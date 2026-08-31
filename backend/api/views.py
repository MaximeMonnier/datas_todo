# api/views.py
import time
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status

from .models import Category, Task
from .serializers import CategorySerializer, TaskSerializer
from rest_framework.permissions import IsAuthenticated

@api_view(['GET'])
def trigger_error(request):
    """Sentry test"""
    division_by_zero = 1 / 0
    return Response({"this": "will never be returned"})


@api_view(['GET'])
def health_check(request):
    """Une vue simple qui renvoie un statut de succès."""
    return Response({"status": "ok", "message": "API is healthy"})

@api_view(['GET'])
def hello_view(request):
    if request.method == 'GET':
        print("Request received, sleeping for 3 seconds...") # Log serveur
        time.sleep(3) # Ajoute une pause de 3 secondes
        print("Awake! Sending response.") # Log serveur
        content = {'message': 'Hello from Django! Connexion successful.👍'}
        return Response(content, status=status.HTTP_200_OK)

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def get_categories(request):
    if request.method == 'GET':
        categories = Category.objects.all()
        serializer = CategorySerializer(categories, many=True)
        return Response(serializer.data)
    elif request.method == 'POST':
        serializer = CategorySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'POST', 'PATCH', 'DELETE'])
@permission_classes([IsAuthenticated])
def get_tasks(request, pk=None):
    # on ne travaille que sur les taches de l'utilisateur connecte :
    # une tache appartenant a un autre ressort donc en 404
    taches = Task.objects.filter(user=request.user)

    if request.method == 'GET':
        if pk:
            try:
                task = taches.get(pk=pk)
                serializer = TaskSerializer(task)
                return Response(serializer.data)
            except Task.DoesNotExist:
                return Response(status=status.HTTP_404_NOT_FOUND)
        else:
            tasks = taches
            # Filtre par category_id (?category_id=3) ou par nom (?category=travail)
            category_id = request.query_params.get('category_id')
            if category_id:
                tasks = tasks.filter(category_id=category_id)
            category_name = request.query_params.get('category')
            if category_name:
                tasks = tasks.filter(category__name=category_name)
            serializer = TaskSerializer(tasks, many=True)
            return Response(serializer.data)
    elif request.method == 'POST':
        serializer = TaskSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'PATCH':
        if pk:
            try:
                task = taches.get(pk=pk)
                serializer = TaskSerializer(task, data=request.data, partial=True)
                if serializer.is_valid():
                    serializer.save()
                    return Response(serializer.data)
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            except Task.DoesNotExist:
                return Response(status=status.HTTP_404_NOT_FOUND)
    elif request.method == 'DELETE':
        if pk:
            try:
                task = taches.get(pk=pk)
                task.delete()
                return Response(status=status.HTTP_204_NO_CONTENT)
            except Task.DoesNotExist:
                return Response(status=status.HTTP_404_NOT_FOUND)
