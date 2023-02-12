export default function useRandomColor() {
  const colors = ['#97dba9', '#cb97db', '#ebdfab', '#d7abeb']
  return colors[Math.floor(Math.random() * colors.length)];
}