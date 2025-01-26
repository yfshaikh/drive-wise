from phi.assistant import Assistant
from phi.tools.website import WebsiteTools
from phi.tools.duckduckgo import DuckDuckGo
from typing import Dict
import os
from dotenv import load_dotenv
from textwrap import dedent
from tools.CarFinanceTools import calculate_monthly_payment, calculate_max_car_price, calculate_loan_amount, calculate_interest_rate

def test_car_recommendation_system(user_data):
    load_dotenv()
    
    # Initialize assistants with specific roles
    financial_analyst = Assistant(
        name="Financial Analyst",
        description=dedent("""
            You are an experienced financial analyst specializing in auto financing.
            You analyze credit scores, income, and financial situations to determine 
            optimal car financing solutions, including payment plans and interest rates.
        """),
        instructions=["""
            As an auto financing expert, your task is to:
            
            1. Use Maximum Car Price Calculator to determine price range
               - Consider different loan terms (36, 48, 60 months)
               - Use credit score to estimate interest rates
            
            2. For the determined price range:
               - Calculate monthly payments for different scenarios
               - Analyze total cost including interest
               - Consider down payment impact
            
            3. Provide detailed recommendations including:
               - Optimal loan term
               - Recommended down payment
               - Monthly payment breakdown
               - Total cost analysis
            
            Format all monetary values as currency with two decimal places.
            Analyze financial aspects and recommend suitable car financing options.
        """],
        tools=[calculate_monthly_payment, calculate_max_car_price, calculate_loan_amount, calculate_interest_rate],
        show_tool_calls=False,
    )
    
    lifestyle_analyst = Assistant(
        name="Lifestyle Analyst",
        description=dedent("""
            You are an expert in matching vehicles to lifestyle needs. You consider:
            - Family composition and size
            - Daily routines and commute patterns
            - Hobbies and recreational activities
            - Living environment (urban/suburban/rural)
            - Storage and cargo needs
            - Safety requirements
            - Environmental preferences
            
            You provide detailed analysis of how different vehicle categories 
            align with user's lifestyle patterns and requirements.
        """),
        instructions=["""
            As a lifestyle analysis expert, your task is to:
            
            Research and analyze:
            1. Vehicle categories that match the family size and composition
            2. Space requirements based on lifestyle activities
            3. Safety features needed for the family situation
            4. Comfort features for commute patterns
            5. Specific requirements based on living area
            6. Storage needs for hobbies and activities
            
            Provide:
            1. Recommended vehicle categories (SUV, Sedan, etc.)
            2. Must-have features based on lifestyle
            3. Nice-to-have features for quality of life
            4. Specific lifestyle considerations that impact choice
            
            Analyze user lifestyle and recommend suitable vehicle categories.
            Use search tools to research current vehicle options and features.
        """],
        tools=[DuckDuckGo()],
        show_tool_calls=False,
    )
    
    car_specialist = Assistant(
        name="Car Specialist",
        description=dedent("""
            You are a knowledgeable car specialist with extensive experience in the automotive industry.
            You combine financial constraints and lifestyle needs to recommend specific car models
            that best match the user's requirements, including safety features, reliability,
            and long-term value considerations.
        """),
        instructions=["""
            As an automotive industry expert, your task is to:
            
            For each recommended car:
            1. Calculate total cost of ownership
            2. Provide monthly payment details
            3. Explain how it fits budget constraints
            4. Justify how it meets lifestyle needs
            5. List key features that match requirements
            6. Provide safety ratings and reliability data
            
            Provide 3 specific recommendations:
            - A practical choice (best value)
            - An optimal choice (best balance)
            - A premium choice (within budget, extra features)
            
            Recommend specific car models based on financial and lifestyle requirements.
            Use search and web tools to verify current models, features, and market prices.
            Include the link to the listing page in the response.             
        """],
        tools=[DuckDuckGo(), WebsiteTools],
        show_tool_calls=False,
    )

    # Execute the recommendation process
    financial_analysis = list(financial_analyst.run(
        dedent(f"""
            Analyze financing options for the following user profile:
            - Annual Income: ${user_data['annual_income']}
            - Credit Score: {user_data['credit_score']}
            - Monthly Budget: ${user_data['monthly_budget']}
            - Down Payment Available: ${user_data['down_payment']}
        """)
    ))
    
    lifestyle_analysis = list(lifestyle_analyst.run(
        dedent(f"""
            Analyze lifestyle requirements for vehicle recommendations:
            
            User Profile:
            - Family Status: {user_data['family_status']}
            - Number of Children: {user_data['children']}
            - Living Area: {user_data['living_area']}
            - Primary Use: {user_data['primary_use']}
            - Hobbies: {user_data['hobbies']}
            - Typical Commute: {user_data['commute']}
            - Preferred Features: {user_data['preferred_features']}
        """)
    ))
    
    final_recommendations = list(car_specialist.run(f"""
        Based on the following analyses, recommend specific cars:
        
        Financial Analysis:
        {financial_analysis}
        
        Lifestyle Analysis:
        {lifestyle_analysis}
        
        User Data:
        {user_data}
        
        Provide three specific car recommendations with detailed analysis for each option.
    """))

    return final_recommendations

if __name__ == "__main__":
    print("Starting Car Recommendation Test...")
    result = test_car_recommendation_system()
    joined_response = ''.join(result)
    formatted_response = ' '.join(joined_response.split()).replace(" ,", ",")
    print(formatted_response)
