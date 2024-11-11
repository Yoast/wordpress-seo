export { Dashboard } from "./components/dashboard";

/**
 * @typedef {Object} Taxonomy A taxonomy.
 * @property {string} name The unique identifier.
 * @property {string} label The user-facing label.
 * @property {Object} links The links.
 * @property {string} [links.search] The search link, might not exist.
 */

/**
 * @typedef {Object} ContentType A content type.
 * @property {string} name The unique identifier.
 * @property {string} label The user-facing label.
 * @property {Taxonomy|null} taxonomy The (main) taxonomy or null.
 */

/**
 * @typedef {Object} Term A term.
 * @property {string} name The unique identifier.
 * @property {string} label The user-facing label.
 */
