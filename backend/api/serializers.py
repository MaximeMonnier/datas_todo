from rest_framework import serializers
from .models import Category, Task

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name']
    
    def validate_name(self, value):
        # Vérifier l'unicité du nom (en excluant l'instance actuelle lors d'une mise à jour)
        instance = getattr(self, 'instance', None)
        if Category.objects.filter(name=value).exclude(pk=instance.pk if instance else None).exists():
            raise serializers.ValidationError("Une catégorie avec ce nom existe déjà.")
        return value
    
class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ['id', 'description', 'is_completed', 'created_at', 'category', 'user']
        # le proprietaire est impose par la vue, jamais par le client
        read_only_fields = ['created_at', 'user']
