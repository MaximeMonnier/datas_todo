"""Prepare la base de developpement pour le test end-to-end Cypress.

Le test E2E travaille sur la VRAIE base de dev : il lui faut un utilisateur
reel pour se connecter, et un etat de depart propre pour etre rejouable
(la categorie "Projet Alpha" est unique en base, la recreer echouerait).
"""

from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand

from api.models import Category, Task

USERNAME = "e2e_user"
PASSWORD = "e2e_password123"
CATEGORY_NAME = "Projet Alpha"


class Command(BaseCommand):
    help = "Cree l'utilisateur de test E2E et nettoie les donnees du scenario."

    def handle(self, *args, **options):
        User = get_user_model()
        user, created = User.objects.get_or_create(username=USERNAME)
        # On (re)pose le mot de passe a chaque fois : le test connait cette valeur.
        user.set_password(PASSWORD)
        user.save()

        # Les taches partent d'abord (ForeignKey), puis la categorie.
        supprimees, _ = Task.objects.filter(category__name=CATEGORY_NAME).delete()
        Category.objects.filter(name=CATEGORY_NAME).delete()

        self.stdout.write(
            self.style.SUCCESS(
                f"utilisateur '{USERNAME}' pret (cree={created}), "
                f"categorie '{CATEGORY_NAME}' nettoyee ({supprimees} objet(s) supprime(s))"
            )
        )
