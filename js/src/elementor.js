/* global jQuery, elementor, $e */
import initializeEdit from "./elementor/initializeEdit";
import YoastView from "./elementor/YoastView";

const addYoastRegion = ( regions ) => {
	regions.yoast = {
		region: regions.global.region,
		view: YoastView,
		options: {},
	};

	return regions;
};

jQuery( function() {
	// Add missing elements on our page.
	const body = jQuery( "body" ).first();
	body.append( jQuery( "<div id=\"wpseo_meta\"></div>" ) );
	body.append( jQuery( `<input id="yoast_wpseo_is_cornerstone" value="${ window.wpseoScriptData.metabox.cornerstoneActive }" />` ) );

	initializeEdit();

	elementor.once( "preview:loaded", function() {
		console.log( "preview:loaded" );

		$e.components
			.get( "panel/elements" )
			.addTab( "yoast", { title: "Yoast SEO" } );
	} );
} );

jQuery( window ).on( "elementor:init", () => {
	console.log( "elementor:init" );

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
