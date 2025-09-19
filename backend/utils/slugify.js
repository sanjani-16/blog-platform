// utils/slugify.js
const slugify = require('slugify');
const { v4: uuidv4 } = require('uuid');

function createUniqueSlug(title) {
  const base = slugify(title || 'post', { lower: true, strict: true });
  // Append small uuid suffix to avoid collisions
  return `${base}-${uuidv4().slice(0, 8)}`;
}

module.exports = { createUniqueSlug };
