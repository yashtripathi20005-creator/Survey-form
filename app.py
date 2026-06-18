from flask import Flask, render_template, request, jsonify
import datetime
import json
import os

app = Flask(__name__)

# File to store survey responses
RESPONSES_FILE = 'responses.json'

# Initialize responses file if it doesn't exist
if not os.path.exists(RESPONSES_FILE):
    with open(RESPONSES_FILE, 'w') as f:
        json.dump([], f)

@app.route('/')
def survey_form():
    """Serve the survey form page"""
    return render_template('survey.html')

@app.route('/submit', methods=['POST'])
def submit_survey():
    """Handle survey form submission"""
    try:
        # Get form data
        name = request.form.get('name', '').strip()
        email = request.form.get('email', '').strip()
        age = request.form.get('age', '').strip()
        satisfaction = request.form.get('satisfaction', '')
        recommend = request.form.get('recommend', '')
        feedback = request.form.get('feedback', '').strip()
        interests = request.form.getlist('interests')
        
        # Validate required fields
        if not name or not email or not age or not satisfaction:
            return jsonify({
                'success': False,
                'message': 'Please fill in all required fields (Name, Email, Age, Satisfaction)'
            }), 400
        
        # Validate age
        try:
            age_int = int(age)
            if age_int < 1 or age_int > 120:
                raise ValueError
        except ValueError:
            return jsonify({
                'success': False,
                'message': 'Please enter a valid age (1-120)'
            }), 400
        
        # Create response entry
        response = {
            'timestamp': datetime.datetime.now().isoformat(),
            'name': name,
            'email': email,
            'age': age_int,
            'satisfaction': satisfaction,
            'recommend': recommend,
            'feedback': feedback,
            'interests': interests
        }
        
        # Save to JSON file
        with open(RESPONSES_FILE, 'r') as f:
            responses = json.load(f)
        
        responses.append(response)
        
        with open(RESPONSES_FILE, 'w') as f:
            json.dump(responses, f, indent=2)
        
        return jsonify({
            'success': True,
            'message': 'Thank you for completing the survey!'
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Error: {str(e)}'
        }), 500

@app.route('/responses', methods=['GET'])
def view_responses():
    """View all responses (for admin/debugging)"""
    with open(RESPONSES_FILE, 'r') as f:
        responses = json.load(f)
    return jsonify(responses)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
