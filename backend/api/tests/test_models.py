"""Tests unitaires : logique metier des modeles, sans requete web."""
import pytest
from django.db import IntegrityError, transaction

from api.models import Task


def test_tache_non_terminee_par_defaut(tache):
    assert tache.is_completed is False


def test_mark_as_complete(tache):
    tache.mark_as_complete()
    tache.refresh_from_db()
    assert tache.is_completed is True


def test_tache_sans_categorie_impossible(utilisateur):
    with pytest.raises(IntegrityError):
        with transaction.atomic():
            Task.objects.create(description="Orpheline", user=utilisateur)
