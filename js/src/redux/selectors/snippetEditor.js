/**
 * Gets the replacementVariables from the state.
 *
 * @param {Object} state The state.
 *
 * @returns {string} The replacementVariables.
 */
export const getReplaceVars = state => state.snippetEditor.replacementVariables;

/**
 * Gets the slug from the state.
 *
 * @param {Object} state The state.
 *
 * @returns {string} The slug.
 */
export const getSlug = state => state.snippetEditor.data.slug;
