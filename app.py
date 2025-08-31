from flask import Flask, render_template, request, jsonify, session
from flask_cors import CORS
import mysql.connector
import openai
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
app.secret_key = os.urandom(24)  # Required for session management
CORS(app)

# Database configuration
db_config = {
    'host': os.getenv('DB_HOST', 'localhost'),
    'user': os.getenv('DB_USER', 'Jikoapp'),
    'password': os.getenv('DB_PASSWORD', '2025'),
    'database': os.getenv('DB_NAME', 'jiko_db')
}

# OpenAI API configuration
openai.api_key = os.getenv('OPENAI_API_KEY')

def get_db_connection():
    return mysql.connector.connect(**db_config)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/recipes', methods=['GET'])
def get_recipes():
    # Get filter parameters from request
    ingredients = request.args.getlist('ingredients')
    region = request.args.get('region', 'all')
    max_time = request.args.get('max_time', 'any')
    diet = request.args.get('diet', 'any')
    
    # Build SQL query based on filters
    query = "SELECT * FROM recipes WHERE 1=1"
    params = []
    
    if region != 'all':
        query += " AND region = %s"
        params.append(region)
        
    if max_time != 'any':
        query += " AND cook_time <= %s"
        params.append(int(max_time))
        
    if diet != 'any':
        query += " AND dietary = %s"
        params.append(diet)
    
    # Connect to database and execute query
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute(query, params)
    recipes = cursor.fetchall()
    
    # Calculate match percentage for each recipe based on ingredients
    if ingredients:
        for recipe in recipes:
            # Get recipe ingredients from database
            cursor.execute("SELECT ingredient FROM recipe_ingredients WHERE recipe_id = %s", [recipe['id']])
            recipe_ingredients = [row['ingredient'] for row in cursor.fetchall()]
            
            # Calculate match percentage
            matched = sum(1 for ing in ingredients if ing in recipe_ingredients)
            recipe['match'] = min(100, int((matched / len(ingredients)) * 100))
        
        # Sort by match percentage
        recipes.sort(key=lambda x: x['match'], reverse=True)
    
    cursor.close()
    conn.close()
    
    return jsonify(recipes)

@app.route('/api/suggestions', methods=['POST'])
def get_suggestions():
    data = request.json
    ingredients = data.get('ingredients', [])
    
    # Use OpenAI API to generate suggestions
    prompt = f"Suggest African recipes that can be made with these ingredients: {', '.join(ingredients)}. Also suggest 1-2 additional common African ingredients that could expand recipe options."
    
    try:
        response = openai.Completion.create(
            engine="text-davinci-003",
            prompt=prompt,
            max_tokens=150,
            n=1,
            stop=None,
            temperature=0.7
        )
        
        suggestion = response.choices[0].text.strip()
        return jsonify({'suggestion': suggestion})
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)