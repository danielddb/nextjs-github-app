import { Flex, Box } from '@chakra-ui/core';
import React from 'react';
import AuthContent from './AuthContent';

const FullScreenAuth = () => {
  return (
    <Flex align="center" justify="center" minHeight="100vh">
      <Box px={6} py={12}>
        <AuthContent />
      </Box>
    </Flex>
  );
};

export default FullScreenAuth;
