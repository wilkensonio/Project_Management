# import pickle
# import pandas as pd
# import numpy as np
# from sklearn.linear_model import LinearRegression
# from sklearn.model_selection import train_test_split
# from sklearn.preprocessing import LabelEncoder
# from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score



# data =  pd.read_csv('project_task_data.csv')
# df = pd.DataFrame(data)

# # convert date_time to numeric (days)
# df['completionTime'] = pd.to_datetime(df['completionTime'])
# df['completionTime'] = (df['completionTime'] - pd.Timestamp("2025-01-01")).dt.days

# # Convert categorical variable 'workload' into numeric using LabelEncoder
# label_encoder = LabelEncoder()
# df['workload'] = label_encoder.fit_transform(df['workload'])

# # Select features and target variable
# X = df[['teamSize', 'budget', 'workload', 'estimateDuration', 'tasks']]  # Features
# y = df['completionTime']  # Target variable

# # Split the data into training and test sets
# X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# # Initialize and train the Linear Regression model
# model = LinearRegression()
# model.fit(X_train, y_train)

# with open('completion_time_predictor.pkl', 'wb') as f:
#     pickle.dump(model, f)

# # Save label encoder for transforming 'workload' back
# with open('label_encoder.pkl', 'wb') as f:
#     pickle.dump(label_encoder, f)

# y_pred = model.predict(X_test)

# mae = mean_absolute_error(y_test, y_pred)
# mse = mean_squared_error(y_test, y_pred)
# r2 = r2_score(y_test, y_pred) 

# print(f"Mean Absolute Error: {mae}")
# print(f"Mean Squared Error: {mse}")
# print(f"R² Score: {r2}")


# print("Model and encoder saved!")

import pickle
import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

# Load the data
data = pd.read_csv('project_task_data.csv')
df = pd.DataFrame(data)

# Convert 'completionTime' to numeric (days from a reference date)
df['completionTime'] = pd.to_datetime(df['completionTime'])
df['completionTime'] = (df['completionTime'] - pd.Timestamp("2025-01-01")).dt.days

# Check unique values in 'workload' column before encoding
print("Unique values in 'workload' column:", df['workload'].unique())

# Apply One-Hot Encoding to the 'workload' column
df = pd.get_dummies(df, columns=['workload'], drop_first=True)  # Avoid dummy variable trap (drop first)

# Check the columns after one-hot encoding to understand what was created
print("Columns after One-Hot Encoding:", df.columns)

# Dynamically handle columns to include only those that exist
required_columns = ['teamSize', 'budget', 'estimateDuration', 'tasks']
if 'workload_medium' in df.columns:
    required_columns.append('workload_medium')
if 'workload_heavy' in df.columns:
    required_columns.append('workload_heavy')

# Select features and target variable
X = df[required_columns]  # Features (dynamically adding available workload columns)
y = df['completionTime']  # Target variable

# Split the data into training and test sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Initialize and train the Linear Regression model
model = LinearRegression()
model.fit(X_train, y_train)

# Save the trained model
with open('completion_time_predictor.pkl', 'wb') as f:
    pickle.dump(model, f)

# Make predictions on the test set
y_pred = model.predict(X_test)

# Calculate and print the model's performance metrics
mae = mean_absolute_error(y_test, y_pred)
mse = mean_squared_error(y_test, y_pred)
r2 = r2_score(y_test, y_pred)

print(f"Mean Absolute Error: {mae}")
print(f"Mean Squared Error: {mse}")
print(f"R² Score: {r2}")

print("Model saved!")
