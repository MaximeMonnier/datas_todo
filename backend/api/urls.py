"""
URL API configuration for backend project.
"""

from django.urls import path
from . import views

urlpatterns = [
    path('hello/', views.hello_view, name='hello'),
    path('categories/', views.get_categories, name='get_categories'),
    path('tasks/', views.get_tasks, name='get_tasks'),
    path('tasks/<int:pk>/', views.get_tasks, name='get_task_detail'),
    path('health/', views.health_check, name='health_check'),
    path('error/', views.trigger_error, name='trigger_error'),
]
