# 🍳 JIKO – Smart Recipe Web App

JIKO is a **recipe management web application** built with **Flask**, **MySQL**, and **OpenAI API**.  
It allows users to explore, filter, and manage recipes while providing **AI-powered recommendations** for smarter cooking decisions.  
The web application was built with the help of Deepseek and ChatGPT 

Deployed on **Render**.

----

## 🚀 Features
- 🔐 **User Authentication** (Register/Login)
- 🥘 **Recipe Management** – Add, view, and filter recipes
- 🧾 **Search & Filter** – Find recipes by ingredients, cuisine, or type
- 🤖 **AI Integration** – Get cooking suggestions using OpenAI API
- 🎨 **Responsive UI** – Built with HTML5, CSS3, and JavaScript
- 🌍 **Cross-platform** – Works seamlessly on mobile and desktop browsers

---

## 🛠️ Tech Stack
**Frontend**: HTML5, CSS3, JavaScript  
**Backend**: Python (Flask)  
**Database**: MySQL  
**AI**: OpenAI API  
**Deployment**: Render (Gunicorn WSGI server)

---

## 📂 Project Structure
JIKO/
│── app.py # Flask application entry point

│── requirements.txt # Python dependencies

│── README.md # Project documentation

│── static/ # CSS, JS, images
│ ├── style.css
│ └── script.js

│── templates/ # HTML templates (Jinja2)
│ ├── index.html



---

## ⚙️ Installation & Setup

1. **Clone this repository**
   ```bash
   git clone https://github.com/Webapp_project/jiko.git
   cd jiko
   ---
   
2. Create a virtual enviroment 
 python -m venv venv
source venv/bin/activate   # Mac/Linux
venv\Scripts\activate      # Windows

3. Install dependenciesn
pip install -r requirements.txt

4. Set enviroments variables
 Create a .env file in the root directory:
FLASK_APP=app.py
FLASK_ENV=development
OPENAI_API_KEY=your_openai_api_key_here

5. Run the app locally
   flask run

6. Visit
   http://127.0.0.1:5000/

7. Live app
   https://jiko-app.onrender.com/

8. Pitch Deck
   https://gamma.app/docs/JIKO-FOOD-APP-Fighting-Hunger-Empowering-Communities-c08hqtwqxyg0lwl

## 🌍 Deployment

The app is deployed using Render with Gunicorn: 
gunicorn app:app

## 👥 Team Members
Name: Jennifer Omoregier 

Email: jennylightomoregie@gmail.com

Role: Frontend, Backend and Data Developer, Deployment

Name: Isreal Ango 

Email: angoyacham007@gmail.com

Role: Database & API Integration, Pitch Deck Presentation
	
## 📜 License

This project is licensed under the MIT License – see the LICENSE
 file for details.

## 💡 Acknowledgments

Flask

Render

OpenAI API

FontAwesome
 for icons

## Author 
Jennifer and Israel
