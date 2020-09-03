/* global jQuery, elementor, $e */
import ElementorAddRegion from "./elementor/AddRegion";

jQuery( function() {
	elementor.once( "preview:loaded", function() {
		console.log( "preview:loaded" );

		const yoastNavigationTab = jQuery( ".elementor-component-tab.elementor-panel-navigation-tab" );
		yoastNavigationTab.attr( "data-tab", "yoast" );
		jQuery( "#elementor-panel-elements-navigation" ).append( yoastNavigationTab );

		$e.components
			.get( "panel/elements" )
			.addTab( "yoast", { title: "SEO" } );
	} );
} );

jQuery( window ).on( "elementor:init", function() {
	console.log( "elementor:init" );

	elementor.hooks.addFilter(
		"panel/elements/regionViews",
		ElementorAddRegion,
	);
} );


//
//const slot = document.createElement( "div" );
//slot.classList.add( [ "elementor-component-tab", "elementor-panel-navigation-tab" ] );
//slot.innerHTML = "<p>tadaaa</p>";
//document.getElementById( "body" ).appendChild( slot );
//// Document.getElementById( 'elementor-panel-elements-navigation' ).appendChild( slot );
