import os
import dj_database_url
from .base import *
import sentry_sdk
from sentry_sdk.integrations.django import DjangoIntegration

# ==============================================================================
# SÉCURITÉ
# ==============================================================================

SECRET_KEY = os.environ['SECRET_KEY']
DEBUG = False


def _env_list(name):
    """Découpe une variable d'env 'a,b,c' en liste, sans entrées vides."""
    return [v.strip() for v in os.environ.get(name, '').split(',') if v.strip()]


ALLOWED_HOSTS = _env_list('ALLOWED_HOSTS')
CORS_ALLOWED_ORIGINS = _env_list('CORS_ALLOWED_ORIGINS')

# Vercel cree une URL unique a chaque deploiement
# (ex: datas-todo-2j69ltotd-maximemonniers-projects.vercel.app), impossible a
# lister a l'avance : on les autorise par motif.
CORS_ALLOWED_ORIGIN_REGEXES = _env_list('CORS_ALLOWED_ORIGIN_REGEXES')
CSRF_TRUSTED_ORIGINS = [f'https://{host}' for host in ALLOWED_HOSTS if not host.startswith('.')]

SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True

# ==============================================================================
# BASE DE DONNÉES
# ==============================================================================

DATABASES = {
    'default': dj_database_url.config(
        conn_max_age=600,
        ssl_require=True
    )
}

# ==============================================================================
# FICHIERS STATIQUES (WHITENOISE)
# ==============================================================================

STATIC_ROOT = BASE_DIR / 'staticfiles'

# Django 6 : STATICFILES_STORAGE a été supprimé, il faut passer par STORAGES
STORAGES = {
    'default': {
        'BACKEND': 'django.core.files.storage.FileSystemStorage',
    },
    'staticfiles': {
        'BACKEND': 'whitenoise.storage.CompressedManifestStaticFilesStorage',
    },
}



SENTRY_DSN = os.environ.get('SENTRY_DSN')

    if SENTRY_DSN:
        sentry_sdk.init(
            dsn=SENTRY_DSN,
            integrations=[DjangoIntegration()],
            traces_sample_rate=1.0, # Capture 100% des transactions pour le monitoring de perf.
            send_default_pii=True
        )