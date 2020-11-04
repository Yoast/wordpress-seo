/* eslint-disable require-jsdoc */
/* global jQuery, window */
import domReady from "@wordpress/dom-ready";
import { registerReactComponent } from "../helpers/reactRoot";
import { get } from "lodash";
import { dispatch } from "@wordpress/data";
import ElementorSlot from "../elementor/components/slots/ElementorSlot";
import ElementorFill from "../elementor/containers/ElementorFill";
import { renderReactRoot } from "../helpers/reactRoot";

/**
 * Activates the Elementor save button.
 *
 * @returns {void}
 */
const activateSaveButton = () => {
	const footerSaver = get( window.elementor, "saver.footerSaver", false );
	if ( false !== footerSaver ) {
		footerSaver.activateSaveButtons( document, true );
		return;
	}
	window.elementor.channels.editor.trigger( "status:change", true );
};

/**
 * Copies the current value to the oldValue.
 *
 * @param {HTMLElement} input The input element.
 *
 * @returns {void}
 */
const storeValueAsOldValue = ( input ) => {
	input.oldValue = input.value;
};

/**
 * Activates the save button if a change is detected.
 *
 * @param {HTMLElement} input The input.
 *
 * @returns {void}
 */
const detectChange = input => {
	if ( input.value !== input.oldValue ) {
		activateSaveButton();
		storeValueAsOldValue( input );
	}
};

const sendFormData = ( form ) => {
	const data = jQuery( form ).serializeArray().reduce( ( result, { name, value } ) => {
		result[ name ] = value;

		return result;
	}, {} );

	jQuery.post( form.getAttribute( "action" ), data, ( { success, data: responseData } ) => {
		if ( ! success ) {
			// Something went wrong while saving.
			return;
		}

		// Update the slug in our store if WP changed it.
		if ( responseData.slug && responseData.slug !== data.slug ) {
			dispatch( "yoast-seo/editor" ).updateData( { slug: responseData.slug } );
		}
	} );
};

/**
 * Initializes the Yoast elementor editor integration.
 *
 * @returns {void}
 */
export default function initElementEditorIntegration() {
	// Expose registerReactComponent as an alternative to registerPlugin.
	window.YoastSEO = window.YoastSEO || {};
	window.YoastSEO._registerReactComponent = registerReactComponent;

	domReady( () => {
		// Check whether the route to our tab is active. If so, render our React root.
		window.$e.routes.on( "run:after", function( component, route ) {
			if ( route === "panel/page-settings/yoast-tab" ) {
				renderReactRoot( window.YoastSEO.store, "elementor-panel-page-settings-controls", (
					<div className="yoast yoast-elementor-panel__fills">
						<ElementorSlot />
						<ElementorFill />
					</div>
				) );
			}
		} );

		// Hook into the save.
		const handleSave = sendFormData.bind( null, document.getElementById( "yoast-form" ) );
		window.elementor.saver.on( "after:save", handleSave );
	} );

	const yoastInputs = document.querySelectorAll( "input[name^='yoast']" );
	yoastInputs.forEach( input => storeValueAsOldValue( input ) );

	setInterval( () => yoastInputs.forEach( detectChange ), 500 );
}
