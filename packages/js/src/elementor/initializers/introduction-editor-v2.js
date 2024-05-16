import { __ } from "@wordpress/i18n";

/**
 * Initializes the introduction.
 *
 * @returns {void}
 */
export default function initializeIntroductionEditorV2() {
	// Do nothing if the user already closed the introduction.
	if ( window.elementor.config.user.introduction[ "yoast-introduction-editor-v2" ] === true ) {
		return;
	}

	const introduction = new window.elementorModules.editor.utils.Introduction( {
		introductionKey: "yoast-introduction-editor-v2",
		dialogOptions: {
			id: "yoast-introduction-editor-v2",
			className: "elementor-right-click-introduction",
			headerMessage: __( "Yoast SEO for Elementor", "wordpress-seo" ),
			message: __( "Get started with Yoast SEO's content analysis for Elementor!", "wordpress-seo" ),
			position: {
				my: 'center top',
				at: 'center bottom+20',
				of: document.querySelector("button[value='document-settings']"),
				collision: 'fit none',
				autoRefresh: true,
			},
			hide: {
				onOutsideClick: false,
			},
		},
		onDialogInitCallback: ( dialog ) => {
			// Close the introduction after the user clicks on the element it points to.
			window.$e.routes.on( "run:after", function( component, route ) {
				if ( route === "panel/page-settings/settings" ) {
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
			introduction.show();
		} catch ( e ) {
			setTimeout( showIntroduction, 100 );
		}
	}

	setTimeout( showIntroduction, 100 );
}
