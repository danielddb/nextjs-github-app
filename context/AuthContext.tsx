import React from 'react';
import useSWR, { ConfigInterface } from 'swr';
import * as github from '../lib/github';
import { createClient } from '../lib/graphql-client';
import { useDeepMemo } from '../hooks/useDeepMemo';
import useLocalStorage from '../hooks/useLocalStorage';

const client = createClient('https://api.github.com/graphql');

const AuthContext = React.createContext<{
  accessToken: string;
  isAuthenticating: boolean;
  isAuthenticated: boolean;
  setToken: (token: string) => void;
  exchangeToken: (
    code: string,
    state: string
  ) => Promise<github.AccessTokenResponse>;
  authoriseApp: () => void;
  logout: () => void;
}>(null);

export const AuthProvider: React.FC<{}> = ({ children }) => {
  const tokenKey = '__github-nextjs-access_token__';
  const [tokenState, setToken] = useLocalStorage(tokenKey);

  const authoriseApp = () => github.authoriseApp();

  const exchangeToken = async (code: string, state: string) => {
    return await github.requestAccessToken({ code, state });
  };

  const logout = () => {
    setToken(null);
  };

  const value = {
    accessToken: tokenState.value,
    isAuthenticating: tokenState.isInitialising,
    isAuthenticated: !!tokenState.value,
    setToken,
    exchangeToken,
    authoriseApp,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => React.useContext(AuthContext);

export function useClient<Data = any, Error = any>(
  query: string | null,
  variables?: { [key: string]: any },
  config?: ConfigInterface<Data, Error>
) {
  const { accessToken } = useAuth();
  const result = useDeepMemo(() => variables, [variables]);

  return useSWR<Data, Error>(
    query ? [query, result, accessToken] : null,
    (query, variables, accessToken) =>
      client(query, variables, { authorization: `Bearer ${accessToken}` }),
    config
  );
}

export const useViewer = () =>
  useClient(
    `{
      viewer {
        login
      }
    }`
  );
