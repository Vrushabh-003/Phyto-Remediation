import React from 'react';
import { Link } from 'react-router-dom';
import { PageContainer, FormWrapper, Title, Input, Button, LinkText } from '../styles/StyledComponents';

const RegisterPage = () => {
  return (
    <PageContainer>
      <FormWrapper>
        <Title>Join the Remediation</Title>
        <form>
          <Input type="text" placeholder="Full Name" required />
          <Input type="tel" placeholder="Mobile Number" required />
          <Input type="text" placeholder="Device ID" required />
          <Input type="password" placeholder="Create Password" required />
          <Button type="submit">Create Account</Button>
        </form>
        <LinkText>
          Already have an account? <Link to="/">Log in</Link>
        </LinkText>
      </FormWrapper>
    </PageContainer>
  );
};

export default RegisterPage;