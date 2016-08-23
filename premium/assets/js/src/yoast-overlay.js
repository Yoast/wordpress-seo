/* jshint -W097 */
'use strict';
var yoast_overlay = null;
(function( $ ) {
	yoast_overlay = {
		messages: [],
		current_message: null,
		add_message: function( title, text, autoclose ) {
			this.messages.push( { title: title, text: text, autoclose: autoclose } );
			this.display_message();
		},
		close_message: function( el ) {
			$( el ).remove();
			this.current_message = null;
			this.display_message();
		},
		display_message: function() {
			if ( this.current_message === null && this.messages.length > 0 ) {
				// Store this in a local var
				var that = this;

				// Set the current message
				this.current_message = this.messages.shift();

				// Create the element
				var el = $( '<div>' );

				// Set the CSS
				$( el ).css( 'position', 'fixed' ).css( 'top', '20%' ).css( 'left', '50%' ).css( 'width', 350 ).css( 'min-height', 100 ).css( 'padding', '25px' ).css( 'background', '#ffffff' ).css( 'border', '2px solid #dcddde' );

				// Horizontal positioning
				$( el ).css( 'margin-left', '-' + ($( el ).width() * 0.5) + 'px' );

				// The title
				$( el ).append( $( '<h2>' ).html( this.current_message.title ).css( 'margin', 0 ).css( 'padding', '0 0 7px' ).css( 'border-bottom', '1px solid #f18500' ) );

				// The text
				$( el ).append( $( '<p>' ).css( 'margin-bottom', 0 ).html( this.current_message.text ) );

				// The close button
				var el_close = $( '<a>' ).css( 'position', 'absolute' ).css( 'top', 0 ).css( 'right', 0 ).css( 'padding', '0 5px' ).css( 'margin', '5px' ).css( 'line-height', '17px' ).css( 'cursor', 'pointer' ).css( 'color', '#f18500' ).css( 'font-weight', 'bold' ).css( 'border', '1px solid #f18500' );
				$( el_close ).html( 'X' );
				$( el_close ).click( function() {
					that.close_message( el );
				}
				);
				$( el ).append( el_close );

				// Append the element to body
				$( 'body' ).append( el );

				// Check autoclose
				if ( this.current_message.autoclose !== undefined && this.current_message.autoclose !== false && this.current_message.autoclose > 0 ) {
					setTimeout( function() {
						that.close_message( el );
					}, ( this.current_message.autoclose * 1000)
					);
				}
			}
		}
	};
})( jQuery );
