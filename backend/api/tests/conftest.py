import pytest
from django.contrib.auth.models import User
from rest_framework.test import APIClient

from api.models import Category, Task


@pytest.fixture
def client():
    """Client non authentifie."""
    return APIClient()


@pytest.fixture
def utilisateur(db):
    return User.objects.create_user(username="alice", password="secret123")


@pytest.fixture
def autre_utilisateur(db):
    return User.objects.create_user(username="bob", password="secret123")


@pytest.fixture
def client_auth(utilisateur):
    """Client connecte en tant qu'alice."""
    api_client = APIClient()
    api_client.force_authenticate(user=utilisateur)
    return api_client


@pytest.fixture
def categorie(db):
    return Category.objects.create(name="courses")


@pytest.fixture
def tache(categorie, utilisateur):
    return Task.objects.create(
        description="Acheter du pain", category=categorie, user=utilisateur
    )
