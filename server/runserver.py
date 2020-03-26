"""
This script runs the FlaskWebProject1 application using a development server.
"""

from os import environ
from main import app

if __name__ == '__main__':
    HOST = environ.get('SERVER_HOST', '0.0.0.0')
    try:
        PORT = int(environ.get('SERVER_PORT', '6050'))
    except ValueError:
        PORT = 5555
    app.secret_key = "secret_key"    
    app.run(HOST, PORT)

