from phi.assistant import Assistant
from phi.tools.website import WebsiteTools
from phi.tools.duckduckgo import DuckDuckGo
from typing import Dict
import os
from dotenv import load_dotenv
from textwrap import dedent
from tools.CarFinanceTools import CarFinanceTools

def test_car_recommendation_system(user_data):
    load_dotenv()
    
    # Initialize assistants with specific roles
    financial_analyst = Assistant(
        name="Financial Analyst",
        description="You are an experienced financial analyst specializing in auto financing. You analyze credit scores, income, and financial situations to determine optimal car financing solutions, including payment plans and interest rates.",
        instructions=["1. Use Maximum Car Price Calculator to determine price range - Consider different loan terms (36, 48, 60 months) - Use credit score to estimate interest rates",
                       "2. For the determined price range: - Calculate monthly payments for different scenarios - Analyze total cost including interest - Consider down payment impact", 
                       "3. Provide detailed recommendations including: - Optimal loan term - Recommended down payment - Monthly payment breakdown - Total cost analysis. Format all monetary values as currency with two decimal places. Analyze financial aspects and recommend suitable car financing options."],
        tools=[CarFinanceTools.calculate_monthly_payment, CarFinanceTools.calculate_max_car_price, CarFinanceTools.calculate_total_cost],
        show_tool_calls=False,
    )
    
    lifestyle_analyst = Assistant(
        name="Lifestyle Analyst",
        description="You are an expert in matching vehicles to lifestyle needs, considering factors like family size, daily routines, hobbies, living environment, storage needs, safety, and environmental preferences to recommend vehicles that align with the user's lifestyle.",
        instructions = [
            "1. Research and analyze Vehicle categories that match the family size and composition",
            "2. Research and analyze Space requirements based on lifestyle activities",
            "3. Research and analyze Safety features needed for the family situation",
            "4. Research and analyze Comfort features for commute patterns",
            "5. Research and analyze Specific requirements based on living area",
            "6. Research and analyze Storage needs for hobbies and activities",
            "7. Provide Recommended vehicle categories (SUV, Sedan, etc.)",
            "8. Provide Must-have features based on lifestyle",
            "9. Provide Nice-to-have features for quality of life",
            "10. Provide Specific lifestyle considerations that impact choice",
            "11. Analyze user lifestyle and recommend suitable vehicle categories.",
            "12. Use search tools to research current vehicle options and features."
        ],


        tools=[DuckDuckGo()],
        show_tool_calls=False,
    )
    
    car_specialist = Assistant(
    name="Car Specialist",
    description="You are a knowledgeable car specialist with extensive experience in the automotive industry. You combine financial constraints and lifestyle needs to recommend specific car models that best match the user's requirements, including safety features, reliability, and long-term value considerations.",
    instructions=[
        "1. For each recommended car, calculate the total cost of ownership.",
        "2. Provide monthly payment details for each recommendation.",
        "3. Explain how each car fits within the user's budget constraints.",
        "4. Justify how each car meets the user's lifestyle needs.",
        "5. List key features of each car that match the user's requirements.",
        "6. Provide safety ratings and reliability data for each recommendation.",
        "7. Recommend 3 specific car models based on financial and lifestyle requirements: a practical choice (best value), an optimal choice (best balance), and a premium choice (within budget with extra features).",
        "8. Use search and web tools to verify current models, features, and market prices.",
        "9. Include the link to the listing page in the response."
    ],
    tools=[DuckDuckGo(), WebsiteTools],
    show_tool_calls=False,
)


    financial_analysis = list(financial_analyst.run(
        [
            {"role": "user", "content": "1. Analyze financing options for the following user profile:", "type": "text"},
            {"role": "user", "content": "2. User Profile: Annual Income Range - ${user_data['annual_income_range']}", "type": "text"},
            {"role": "user", "content": "3. User Profile: Credit Score - {user_data['credit_score']}", "type": "text"},
            {"role": "user", "content": "4. User Profile: Target Monthly Payment - ${user_data['target_monthly_payment']}", "type": "text"},
            {"role": "user", "content": "5. Based on the user profile, recommend financing options that align with their budget and credit score.", "type": "text"},
            {"role": "user", "content": "6. Provide a breakdown of potential loan terms, interest rates, and monthly payments.", "type": "text"},
            {"role": "user", "content": "7. Suggest affordable financing options that fall within the user's monthly budget and credit score constraints.", "type": "text"}
        ]
    ))
    

    
    lifestyle_analysis = list(lifestyle_analyst.run(
        [
            {"role": "user", "content": "1. Analyze lifestyle requirements for vehicle recommendations based on the following user profile:", "type": "text"},
            {"role": "user", "content": "2. User Profile: Life Stage - {user_data['life_stage']}", "type": "text"},
            {"role": "user", "content": "3. User Profile: Age Range - {user_data['age_range']}", "type": "text"},
            {"role": "user", "content": "4. User Profile: Preferred Vehicle Categories - {user_data['vehicle_categories']}", "type": "text"},
            {"role": "user", "content": "5. User Profile: Primary Vehicle Uses - {user_data['primary_uses']}", "type": "text"},
            {"role": "user", "content": "6. User Profile: Vehicle Priorities - {user_data['vehicle_priorities']}", "type": "text"},
            {"role": "user", "content": "7. User Profile: Tech Preferences - {user_data['tech_preferences']}", "type": "text"},
            {"role": "user", "content": "8. User Profile: Preferred Vehicle Colors - {user_data['preferred_colors']}", "type": "text"},
            {"role": "user", "content": "9. Based on the user profile, recommend vehicle categories that align with their lifestyle needs.", "type": "text"},
            {"role": "user", "content": "10. Take into account safety, comfort, space, and technology preferences when making recommendations.", "type": "text"},
            {"role": "user", "content": "11. Provide additional suggestions based on the user's priorities and lifestyle constraints.", "type": "text"}
        ]
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
