export async function loadData() {
  const response = await fetch('data/demo.json');
  return await response.json();
}