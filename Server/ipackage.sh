#!/bin/bash

chmod +x "$0"

PROJECT_DIR="python" 
PYTHON_PACKAGE_LIST="requirements.txt"   
NPM_PACKAGE_LIST="package.json"        
        
        

# Step 1: Install npm packages
if [ -f "$NPM_PACKAGE_LIST" ]; then
    echo "Installing npm packages..."
    npm install
else
    echo "npm package list file not found!"
    exit 1
fi

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
 

