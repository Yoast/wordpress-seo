export default LinkStatistics;
/**
 * Calculates link statistics.
 * E.g. which links a node or its children contains, and whether these links are:
 *  * internal (points to a page in the same domain), external (a page in another domain) or other.
 *  * marked as follow (search engines are allowed to follow this link) or no-follow (search engines are not allowed to follow the link).
 *
 *  @memberOf module:parsedPaper/research
 */
declare class LinkStatistics extends Research {
    /**
     * Checks whether the given link is marked for search engines to not follow.
     *
     * @param {module:parsedPaper/structure.FormattingElement} linkElement The link to check.
     *
     * @returns {boolean} `true` if the link is marked as 'no-follow'.
     *
     * @private
     */
    private _isNoFollow;
    /**
     * Checks whether the given protocol string is either HTTP or HTTPS.
     *
     * @param {String} protocol The protocol string to check.
     *
     * @returns {boolean} Whether the protocol is either HTTP or HTTPS.
     *
     * @private
     */
    private _isHttp;
    /**
     * Checks whether the given link is:
     *  * internal: points to a web page in the same domain as the current site.
     *  * external: points to a web page in another domain as the current site.
     *  * other: e.g. uses another protocol like `ftp`.
     *
     * @param {module:parsedPaper/structure.FormattingElement} linkElement The link to check.
     * @param {string}                                         domain The domain to check against.
     *
     * @returns {"external"|"internal"|"other"} Whether the link points to an external, internal or other web page.
     *
     * @private
     */
    private _whichTarget;
    /**
     * Returns the permalink from the metadata.
     *
     * @param {module:parsedPaper/structure.Node} metadata The metadata to retrieve the permalink from.
     *
     * @returns {string} The permalink.
     *
     * @private
     */
    private _getPermalink;
    /**
     * Calculates link statistics for the given node.
     *
     * @param {module:parsedPaper/structure.Node} node     The node to calculate the research for.
     * @param {module:parsedPaper/structure.Node} metadata The document's metadata.
     *
     * @returns {Promise<Object[]>} The research results.
     */
    calculateFor(node: any, metadata: any): Promise<Object[]>;
}
import Research from "./Research";
