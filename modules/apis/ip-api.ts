export async function ipInformation() {
  const response = await fetch('http://ip-api.com/json/')
  return await response.json()
}
