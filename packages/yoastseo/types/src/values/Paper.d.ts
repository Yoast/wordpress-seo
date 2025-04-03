/**
 * Represents an object where the analysis data is stored.
 */
export default class Paper {
    /**
     * Parses the object to a Paper.
     *
     * @param {Object|Paper} serialized The serialized object or Paper instance.
     *
     * @returns {Paper} The parsed Paper.
     */
    static parse(serialized: Object | Paper): Paper;
    /**
     * Constructs the Paper object and sets its attributes.
     *
     * @param {string}  text                            The text to use in the analysis.
     * @param {object}  [attributes]                    The object containing all attributes.
     * @param {string}  [attributes.keyword]            The main keyword or keyphrase of the text.
     * @param {string}  [attributes.synonyms]           The synonyms of the main keyword or keyphrase. It should be separated by commas if multiple synonyms are added.
     * @param {string}  [attributes.description]        The SEO meta description.
     * @param {string}  [attributes.title]              The SEO title.
     * @param {number}  [attributes.titleWidth=0]       The width of the title in pixels.
     * @param {string}  [attributes.slug]               The slug.
     * @param {string}  [attributes.locale=en_US]       The locale.
     * @param {string}  [attributes.permalink]          The full URL for any given post, page, or other pieces of content on a site.
     * @param {string}  [attributes.date]               The date.
     * @param {Object[]}  [attributes.wpBlocks]         The array of texts, encoded in WordPress block editor blocks.
     * @param {Object}  [attributes.customData]         Custom data.
     * @param {string}  [attributes.textTitle]          The title of the text.
     * @param {string}  [attributes.writingDirection=LTR]   The writing direction of the paper. Defaults to left to right (LTR).
     * @param {boolean} [attributes.isFrontPage=false]  Whether the current page is the front page of the site. Defaults to false.
     */
    constructor(text: string, attributes?: {
        keyword?: string | undefined;
        synonyms?: string | undefined;
        description?: string | undefined;
        title?: string | undefined;
        titleWidth?: number | undefined;
        slug?: string | undefined;
        locale?: string | undefined;
        permalink?: string | undefined;
        date?: string | undefined;
        wpBlocks?: Object[] | undefined;
        customData?: Object | undefined;
        textTitle?: string | undefined;
        writingDirection?: string | undefined;
        isFrontPage?: boolean | undefined;
    } | undefined);
    _text: string;
    _tree: import("../parse/structure").Node | null;
    _attributes: {
        keyword?: string | undefined;
        synonyms?: string | undefined;
        description?: string | undefined;
        title?: string | undefined;
        titleWidth?: number | undefined;
        slug?: string | undefined;
        locale?: string | undefined;
        permalink?: string | undefined;
        date?: string | undefined;
        wpBlocks?: Object[] | undefined;
        customData?: Object | undefined;
        textTitle?: string | undefined;
        writingDirection?: string | undefined;
        isFrontPage?: boolean | undefined;
    };
    /**
     * Checks whether a keyword is available.
     * @returns {boolean} Returns true if the Paper has a keyword.
     */
    hasKeyword(): boolean;
    /**
     * Returns the associated keyword or an empty string if no keyword is available.
     * @returns {string} Returns Keyword
     */
    getKeyword(): string;
    /**
     * Checks whether synonyms are available.
     * @returns {boolean} Returns true if the Paper has synonyms.
     */
    hasSynonyms(): boolean;
    /**
     * Returns the associated synonyms or an empty string if no synonyms is available.
     * @returns {string} Returns synonyms.
     */
    getSynonyms(): string;
    /**
     * Checks whether the text is available.
     * @returns {boolean} Returns true if the paper has a text.
     */
    hasText(): boolean;
    /**
     * Returns the associated text or an empty string if no text is available.
     * @returns {string} Returns the text.
     */
    getText(): string;
    /**
     * Sets the tree.
     *
     * @param {Node} tree The tree to set.
     *
     * @returns {void}
     */
    setTree(tree: Node): void;
    /**
     * Returns the tree.
     *
     * @returns {Node} The tree.
     */
    getTree(): Node;
    /**
     * Checks whether a description is available.
     * @returns {boolean} Returns true if the paper has a description.
     */
    hasDescription(): boolean;
    /**
     * Returns the description or an empty string if no description is available.
     * @returns {string} Returns the description.
     */
    getDescription(): string;
    /**
     * Checks whether an SEO title is available
     * @returns {boolean} Returns true if the Paper has an SEO title.
     */
    hasTitle(): boolean;
    /**
     * Returns the SEO title, or an empty string if no title is available.
     * @returns {string} Returns the SEO title.
     */
    getTitle(): string;
    /**
     * Checks whether an SEO title width in pixels is available.
     * @returns {boolean} Returns true if the Paper's SEO title is wider than 0 pixels.
     */
    hasTitleWidth(): boolean;
    /**
     * Gets the SEO title width in pixels, or an empty string of no title width in pixels is available.
     * @returns {number} Returns the SEO title width in pixels.
     */
    getTitleWidth(): number;
    /**
     * Checks whether a slug is available.
     * @returns {boolean} Returns true if the Paper has a slug.
     */
    hasSlug(): boolean;
    /**
     * Gets the paper's slug, or an empty string if no slug is available.
     * @returns {string} Returns the slug.
     */
    getSlug(): string;
    /**
     * Checks if currently edited page is a front page.
     * @returns {boolean} Returns true if the current page is a front page.
     */
    isFrontPage(): boolean;
    /**
     * Checks whether an url is available
     * @deprecated Since version 1.19.1. Use hasSlug instead.
     * @returns {boolean} Returns true if the Paper has a slug.
     */
    hasUrl(): boolean;
    /**
     * Returns the url, or an empty string if no url is available.
     * @deprecated Since version 1.19.1. Use getSlug instead.
     * @returns {string} Returns the url
     */
    getUrl(): string;
    /**
     * Checks whether a locale is available.
     * @returns {boolean} Returns true if the paper has a locale.
     */
    hasLocale(): boolean;
    /**
     * Returns the locale or an empty string if no locale is available
     * @returns {string} Returns the locale.
     */
    getLocale(): string;
    /**
     * Gets the information of the writing direction of the paper.
     * It returns "LTR" (left to right) if this attribute is not provided.
     *
     * @returns {string} Returns the information of the writing direction of the paper.
     */
    getWritingDirection(): string;
    /**
     * Checks whether a permalink is available.
     * @returns {boolean} Returns true if the Paper has a permalink.
     */
    hasPermalink(): boolean;
    /**
     * Returns the permalink, or an empty string if no permalink is available.
     * @returns {string} Returns the permalink.
     */
    getPermalink(): string;
    /**
     * Checks whether a date is available.
     * @returns {boolean} Returns true if the Paper has a date.
     */
    hasDate(): boolean;
    /**
     * Returns the date, or an empty string if no date is available.
     * @returns {string} Returns the date.
     */
    getDate(): string;
    /**
     * Checks whether custom data is available.
     * @returns {boolean} Returns true if the Paper has custom data.
     */
    hasCustomData(): boolean;
    /**
     * Returns the custom data, or an empty object if no data is available.
     * @returns {Object} Returns the custom data.
     */
    getCustomData(): Object;
    /**
     * Checks whether a text title is available.
     * @returns {boolean} Returns true if the Paper has a text title.
     */
    hasTextTitle(): boolean;
    /**
     * Returns the text title, or an empty string if no data is available.
     * @returns {string} Returns the text title.
     */
    getTextTitle(): string;
    /**
     * Serializes the Paper instance to an object.
     *
     * @returns {Object} The serialized Paper.
     */
    serialize(): Object;
    /**
     * Checks whether the given paper has the same properties as this instance.
     *
     * @param {Paper} paper The paper to compare to.
     *
     * @returns {boolean} Whether the given paper is identical or not.
     */
    equals(paper: Paper): boolean;
}
export type Node = import("../parse/structure").Node;
