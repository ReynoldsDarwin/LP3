from flask import Flask, render_template, request, redirect, url_for
import csv
import os
from datetime import datetime

app = Flask(__name__)

CSV_FILE = 'datos_usuarios.csv'

@app.route('/')
def index():
    return render_template('registro.html')

@app.route('/guardar', methods=['POST'])
def guardar():
    if request.method == 'POST':
        # Obtenemos los nuevos campos desde el formulario
        datos = {
            'fecha': datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            'codigo': request.form.get('codigo'),
            'nombres': request.form.get('nombres'),
            'apellido_p': request.form.get('apellido_p'),
            'apellido_m': request.form.get('apellido_m'),
            'edad': request.form.get('edad'),
            'categoria': request.form.get('categoria')
        }

        file_exists = os.path.isfile(CSV_FILE)

        with open(CSV_FILE, mode='a', newline='', encoding='utf-8') as f:
            writer = csv.DictWriter(f, fieldnames=datos.keys())
            
            # Escribir cabecera si el archivo es nuevo
            if not file_exists:
                writer.writeheader()
            
            writer.writerow(datos)

        return "<h1>¡Datos guardados con éxito!</h1><a href='/'>Registrar otro</a>"

if __name__ == '__main__':
    app.run(debug=True)