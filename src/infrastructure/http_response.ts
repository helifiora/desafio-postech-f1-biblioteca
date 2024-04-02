export function created(content: object): Response {
  return Response.json(content, { status: 201 });
}

export function noContent(): Response {
  return new Response(null, { status: 204 });
}

export function notFound(): Response {
  return new Response(null, { status: 404 });
}

export function ok(content: object): Response {
  return Response.json(content, { status: 200 });
}

export function internalError(message: string): Response {
  return Response.json({ error: message }, { status: 500 });
}

export function badRequest(message: string): Response {
  return Response.json({ error: message }, { status: 402 });
}
