from flask import Flask, request, jsonify
import pickle
import numpy as np

app = Flask(__name__)

# Load the saved model and label encoder
with open('completion_time_predictor.pkl', 'rb') as f:
    model = pickle.load(f)

with open('label_encoder.pkl', 'rb') as f:
    label_encoder = pickle.load(f)

# Route to predict the completion time
@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Get the data from the POST request
        data = request.get_json()

        # Extract project attributes from the request
        team_size = data['teamSize']
        budget = data['budget']
        workload = data['workload']
        estimate_duration = data['estimateDuration'] # total / project
        tasks = data['tasks']

        # Convert 'workload' to numeric using the label encoder
        workload_encoded = label_encoder.transform([workload])[0]

        # Prepare the input features for prediction
        features = np.array([[team_size, budget, workload_encoded, estimate_duration, tasks]])

        # Predict the completion time
        predicted_completion_time = model.predict(features)[0]

        # Return the result as JSON
        return jsonify({"predictedCompletionTime": predicted_completion_time})

    except Exception as e:
        return jsonify({"error": str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True)
