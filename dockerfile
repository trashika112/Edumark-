FROM python:3.11-slim

# Install system packages and prerequisites
RUN apt-get update && apt-get install -y \
    curl gnupg2 unixodbc-dev gcc g++ apt-transport-https ca-certificates \
    && apt-get clean

# Add Microsoft package repository
RUN curl https://packages.microsoft.com/keys/microsoft.asc | apt-key add - \
 && curl https://packages.microsoft.com/config/debian/11/prod.list > /etc/apt/sources.list.d/mssql-release.list

# Install ODBC Driver 18
RUN apt-get update \
 && ACCEPT_EULA=Y apt-get install -y msodbcsql18

# Set working directory
WORKDIR /app

# Copy application code
COPY . .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Expose your Flask port
EXPOSE 10000

# Start the Flask app
CMD ["python", "app.py"]
