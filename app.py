from flask import Flask, jsonify
from flask_cors import CORS  # ✅ Enables CORS for Netlify frontend
import pyodbc
import os
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()

app = Flask(__name__)
CORS(app)  # ✅ Allow all origins

# ✅ SQL Server connection
try:
    conn = pyodbc.connect(
        f"DRIVER={{ODBC Driver 18 for SQL Server}};"
        f"SERVER={os.getenv('DB_HOST')};"
        f"DATABASE={os.getenv('DB_NAME')};"
        f"UID={os.getenv('DB_USER')};"
        f"PWD={os.getenv('DB_PASS')}"
         f"TrustServerCertificate=yes;"
    )
    print("✅ Connected to SQL Server successfully!")
except Exception as e:
    print("❌ Failed to connect to SQL Server:")
    print(e)

# ✅ Home Route
@app.route("/")
def home():
    return """
    <h2>🎓 EduMark Flask Backend</h2>
    <p>✅ Backend is running and connected to SQL Server</p>
    <ul>
        <li><a href="/api/students">/api/students</a> - View all students</li>
    </ul>
    """

# ✅ Sample API to Get Students
@app.route("/api/students", methods=["GET"])
def get_students():
    try:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM Students")  # Change table name if needed
        columns = [column[0] for column in cursor.description]
        data = [dict(zip(columns, row)) for row in cursor.fetchall()]
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ✅ Start the app
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=10000, debug=True)
