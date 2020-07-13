const fetch = require('isomorphic-unfetch');

exports.handler = async function (event, context, callback) {
  const body = JSON.parse(event.body);
  const res = await fetch(`https://github.com/login/oauth/access_token`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...body,
      client_id: process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
    }),
  });
  const data = await res.json();

  callback(null, {
    statusCode: res.status,
    body: JSON.stringify(data),
  });
};
