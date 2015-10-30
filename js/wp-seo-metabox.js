/* browser:true */
(function() {
	'use strict';

	window.wpseo_init_tabs = function() {
		if ( jQuery( '.wpseo-metabox-tabs-div' ).length > 0 ) {
			var active_tab = window.location.hash;
			if ( active_tab === '' || active_tab.search( 'wpseo' ) === -1 ) {
				active_tab = 'content';
			}
			else {
				active_tab = active_tab.replace( '#wpseo_', '' );
			}
			jQuery( '.' + active_tab ).addClass( 'active' );

			jQuery( 'a.wpseo_tablink' ).click( function( ev ) {
					ev.preventDefault();

					jQuery( '.wpseo-meta-section.active .wpseo-metabox-tabs li' ).removeClass( 'active' );
					jQuery( '.wpseo-meta-section.active .wpseotab' ).removeClass( 'active' );

					var targetElem = jQuery( jQuery( this ).attr( 'href' ) );
					targetElem.addClass( 'active' );
					jQuery( this ).parent( 'li' ).addClass( 'active' );

					if ( jQuery( this ).hasClass( 'scroll' ) ) {
						jQuery( 'html, body' ).animate( {
								scrollTop: jQuery( targetElem ).offset().top
							}, 500
						);
					}
				}
			);
		}

		if ( jQuery( '.wpseo-meta-section' ).length > 0 ) {
			var active_page = window.location.hash;
			if ( active_page === '' || active_page.search( 'wpseo' ) === -1 ) {
				active_page = 'content';
			}
			else {
				active_page = active_page.replace( '#wpseo-meta-section-', '' );
			}
			jQuery( '#wpseo-meta-section-' + active_page ).addClass( 'active' );
			jQuery( '.wpseo-metabox-sidebar li').filter( function() {
				return jQuery( this ).find('.wpseo-meta-section-link').attr( 'href' ) === '#wpseo-meta-section-' + active_page;
			} ).addClass('active');

			jQuery( 'a.wpseo-meta-section-link' ).click( function( ev ) {
					ev.preventDefault();

					jQuery( '.wpseo-metabox-sidebar li' ).removeClass( 'active' );
					jQuery( '.wpseo-meta-section' ).removeClass( 'active' );

					var targetElem = jQuery( jQuery( this ).attr( 'href' ) );
					targetElem.addClass( 'active' );
					window.yolo = jQuery( this );
					jQuery( this ).parent( 'li' ).addClass( 'active' );
				}
			);
		}

		jQuery( '.wpseo-heading' ).hide();
		jQuery( '.wpseo-metabox-tabs' ).show();
		// End Tabs code

		jQuery( '.yoast_help' ).qtip(
			{
				content: {
					attr: 'alt'
				},
				position: {
					my: 'bottom left',
					at: 'top center'
				},
				style: {
					tip: {
						corner: true
					},
					classes: 'yoast-qtip qtip-rounded qtip-blue'
				},
				show: 'click',
				hide: {
					fixed: true,
					delay: 500
				}

			}
		);
	};

	jQuery( document ).ready( function() {
		jQuery( '.wpseo-meta-section').each( function( _, el ) {
			jQuery( el ).find( '.wpseo-metabox-tabs li:first' ).addClass( 'active' );
			jQuery( el ).find( '.wpseotab:first' ).addClass( 'active' );
		});
		window.wpseo_init_tabs();
	});
}());
