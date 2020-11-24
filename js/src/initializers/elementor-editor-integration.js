/* eslint-disable require-jsdoc */
/* global jQuery, window */
import domReady from "@wordpress/dom-ready";
import { dispatch } from "@wordpress/data";
import { doAction } from "@wordpress/hooks";
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
	// The SEO score and the content score changing do not require a new save.
	if ( input.name === "yoast_wpseo_linkdex" || input.name === "yoast_wpseo_content_score" ) {
		return;
	}

	// The prominent words do not require a new save (based on the content anyway).
	if ( input.name === "yoast_wpseo_words_for_linking" ) {
		return;
	}

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

	jQuery.post( form.getAttribute( "action" ), data, ( { success, data: responseData }, status, xhr ) => {
		if ( ! success ) {
			// Something went wrong while saving.
			return;
		}

		doAction( "yoast.elementor.save.success", xhr );

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
					<StyleSheetManager target={ document.getElementById( "elementor-panel-page-settings-controls" ) }>
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

		// Register with the menu.
		const menu = window.elementor.modules.layouts.panel.pages.menu.Menu;
		menu.addItem( {
			name: "yoast",
			icon: "yoast yoast-element-menu-icon",
			title: "Yoast SEO",
			type: "page",
			callback: () => {
				try {
					window.$e.routes.run( "panel/page-settings/yoast-tab" );
				} catch ( error ) {
					// The yoast tab is only available if the page settings have been visited.
					window.$e.routes.run( "panel/page-settings/settings" );
					window.$e.routes.run( "panel/page-settings/yoast-tab" );
				}
			},
		}, "more" );
	} );

	const yoastInputs = document.querySelectorAll( "input[name^='yoast']" );
	yoastInputs.forEach( input => storeValueAsOldValue( input ) );

	setInterval( () => yoastInputs.forEach( detectChange ), 500 );
}
