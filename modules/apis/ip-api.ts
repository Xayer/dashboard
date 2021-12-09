export async function ipInformation() {
  const response = await fetch('https://ipwhois.app/json/')
  return await response.json()
}
