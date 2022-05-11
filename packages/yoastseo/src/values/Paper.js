import { defaults, isEmpty, isEqual } from "lodash-es";
import { unifyAllSpaces } from "../languageProcessing/helpers/sanitize/unifyWhitespace";

/**
 * Default attributes to be used by the Paper if they are left undefined.
 * @type {{keyword: string, synonyms: string, description: string, title: string, titleWidth: number,
 * 		   slug: string, locale: string, permalink: string, date: string}}
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
};

/**
 * Construct the Paper object and set the keyword property.
 *
 * @param {string} text                     The text to use in the analysis.
 * @param {object} [attributes]             The object containing all attributes.
 * @param {string} [attributes.keyword]     The main keyword.
 * @param {string} [attributes.synonyms]    The main keyword's synonyms.
 * @param {string} [attributes.description] The SEO description.
 * @param {string} [attributes.title]       The SEO title.
 * @param {number} [attributes.titleWidth]  The width of the title in pixels.
 * @param {string} [attributes.slug]        The slug.
 * @param {string} [attributes.locale]      The locale.
 * @param {string} [attributes.permalink]   The base url + slug.
 * @param {string} [attributes.date]        The date.
 * @param {Object} [attributes.wpBlocks]    The text, encoded in WordPress block editor blocks.
 * @constructor
 */
