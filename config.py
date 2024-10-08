import os

# For a production app, you should use a secret key set in the environment
# The recommended way to generate a 64char secret key is to run:
# python -c 'import secrets; print(secrets.token_hex())'
SECRET_KEY = os.getenv('SECRET_KEY', '0602963494ae4160ca88229ad7a1ddebfce523ff69f9489231ee17caecf96c49')

# When deploying on render.com, set in the environment to the PostgreSQL URL
SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL', "postgresql://postgres:password@localhost:5432/exercises")