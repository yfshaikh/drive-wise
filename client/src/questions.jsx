export const questions = [
    {
      id: 'demographics',
      type: 'single',
      question: 'Which best describes your current life stage?',
      options: [
        { value: 'young_single', label: 'Young Professional (Single)' },
        { value: 'married_no_kids', label: 'Married/Partner (No Children)' },
        { value: 'family_young_kids', label: 'Family with Young Children' },
        { value: 'family_teens', label: 'Family with Teenagers' },
        { value: 'empty_nester', label: 'Empty Nester' }
      ]
    },
    {
      id: 'age',
      type: 'single',
      question: 'What is your age range?',
      options: [
        { value: '18-25', label: '18-25 years' },
        { value: '26-35', label: '26-35 years' },
        { value: '36-45', label: '36-45 years' },
        { value: '46-55', label: '46-55 years' },
        { value: '56+', label: '56 years or older' }
      ]
    },
    {
      id: 'household_income',
      type: 'single',
      question: 'What is your annual household income?',
      options: [
        { value: 'under_50k', label: 'Under $50,000' },
        { value: '50k-75k', label: '$50,000 - $75,000' },
        { value: '75k-100k', label: '$75,000 - $100,000' },
        { value: '100k-150k', label: '$100,000 - $150,000' },
        { value: 'over_150k', label: 'Over $150,000' }
      ]
    },
    {
      id: 'credit_score',
      type: 'single',
      question: 'What is your credit score range?',
      options: [
        { value: 'excellent', label: 'Excellent (750+)' },
        { value: 'good', label: 'Good (700-749)' },
        { value: 'fair', label: 'Fair (650-699)' },
        { value: 'poor', label: 'Poor (Below 650)' },
        { value: 'unsure', label: 'Not Sure' }
      ]
    },
    {
      id: 'monthly_payment',
      type: 'single',
      question: 'What is your target monthly car payment?',
      options: [
        { value: 'under_300', label: 'Under $300' },
        { value: '300-500', label: '$300 - $500' },
        { value: '500-700', label: '$500 - $700' },
        { value: '700-900', label: '$700 - $900' },
        { value: 'over_900', label: 'Over $900' }
      ]
    },
    {
      id: 'primary_use',
      type: 'multiple',
      question: 'What will be the primary uses for your vehicle? (Select all that apply)',
      options: [
        { value: 'commute', label: 'Daily Commute' },
        { value: 'family', label: 'Family Transportation' },
        { value: 'recreation', label: 'Weekend Recreation' },
        { value: 'business', label: 'Business/Professional' },
        { value: 'road_trips', label: 'Long Distance Travel' }
      ]
    },
    {
      id: 'vehicle_type',
      type: 'multiple',
      question: 'What vehicle categories interest you? (Select all that apply)',
      options: [
        { value: 'luxury', label: 'Luxury Vehicle' },
        { value: 'sports', label: 'Sports Car' },
        { value: 'suv', label: 'SUV/Crossover' },
        { value: 'sedan', label: 'Sedan' },
        { value: 'electric', label: 'Electric Vehicle' }
      ]
    },
    {
      id: 'priorities',
      type: 'multiple',
      question: 'What are your top priorities in a vehicle? (Select all that apply)',
      options: [
        { value: 'comfort', label: 'Comfort and Ride Quality' },
        { value: 'performance', label: 'Performance and Handling' },
        { value: 'safety', label: 'Safety Features' },
        { value: 'fuel_efficiency', label: 'Fuel Efficiency' },
        { value: 'tech_features', label: 'Technology Features' }
      ]
    },
    {
      id: 'tech_features',
      type: 'multiple',
      question: 'Which technology features are important to you? (Select all that apply)',
      options: [
        { value: 'apple_carplay', label: 'Apple CarPlay/Android Auto' },
        { value: 'driver_assist', label: 'Advanced Driver Assistance' },
        { value: 'premium_audio', label: 'Premium Audio System' },
        { value: 'parking_assist', label: 'Parking Assistance' },
        { value: 'wireless_charging', label: 'Wireless Charging' }
      ]
    },
    {
      id: 'color_preference',
      type: 'multiple',
      question: 'What are your preferred exterior colors? (Select all that apply)',
      options: [
        { value: 'black', label: 'Black' },
        { value: 'white', label: 'White' },
        { value: 'silver', label: 'Silver/Gray' },
        { value: 'blue', label: 'Blue' },
        { value: 'red', label: 'Red' }
      ]
    }
  ];