function Paper( text, attributes ) {
	this._text = text || "";
	// Unify whitespaces and non-breaking spaces.
	this._text = unifyAllSpaces( this._text );

	attributes = attributes || {};
	defaults( attributes, defaultAttributes );

	if ( attributes.locale === "" ) {
		attributes.locale = defaultAttributes.locale;
	}

	if ( attributes.hasOwnProperty( "url" ) ) {
		// The 'url' attribute has been deprecated since version 18.8, refer to hasUrl and getUrl below.
		console.warn( "The 'url' attribute is deprecated, use 'slug' instead." );
		attributes.slug = attributes.url || attributes.slug;
	}

	const onlyLetters = attributes.keyword.replace( /[‘’“”"'.?!:;,¿¡«»&*@#±^%|~`[\](){}⟨⟩<>/\\–\-\u2014\u00d7\u002b\u0026\s]/g, "" );

	if ( isEmpty( onlyLetters ) ) {
		attributes.keyword = defaultAttributes.keyword;
	}

	this._attributes = attributes;
}

/**
 * Check whether a keyword is available.
 * @returns {boolean} Returns true if the Paper has a keyword.
 */
Paper.prototype.hasKeyword = function() {
	return this._attributes.keyword !== "";
};

/**
 * Return the associated keyword or an empty string if no keyword is available.
 * @returns {string} Returns Keyword
 */
Paper.prototype.getKeyword = function() {
	return this._attributes.keyword;
};

/**
 * Check whether synonyms are available.
 * @returns {boolean} Returns true if the Paper has synonyms.
 */
Paper.prototype.hasSynonyms = function() {
	return this._attributes.synonyms !== "";
};

/**
 * Return the associated synonyms or an empty string if no synonyms is available.
 * @returns {string} Returns synonyms.
 */
Paper.prototype.getSynonyms = function() {
	return this._attributes.synonyms;
};

/**
 * Check whether the text is available.
 * @returns {boolean} Returns true if the paper has a text.
 */
Paper.prototype.hasText = function() {
	return this._text !== "";
};

/**
 * Return the associated text or am empty string if no text is available.
 * @returns {string} Returns text
 */
Paper.prototype.getText = function() {
	return this._text;
};

/**
 * Check whether a description is available.
 * @returns {boolean} Returns true if the paper has a description.
 */
Paper.prototype.hasDescription = function() {
	return this._attributes.description !== "";
};

/**
 * Return the description or an empty string if no description is available.
 * @returns {string} Returns the description.
 */
Paper.prototype.getDescription = function() {
	return this._attributes.description;
};

/**
 * Check whether a title is available
 * @returns {boolean} Returns true if the Paper has a title.
 */
Paper.prototype.hasTitle = function() {
	return this._attributes.title !== "";
};

/**
 * Return the title, or an empty string of no title is available.
 * @returns {string} Returns the title
 */
Paper.prototype.getTitle = function() {
	return this._attributes.title;
};

/**
 * Check whether a title width in pixels is available
 * @returns {boolean} Returns true if the Paper has a title.
 */
Paper.prototype.hasTitleWidth = function() {
	return this._attributes.titleWidth !== 0;
};

/**
 * Return the title width in pixels, or an empty string of no title width in pixels is available.
 * @returns {string} Returns the title
 */
Paper.prototype.getTitleWidth = function() {
	return this._attributes.titleWidth;
};

/**
 * Check whether a slug is available
 * @returns {boolean} Returns true if the Paper has a slug.
 */
Paper.prototype.hasSlug = function() {
	return this._attributes.slug !== "";
};

/**
 * Return the slug, or an empty string of no slug is available.
 * @returns {string} Returns the url
 */
Paper.prototype.getSlug = function() {
	return this._attributes.slug;
};

/**
 * Check whether an url is available
 * @deprecated Since version 18.7. Use hasSlug instead.
 * @returns {boolean} Returns true if the Paper has a slug.
 */
Paper.prototype.hasUrl = function() {
	console.warn( "This function is deprecated, use hasSlug instead" );
	return this.hasSlug();
};

/**
 * Return the url, or an empty string if no url is available.
 * @deprecated Since version 18.8. Use getSlug instead.
 * @returns {string} Returns the url
 */
Paper.prototype.getUrl = function() {
	console.warn( "This function is deprecated, use getSlug instead" );
	return this.getSlug();
};

/**
 * Check whether a locale is available
 * @returns {boolean} Returns true if the paper has a locale
 */
Paper.prototype.hasLocale = function() {
	return this._attributes.locale !== "";
};

/**
 * Return the locale or an empty string if no locale is available
 * @returns {string} Returns the locale
 */
Paper.prototype.getLocale = function() {
	return this._attributes.locale;
};

/**
 * Check whether a permalink is available
 * @returns {boolean} Returns true if the Paper has a permalink.
 */
Paper.prototype.hasPermalink = function() {
	return this._attributes.permalink !== "";
};

/**
 * Return the permalink, or an empty string if no permalink is available.
 * @returns {string} Returns the permalink.
 */
Paper.prototype.getPermalink = function() {
	return this._attributes.permalink;
};

/**
 * Check whether a date is available.
 * @returns {boolean} Returns true if the Paper has a date.
 */
Paper.prototype.hasDate = function() {
	return this._attributes.date !== "";
};

/**
 * Returns the date, or an empty string if no date is available.
 * @returns {string} Returns the date.
 */
Paper.prototype.getDate = function() {
	return this._attributes.date;
};

/*
 * Serializes the Paper instance to an object.
 *
 * @returns {Object} The serialized Paper.
 */
Paper.prototype.serialize = function() {
	return {
		_parseClass: "Paper",
		text: this._text,
		...this._attributes,
	};
};

/**
 * Checks whether the given paper has the same properties as this instance.
 *
 * @param {Paper} paper The paper to compare to.
 *
 * @returns {boolean} Whether the given paper is identical or not.
 */
Paper.prototype.equals = function( paper ) {
	return this._text === paper.getText() && isEqual( this._attributes, paper._attributes );
};

/**
 * Parses the object to a Paper.
 *
 * @param {Object} serialized The serialized object.
 *
 * @returns {Paper} The parsed Paper.
 */
Paper.parse = function( serialized ) {
	// _parseClass is taken here, so it doesn't end up in the attributes.
	// eslint-disable-next-line no-unused-vars
	const { text, _parseClass, ...attributes } = serialized;

	return new Paper( text, attributes );
};

export default Paper;
