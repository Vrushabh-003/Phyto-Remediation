import styled from 'styled-components';

// A background container with a subtle leafy pattern or gradient
export const PageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(135deg, #e8f5e9, #c8e6c9); /* Light green gradient */
  font-family: 'Arial', sans-serif;
`;

// The main form container that looks like a pot or a leaf
export const FormWrapper = styled.div`
  padding: 40px;
  background: #ffffff;
  border-radius: 15px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  text-align: center;
`;

// The title for the forms
export const Title = styled.h2`
  margin-bottom: 25px;
  color: #2e7d32; /* Deep green */
  font-size: 2em;
  font-weight: bold;
`;

// Styling for the input fields
export const Input = styled.input`
  width: 100%;
  padding: 12px 15px;
  margin-bottom: 20px;
  border: 1px solid #a5d6a7; /* Soft green border */
  border-radius: 8px;
  box-sizing: border-box;
  font-size: 1em;
  
  &:focus {
    border-color: #4caf50; /* Brighter green on focus */
    outline: none;
  }
`;

// The main call-to-action button
export const Button = styled.button`
  width: 100%;
  padding: 12px;
  background-color: #4caf50; /* Vibrant green */
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.1em;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #388e3c; /* Darker green on hover */
  }
`;

// A link for navigating between login and register pages
export const LinkText = styled.p`
  margin-top: 20px;
  color: #555;
  font-size: 0.9em;

  a {
    color: #2e7d32;
    text-decoration: none;
    font-weight: bold;

    &:hover {
      text-decoration: underline;
    }
  }
`;