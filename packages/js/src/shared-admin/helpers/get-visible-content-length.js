import { languageProcessing } from "yoastseo";

/**
 * The length of the text a reader actually sees, used to judge whether there is enough content for AI generation.
 *
 * The editor content is the stored markup: block comments, HTML tags and, in the classic editor, raw TinyMCE HTML.
 * Measuring that would count markup as content, so a post holding a handful of words spread over several blocks
 * would look long enough. The prompt content sent to the AI is built from parsed sentences (see
 * `preparePromptContent`), so the visible text is what actually determines how well generation can do.
 *
 * @param {string} content The editor content, as markup.
 *
 * @returns {number} The number of characters of visible text.
 */
export const getVisibleContentLength = ( content ) => languageProcessing.sanitizeString( content || "" ).length;
