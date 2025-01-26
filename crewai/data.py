import matplotlib.pyplot as plt 
import pandas as pd 
import os
print(os.getcwd())

file = pd.read_excel('/Users/yusufshaikh/Documents/Projects/drive-wise/drive-wise/crewai/toyota_fe.xlsx') 
x_axis = file['Carline'] 
y_axis = file['Comb FE (Guide) - Conventional Fuel'] 
plt.plot(x_axis, y_axis) 
plt.xlabel("Model") 
plt.ylabel("Fuel Economy") 
plt.show() 