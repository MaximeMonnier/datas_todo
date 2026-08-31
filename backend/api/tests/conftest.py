"""Fixtures partagees par tous les tests de l'app api."""
import pytest
from rest_framework.test import APIClient

from api.models import Category, Task


@pytest.fixture
def client():
    return APIClient()


@pytest.fixture
def categorie(db):
    return Category.objects.create(name="Courses")


@pytest.fixture
def tache(categorie):
    return Task.objects.create(description="Acheter du pain", category=categorie)
