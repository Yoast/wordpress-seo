/**
 * Shortlinker to handle appending parameters to a link.
 */
export default class Shortlinker {
    /**
     * Creates a query string from a params object.
     *
     * @param {Object} params Params for in the query string.
     *
     * @returns {string} URI encoded query string.
     */
    static createQueryString(params: Object): string;
    /**
     * Initialize the Shortlinker class.
     *
     * @param {Object} [config={}] Optional configuration.
     */
    constructor(config?: Object | undefined);
    /**
     * Saves the passed configuration.
     *
     * @param {Object} config             The configuration.
     * @param {Object} [config.params={}] The default params to create the query string with.
     *
     * @returns {void}
     */
    configure(config: {
        params?: Object | undefined;
    }): void;
    _config: {
        params: Object;
    } | undefined;
    /**
     * Creates a link by combining the params from the config and appending them to the url.
     *
     * @param {string} url         The base url.
     * @param {Object} [params={}] Optional params for in the url.
     *
     * @returns {string} The url with query string.
     */
    append(url: string, params?: Object | undefined): string;
    /**
     * Creates an anchor opening tag; uses the append function to create the url.
     *
     * @param {string} url         The base url.
     * @param {Object} [params={}] Optional params for in the url.
     *
     * @returns {string} The anchor opening tag.
     */
    createAnchorOpeningTag(url: string, params?: Object | undefined): string;
}
