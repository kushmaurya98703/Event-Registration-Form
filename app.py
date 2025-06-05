from flask import Flask, request, jsonify
import mysql.connector as MyConn
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS to allow frontend requests

# Database connection
mydb = MyConn.connect(
    host="localhost",
    user="sunny",
    password="maurya17307",
    database="loginform"
)

db_cursor = mydb.cursor()

# Create table for event registrations
db_cursor.execute("""
    CREATE TABLE IF NOT EXISTS EventRegistrations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        attending VARCHAR(3),
        first_name VARCHAR(50),
        last_name VARCHAR(50),
        email VARCHAR(100),
        phone VARCHAR(15),
        guests INT
    )
""")

@app.route('/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        attending = data.get('attending')
        first_name = data.get('firstName')
        last_name = data.get('lastName')
        email = data.get('email')
        phone = data.get('phone')
        guests = int(data.get('guests', 0))

        # Validate required fields
        if not attending or not first_name or not last_name or not phone:
            return jsonify({'error': 'Missing required fields'}), 400

        # Insert data into the table
        insert_query = """
            INSERT INTO EventRegistrations (attending, first_name, last_name, email, phone, guests)
            VALUES (%s, %s, %s, %s, %s, %s)
        """
        values = (attending, first_name, last_name, email, phone, guests)
        db_cursor.execute(insert_query, values)
        mydb.commit()

        # Get the last inserted ID (registration ID)
        db_cursor.execute("SELECT LAST_INSERT_ID()")
        registration_id = db_cursor.fetchone()[0]

        return jsonify({
            'message': 'Registration successful',
            'registration_id': registration_id
        }), 200

    except Exception as e:
        mydb.rollback()
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)