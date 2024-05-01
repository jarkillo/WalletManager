# Usar una imagen oficial de Python como imagen base
FROM python:3.10

# Establecer el directorio de trabajo en el contenedor
WORKDIR /app

# Copiar los archivos de requisitos y instalar las dependencias
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copiar el resto de la aplicación
COPY . .

# Establecer PYTHONPATH
ENV PYTHONPATH /app

# Exponer el puerto que FastAPI utilizará
EXPOSE 8000

# Comando para ejecutar la aplicación usando el script run.py
CMD ["python", "run.py"]
