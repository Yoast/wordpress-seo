/* global jQuery, window */
import { dispatch } from "@wordpress/data";
import { registerElementorDataHookAfter } from "../helpers/elementorHook";
import { registerReactComponent, renderReactRoot } from "../helpers/reactRoot";
import ElementorSlot from "../elementor/components/slots/ElementorSlot";
import ElementorFill from "../elementor/containers/ElementorFill";
import { StyleSheetManager } from "styled-components";

/**
 * Activates the Elementor save button.
 *
 * @returns {void}
 */
function activateSaveButton() {
	window.$e.internal( "document/save/set-is-modified", { status: true } );
}

/**
 * Copies the current value to the oldValue.
 *
 * @param {HTMLElement} input The input element.
 *
 * @returns {void}
 */
function storeValueAsOldValue( input ) {
	input.oldValue = input.value;
}

/**
 * Activates the save button if a change is detected.
 *
 * @param {HTMLElement} input The input.
 *
 * @returns {void}
 */
function detectChange( input ) {
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
}

/**
 * Saves the form via AJAX action.
 *
 * @param {HTMLElement} form The form to submit.
 *
 * @returns {void}
 */
function sendFormData( form ) {
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
}

/**
 * Initializes the Yoast elementor editor integration.
 *
 * @returns {void}
 */
export default function initElementEditorIntegration() {
	// Expose registerReactComponent as an alternative to registerPlugin.
	window.YoastSEO = window.YoastSEO || {};
	window.YoastSEO._registerReactComponent = registerReactComponent;

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
	registerElementorDataHookAfter( "document/save/save", "yoast-seo-save", () => {
		/*
			* Do not save our data to a revision.
			*
			* WordPress saves the metadata to the post parent, not the revision. See `update_post_meta`.
			* Most likely this is because saving a revision on a published post will unpublish in WordPress itself.
			* But Elementor does not unpublish your post when you save a draft.
			* This would result in Yoast SEO data being live while saving a draft.
			*/
		if ( window.elementor.config.document.id === window.elementor.config.document.revisions.current_id  ) {
			handleSave();
		}
	} );

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

	const yoastInputs = document.querySelectorAll( "input[name^='yoast']" );
	yoastInputs.forEach( input => storeValueAsOldValue( input ) );

	setInterval( () => yoastInputs.forEach( detectChange ), 500 );
}
