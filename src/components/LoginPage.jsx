import React from 'react';
import { Link } from 'react-router-dom';
import { PageContainer, FormWrapper, Title, Input, Button, LinkText } from '../styles/StyledComponents';

const LoginPage = () => {
  return (
    <PageContainer>
      <FormWrapper>
        <Title>Welcome Back!</Title>
        <form>
          <Input type="text" placeholder="Device ID" required />
          <Input type="password" placeholder="Password" required />
          <Link to="/logs"><Button type="submit">Log In</Button></Link>
        </form>
        <LinkText>
          New User? <Link to="/register">Create an account</Link>
        </LinkText>
      </FormWrapper>
    </PageContainer>
  );
};

export default LoginPage;