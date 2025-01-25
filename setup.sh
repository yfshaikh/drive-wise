#!/bin/bash

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
source venv/bin/activate

# Install requirements
echo "Installing requirements..."
pip install -r requirements.txt

# Check for environment variables
if [ -z "$OPENAI_API_KEY" ]; then
    echo "Warning: OPENAI_API_KEY is not set"
fi

if [ -z "$SERPER_API_KEY" ]; then
    echo "Warning: SERPER_API_KEY is not set"
fi

echo "Setup complete! Virtual environment is activated."
echo "To activate the virtual environment in the future, run: source venv/bin/activate"