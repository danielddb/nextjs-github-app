import { Button, Heading, Stack, Text } from '@chakra-ui/core';
import React from 'react';
import { useAuth } from '../context/AuthContext';

const AuthContent: React.FC<{ introText?: string }> = ({
  introText = 'Welcome! Please click the button below to sign-in',
}) => {
  const { authoriseApp } = useAuth();

  return (
    <Stack textAlign="center">
      <Heading>Next.js GitHub</Heading>
      <Text>{introText}</Text>
      <Button mt={4} onClick={() => authoriseApp()}>
        Authorize App
      </Button>
    </Stack>
  );
};

export default AuthContent;
