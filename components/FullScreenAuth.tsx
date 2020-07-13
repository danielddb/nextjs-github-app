import { Flex } from '@chakra-ui/core';
import React from 'react';
import AuthContent from './AuthContent';

const FullScreenAuth = () => {
  return (
    <Flex align="center" justify="center" h="100vh">
      <AuthContent />
    </Flex>
  );
};

export default FullScreenAuth;
