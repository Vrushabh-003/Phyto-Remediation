import React from 'react';
import { useParams, Link } from 'react-router-dom';
import styled from 'styled-components';
import { logData, recommendationData } from '../data'; // Import data

// --- Styled Components for Recommendation Page ---
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

// START: Styles for the card were missing here
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
`;

const CardContent = styled.div`
  padding: 15px;
  text-align: left;
  flex-grow: 1;

  h3 {
    margin-top: 0;
    color: #388e3c;
  }

  p {
    font-size: 0.9em;
    color: #555;
    line-height: 1.5;
  }
`;
// END: Styles for the card were missing here


const SuggestionsList = styled.ul`
  list-style-type: '🌿';
  padding-left: 20px;
  li { padding-left: 10px; margin-bottom: 10px; color: #333; }
`;


const RecommendationPage = () => {
  const { logId } = useParams();
  const log = logData.find(item => item.id === parseInt(logId));
  const recommendations = recommendationData[logId];

  if (!log || !recommendations) {
    return (
        <ReportWrapper>
            <ReportContainer>
                <h1>Report Not Found</h1>
                <p>We couldn't find a report with that ID.</p>
                <BackButton to="/logs">← Back to All Logs</BackButton>
            </ReportContainer>
        </ReportWrapper>
    );
  }

  return (
    <ReportWrapper>
      <ReportContainer>
        <BackButton to="/logs">← Back to All Logs</BackButton>
        <ReportHeader>
          <h1>Phytoremediation Report</h1>
          <p><strong>Location:</strong> {log.location}</p>
          <p><strong>Date:</strong> {new Date(log.dateTime).toLocaleString()}</p>
        </ReportHeader>

        <Section>
          <h2>Recommended Plants</h2>
          <PlantGrid>
            {recommendations.plants.map(plant => (
              <PlantCard key={plant.name}>
                {/* START: Content for the card was missing here */}
                <CardImage src={plant.imageUrl} alt={plant.name} />
                <CardContent>
                  <h3>{plant.name}</h3>
                  <p>{plant.reason}</p>
                </CardContent>
                {/* END: Content for the card */}
              </PlantCard>
            ))}
          </PlantGrid>
        </Section>

        <Section>
          <h2>Additional Suggestions</h2>
          <SuggestionsList>
            {recommendations.otherSuggestions.map((item, i) => <li key={i}>{item}</li>)}
          </SuggestionsList>
        </Section>
      </ReportContainer>
    </ReportWrapper>
  );
};

export default RecommendationPage;