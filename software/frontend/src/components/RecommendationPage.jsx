import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

// --- Styled Components ---
const ReportWrapper = styled.div`
  background: linear-gradient(135deg, #e8f5e9, #c8e6c9);
  min-height: 100vh;
  padding: 20px;
  @media (min-width: 768px) {
    padding: 40px;
  }
`;

const ReportContainer = styled.div`
  max-width: 900px;
  margin: 0 auto;
  background: white;
  border-radius: 15px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.07);
  padding: 20px;
  @media (min-width: 768px) {
    padding: 40px;
  }
`;

const BackButton = styled(Link)`
  display: inline-block;
  margin-bottom: 25px;
  color: #2e7d32;
  text-decoration: none;
  font-weight: bold;
  &:hover { text-decoration: underline; }
`;

const ReportHeader = styled.div`
  border-bottom: 1px solid #eee;
  padding-bottom: 20px;
  margin-bottom: 20px;
  h1 { margin: 0; color: #2e7d32; }
  p { margin: 5px 0 0 0; color: #555; }
`;

const Section = styled.section`
  margin-bottom: 40px;
  h2 {
    color: #388e3c;
    margin-bottom: 20px;
  }
`;

const PlantGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const PlantCard = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-5px);
  }
`;

const CardImage = styled.img`
  width: 100%;
  height: 180px;
  object-fit: cover;
  background-color: #eee; // Placeholder bg for missing images
`;

const CardContent = styled.div`
  padding: 15px;
  text-align: left;
  flex-grow: 1;

  h3 {
    margin-top: 0;
    margin-bottom: 10px;
    color: #388e3c;
  }

  p {
    font-size: 0.9em;
    color: #555;
    line-height: 1.5;
    margin: 0;
  }
`;

const LoadingMessage = styled.p`
  font-size: 1.2em;
  color: #388e3c;
  text-align: center;
  padding: 40px 0;
`;

const ErrorMessage = styled.p`
  font-size: 1.1em;
  color: #c62828; /* Red color for errors */
  text-align: center;
  padding: 20px;
  background-color: #ffebee; /* Light red background */
  border: 1px solid #ef9a9a;
  border-radius: 8px;
`;

// --- RecommendationPage Component ---
const RecommendationPage = () => {
  // State for API data, loading status, and errors
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Optional: Keep state for log details if needed
  const [logDetails, setLogDetails] = useState({ location: "Latest Analysis Area", dateTime: new Date() });

  // useEffect Hook to fetch data from backend when component mounts
  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        setError(null);
        // API call to your Flask backend
        const response = await fetch('http://127.0.0.1:5000/api/recommendations');

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({})); // Handle non-JSON error responses
          throw new Error(errorData.error || `Failed to fetch. Status: ${response.status}`);
        }

        const data = await response.json();
        setRecommendations(data.recommendations || []); // Update state with fetched data

        // Optional: Update log details based on fetched data if available
        // setLogDetails({ location: data.location || "Latest Analysis Area", dateTime: data.timestamp || new Date() });

      } catch (err) {
        console.error("Error fetching recommendations:", err);
        setError(err.message); // Set error state
      } finally {
        setLoading(false); // Stop loading indicator
      }
    };

    fetchRecommendations(); // Execute the fetch function
  }, []); // Empty dependency array means this runs only once on mount

  // --- Render based on loading or error state ---
  if (loading) {
    return (
      <ReportWrapper>
        <ReportContainer>
          <LoadingMessage><span role="img" aria-label="loading">⏳</span> Loading Recommendations...</LoadingMessage>
        </ReportContainer>
      </ReportWrapper>
    );
  }

  if (error) {
    return (
      <ReportWrapper>
        <ReportContainer>
          <BackButton to="/logs">← Back to All Logs</BackButton>
          <ReportHeader>
            <h1><span role="img" aria-label="error">❌</span> Error Loading Report</h1>
          </ReportHeader>
          <ErrorMessage>{error}</ErrorMessage>
        </ReportContainer>
      </ReportWrapper>
    );
  }

  // --- Render recommendations if fetch was successful ---
  return (
    <ReportWrapper>
      <ReportContainer>
        <BackButton to="/logs">← Back to All Logs</BackButton>
        <ReportHeader>
          <h1>Phytoremediation Report</h1>
          <p><strong>Location:</strong> {logDetails.location}</p>
          <p><strong>Analysis Date:</strong> {new Date(logDetails.dateTime).toLocaleString()}</p>
        </ReportHeader>

        <Section>
          <h2>Recommended Plants <span role="img" aria-label="plant">🌱</span></h2>
          {recommendations.length > 0 ? (
            <PlantGrid>
              {recommendations.map((plant, index) => (
                <PlantCard key={plant.scientific_name || index}> {/* Prefer scientific name as key */}
                  <CardImage
                    src={plant.image_url || '/placeholder.JPG'} // Use a real placeholder path in /public
                    alt={plant.common_name || plant.scientific_name}
                    onError={(e) => { e.target.onerror = null; e.target.src = '/placeholder.JPG'; }} // Prevent infinite loop on error
                  />
                  <CardContent>
                    <h3>{plant.common_name || 'N/A'}</h3>
                    <p><em>{plant.scientific_name}</em></p>
                    <p>{plant.notes || 'No specific notes provided.'}</p>
                  </CardContent>
                </PlantCard>
              ))}
            </PlantGrid>
          ) : (
            <p>No specific plant recommendations could be generated based on the latest soil analysis.</p>
          )}
        </Section>

        {/* You can add back the 'Additional Suggestions' section later if your API provides that data */}

      </ReportContainer>
    </ReportWrapper>
  );
};

export default RecommendationPage;