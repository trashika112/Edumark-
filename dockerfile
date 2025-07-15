FROM python:3.11-slim

# Install system packages
RUN apt-get update && apt-get install -y curl gnupg2 unixodbc-dev gcc g++ \
    && apt-get clean

# Add Microsoft SQL Server ODBC Driver 18
RUN curl https://packages.microsoft.com/keys/microsoft.asc | apt-key add - \
    && curl https://packages.microsoft.com/config/debian/11/prod.list > /etc/apt/sources.list.d/mssql-release.list \
    && apt-get update \
    && ACCEPT_EULA=Y apt-get install -y msodbcsql18

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the app
COPY . .

# Expose port and run
EXPOSE 10000
CMD ["python", "app.py"]
