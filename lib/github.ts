import fetch from 'isomorphic-unfetch';

export const authoriseApp = (): void => {
  const scope =
    'user public_repo repo repo_deployment repo:status read:repo_hook read:org read:public_key read:gpg_key';

  const state =
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15);

  window.location.href = [
    `https://github.com/login/oauth/authorize`,
    `?client_id=${process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID}`,
    `&redirect_uri=${window.location.origin}/exchange-token`,
    `&scope=${scope}`,
    `&state=${state}`,
  ].join('');
};

export type AccessTokenResponse =
  | { access_token: string; token_type: string }
  | {
      error: string;
      error_description?: string;
      error_uri?: string;
    };

export const requestAccessToken = async (body: {
  code: string;
  state: string;
}): Promise<AccessTokenResponse> => {
  const res = await fetch(`/.netlify/functions/access-token`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  return res.json();
};
