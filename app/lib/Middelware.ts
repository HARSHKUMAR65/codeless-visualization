export const withAuth = (
  handler: (request: Request) => Promise<Response>
) => {
  return async (request: Request) => {
    const authHeader = request.headers.get('Authorization');

    if (!authHeader || authHeader !== 'Bearer my-secret-token') {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }
    return handler(request);
  };
};