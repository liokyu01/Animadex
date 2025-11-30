// utils.js
export function darkenHex(hex, amount = 20) {
  let color = hex.replace("#", "");
  if (color.length === 8) color = color.slice(0, 6); // ignore alpha for darken
  const num = parseInt(color, 16);
  let r = (num >> 16) - amount;
  let g = ((num >> 8) & 0x00FF) - amount;
  let b = (num & 0x0000FF) - amount;
  r = Math.max(0, r);
  g = Math.max(0, g);
  b = Math.max(0, b);
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}ff`;
}

export function lightenHex(hex, amount = 20) {
  let color = hex.replace("#", "");
  if (color.length === 8) color = color.slice(0, 6);
  const num = parseInt(color, 16);
  let r = Math.min(255, (num >> 16) + amount);
  let g = Math.min(255, ((num >> 8) & 0x00FF) + amount);
  let b = Math.min(255, (num & 0x0000FF) + amount);
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}ff`;
}