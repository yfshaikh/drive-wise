from crewai import Task
from textwrap import dedent

class CarRecommendationTasks:
    def analyze_financing_options(self, agent, user_data):
        return Task(
            description=dedent(f"""
                Analyze financing options for the following user profile:
                - Annual Income: ${user_data['annual_income']}
                - Credit Score: {user_data['credit_score']}
                - Monthly Budget: ${user_data['monthly_budget']}
                - Down Payment Available: ${user_data['down_payment']}
                
                Steps to complete:
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
                
                Use the financial calculator tools for precise calculations.
                Format all monetary values as currency with two decimal places.
            """),
            expected_output="A detailed financial analysis report",
            agent=agent
        )

    def analyze_lifestyle_needs(self, agent, user_data):
        return Task(
            description=dedent(f"""
                Analyze lifestyle requirements for vehicle recommendations:
                
                User Profile:
                - Family Status: {user_data['family_status']}
                - Number of Children: {user_data['children']}
                - Living Area: {user_data['living_area']}
                - Primary Use: {user_data['primary_use']}
                - Hobbies: {user_data['hobbies']}
                - Typical Commute: {user_data['commute']}
                
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
                
                Use internet search to find current vehicle categories and features
                that best match these requirements.
            """),
            expected_output="A comprehensive lifestyle requirements analysis",
            agent=agent
        )

    def recommend_specific_cars(self, agent, financial_analysis, lifestyle_analysis, user_data):
        return Task(
            description=dedent(f"""
                Based on the financial and lifestyle analyses, recommend specific cars:
                
                Financial Parameters:
                {financial_analysis}
                
                Lifestyle Requirements:
                {lifestyle_analysis}
                
                For each recommended car:
                1. Calculate total cost of ownership
                2. Provide monthly payment details
                3. Explain how it fits budget constraints
                4. Justify how it meets lifestyle needs
                5. List key features that match requirements
                6. Provide safety ratings and reliability data
                
                Research current market options and provide 3 specific recommendations:
                - A practical choice (best value)
                - A optimal choice (best balance)
                - A premium choice (within budget, extra features)
                
                Use financial calculators to validate costs and search tools
                to verify current models and features.
            """),
            expected_output="A list of three specific car recommendations with detailed analysis",
            agent=agent
        )