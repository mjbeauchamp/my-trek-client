export async function parseFetchError(res: Response) {
  try {
    const json = await res.json();
    return json.message ?? `Request failed with status ${res.status}`;
  } catch {
    return `Request failed with status ${res.status}`;
  }
}
