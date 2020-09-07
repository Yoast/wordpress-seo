/* global jQuery, elementor, $e */
import BlockEditorData from "./analysis/blockEditorData";
import YoastView from "./elementor/YoastView";
import initElementorEditorIntegration from "./initializers/elementor-editor-integration";

window.yoast = window.yoast || {};
window.yoast.initEditorIntegration = initElementorEditorIntegration;
window.yoast.EditorData = BlockEditorData;

const addYoastRegion = ( regions ) => {
	regions.yoast = {
		region: regions.global.region,
		view: YoastView,
		options: {},
	};

	return regions;
};

jQuery( function() {
	elementor.once( "preview:loaded", function() {
		console.log( "preview:loaded" );

		$e.components
			.get( "panel/elements" )
			.addTab( "yoast", { title: "Yoast SEO" } );
	} );
} );

jQuery( window ).on( "elementor:init", () => {
	console.log( "elementor:init" );

	// Add our tab to the template.
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
