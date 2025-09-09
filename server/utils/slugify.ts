/**
 * Convert a string to a URL-friendly slug
 */
export const slugify = (text: string): string => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')        // Replace spaces with -
    .replace(/[^\w\-]+/g, '')    // Remove all non-word chars
    .replace(/\-\-+/g, '-')      // Replace multiple - with single -
    .replace(/^-+/, '')          // Trim - from start of text
    .replace(/-+$/, '');         // Trim - from end of text
};

/**
 * Create a unique slug by appending a random string if needed
 */
export const createUniqueSlug = (text: string, existingSlugs: string[] = []): string => {
  let baseSlug = slugify(text);
  let finalSlug = baseSlug;
  let counter = 1;

  // Check if slug already exists and append counter if needed
  while (existingSlugs.includes(finalSlug)) {
    finalSlug = `${baseSlug}-${counter}`;
    counter++;
  }

  return finalSlug;
};

/**
 * Generate slug from product name with brand
 */
export const generateProductSlug = (name: string, brand?: string): string => {
  const productName = brand ? `${brand} ${name}` : name;
  return slugify(productName);
};

/**
 * Generate slug from category name with parent
 */
export const generateCategorySlug = (name: string, parentSlug?: string): string => {
  const categoryName = parentSlug ? `${parentSlug} ${name}` : name;
  return slugify(categoryName);
};

export default slugify;