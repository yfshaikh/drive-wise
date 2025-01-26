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
            tools=[],
            description=dedent("""
                You are an experienced financial analyst specializing in auto financing.
                You analyze credit scores, income, and financial situations to determine 
                optimal car financing solutions, including payment plans and interest rates.
            """),
            instructions=[
                "Analyze financial aspects and recommend suitable car financing options",
            ],
            markdown=False,
            show_tool_calls=True,
        )


    def lifestyle_analyst_agent(self):
            return Agent(
            model=OpenAIChat(id="gpt-3.5-turbo"),
            tools=[DuckDuckGo()],
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
            instructions=[
                "Analyze user lifestyle and recommend suitable vehicle categories",
            ],
            markdown=False,
            show_tool_calls=True,
            )

    def car_specialist_agent(self):
        return Agent(
            model=OpenAIChat(id="gpt-3.5-turbo"),
            tools=[],
            team=[self.finance_tools, self.lifestyle_analyst_agent],
            description=dedent("""
                You are a knowledgeable car specialist with extensive experience in the automotive industry.
                You combine financial constraints and lifestyle needs to recommend specific car models
                that best match the user's requirements, including safety features, reliability,
                and long-term value considerations.
            """),
            instructions=[
                "Recommend specific car models based on financial and lifestyle requirements",
            ],
            markdown=False,
            show_tool_calls=True,
        )
        
        
    