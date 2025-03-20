#!/bin/bash

# Define your directories and packages
PROJECT_DIR="/python" 
PYTHON_PACKAGE_LIST="requirements.txt"  # Update with the Python package list (e.g., requirements.txt)
NPM_PACKAGE_LIST="package.json"        # Update with the Node.js package list (e.g., package.json)
PYTHON_SCRIPT=""         # Python script to run

# Go to the project directory
cd $PROJECT_DIR || { echo "Directory not found!"; exit 1; }

# Step 1: Install Python packages
if [ -f "$PYTHON_PACKAGE_LIST" ]; then
    echo "Installing Python packages..."
    pip install -r $PYTHON_PACKAGE_LIST
else
    echo "Python package list file not found!"
    exit 1
fi

# Step 2: Install npm packages
if [ -f "$NPM_PACKAGE_LIST" ]; then
    echo "Installing npm packages..."
    npm install
else
    echo "npm package list file not found!"
    exit 1
fi

# Step 3: Run Python script
echo "Running Python script..."
python $PYTHON_SCRIPT

# You can replace 'python' with 'python3' depending on your system configuration

