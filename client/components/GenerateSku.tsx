type SKUOptions = {
  category: string;
  model: string;
  attributes?: string[]; // e.g., ['BLK', '2025']
  separator?: string;
};

function generateSKU({
  category,
  model,
  attributes = [],
  separator = '-'
}: SKUOptions): string {
  const safe = (s: string) =>
    s.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');

  return [
    safe(category),
    safe(model),
    ...attributes.map(attr => safe(attr))
  ].join(separator);
}

// Example usage:
const sku = generateSKU({
  category: 'TV',
  model: '55UHD',
  attributes: ['black', '2025']
});

console.log(sku); // TV-55UHD-BLACK-2025
