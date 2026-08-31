"""Tests des vues : codes de statut, contenu des reponses, routage des URLs."""
from api.models import Category, Task


def test_health_check(client):
    response = client.get("/api/health/")
    assert response.status_code == 200
    assert response.data["status"] == "ok"


def test_liste_categories(client, categorie):
    response = client.get("/api/categories/")
    assert response.status_code == 200
    assert len(response.data) == 1
    assert response.data[0]["name"] == "Courses"


def test_creation_categorie(client, db):
    response = client.post("/api/categories/", {"name": "Travail"}, format="json")
    assert response.status_code == 201
    assert Category.objects.count() == 1


def test_creation_categorie_dupliquee_refusee(client, categorie):
    response = client.post("/api/categories/", {"name": "Courses"}, format="json")
    assert response.status_code == 400


def test_liste_taches_vide(client, db):
    response = client.get("/api/tasks/")
    assert response.status_code == 200
    assert response.data == []


def test_creation_tache(client, categorie):
    response = client.post(
        "/api/tasks/",
        {"description": "Acheter du pain", "category": categorie.id},
        format="json",
    )
    assert response.status_code == 201
    assert Task.objects.count() == 1
    assert Task.objects.first().is_completed is False


def test_detail_tache(client, tache):
    response = client.get(f"/api/tasks/{tache.id}/")
    assert response.status_code == 200
    assert response.data["description"] == "Acheter du pain"


def test_detail_tache_inexistante(client, db):
    response = client.get("/api/tasks/999/")
    assert response.status_code == 404


def test_filtre_par_categorie(client, tache):
    autre = Category.objects.create(name="Travail")
    Task.objects.create(description="Envoyer le rapport", category=autre)

    response = client.get(f"/api/tasks/?category_id={tache.category.id}")
    assert response.status_code == 200
    assert len(response.data) == 1
    assert response.data[0]["description"] == "Acheter du pain"


def test_modification_tache(client, tache):
    response = client.patch(
        f"/api/tasks/{tache.id}/", {"is_completed": True}, format="json"
    )
    assert response.status_code == 200
    tache.refresh_from_db()
    assert tache.is_completed is True


def test_suppression_tache(client, tache):
    response = client.delete(f"/api/tasks/{tache.id}/")
    assert response.status_code == 204
    assert Task.objects.count() == 0
