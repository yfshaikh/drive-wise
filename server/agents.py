from crewai import Agent
from textwrap import dedent
from langchain_openai import ChatOpenAI  # New import path
from tools.CarFinanceTools import get_finance_tools
from tools.websearch import SearchTools
from phi.agent import Agent
from phi.model.openai import OpenAIChat
from phi.tools.duckduckgo import DuckDuckGo
import os
import dotenv
from tools.CarFinanceTools import CarFinanceTools

dotenv.load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

class CarRecommendationAgents:
    def __init__(self, llm=None):
        self.llm = ChatOpenAI(model_name="gpt-3.5-turbo", temperature=0.7)
        self.finance_tools = get_finance_tools()
        self.search_tools = SearchTools()




    def financial_analyst_agent(self):
        return Agent(
            model=OpenAIChat(id="gpt-3.5-turbo"),
            markdown=False,
            show_tool_calls=True,
            name="Financial Analyst",
            description="You are an experienced financial analyst specializing in auto financing. You analyze credit scores, income, and financial situations to determine optimal car financing solutions, including payment plans and interest rates.",
            instructions=["1. Use Maximum Car Price Calculator to determine price range - Consider different loan terms (36, 48, 60 months) - Use credit score to estimate interest rates",
                        "2. For the determined price range: - Calculate monthly payments for different scenarios - Analyze total cost including interest - Consider down payment impact", 
                        "3. Provide detailed recommendations including: - Optimal loan term - Recommended down payment - Monthly payment breakdown - Total cost analysis. Format all monetary values as currency with two decimal places. Analyze financial aspects and recommend suitable car financing options."],
            tools=[CarFinanceTools.calculate_monthly_payment, CarFinanceTools.calculate_max_car_price, CarFinanceTools.calculate_total_cost],
            show_tool_calls=False,
        )


    def lifestyle_analyst_agent(self):
            return Agent(
            model=OpenAIChat(id="gpt-3.5-turbo"),
            tools=[DuckDuckGo()],
            name="Lifestyle Analyst",
            description="You are an expert in matching vehicles to lifestyle needs, considering factors like family size, daily routines, hobbies, living environment, storage needs, safety, and environmental preferences to recommend vehicles that align with the user's lifestyle."
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
            markdown=False,
            show_tool_calls=True,
            )

    def car_specialist_agent(self):
        return Agent(
            model=OpenAIChat(id="gpt-3.5-turbo"),
            tools=[],
            team=[self.finance_tools, self.lifestyle_analyst_agent],
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
            show_tool_calls=False,
            markdown=False,
        )
        
        
    