import { __ } from "@wordpress/i18n";

/**
 * Initializes the introduction.
 *
 * @returns {void}
 */
export default function initializeIntroduction() {
	// Do nothing if the user already closed the introduction.
	if ( window.elementor.config.user.introduction[ "yoast-introduction" ] === true ) {
		return;
	}

	const introduction = new window.elementorModules.editor.utils.Introduction( {
		introductionKey: "yoast-introduction",
		dialogOptions: {
			id: "yoast-introduction",
			className: "elementor-right-click-introduction",
			headerMessage: __( "New: Yoast SEO for Elementor", "wordpress-seo" ),
			message: __( "Get started with Yoast SEO's content analysis for Elementor!", "wordpress-seo" ),
			position: {
				my: "left top",
				at: "right top",
				autoRefresh: true,
			},
			hide: {
				onOutsideClick: false,
			},
		},
		onDialogInitCallback: ( dialog ) => {
			// Close the introduction after the user clicks on the element it points to.
			window.$e.routes.on( "run:after", function( component, route ) {
				if ( route === "panel/menu" ) {
					dialog.getElements( "ok" ).trigger( "click" );
				}
			} );

			dialog.addButton( {
				name: "ok",
				text: __( "Got it", "wordpress-seo" ),
				callback: () => introduction.setViewed(),
			} );

			dialog.getElements( "ok" ).addClass( "elementor-button elementor-button-success" );
		},
	} );

	/**
	 * Shows the introduction.
	 *
	 * @returns {void}
	 */
	function showIntroduction() {
		try {
			introduction.show( window.elementor.getPanelView().header.currentView.ui.menuButton[ 0 ] );
		} catch ( e ) {
			setTimeout( showIntroduction, 100 );
		}
	}

	setTimeout( showIntroduction, 100 );
}
