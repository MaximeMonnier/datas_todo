from django.conf import settings
from django.db import models

# Create your models here.
class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name
    
class Task(models.Model):
    description = models.TextField()
    is_completed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    category = models.ForeignKey(Category, related_name='tasks', on_delete=models.CASCADE)
    # proprietaire de la tache : sert a isoler les taches entre utilisateurs
    user = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='tasks', on_delete=models.CASCADE)

    def __str__(self):
        return self.description[:50] if self.description else "Task"

    def mark_as_complete(self):
        """Marque la tache comme terminee et l'enregistre."""
        self.is_completed = True
        self.save(update_fields=['is_completed'])
