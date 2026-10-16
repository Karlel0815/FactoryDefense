export const key = (x, y) => `${x},${y}`;
export const inBounds = (x, y, width, height) => Number.isInteger(x) && Number.isInteger(y) && x >= 0 && y >= 0 && x < width && y < height;
export const neighbors = (x, y, width, height) => [[x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]].filter(([a, b]) => inBounds(a, b, width, height));

// Bresenham fills gaps left by quick touch/mouse movement.
export function lineCells(from, to) {
  if (![from?.x, from?.y, to?.x, to?.y].every(Number.isInteger)) return [];
  const cells = [];
  let { x: x0, y: y0 } = from;
  const { x: x1, y: y1 } = to;
  const dx = Math.abs(x1 - x0), dy = Math.abs(y1 - y0);
  const sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1;
  let error = dx - dy;
  while (true) {
    cells.push({ x: x0, y: y0 });
    if (x0 === x1 && y0 === y1) break;
    const twice = 2 * error;
    const stepX = twice > -dy, stepY = twice < dx;
    if (stepX) { error -= dy; x0 += sx; }
    // Orthogonal bridge avoids disconnected diagonal road segments.
    if (stepX && stepY) cells.push({ x: x0, y: y0 });
    if (stepY) { error += dx; y0 += sy; }
  }
  return cells;
}

export function positionToCell(clientX, clientY, rect, width, height) {
  if (!Number.isFinite(clientX) || !Number.isFinite(clientY) || !rect?.width || !rect?.height) return null;
  const u = (clientX - rect.left) / rect.width, v = (clientY - rect.top) / rect.height;
  if (u < 0 || v < 0 || u >= 1 || v >= 1) return null;
  return { x: Math.floor(u * width), y: Math.floor(v * height) };
}
