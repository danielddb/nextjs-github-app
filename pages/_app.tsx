import React from 'react';
import { ChakraProvider, CSSReset } from '@chakra-ui/core';
import { AppProps } from 'next/app';
import { AuthProvider } from '../context/AuthContext';
import theme from '@chakra-ui/theme';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <CSSReset />
      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
    </ChakraProvider>
  );
}

export default MyApp;
