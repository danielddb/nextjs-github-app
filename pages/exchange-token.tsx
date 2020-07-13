import { useToast } from '@chakra-ui/core';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export default function ExchangeToken() {
  const toast = useToast();
  const router = useRouter();
  const { exchangeToken, setToken } = useAuth();

  useEffect(() => {
    async function doExhangeToken() {
      const { code, state } = router.query;

      if (code && state) {
        const data = await exchangeToken(code as string, state as string);

        if ('access_token' in data) {
          setToken(data.access_token);
          router.push('/');
        } else {
          toast({
            title: data.error,
            description: data.error_description,
            status: 'warning',
            duration: 9000,
            isClosable: true,
          });

          router.push('/login');
        }
      }
    }

    doExhangeToken();
  }, [router]);

  return null;
}
