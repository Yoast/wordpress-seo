/* global wpseoReplaceVarsL10n */
import debounce from "lodash/debounce";
import forEach from "lodash/forEach";
import { updateReplacementVariable } from "../redux/actions/snippetEditor";

/**
 * Represents the classic editor data.
 */
class ClassicEditorData {
	/**
	 * Sets the wp data, Yoast SEO refresh function and data object.
	 *
	 * @param {Object} wpData    The Gutenberg data API.
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

	initialize( replaceVars ) {
		this.data = this.getInitialData( replaceVars );
		this.sendInitialData();
		this.subscribeToElements();
	}

	getTitle() {
		let titleElement = document.getElementById( "title" );
		return titleElement && titleElement.value || "";
	}

	getExcerpt() {
		let excerptElement = document.getElementById( "excerpt" );
		return excerptElement && excerptElement.value || "";
	}

	sendInitialData() {
		forEach( this.data, ( value, name ) => {
			this.store.dispatch( updateReplacementVariable( name, value ) )
		} );
	}

	subscribeToElements() {
		this.subscribeToInputElement( "title", "title" );
		this.subscribeToInputElement( "excerpt", "excerpt" );
	}

	/**
	 * Subscribes to an element via its id, and sends the changes to redux.
	 *
	 * @param {string} elementId          The id of the element to subscribe to.
	 * @param {string} targetReplaceVar   The name of the replacevar the value should be sent to.
	 */
	subscribeToInputElement( elementId, targetReplaceVar ) {
		let element = document.getElementById( elementId );
		let debouncedUpdateData = debounce( this.updateData, 500 );
		element.addEventListener( "input", ( event ) => {
			debouncedUpdateData( event, targetReplaceVar );
		} );
	}

	updateData( event, targetReplaceVar ) {
		let replaceValue = event.target.value;
		this.data[ targetReplaceVar ] = replaceValue;
		this.store.dispatch( updateReplacementVariable( targetReplaceVar, replaceValue ) );
	}

	getInitialData( replaceVars ) {
		return {
			...replaceVars,
			title: this.getTitle(),
			excerpt: this.getExcerpt(),
		}
	}

	getData() {
		return this.data;
	}
}
module.exports = ClassicEditorData;
