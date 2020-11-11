/* eslint-disable require-jsdoc */
/* global jQuery, window */
import domReady from "@wordpress/dom-ready";
import { dispatch } from "@wordpress/data";
import { get } from "lodash";
import { registerReactComponent, renderReactRoot } from "../helpers/reactRoot";
import ElementorSlot from "../elementor/components/slots/ElementorSlot";
import ElementorFill from "../elementor/containers/ElementorFill";
import { StyleSheetManager } from "styled-components";

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
	let value = input.value;

	// We don't store linkdex values below 0 so treat them as 0 for the purpose of changes.
	if ( input.name === "yoast_wpseo_linkdex" && parseInt( input.value, 10 ) < 0 ) {
		value = "0";
	}

	if ( value !== input.oldValue ) {
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
					<StyleSheetManager target={ window.document.body }>
						<div className="yoast yoast-elementor-panel__fills">
							<ElementorSlot />
							<ElementorFill />
						</div>
					</StyleSheetManager>
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
