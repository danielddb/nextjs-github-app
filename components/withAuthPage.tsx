import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/router';

const withAuthPage = <P extends object>(Component: React.ComponentType<P>) => {
  const WithAuth: React.FC<P> = (props) => {
    const { isAuthenticated, isAuthenticating } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!isAuthenticated && !isAuthenticating) {
        router.push('/login');
      }
    }, [isAuthenticated, isAuthenticating]);

    return isAuthenticated && !isAuthenticating ? (
      <Component {...(props as P)} />
    ) : null;
  };

  return WithAuth;
};

export default withAuthPage;
