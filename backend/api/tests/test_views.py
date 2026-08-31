"""Tests d'integration : codes HTTP, JSON renvoye et securite des endpoints."""
from api.models import Category, Task


# --- Creation de tache (POST) ---
def test_creation_tache_authentifiee(client_auth, categorie, utilisateur):
    response = client_auth.post(
        "/api/tasks/",
        {"description": "Acheter du pain", "category": categorie.id},
        format="json",
    )
    assert response.status_code == 201
    assert Task.objects.count() == 1
    assert Task.objects.first().user == utilisateur


def test_creation_tache_sans_description_refusee(client_auth, categorie):
    response = client_auth.post(
        "/api/tasks/", {"category": categorie.id}, format="json"
    )
    assert response.status_code == 400
    assert "description" in response.data


def test_creation_tache_non_authentifiee_refusee(client, categorie):
    response = client.post(
        "/api/tasks/",
        {"description": "Acheter du pain", "category": categorie.id},
        format="json",
    )
    assert response.status_code == 401
    assert Task.objects.count() == 0


# --- Filtre des taches (GET) ---
def test_filtre_par_categorie(client_auth, tache, utilisateur):
    travail = Category.objects.create(name="travail")
    Task.objects.create(description="Envoyer le rapport", category=travail, user=utilisateur)

    response = client_auth.get("/api/tasks/?category=travail")
    assert response.status_code == 200
    assert len(response.data) == 1
    assert response.data[0]["description"] == "Envoyer le rapport"


# --- Suppression de tache (DELETE) ---
def test_suppression_de_sa_propre_tache(client_auth, tache):
    response = client_auth.delete(f"/api/tasks/{tache.id}/")
    assert response.status_code == 204
    assert Task.objects.count() == 0


def test_suppression_tache_d_un_autre_utilisateur_refusee(
    client_auth, categorie, autre_utilisateur
):
    """404 plutot que 403 : on masque l'existence de l'objet."""
    tache_de_bob = Task.objects.create(
        description="Tache de bob", category=categorie, user=autre_utilisateur
    )

    response = client_auth.delete(f"/api/tasks/{tache_de_bob.id}/")
    assert response.status_code == 404
    assert Task.objects.filter(pk=tache_de_bob.pk).exists()
