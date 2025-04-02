/**
 * Counts the links found in the text.
 *
 * @param {Paper} paper The paper object containing text, keyword and url.
 *
 * @returns {object} The object containing all linktypes.
 * total: the total number of links found.
 * internalTotal: the total number of links that are internal.
 * internalDofollow: the internal links without a nofollow attribute.
 * internalNofollow: the internal links with a nofollow attribute.
 * externalTotal: the total number of links that are external.
 * externalDofollow: the external links without a nofollow attribute.
 * externalNofollow: the internal links with a dofollow attribute.
 * otherTotal: all links that are not HTTP or HTTPS.
 * otherDofollow: other links without a nofollow attribute.
 * otherNofollow: other links with a nofollow attribute.
 */
export default function _default(paper: Paper): object;
