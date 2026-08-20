# api/views.py
import time
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from .models import Category, Task
from .serializers import CategorySerializer, TaskSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.permissions import IsAdminUser

@api_view(['GET'])
# @permission_classes([IsAuthenticated])
# @permission_classes([IsAdminUser])
def hello_view(request):
    if request.method == 'GET':
        print("Request received, sleeping for 3 seconds...") # Log serveur
        time.sleep(3) # Ajoute une pause de 3 secondes
        print("Awake! Sending response.") # Log serveur
        content = {'message': 'Hello from Django! Connexion successful.👍'}
        return Response(content, status=status.HTTP_200_OK)

@api_view(['GET', 'POST'])
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
def get_tasks(request, pk=None):
    if request.method == 'GET':
        if pk:
            try:
                task = Task.objects.get(pk=pk)
                serializer = TaskSerializer(task)
                return Response(serializer.data)
            except Task.DoesNotExist:
                return Response(status=status.HTTP_404_NOT_FOUND)
        else:
            tasks = Task.objects.all()
            # Filtre par category_id si le paramètre est fourni
            category_id = request.query_params.get('category_id')
            if category_id:
                tasks = tasks.filter(category_id=category_id)
            serializer = TaskSerializer(tasks, many=True)
            return Response(serializer.data)
    elif request.method == 'POST':
        serializer = TaskSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'PATCH':
        if pk:
            try:
                task = Task.objects.get(pk=pk)
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
                task = Task.objects.get(pk=pk)
                task.delete()
                return Response(status=status.HTTP_204_NO_CONTENT)
            except Task.DoesNotExist:
                return Response(status=status.HTTP_404_NOT_FOUND)