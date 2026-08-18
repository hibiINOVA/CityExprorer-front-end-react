/**
 * @file format.js
 * @description Utilidades de formato compartidas.
 */

export function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('es-MX', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function promedioDeComentarios(comentarios) {
  if (!Array.isArray(comentarios) || comentarios.length === 0) return 0;
  const suma = comentarios.reduce((acc, c) => acc + Number(c.valoracion || 0), 0);
  return +(suma / comentarios.length).toFixed(1);
}