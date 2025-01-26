from crewai import Agent, Task, Crew
from langchain_community.tools import DuckDuckGoSearchRun
from langchain.tools import Tool
from langchain_openai import ChatOpenAI
import os
import dotenv
from phi.agent import Agent
from phi.model.openai import OpenAIChat
from phi.tools.duckduckgo import DuckDuckGo


# https://www.youtube.com/watch?v=EUey9L9sgzE&t=1382s

dotenv.load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
# Initialize the search tool
search_tool = Tool(
    name="web_search",
    func=DuckDuckGoSearchRun().run,
    description="Searches the web for current information about cars and vehicles"
)

 
car_search_agent = Agent(
    name="Car Search Specialist",
    model=OpenAIChat(id="gpt-3.5-turbo"),
    tools=[DuckDuckGo()],
    instructions=["Always include sources"],
    show_tool_calls=True,
    markdown=False
)

car_search_agent.print_response(
    """Search for used Toyota cars that match the following criteria:
    - Price range: $10,000 - $13,000
    - Color: Red
    - Condition: Used
    
    Compile a list of the best matches, including:
    - Model and year
    - Price
    - Mileage (if available)
    - Location (if available)
    - Brief condition description
    
    Focus on finding reliable options that offer good value for money.
    
    Expected output:
    A detailed list of used Toyota cars matching the criteria, with each entry containing:
    1. Model and year
    2. Price
    3. Mileage
    4. Location
    5. Condition description
    """, stream=True
)


