from crewai import Crew
from agents import CarRecommendationAgents
from tasks import CarRecommendationTasks
from dotenv import load_dotenv
import os



def test_car_recommendation_system():
    
    
    load_dotenv()
    
    
    OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
    SERPER_API_KEY = os.getenv("SERPER_API_KEY")
    
    # Test user data
    user_data = {
        # Financial Information
        "annual_income": 85000,
        "credit_score": 720,
        "monthly_budget": 500,
        "down_payment": 5000,
        
        # Lifestyle Information
        "family_status": "married",
        "children": 2,
        "living_area": "suburban",
        "primary_use": "family transport and commuting",
        "hobbies": ["camping", "sports", "home improvement"],
        "commute": "30 miles daily",
        
        # Preferences
        "preferred_features": [
            "safety",
            "fuel efficiency",
            "cargo space",
            "comfortable ride"
        ]
    }

    # Initialize agents
    agents = CarRecommendationAgents()
    financial_agent = agents.financial_analyst_agent()
    lifestyle_agent = agents.lifestyle_analyst_agent()
    car_specialist = agents.car_specialist_agent()

    # Create tasks
    tasks = CarRecommendationTasks()
    
    # Define task sequence
    financial_analysis = tasks.analyze_financing_options(
        financial_agent, 
        user_data
    )
    
    lifestyle_analysis = tasks.analyze_lifestyle_needs(
        lifestyle_agent,
        user_data
    )
    
    car_recommendations = tasks.recommend_specific_cars(
        car_specialist,
        financial_analysis,
        lifestyle_analysis,
        user_data
    )

    # Create and run crew
    crew = Crew(
        agents=[financial_agent, lifestyle_agent, car_specialist],
        tasks=[financial_analysis, lifestyle_analysis, car_recommendations]
    )

    result = crew.kickoff()
    return result

if __name__ == "__main__":

    print("Starting Car Recommendation Test...")
    result = test_car_recommendation_system()
    print("\nResults:")
    print(result)