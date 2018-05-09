/* External dependencies */
import removeMarks from "yoastseo/js/markers/removeMarks";

/* Internal dependencies */
import { updateReplacementVariable } from "../redux/actions/snippetEditor";
import updateReplacementVariables from "../helpers/updateReplacementVariables";
import tmceHelper, { tmceId } from "../wp-seo-tinymce";

/**
 * Represents the classic editor data.
 */
class ClassicEditorData {
	/**
	 * Sets the wp data, Yoast SEO refresh function and data object.
	 *
	 * @param {Function} refresh The YoastSEO refresh function.
	 * @param {Object} store     The YoastSEO Redux store.
	 * @returns {void}
	 */
	constructor( refresh, store ) {
		this._refresh = refresh;
		this.store = store;
		this.data = {};
		this.updateData = this.updateData.bind( this );
	}

	/**
	 * Initializes the class by filling this.data and subscribing to relevant elements.
	 *
	 * @param {Object} replaceVars The replacement variables passed in the wp-seo-post-scraper args.
	 *
	 * @returns {void}
	 */
	initialize( replaceVars ) {
		this.data = this.getInitialData( replaceVars );
		updateReplacementVariables( this.data, this.store );
		this.subscribeToElements();
	}

	/**
	 * Gets the title from the document.
	 *
	 * @returns {string} The title or an empty string.
	 */
	getTitle() {
		let titleElement = document.getElementById( "title" );
		return titleElement && titleElement.value || "";
	}

	/**
	 * Gets the excerpt from the document.
	 *
	 * @returns {string} The excerpt or an empty string.
	 */
	getExcerpt() {
		let excerptElement = document.getElementById( "excerpt" );
		return excerptElement && excerptElement.value || "";
	}

	/**
	 * Gets the slug from the document.
	 *
	 * @returns {string} The slug or an empty string.
	 */
	getSlug() {
		let slug = "";

		let newPostSlug = document.getElementById( "new-post-slug" );

		if ( newPostSlug ) {
			slug = newPostSlug.val();
		} else if ( document.getElementById( "editable-post-name-full" ) !== null ) {
			slug = document.getElementById( "editable-post-name-full" ).textContent;
		}

		return slug;
	}

	/**
	 * Gets the content of the document after removing marks.
	 *
	 * @returns {string} The content of the document.
	 */
	getContent() {
		return removeMarks( tmceHelper.getContentTinyMce( tmceId ) );
	}

	/**
	 * Subscribes to input elements.
	 *
	 * @returns {void}
	 */
	subscribeToElements() {
		this.subscribeToInputElement( "title", "title" );
		this.subscribeToInputElement( "excerpt", "excerpt" );
	}

	/**
	 * Subscribes to an element via its id, and sets a debounced callback.
	 *
	 * @param {string} elementId          The id of the element to subscribe to.
	 * @param {string} targetReplaceVar   The name of the replacevar the value should be sent to.
	 *
	 * @returns {void}
	 */
	subscribeToInputElement( elementId, targetReplaceVar ) {
		const element = document.getElementById( elementId );

		/*
		 * On terms some elements don't exist in the DOM, such as the title element.
		 * We return early if the element was not found.
		 */
		if ( ! element ) {
			return;
		}

		element.addEventListener( "input", ( event ) => {
			this.updateData( event, targetReplaceVar );
		} );
	}

	/**
	 * Sets the event target value in the data and dispatches to the store.
	 *
	 * @param {Object} event            An event object.
	 * @param {string} targetReplaceVar The replacevar the event's value belongs to.
	 *
	 * @returns {void}
	 */
	updateData( event, targetReplaceVar ) {
		const replaceValue = event.target.value;
		this.data[ targetReplaceVar ] = replaceValue;
		this.store.dispatch( updateReplacementVariable( targetReplaceVar, replaceValue ) );
	}

	/**
	 * Gets the initial data from the replacevars and document.
	 *
	 * @param {Object} replaceVars The replaceVars object.
	 *
	 * @returns {Object} The data.
	 */
	getInitialData( replaceVars ) {
		return {
			...replaceVars,
			title: this.getTitle(),
			excerpt: this.getExcerpt(),
			slug: this.getSlug(),
			content: this.getContent(),
		};
	}

	/**
	 * Add the latest content to the data object, and return the data object.
	 *
	 * @returns {Object} The data.
	 */
	getData() {
		this.data.content = this.getContent();

		return this.data;
	}
}
module.exports = ClassicEditorData;
