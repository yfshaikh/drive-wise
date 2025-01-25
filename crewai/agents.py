from crewai import Agent
from textwrap import dedent
from langchain_openai import ChatOpenAI  # New import path
from tools.CarFinanceTools import get_finance_tools
from tools.websearch import SearchTools

class CarRecommendationAgents:
    def __init__(self, llm=None):
        self.llm = ChatOpenAI(model_name="gpt-3.5-turbo", temperature=0.7)
        self.finance_tools = get_finance_tools()
        self.search_tools = SearchTools()

    def financial_analyst_agent(self):
        return Agent(
            role='Financial Analyst',
            goal='Analyze financial aspects and recommend suitable car financing options',
            backstory=dedent("""
                You are an experienced financial analyst specializing in auto financing.
                You analyze credit scores, income, and financial situations to determine 
                optimal car financing solutions, including payment plans and interest rates.
            """),
            tools=[],
            allow_delegation=False,
            llm=self.llm,
            verbose=True
        )

    def lifestyle_analyst_agent(self):
            return Agent(
                role='Lifestyle Analyst',
                goal='Analyze user lifestyle and recommend suitable vehicle categories',
                backstory=dedent("""
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
                tools=[self.search_tools.search_internet],
                llm=self.llm,
                verbose=True
            )

    def car_specialist_agent(self):
        return Agent(
            role='Car Specialist',
            goal='Recommend specific car models based on financial and lifestyle requirements',
            backstory=dedent("""
                You are a knowledgeable car specialist with extensive experience in the automotive industry.
                You combine financial constraints and lifestyle needs to recommend specific car models
                that best match the user's requirements, including safety features, reliability,
                and long-term value considerations.
            """),
            tools=[],
            allow_delegation=False,
            llm=self.llm,
            verbose=True
        )
