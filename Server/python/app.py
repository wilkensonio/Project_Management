import pickle
import numpy as np
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

 
with open('completion_time_predictor.pkl', 'rb') as f:
    model = pickle.load(f)

with open('label_encoder.pkl', 'rb') as f:
    label_encoder = pickle.load(f)
 
@app.route('/predict', methods=['POST'])
def predict():
    try:
    
        data = request.get_json()

     
        team_size = data['teamSize']
        budget = data['budget']
        workload = data['workload']
        estimate_duration = data['estimateDuration'] # Project total time for all tasks 
        tasks = data['tasks']

        # Convert 'workload' to numeric using the label encoder
        workload_encoded = label_encoder.transform([workload])[0]

        # Prepare the input features for prediction
        features = np.array([[team_size, budget, workload_encoded, estimate_duration, tasks]])
      
        predicted_completion_time = abs(model.predict(features)[0])
        hour = 0
        if predicted_completion_time >= 3600:
            hour = predicted_completion_time // 3600
        elif predicted_completion_time > 0:  # If it's a small non-zero time, convert it to minutes
            hour = 1  
        if hour == 0:
            hour = 1   
    
      
        return jsonify({"predictedCompletionTimeHour": hour})

    except Exception as e:
        return jsonify({"error": str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True, port=5000)
