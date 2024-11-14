export { Dash } from "./components/dash";

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

/**
 * @typedef {Object} Score A score.
 * @property {string} name The name of the score. Can be "ok", "good", "bad" or "notAnalyzed".
 * @property {number} amount The amount of content for this score.
 * @property {Object} links The links.
 * @property {string} [links.view] The view link, might not exist.
 */
