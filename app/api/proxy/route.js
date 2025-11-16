export async function POST(request) {
  const { url, method, headers, body } = await request.json();

  try {
    const response = await fetch(`https://nextps.panel-ufo.fr/${url}`, {
      method,
      headers: {
        ...headers,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body,
    });

    const data = await response.json();
    return Response.json(data);
  } catch (error) {
    console.error('Erreur proxy:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
