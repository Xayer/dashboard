export async function ipInformation() {
  const response = await fetch('https://ip-api.com/json/')
  return await response.json()
}
