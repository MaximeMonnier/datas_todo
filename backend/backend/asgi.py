"""
ASGI config for backend project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/6.0/howto/deployment/asgi/
"""

import os

from django.core.asgi import get_asgi_application

# Point d'entree serveur : on part du principe qu'on est en production.
# En local, manage.py a deja positionne la variable, donc ce setdefault ne s'applique pas.
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings.production')

application = get_asgi_application()
