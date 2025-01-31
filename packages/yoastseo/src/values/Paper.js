import { defaults, isEmpty, isEqual, isNil } from "lodash";

/**
 * Default attributes to be used by the Paper if they are left undefined.
 * @type {{keyword: string, synonyms: string, description: string, title: string, titleWidth: number,
 * 		   slug: string, locale: string, permalink: string, date: string, customData: object, textTitle: string,
 * 		   writingDirection: "LTR", isFrontPage: boolean }}
 */
const defaultAttributes = {
	keyword: "",
	synonyms: "",
	description: "",
	title: "",
	titleWidth: 0,
	slug: "",
	locale: "en_US",
	permalink: "",
	date: "",
	customData: {},
	textTitle: "",
	writingDirection: "LTR",
	wpBlocks: [],
	isFrontPage: false,
};

/**
 * Represents an object where the analysis data is stored.
 */
export default class Paper {
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
	constructor( text, attributes ) {
		this._text = text || "";

		this._tree = null;

		attributes = attributes || {};
		defaults( attributes, defaultAttributes );

		if ( attributes.locale === "" ) {
			attributes.locale = defaultAttributes.locale;
		}

		if ( attributes.hasOwnProperty( "url" ) ) {
			// The 'url' attribute has been deprecated since version 1.19.1, refer to hasUrl and getUrl below.
			console.warn( "The 'url' attribute is deprecated, use 'slug' instead." );
			attributes.slug = attributes.url || attributes.slug;
		}

		const onlyLetters = attributes.keyword.replace( /[‘’“”"'.?!:;,¿¡«»&*@#±^%|~`[\](){}⟨⟩<>/\\–\-\u2014\u00d7\u002b\s]/g, "" );

		if ( isEmpty( onlyLetters ) ) {
			attributes.keyword = defaultAttributes.keyword;
		}

		this._attributes = attributes;
	}


	/**
	 * Checks whether a keyword is available.
	 * @returns {boolean} Returns true if the Paper has a keyword.
	 */
	hasKeyword() {
		return this._attributes.keyword !== "";
	}

	/**
	 * Returns the associated keyword or an empty string if no keyword is available.
	 * @returns {string} Returns Keyword
	 */
	getKeyword() {
		return this._attributes.keyword;
	}

	/**
	 * Checks whether synonyms are available.
	 * @returns {boolean} Returns true if the Paper has synonyms.
	 */
	hasSynonyms() {
		return this._attributes.synonyms !== "";
	}

	/**
	 * Returns the associated synonyms or an empty string if no synonyms is available.
	 * @returns {string} Returns synonyms.
	 */
	getSynonyms() {
		return this._attributes.synonyms;
	}

	/**
	 * Checks whether the text is available.
	 * @returns {boolean} Returns true if the paper has a text.
	 */
	hasText() {
		return this._text !== "";
	}

	/**
	 * Returns the associated text or an empty string if no text is available.
	 * @returns {string} Returns the text.
	 */
	getText() {
		return this._text;
	}

	/**
	 * Sets the tree.
	 *
	 * @param {Node} tree The tree to set.
	 *
	 * @returns {void}
	 */
	setTree( tree ) {
		this._tree = tree;
	}

	/**
	 * Returns the tree.
	 *
	 * @returns {Node} The tree.
	 */
	getTree() {
		return this._tree;
	}

	/**
	 * Checks whether a description is available.
	 * @returns {boolean} Returns true if the paper has a description.
	 */
	hasDescription() {
		return this._attributes.description !== "";
	}

	/**
	 * Returns the description or an empty string if no description is available.
	 * @returns {string} Returns the description.
	 */
	getDescription() {
		return this._attributes.description;
	}

	/**
	 * Checks whether an SEO title is available
	 * @returns {boolean} Returns true if the Paper has an SEO title.
	 */
	hasTitle() {
		return this._attributes.title !== "";
	}

	/**
	 * Returns the SEO title, or an empty string if no title is available.
	 * @returns {string} Returns the SEO title.
	 */
	getTitle() {
		return this._attributes.title;
	}

	/**
	 * Checks whether an SEO title width in pixels is available.
	 * @returns {boolean} Returns true if the Paper's SEO title is wider than 0 pixels.
	 */
	hasTitleWidth() {
		return this._attributes.titleWidth !== 0;
	}

	/**
	 * Gets the SEO title width in pixels, or an empty string of no title width in pixels is available.
	 * @returns {number} Returns the SEO title width in pixels.
	 */
	getTitleWidth() {
		return this._attributes.titleWidth;
	}

	/**
	 * Checks whether a slug is available.
	 * @returns {boolean} Returns true if the Paper has a slug.
	 */
	hasSlug() {
		return this._attributes.slug !== "";
	}

	/**
	 * Gets the paper's slug, or an empty string if no slug is available.
	 * @returns {string} Returns the slug.
	 */
	getSlug() {
		return this._attributes.slug;
	}

	/**
	 * Checks if currently edited page is a front page.
	 * @returns {boolean} Returns true if the current page is a front page.
	 */
	isFrontPage() {
		return this._attributes.isFrontPage;
	}

	/**
	 * Checks whether an url is available
	 * @deprecated Since version 1.19.1. Use hasSlug instead.
	 * @returns {boolean} Returns true if the Paper has a slug.
	 */
	hasUrl() {
		console.warn( "This function is deprecated, use hasSlug instead" );
		return this.hasSlug();
	}

	/**
	 * Returns the url, or an empty string if no url is available.
	 * @deprecated Since version 1.19.1. Use getSlug instead.
	 * @returns {string} Returns the url
	 */
	getUrl() {
		console.warn( "This function is deprecated, use getSlug instead" );
		return this.getSlug();
	}

	/**
	 * Checks whether a locale is available.
	 * @returns {boolean} Returns true if the paper has a locale.
	 */
	hasLocale() {
		return this._attributes.locale !== "";
	}

	/**
	 * Returns the locale or an empty string if no locale is available
	 * @returns {string} Returns the locale.
	 */
	getLocale() {
		return this._attributes.locale;
	}

	/**
	 * Gets the information of the writing direction of the paper.
	 * It returns "LTR" (left to right) if this attribute is not provided.
	 *
	 * @returns {string} Returns the information of the writing direction of the paper.
	 */
	getWritingDirection() {
		return this._attributes.writingDirection;
	}

	/**
	 * Checks whether a permalink is available.
	 * @returns {boolean} Returns true if the Paper has a permalink.
	 */
	hasPermalink() {
		return this._attributes.permalink !== "";
	}

	/**
	 * Returns the permalink, or an empty string if no permalink is available.
	 * @returns {string} Returns the permalink.
	 */
	getPermalink() {
		return this._attributes.permalink;
	}

	/**
	 * Checks whether a date is available.
	 * @returns {boolean} Returns true if the Paper has a date.
	 */
	hasDate() {
		return this._attributes.date !== "";
	}

	/**
	 * Returns the date, or an empty string if no date is available.
	 * @returns {string} Returns the date.
	 */
	getDate() {
		return this._attributes.date;
	}

	/**
	 * Checks whether custom data is available.
	 * @returns {boolean} Returns true if the Paper has custom data.
	 */
	hasCustomData() {
		return ! isEmpty( this._attributes.customData );
	}

	/**
	 * Returns the custom data, or an empty object if no data is available.
	 * @returns {Object} Returns the custom data.
	 */
	getCustomData() {
		return this._attributes.customData;
	}

	/**
	 * Checks whether a text title is available.
	 * @returns {boolean} Returns true if the Paper has a text title.
	 */
	hasTextTitle() {
		return this._attributes.textTitle !== "" && ! isNil( this._attributes.textTitle );
	}

	/**
	 * Returns the text title, or an empty string if no data is available.
	 * @returns {string} Returns the text title.
	 */
	getTextTitle() {
		return this._attributes.textTitle;
	}

	/**
	 * Serializes the Paper instance to an object.
	 *
	 * @returns {Object} The serialized Paper.
	 */
	serialize() {
		return {
			_parseClass: "Paper",
			text: this._text,
			...this._attributes,
		};
	}

	/**
	 * Checks whether the given paper has the same properties as this instance.
	 *
	 * @param {Paper} paper The paper to compare to.
	 *
	 * @returns {boolean} Whether the given paper is identical or not.
	 */
	equals( paper ) {
		return this._text === paper.getText() && isEqual( this._attributes, paper._attributes );
	}

	/**
	 * Parses the object to a Paper.
	 *
	 * @param {Object|Paper} serialized The serialized object or Paper instance.
	 *
	 * @returns {Paper} The parsed Paper.
	 */
	static parse( serialized ) {
		// For ease of use, check if it is not already a Paper instance.
		if ( serialized instanceof Paper ) {
			return serialized;
		}

		// _parseClass is taken here, so it doesn't end up in the attributes.
		// eslint-disable-next-line no-unused-vars
		const { text, _parseClass, ...attributes } = serialized;

		return new Paper( text, attributes );
	}
}
