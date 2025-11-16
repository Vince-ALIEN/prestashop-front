'use client';

import axios from 'axios';

export const getAccessToken = async () => {
  const params = new URLSearchParams();
  params.append('grant_type', 'client_credentials');
  params.append('client_id', 'next');
  params.append('client_secret', '4e37407f922268d8377cf65d18485322');
  params.append('scope', 'product_read');

  const response = await axios.post('/api/proxy', {
    url: 'admin-api/access_token',
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString(),
  });

  return response.data.access_token;
};
