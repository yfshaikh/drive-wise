from langchain.tools import Tool
from typing import Dict
import math

class CarFinanceTools:
    @staticmethod
    def calculate_monthly_payment(principal: float, annual_rate: float, years: int) -> float:
        """Calculate monthly car payment using loan amortization formula"""
        monthly_rate = annual_rate / 12 / 100  # Convert annual rate to monthly decimal
        num_payments = years * 12
        if monthly_rate == 0:
            return principal / num_payments
        return principal * (monthly_rate * (1 + monthly_rate)**num_payments) / ((1 + monthly_rate)**num_payments - 1)

    @staticmethod
    def calculate_max_car_price(monthly_budget: float, annual_rate: float, years: int, down_payment: float = 0) -> float:
        """Calculate maximum car price based on monthly budget"""
        monthly_rate = annual_rate / 12 / 100
        num_payments = years * 12
        if monthly_rate == 0:
            return monthly_budget * num_payments + down_payment
        max_loan = monthly_budget * ((1 - (1 + monthly_rate)**-num_payments) / monthly_rate)
        return max_loan + down_payment

    @staticmethod
    def calculate_total_cost(car_price: float, annual_rate: float, years: int, down_payment: float = 0) -> Dict:
        """Calculate total cost of car ownership including interest"""
        loan_amount = car_price - down_payment
        monthly_payment = CarFinanceTools.calculate_monthly_payment(loan_amount, annual_rate, years)
        total_payments = monthly_payment * years * 12
        total_interest = total_payments - loan_amount
        return {
            "monthly_payment": round(monthly_payment, 2),
            "total_payments": round(total_payments, 2),
            "total_interest": round(total_interest, 2)
        }

    def get_finance_tools():
        tools = [
            Tool(
                name="Monthly Payment Calculator",
                func=CarFinanceTools.calculate_monthly_payment,
                description="Calculate monthly car payment given principal, annual interest rate, and loan term in years"
            ),
            Tool(
                name="Maximum Car Price Calculator",
                func=CarFinanceTools.calculate_max_car_price,
                description="Calculate maximum affordable car price based on monthly budget, interest rate, and loan term"
            ),
            Tool(
                name="Total Cost Calculator",
                func=CarFinanceTools.calculate_total_cost,
                description="Calculate total cost of car ownership including monthly payments, total payments, and total interest"
            )
        ]
        return tools