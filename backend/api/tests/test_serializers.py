"""Tests des serializers : validation et champs exposes."""
from api.serializers import CategorySerializer, TaskSerializer


def test_categorie_valide(db):
    serializer = CategorySerializer(data={"name": "Travail"})
    assert serializer.is_valid() is True


def test_nom_categorie_duplique_refuse(categorie):
    serializer = CategorySerializer(data={"name": "Courses"})
    assert serializer.is_valid() is False
    assert "name" in serializer.errors


def test_renommage_categorie_avec_son_propre_nom_autorise(categorie):
    serializer = CategorySerializer(instance=categorie, data={"name": "Courses"})
    assert serializer.is_valid() is True


def test_created_at_est_en_lecture_seule():
    assert TaskSerializer().fields["created_at"].read_only is True


def test_tache_sans_categorie_refusee(db):
    serializer = TaskSerializer(data={"description": "Orpheline"})
    assert serializer.is_valid() is False
    assert "category" in serializer.errors


def test_champs_exposes_par_task_serializer():
    attendus = {"id", "description", "is_completed", "created_at", "category"}
    assert set(TaskSerializer().fields) == attendus
