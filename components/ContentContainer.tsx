import { Box } from '@chakra-ui/core';
import React from 'react';

const ContentContainer: React.FC = ({ children }) => (
  <Box p={6} width={[null, null, '48em']} mx="auto">
    {children}
  </Box>
);

export default ContentContainer;
