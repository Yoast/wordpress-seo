/* global jQuery, elementor, $e, elementorFrontend */
import ElementorEditorData from "./analysis/elementorEditorData";
import YoastView from "./elementor/YoastView";
import initElementorEditorIntegration from "./initializers/elementor-editor-integration";
import initElementorEdit from "./initializers/elementor-edit";
import { get } from "lodash";

window.yoast = window.yoast || {};
window.yoast.initEditorIntegration = initElementorEditorIntegration;
window.yoast.EditorData = ElementorEditorData;

const addYoastRegion = ( regions ) => {
	regions.yoast = {
		region: regions.global.region,
		view: YoastView,
		options: {},
	};

	return regions;
};

jQuery( function() {
	initElementorEdit();

	elementor.once( "preview:loaded", () => {
		let refreshed = false;

		// Connects the tab to the panel.
		$e.components
			.get( "panel/elements" )
			.addTab( "yoast", { title: "Yoast SEO" } );

		// Updates the initial data after the content is available.
		elementorFrontend.hooks.addAction( "frontend/element_ready/global", () => {
			if ( refreshed ) {
				return;
			}

			refreshed = true;
			window.editorData._data = window.editorData.collectData();
			window.YoastSEO.app.refresh();
		} );
	} );
} );

jQuery( window ).on( "elementor:init", () => {
	// Adds the tab to the template.
	const templateElement = document.getElementById( "tmpl-elementor-panel-elements" );
	templateElement.innerHTML = templateElement.innerHTML.replace(
		/(<div class="elementor-component-tab elementor-panel-navigation-tab" data-tab="global">.*<\/div>)/,
		"$1<div class=\"elementor-component-tab elementor-panel-navigation-tab elementor-active\" data-tab=\"yoast\">Yoast SEO</div>",
	);

	elementor.hooks.addFilter(
		"panel/elements/regionViews",
		addYoastRegion,
	);
} );

/**
 * Activates the Elementor save button.
 *
 * @returns {void}
 */
const activateSaveButton = () => {
	const footerSaver = get( elementor, "saver.footerSaver", false );
	if ( false !== footerSaver ) {
		footerSaver.activateSaveButtons( document, true );
		return;
	}
	elementor.channels.editor.trigger( "status:change", true );
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

const yoastInputs = document.querySelectorAll( "input[name^='yoast'" );
yoastInputs.forEach( input => storeValueAsOldValue( input ) );

setInterval( () => yoastInputs.forEach( detectChange ), 500 );
