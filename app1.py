from flask import Flask, request, jsonify
from flask_cors import CORS
import pyodbc
import os
from dotenv import load_dotenv

load_dotenv()  # Load environment variables from .env

app = Flask(__name__)
CORS(app)  # Allow cross-origin requests from Netlify frontend

# Database connection
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

# ✅ Home route
@app.route("/")
def home():
    return """
    <h2>🎓 EduMark Flask Backend</h2>
    <p>✅ Backend is running and connected to SQL Server</p>
    <ul>
        <li><a href="/api/students">/api/students</a> - View all students</li>
    </ul>
    """

# ✅ Register API
@app.route("/api/register", methods=["POST"])
def register():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")
    role = data.get("role")  # student or teacher

    try:
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO Users (username, password, role) VALUES (?, ?, ?)",
            (username, password, role)
        )
        conn.commit()
        return jsonify({"message": "✅ Registration successful"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ✅ Login API
@app.route("/api/login", methods=["POST"])
def login():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")

    try:
        cursor = conn.cursor()
        cursor.execute(
            "SELECT role FROM Users WHERE username=? AND password=?",
            (username, password)
        )
        user = cursor.fetchone()
        if user:
            return jsonify({"message": "✅ Login successful", "role": user[0]})
        else:
            return jsonify({"message": "❌ Invalid credentials"}), 401
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ✅ Get all students
@app.route("/api/students", methods=["GET"])
def get_students():
    try:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM Students")  # Replace with your table
        columns = [column[0] for column in cursor.description]
        data = [dict(zip(columns, row)) for row in cursor.fetchall()]
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ✅ Run the app

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=10000, debug=True)
