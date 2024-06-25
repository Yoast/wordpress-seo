import { __ } from "@wordpress/i18n";
import { isObject } from "lodash";

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
			className: "elementor-right-click-introduction yoast-elementor-introduction",
			headerMessage: __( "Yoast SEO for Elementor", "wordpress-seo" ),
			message: __( "Get started with Yoast SEO's content analysis for Elementor!", "wordpress-seo" ),
			position: {
				my: "center top",
				at: "center bottom+20",
				of: document.querySelector( "button[value='document-settings']" ),
				/**
				 * Moves the position of our introduction modal depending on the screen size.
				 *
				 * @param {Object} coords The initial position of our introduction modal.
				 * @param {Object} feedback The feedback about the position and dimensions of both elements, our introduction and the target element.
				 *
				 * @returns {void}
				 */
				using: function( coords, feedback ) {
					// For horizontal alignment of our arrow:
					// Align the arrow with the target element, in all screen sizes.
					// This takes care of the cases where the introduction has been pushed to the left to fit the viewport.
					// This should always calculate the middle of the target element. We add 8px to account for the target element width itself.
					this.style.setProperty( "--yoast-elementor-introduction-arrow", feedback.target.left - feedback.element.left + 8 + "px" );

					// For vertical alignment of our introduction modal:
					// If the height of the Elementor header is greater than the position of our modal (minus the height of its arrow),
					// we need to push the modal down.
					const elementorHeader = feedback.target.element.closest( "#elementor-editor-wrapper-v2 header" );

					if ( elementorHeader && elementorHeader.offsetHeight > ( coords.top - 12 ) ) {
						this.style.top = elementorHeader.offsetHeight + 20 + "px";
					} else if ( isObject( elementorHeader ) && elementorHeader[ 0 ].offsetHeight > ( coords.top - 12 ) ) {
						this.style.top = elementorHeader[ 0 ].offsetHeight + 12 + "px";
					} else {
						this.style.top = coords.top + "px";
					}

					// Now, we have to just return also the originally calculated height.
					this.style.left = coords.left + "px";
				},
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
