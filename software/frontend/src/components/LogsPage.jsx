import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { logData } from '../data'; // Import data

// --- Styled Components for Logs Page ---
const PageWrapper = styled.div`
  background-color: #f4f7f6;
  min-height: 100vh;
  padding: 40px;
`;

const Header = styled.div`
  max-width: 1200px;
  margin: 0 auto 30px auto;
  text-align: left;
  h1 {
    font-size: 2.5em;
    color: #2e7d32;
    margin-bottom: 5px;
  }
  p {
    color: #555;
    font-size: 1.1em;
  }
`;

const LogGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 25px;
  max-width: 1200px;
  margin: 0 auto;
`;

const LogCard = styled(Link)`
  background: white;
  border-radius: 15px;
  padding: 25px;
  box-shadow: 0 8px 16px rgba(0,0,0,0.05);
  text-decoration: none;
  color: inherit;
  transition: all 0.3s ease;
  border-left: 5px solid #4caf50;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 24px rgba(0,0,0,0.1);
    border-left-color: #2e7d32;
  }

  h3 {
    margin: 0 0 8px 0;
    color: #388e3c;
  }

  p {
    margin: 4px 0;
    color: #666;
    font-size: 0.9em;
  }

  .view-report {
    margin-top: 15px;
    font-weight: bold;
    color: #4caf50;
  }
`;

const LogsPage = () => {
  return (
    <PageWrapper>
      <Header>
        <h1>Analysis Logs</h1>
        <p>Review past analyses and view detailed phytoremediation reports.</p>
      </Header>
      <LogGrid>
        {logData.map(log => (
          <LogCard key={log.id} to={`/recommendation/${log.id}`}>
            <h3>{log.location}</h3>
            <p>
              <strong>Date:</strong> {new Date(log.dateTime).toLocaleDateString('en-GB')}
            </p>
            <p>
              <strong>Time:</strong> {new Date(log.dateTime).toLocaleTimeString('en-US')}
            </p>
            <div className="view-report">View Report →</div>
          </LogCard>
        ))}
      </LogGrid>
    </PageWrapper>
  );
};

export default LogsPage;