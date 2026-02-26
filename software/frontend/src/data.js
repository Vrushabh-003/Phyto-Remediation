export const logData = [
  {
    id: 1,
    dateTime: '2025-10-14T09:15:00Z',
    location: 'Factory Outlet, Navi Mumbai',
  },
  {
    id: 2,
    dateTime: '2025-10-12T14:30:00Z',
    location: 'Taloja Industrial Area',
  },
  {
    id: 3,
    dateTime: '2025-10-11T18:00:00Z',
    location: 'Urban Farming Patch, Vashi',
  },
];

export const recommendationData = {
  1: {
    plants: [
      { 
        name: 'Indian Mustard', 
        reason: 'Excellent for absorbing heavy metals like lead and cadmium.',
        imageUrl: 'https://www.planetayurveda.com/wp-content/uploads/2023/01/rajeeka-indian-mustard.png' 
      },
      { 
        name: 'Sunflower', 
        reason: 'Known to absorb arsenic and zinc from the soil.',
        imageUrl: 'https://images.immediate.co.uk/production/volatile/sites/10/2024/03/2048x1365-sunflowers-SEO-LI911724DSF6762-a7210ba.jpg'
      },
      { 
        name: 'Water Hyacinth', 
        reason: 'Ideal for water-based purification, removes mercury.',
        imageUrl: 'https://www.lakerestoration.com/wp-content/uploads/2024/09/control-water-hyacinth.jpg'
      }
    ],
    otherSuggestions: [
      'Monitor soil pH levels regularly to ensure optimal plant health.',
      'Consider adding organic compost to improve soil structure.',
    ],
  },
  2: {
    plants: [
      { 
        name: 'Poplar Tree', 
        reason: 'Deep roots are effective at absorbing industrial solvents.',
        imageUrl: 'http://googleusercontent.com/image_collection/image_retrieval/7174864029652068226_0'
      },
      { 
        name: 'Indian Grass', 
        reason: 'Helps break down pesticides and hydrocarbons in the soil.',
        imageUrl: 'http://googleusercontent.com/image_collection/image_retrieval/3077114063604701825_0'
      },
    ],
    otherSuggestions: [
      'Ensure proper drainage to prevent waterlogging and contaminant runoff.',
      'Test soil for specific contaminants to tailor the plant selection further.',
    ],
  },
  3: {
    plants: [
      { 
        name: 'Sunflower', 
        reason: 'Known to absorb arsenic and zinc from the soil.',
        imageUrl: 'http://googleusercontent.com/image_collection/image_retrieval/2137197949352503660_0'
      },
      { 
        name: 'Indian Mustard', 
        reason: 'Excellent for absorbing heavy metals like lead and cadmium.',
        imageUrl: 'http://googleusercontent.com/image_collection/image_retrieval/475560294131194153_0' 
      },
    ],
    otherSuggestions: [
      'Use drip irrigation to conserve water and target contaminated areas.',
      'Test soil nutrients quarterly to adjust fertilization and support plant growth.',
    ],
  }
};