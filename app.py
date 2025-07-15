from flask import Flask, jsonify
from flask_cors import CORS   # ✅ NEW LINE
import pyodbc
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)   # ✅ ENABLE CORS for all routes

# SQL Server connection setup
try:
    conn = pyodbc.connect(
        f"DRIVER={{ODBC Driver 17 for SQL Server}};"
        f"SERVER={os.getenv('DB_HOST')};"
        f"DATABASE={os.getenv('DB_NAME')};"
        f"UID={os.getenv('DB_USER')};"
        f"PWD={os.getenv('DB_PASS')}"
    )
    print("✅ Connected to SQL Server successfully!")
except Exception as e:
    print("❌ Failed to connect to SQL Server:")
    print(e)

# Routes...
@app.route("/")
def home():
    return """
    <h2>🎓 EduMark Flask Backend</h2>
    <p>✅ Backend is running and connected to SQL Server</p>
    <ul>
        <li><a href="/api/students">/api/students</a> - View all students</li>
    </ul>
    """

@app.route("/api/students", methods=["GET"])
def get_students():
    try:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM Students")
        columns = [column[0] for column in cursor.description]
        data = [dict(zip(columns, row)) for row in cursor.fetchall()]
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Run Flask
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=10000, debug=True)
