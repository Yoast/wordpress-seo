/* jshint -W097 */
/* jshint -W098 */
/* jshint -W107 */
/* global yoast_overlay */
/* global alert */
'use strict';

( function($) {
	var REDIRECT = {
		DELETED: 410
	};

	var TABLE_COLUMNS = {
		ORIGIN: 1,
		TARGET: 2,
		TYPE: 0
	};

	/**
	 * The quick edit prototype for handling the quick edit on form rows.
	 * @constructor
	 */
	var RedirectQuickEdit = function() {
		this.row = null;
		this.quick_edit_row = null;
	};

	/**
	 * setting upt the quick edit for a row, with the given row values.
	 * @param {element} row
	 * @param {object} row_cells
	 */
	RedirectQuickEdit.prototype.Setup = function( row, row_cells ) {
		this.row            = row;
		this.quick_edit_row = $('#inline-edit').clone();

		this.SetFormValues( row_cells );
	};

	/**
	 * Set the values from the table cell in the form
	 *
	 * @param {object} row_cells
	 */
	RedirectQuickEdit.prototype.SetFormValues = function( row_cells ) {
		this.GetTypeField()
				.find( 'option[value=' + row_cells.type.html().toString() + ']' )
				.attr( 'selected', 'selected' );

		this.GetOriginField().val( row_cells.origin.html().toString() );
		this.GetTargetField().val( row_cells.target.html().toString() );
	};

	/**
	 * Returns the origin field
	 *
	 * @returns {element}
	 */
	RedirectQuickEdit.prototype.GetOriginField = function() {
		return this.quick_edit_row.find( '#wpseo_redirects_update_origin');
	};

	/**
	 * Returns the target field
	 *
	 * @returns {element}
	 */
	RedirectQuickEdit.prototype.GetTargetField = function() {
		return this.quick_edit_row.find( '#wpseo_redirects_update_new');
	};

	/**
	 * Returns the type field
	 *
	 * @returns {element}
	 */
	RedirectQuickEdit.prototype.GetTypeField = function() {
		return this.quick_edit_row.find( '#wpseo_redirects_update_type');
	};

	/**
	 * Returns the original row element
	 *
	 * @returns {element}
	 */
	RedirectQuickEdit.prototype.GetRow = function() {
		return this.row;
	};

	/**
	 * Returns the values on the quick edit form
	 *
	 * @returns {{origin: (string|*), target: (string|*), type: (string|*)}}
	 */
	RedirectQuickEdit.prototype.GetFormValues = function() {
		return {
			origin: this.GetOriginField().val().toString(),
			target: this.GetTargetField().val().toString(),
			type: this.GetTypeField().val().toString()
		};
	};

	/**
	 * Shows the quick edit form and hides the redirect row.
	 */
	RedirectQuickEdit.prototype.Show = function() {
		this.row.addClass('hidden');
		this.quick_edit_row.insertAfter( this.row ).show();
	};

	/**
	 * Hides the quick edit form and show the redirect row.
	 */
	RedirectQuickEdit.prototype.Remove = function() {
		this.row.removeClass('hidden');
		this.quick_edit_row.remove();
	};

	// Instantiate the quick edit form.
	var redirects_quick_edit = new RedirectQuickEdit();

	/**
	 * Extending the elements with a wpseo_redirects object
	 * @param {string} arg_type
	 */
	$.fn.wpseo_redirects = function( arg_type ) {
		var that = this;
		var type = arg_type.replace( 'table-', '' );
		var table = that.find( 'table' );

		/**
		 * Returns a mapped object with the row column elements
		 *
		 * @param {Object} row
		 * @returns {{origin: *, target: *, type: *}}
		 */
		this.row_cells = function(row ) {
			var row_values = row.find( '.val' );

			return {
				origin: row_values.eq( TABLE_COLUMNS.ORIGIN ),
				target: row_values.eq( TABLE_COLUMNS.TARGET ),
				type: row_values.eq( TABLE_COLUMNS.TYPE )
			};
		};

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
							text: wpseo_premium_strings.button_ok,
							click: function() {
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
		 * Creating an edit row for editting a redirect.
		 *
		 * @param {object} row
		 */
		this.edit_row = function( row ) {
			// Just show a dialog when there is already a quick edit form opened.
			if( $('#the-list').find('#inline-edit').length > 0 ) {
				this.dialog(
					wpseo_premium_strings.edit_redirect,
					wpseo_premium_strings.editing_redirect
				);

				return;
			}

			// Running the setup and show the quick edit form.
			redirects_quick_edit.Setup( row, this.row_cells( row ) );
			redirects_quick_edit.Show();
			redirects_quick_edit.GetTypeField().trigger('change');
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
					$( '<div>' ).addClass( 'val type' ).html( redirect_type )
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
					$( '<div>' ).addClass( 'val' ).html( old_url )
				)
			).append(
				$( '<td>' ).append(
					$( '<div>' ).addClass( 'val' ).html( new_url )
				)
			);

			return tr;
		};

		/**
		 * Adding the redirect
		 *
		 * @returns {boolean}
		 */
		this.add_redirect = function() {
			var old_redirect  = jQuery( '#wpseo_redirects_new_old' ).val();
			var redirect_type = jQuery( '#wpseo_redirects_new_type' ).val();
			var new_redirect  = jQuery( '#wpseo_redirects_new_new' ).val();
			if ( parseInt( redirect_type, 10 ) === REDIRECT.DELETED ) {
				new_redirect = '';
			}

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
		 * @param {element} row
		 * @param {Object} new_values
		 *
		 * @returns {boolean}
		 */
		this.update_redirect = function( row, new_values ) {
			var table_cells = this.row_cells( row );

			if ( parseInt( new_values.type, 10 ) === REDIRECT.DELETED ) {
				new_values.target = '';
			}

			// Validate the fields
			var error_message = that.validate( new_values.origin , new_values.target, new_values.type );

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
					old_redirect: encodeURIComponent( table_cells.origin.html().toString() ),
					new_redirect: {
						key: encodeURIComponent( new_values.origin ),
						value: encodeURIComponent( new_values.target ),
						type: encodeURIComponent( new_values.type )
					}
				},
				function( response ) {
					that.handle_response(
						response,
						function() {
							table_cells.origin.html( response.old_redirect );
							table_cells.target.html( new_values.target );
							table_cells.type.html( new_values.type );
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
			var row_values = this.row_cells( row );

			that.post(
				{
					action:     'wpseo_delete_redirect_' + type,
					ajax_nonce: $( '.wpseo_redirects_ajax_nonce' ).val(),
					redirect:   row_values.origin.html().toString()
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
		 * Toggles the target field in case of a 410 redirect.
		 */
		this.toggle_select = function( evt, field_to_toggle ) {
			var type = parseInt( $( evt.target ).val(), 10 );

			if( type === REDIRECT.DELETED ) {
				field_to_toggle.hide();
			} else {
				field_to_toggle.show();
			}
		};

		/**
		 * Running the setup of this element.
		 */
		this.setup = function() {
			// Adding dialog
			$('body').append('<div id="YoastRedirectDialog"><div id="YoastRedirectDialogText"></div></div>');

			// Adding events for the add form
			$('.wpseo-new-redirect-form')
				.on( 'click', 'a.button-primary', function() {
					that.add_redirect();
					return false;
				} )
				.on( 'keypress', 'input', function( evt ) {
					if ( evt.which === 13 ) {
						evt.preventDefault();
						that.add_redirect();
					}
				})
				.on( 'change', '#wpseo_redirects_new_type', function( evt ) {
					that.toggle_select( evt, $('#wpseo_redirect_new_url') );
				} );

			$( window ).on( 'beforeunload',
				function() {
					if( $('#the-list').find('#inline-edit').length > 0 ) {
						return wpseo_premium_strings.unsaved_redirects;
					}
				}
			);

			$( '.wp-list-table' )
				.on( 'click', '.edit', function( evt ) {
					var row = $( evt.target ).closest( 'tr' );

					that.edit_row( row );
				})
				.on( 'click', '.trash', function( evt ) {
					var row = $( evt.target ).closest( 'tr' );

					that.delete_redirect( row );
				})
				.on( 'change', 'select[name=wpseo_redirects_update_type]', function( evt ) {
					var field_to_toggle = $( evt.target ).closest( 'tr' ).find( 'div.wpseo_redirect_update_url' );

					that.toggle_select( evt, field_to_toggle );
				} )
				.on( 'click', '.save', function() {
					that.update_redirect(
						redirects_quick_edit.GetRow(),
						redirects_quick_edit.GetFormValues()
					);
					redirects_quick_edit.Remove();
				})
				.on( 'click', '.cancel', function() {
					redirects_quick_edit.Remove();
				});
		};
		that.setup();
	};

	function init() {
		$.each(
			$('.redirect-table-tab'),
			function(key, element) {
				$(element).wpseo_redirects($(element).attr('id'));
			}
		);
	}

	$(init);
}(jQuery));
