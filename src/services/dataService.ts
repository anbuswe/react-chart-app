const fetchData = async (timeframe: 'daily' | 'weekly' | 'monthly') => {
  try {
    const response = await fetch(`/data.json`); // Adjust the path as per your setup
    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    return [];
  }
};

export default fetchData;
