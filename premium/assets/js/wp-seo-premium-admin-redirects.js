/* jshint -W097 */
/* jshint -W098 */
/* jshint -W107 */
/* global yoast_overlay */
'use strict';

( function($) {
	/**
	 * Extending the elements with a wpseo_redirects object
	 * @param {string} arg_type
	 */
	$.fn.wpseo_redirects = function( arg_type ) {
		var that = this;
		var type = arg_type.replace( 'table-', '' );
		var table = that.find( 'table' );

		/**
		 * Showing a dialog on the screen
		 *
		 * @param {string} title
		 * @param {string} text
		 */
		this.dialog = function( title, text ) {

			$('#YoastRedirectDialogText').html( text );
			$('#YoastRedirectDialog')
				.attr('title', title )
				.dialog(
				{
					width: 500,
					draggable: false,
					resizable: false,
					position: {
						at: 'center top+10%',
						my: 'center top+10%'
					},
					buttons: [
						{
							text : wpseo_premium_strings.button_ok,
							click: function () {
								$(this).dialog('close');
							}
						}
					]
				}
			);
		};

		/**
		 * Sending post request
		 *
		 * @param {object}   data
		 * @param {function} oncomplete
		 */
		this.post = function(data, oncomplete ) {
			$.post( ajaxurl, data, oncomplete, ' json' );
		};

		/**
		 * Handle the response
		 *
		 * @param {object}   response        JSON string with response data
		 * @param {function} on_success      Callback function when there isn't an error.
		 * @param {object}   success_message The message that will be displayed on success
		 *
		 * @returns {boolean}
		 */
		this.handle_response = function( response, on_success, success_message ) {
			if (response.error) {
				that.dialog(
					wpseo_premium_strings.error_saving_redirect,
					response.error
				);

				return true;
			}

			on_success( response );

			that.dialog(
				success_message.title,
				success_message.message
			);

			return true;
		};

		/**
		 * Adding option to a select
		 *
		 * @param {object} option
		 * @param {object} new_select
		 * @param {string} current_value
		 */
		this.add_select_option = function( option, new_select, current_value ) {
			var el_option = $( option ).clone();

			if ( el_option.val() === current_value ) {
				el_option.attr( 'selected', 'selected' );
			}

			$( new_select ).append( el_option );
		};

		/**
		 * Generates input and select, based on the settings
		 *
		 * @param {int}    key
		 * @param {object} table_cell
		 */
		this.add_input_field = function( key, table_cell ) {
			var tab_index   = key + 1;
			var current_val = $( table_cell ).html().toString();
			var new_el      = null;

			if ( $( table_cell ).hasClass( 'type' ) ) {
				new_el = $( '<select>' ).attr( 'tabindex', tab_index );
				$.each(
					$( that ).find( '#wpseo_redirects_new_type option' ),
					function( key, option ) {
						that.add_select_option( option, new_el, current_val );
					}
				);
			}
			else {
				new_el = $( '<input>' ).val( current_val ).attr( 'tabindex', tab_index );
			}

			$( table_cell ).empty().append( new_el );
		};

		/**
		 * Restoring the values of a row
		 *
		 * @param {object} row
		 */
		this.restore_values = function( row ) {
			var row_values = row.find( '.val' );
			var row_data   = row.data( 'old_redirect');

			row_values.eq( 0 ).html( row_data.key );
			row_values.eq( 1 ).html( row_data.value );
			row_values.eq( 2 ).html( row_data.type );
		};

		/**
		 * Creating an edit row for editting a redirect.
		 *
		 * @param {object} row
		 */
		this.edit_row = function( row ) {
			/**
			 * Saving the redirect
			 *
			 * @param  {object} evt
			 * @returns {boolean}
			 */
			var save_redirect_row = function( evt ) {
				evt.preventDefault();
				that.update_redirect( row );

				return false;
			};

			/**
			 * Creates a button
			 *
			 * @param {string}   button_class
			 * @param {int}      tabindex
			 * @param {string}   button_value
			 * @param {function} onclick
			 * @returns {*|jQuery}
			 */
			var create_button = function( button_class, tabindex, button_value, onclick ) {
				return $( '<button>' ).addClass( button_class ).attr( 'tabindex', tabindex ).html(button_value ).click( onclick );
			};

			var row_values = row.find( '.val' );

			// Add row edit class.
			row.addClass( 'row_edit' );

			// Add current redirect as data to the row.
			row.data( 'old_redirect', {
					key:   row_values.eq( 0 ).html().toString(),
					value: row_values.eq( 1 ).html().toString(),
					type:  row_values.eq( 2 ).html().toString()
				}
			);

			// Add input fields.
			$.each( row_values, this.add_input_field );

			// Hide default row actions
			$( row ).find( '.row-actions' ).hide();

			// Wrap inputs in form elements
			var wrap_form = $( '<form>' ).submit( save_redirect_row );

			$( row ).find( 'td .val input' ).wrap( wrap_form );

			// Create a div for the edit actions
			var edit_actions = $( '<div>' ).addClass( 'edit-actions' );

			// Add Save button
			edit_actions.append(
				create_button( 'button-primary', 4, wpseo_premium_strings.button_save, save_redirect_row )
			);

			// Add the cancel button
			edit_actions.append(
				create_button(
					'button',
					5,
					wpseo_premium_strings.button_cancel,
					function() {
						that.restore_row(row);
						that.restore_values(row);
						return false;
					}
				)
			);

			$( row ).find( '.row-actions' ).parent().append( edit_actions );
		};

		/**
		 * Convert the form field to a string.
		 *
		 * @param {int}    key
		 * @param {object} table_cell
		 */
		this.field_to_string = function( key, table_cell ) {
			var find_field = 'input';
			if ( $( table_cell ).hasClass( 'type' ) ) {
				find_field = 'select option:selected';
			}

			var value = $( table_cell ).find( find_field ).val().toString();

			$( table_cell ).empty().html( value );
		};

		/**
		 * Restores the row by converting the input values to html values.
		 *
		 * @param {string} row
		 */
		this.restore_row = function( row ) {
			row.removeClass( 'row_edit' );

			$.each( row.find( '.val' ), this.field_to_string );

			row.find( '.edit-actions' ).remove();
			row.find( '.row-actions' ).show();
		};

		/**
		 * Validate the entered data
		 *
		 * @param {string} old_redirect
		 * @param {string} new_redirect
		 * @param {string} redirect_type
		 *
		 * @returns {boolean|string}
		 */
		this.validate = function(old_redirect, new_redirect, redirect_type) {
			// Check old URL
			if ( '' === old_redirect ) {
				if ( 'url' === type ) {
					return wpseo_premium_strings.error_old_url;
				}

				return wpseo_premium_strings.error_regex;
			}

			if ( new_redirect === old_redirect ) {
				return wpseo_premium_strings.error_circular;
			}

			// Check new URL
			if ( '' === new_redirect && '410' !== redirect_type ) {
				return wpseo_premium_strings.error_new_url;
			}

			// Check the redirect type
			if ( '' === redirect_type ) {
				return wpseo_premium_strings.error_new_type;
			}

			return false;
		};

		/**
		 * Binding events to the row.
		 *
		 * @param {Object} row
		 */
		this.bind_row_events = function( row ) {
			row.find( '.edit' ).click(
				function() {
					that.edit_row( row, true );
				}
			);
			row.find( '.trash' ).click(
				function() {
					that.delete_redirect( row );
				}
			);
		};

		/**
		 * Create a table row element with the new added redirect data
		 *
		 * @param {string} old_url
		 * @param {string} new_url
		 * @param {string} redirect_type
		 * @returns {void|*|jQuery}
		 */
		this.create_redirect_row = function( old_url, new_url, redirect_type ) {
			var tr = $( '<tr>' ).append(
				$( '<th>' ).addClass( 'check-column' ).attr( 'role', 'row' ).append(
					$( '<input>' ).attr( 'type', 'checkbox' ).val( old_url )
				)
			).append(
				$( '<td>' ).append(
					$( '<div>' ).addClass( 'val' ).html( old_url )
				).append(
					$( '<div>' ).addClass( 'row-actions' ).append(
						$( '<span>' ).addClass( 'edit' ).append(
							$( '<a>' ).attr( 'href', 'javascript:;' ).html( 'Edit' )
						).append( ' | ' )
					).append(
						$( '<span>' ).addClass( 'trash' ).append(
							$( '<a>' ).attr( 'href', 'javascript:;' ).html( 'Delete' )
						)
					)
				)
			).append(
				$( '<td>' ).append(
					$( '<div>' ).addClass( 'val' ).html( new_url )
				)
			).append(
				$( '<td>' ).append(
					$( '<div>' ).addClass( 'val type' ).html( redirect_type )
				)
			);

			// bind the tr
			that.bind_row_events( tr );

			return tr;
		};

		/**
		 * Adding the redirect
		 *
		 * @returns {boolean}
		 */
		this.add_redirect = function() {
			var old_redirect  = jQuery( '#wpseo_redirects_new_old' ).val();
			var new_redirect  = jQuery( '#wpseo_redirects_new_new' ).val();
			var redirect_type = jQuery( '#wpseo_redirects_new_type' ).val();

			var error_message = that.validate(old_redirect, new_redirect, redirect_type);

			if( error_message ) {
				that.dialog(
					wpseo_premium_strings.error_saving_redirect,
					error_message
				);

				return false;
			}

			// Do post
			that.post(
				{
					action: 'wpseo_add_redirect_' + type,
					ajax_nonce: $( '.wpseo_redirects_ajax_nonce' ).val(),
					old_url: encodeURIComponent( old_redirect ),
					new_url: encodeURIComponent( new_redirect ),
					type: redirect_type
				},
				// Method that will be called on complete.
				that.add_redirect_response
			);

			return true;
		};

		/**
		 * Handling the add redirect response
		 *
		 * @param {Object} response
		 *
		 * @returns {boolean}
		 */
		this.add_redirect_response = function( response ) {
			that.handle_response(
				response,
				function( response ) {
					// Empty the form fields.
					jQuery( '#wpseo_redirects_new_old' ).val( '' );
					jQuery( '#wpseo_redirects_new_new' ).val( '' );

					// Remove the no items row
					that.find( '.no-items' ).remove();

					// Creating tr
					var tr = that.create_redirect_row(response.old_redirect, response.new_redirect, response.redirect_type );

					// Add the new row
					$('form#' + type).find('#the-list').prepend(tr);
				},
				wpseo_premium_strings.redirect_added
			);
		};

		/**
		 * Updating the redirect
		 *
		 * @param {Object} row
		 *
		 * @returns {boolean}
		 */
		this.update_redirect = function( row ) {
			var table_cells   = row.find( '.val' );
			var old_url       = table_cells.eq( 0 ).find( 'input' ).val().toString();
			var new_url       = table_cells.eq( 1 ).find( 'input' ).val().toString();
			var redirect_type = table_cells.eq( 2 ).find( 'select option:selected' ).val().toString();

			// Validate the fields
			var error_message = that.validate(old_url, new_url, redirect_type);

			if( error_message ) {
				that.dialog(
					wpseo_premium_strings.error_saving_redirect,
					error_message
				);

				return false;
			}

			// Post the request.
			that.post(
				{
					action: 'wpseo_update_redirect_' + type,
					ajax_nonce: $( '.wpseo_redirects_ajax_nonce' ).val(),
					old_redirect: encodeURIComponent( row.data( 'old_redirect' ).key ),
					new_redirect: {
						key: encodeURIComponent( old_url ),
						value: encodeURIComponent( new_url ),
						type: encodeURIComponent( redirect_type )
					}
				},
				function( response ) {
					that.handle_response(
						response,
						function() {
							table_cells.eq( 0 ).find( 'input' ).val( response.old_redirect );
							that.restore_row(row);
						},
						wpseo_premium_strings.redirect_updated
					);
				}
			);

			return true;
		};

		/**
		 * Removes the redirect
		 *
		 * @param {Object} row
		 */
		this.delete_redirect = function(row) {
			that.post(
				{
					action: 'wpseo_delete_redirect_' + type,
					ajax_nonce: $( '.wpseo_redirects_ajax_nonce' ).val(),
					redirect: row.find( '.val' ).eq( 0 ).html().toString()
				},
				function(response) {
					that.handle_response(
						response,
						function() {
							// When the redirect is removed, just fade out the row and remove it after its faded
							row.fadeTo('fast', 0).slideUp(
								function() {
									$(this).remove();
								}
							);
						},
						wpseo_premium_strings.redirect_deleted
					);
				}
			);
		};

		/**
		 * Running the setup of this element.
		 */
		this.setup = function() {
			// Adding dialog
			$('body').append('<div id="YoastRedirectDialog"><div id="YoastRedirectDialogText"></div></div>');

			$.each( that.find( 'table tr' ),
				function( k, tr ) {
					that.bind_row_events( $( tr ) );
				}
			);

			that.find( '.wpseo-new-redirect-form a.button-primary' ).click( function() {
					that.add_redirect();
					return false;
				}
			);

			that.find( '.wpseo-new-redirect-form input' ).keypress( function( event ) {
					if ( event.which === 13 ) {
						event.preventDefault();
						that.add_redirect();
					}
				}
			);

			$( window ).on( 'beforeunload', function() {
					if ( $( '.row_edit' ).length > 0 ) {
						return wpseo_premium_strings.unsaved_redirects;
					}
				}
			);
		};
		that.setup();
	};

	function init() {
		$.each(
			$('.redirect-table-tab'),
			function (key, element) {
				$(element).wpseo_redirects($(element).attr('id'));
			}
		);
	}

	$(init);

}(jQuery));
