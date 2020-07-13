import { GraphQLClient } from 'graphql-request';

export const createClient = (url: string) => {
  const client = new GraphQLClient(url);

  return async <Data = any>(
    query: string,
    variables?: { [key: string]: any },
    headers?: { [key: string]: any }
  ) => {
    client.setHeaders(headers as Headers);

    return client.request<Data>(query, variables);
  };
};
