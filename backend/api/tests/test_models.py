"""Tests des modeles : logique metier, valeurs par defaut, relations."""
import pytest
from django.db import IntegrityError, transaction

from api.models import Category, Task


def test_str_categorie(categorie):
    assert str(categorie) == "Courses"


def test_str_tache_tronque_a_50_caracteres(categorie):
    tache = Task.objects.create(description="a" * 100, category=categorie)
    assert len(str(tache)) == 50


def test_tache_non_terminee_par_defaut(tache):
    assert tache.is_completed is False


def test_created_at_rempli_automatiquement(tache):
    assert tache.created_at is not None


def test_nom_categorie_unique(categorie):
    with pytest.raises(IntegrityError):
        with transaction.atomic():
            Category.objects.create(name="Courses")


def test_suppression_categorie_supprime_ses_taches(categorie, tache):
    categorie.delete()
    assert Task.objects.count() == 0


def test_relation_inverse_tasks(categorie, tache):
    assert list(categorie.tasks.all()) == [tache]
