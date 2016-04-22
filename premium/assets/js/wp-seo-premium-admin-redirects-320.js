/* jshint -W097 */
/* jshint -W098 */
/* jshint -W107 */
/* global yoast_overlay, alert, wpseo_premium_strings, wp, _, wpseoSelect2Locale */
'use strict';

( function($) {
	var ALLOW_EMPTY_TARGET = [
		410, 451
	];

	var TABLE_COLUMNS = {
		ORIGIN: 1,
		TARGET: 2,
		TYPE: 0
	};

	var KEYS = {
		ENTER: 13
	};

	var templateQuickEdit;

	/**
	 * Initialize a redirect form object.
	 *
	 * @param {element} form
	 * @constructor
	 */
	var RedirectForm = function( form ) {
		this.form = form;
	};

	/**
	 * Returns the origin field
	 *
	 * @returns {element}
	 */
	RedirectForm.prototype.getOriginField = function() {
		return this.form.find( 'input[name=wpseo_redirects_origin]');
	};

	/**
	 * Returns the target field
	 *
	 * @returns {element}
	 */
	RedirectForm.prototype.getTargetField = function() {
		return this.form.find( 'input[name=wpseo_redirects_target]');
	};

	/**
	 * Returns the type field
	 *
	 * @returns {element}
	 */
	RedirectForm.prototype.getTypeField = function() {
		return this.form.find( 'select[name=wpseo_redirects_type]');
	};

	/**
	 * Clears the form error message.
	 */
	RedirectForm.prototype.clearErrorMessage = function() {
		this.form.find('.wpseo_redirect_form .form_error').remove();
	};

	/**
	 * Sets a form error message.
	 *
	 * @param {string} errorMessage
	 */
	RedirectForm.prototype.setErrorMessage = function( errorMessage ) {
		this.form.find('.wpseo_redirect_form').prepend( '<div class="form_error error"><p>' + errorMessage + '</p></div>' );
	};

	/**
	 * Removing the row errors
	 */
	RedirectForm.prototype.removeRowHighlights = function() {
		this.form.find( '.redirect_form_row').removeClass('field_error');
	};

	/**
	 * Higlighting the row errors.
	 *
	 * @param {array} fields_to_highlight
	 */
	RedirectForm.prototype.highLightRowErrors = function(fields_to_highlight) {
		for( var i = 0; i < fields_to_highlight.length; i++) {
			switch(fields_to_highlight[ i ] ) {
				case 'origin':
					this.highlightRow( this.getOriginField() );
					break;
				case 'target':
					this.highlightRow( this.getTargetField() );
					break;
				case 'type':
					this.highlightRow( this.getTypeField() );
					break;
			}
		}
	};

	/**
	 * Highlights the closest row with an error class.
	 */
	RedirectForm.prototype.highlightRow = function( errorField ) {
		jQuery( errorField ).closest( 'div.redirect_form_row' ).addClass( 'field_error' );
	};

	/**
	 * Clientside validator for the redirect
	 *
	 * @param {RedirectForm} form
	 * @param {string} type
	 */
	var ValidateRedirect = function( form, type ) {
		this.form = form;
		this.type = type;
		this.validation_error = '';
	};

	/**
	 * Validates for the form fields
	 *
	 * @returns {boolean}
	 */
	ValidateRedirect.prototype.validate = function() {
		this.form.clearErrorMessage();

		this.form.removeRowHighlights();

		if( this.runValidation( this.form.getOriginField(), this.form.getTargetField(), this.form.getTypeField() ) === false ) {
			this.addValidationError( this.validation_error );

			return false;
		}

		return true;
	};

	/**
	 * Executes the validation.
	 *
	 * @param {element} originField
	 * @param {element} targetField
	 * @param {element} typeField
	 * @returns {boolean}
	 */
	ValidateRedirect.prototype.runValidation = function( originField, targetField, typeField ) {
		// Check old URL.
		if ( '' === originField.val() ) {
			this.form.highlightRow( originField );

			if ( 'plain' === this.type ) {
				return this.setError( wpseo_premium_strings.error_old_url );
			}

			return this.setError( wpseo_premium_strings.error_regex );
		}

		// Only when the redirect type is not deleted.
		if(  jQuery.inArray( parseInt( typeField.val(), 10 ), ALLOW_EMPTY_TARGET ) === -1 ) {
			// Check new URL
			if ( '' === targetField.val() ) {
				this.form.highlightRow( targetField );
				return this.setError( wpseo_premium_strings.error_new_url );
			}

			// Check if both fields aren't the same.
			if ( targetField.val() === originField.val() ) {
				this.form.highlightRow( targetField );
				return this.setError( wpseo_premium_strings.error_circular );
			}
		}

		// Check the redirect type
		if ( '' === typeField.val() ) {
			this.form.highlightRow( typeField );
			return this.setError( wpseo_premium_strings.error_new_type );
		}

		return true;
	};

	/**
	 * Sets the validation error and return false.
	 *
	 * @param {string} error
	 * @returns {boolean}
	 */
	ValidateRedirect.prototype.setError = function( error ) {
		this.validation_error = error;
		return false;
	};

	/**
	 * Adding the validation error
	 *
	 * @param {string} error
	 * @param {object} fields
	 */
	ValidateRedirect.prototype.addValidationError = function( error, fields ) {
		this.form.setErrorMessage( error );

		if( fields !== undefined) {
			this.form.highLightRowErrors(fields);
		}
	};

	/**
	 * Returns the values on the quick edit form
	 *
	 * @returns {{origin: (string|*), target: (string|*), type: (string|*)}}
	 */
	ValidateRedirect.prototype.getFormValues = function() {
		var values = {
			origin: this.form.getOriginField().val().toString(),
			target: this.form.getTargetField().val().toString(),
			type: this.form.getTypeField().val().toString()
		};

		// When the redirect type is deleted or unavailable, the target can be emptied
		if ( jQuery.inArray( parseInt( values.type, 10 ), ALLOW_EMPTY_TARGET ) > -1 ) {
			values.target = '';
		}

		return values;
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
	RedirectQuickEdit.prototype.setup = function(row, row_cells ) {
		this.row            = row;
		this.quick_edit_row = $(
			templateQuickEdit({
				origin: _.unescape( row_cells.origin.html() ),
				target: _.unescape( row_cells.target.html() ),
				type: parseInt( row_cells.type.html(), 10 ),
				suffix: $( '#the-list').find( 'tr' ).index( row )
			})
		);
	};

	/**
	 * Returns the original row element
	 *
	 * @returns {element}
	 */
	RedirectQuickEdit.prototype.getRow = function() {
		return this.row;
	};

	/**
	 * Returns the original row element
	 *
	 * @returns {element}
	 */
	RedirectQuickEdit.prototype.getForm = function() {
		return this.quick_edit_row;
	};

	/**
	 * Shows the quick edit form and hides the redirect row.
	 */
	RedirectQuickEdit.prototype.show = function() {
		this.row.addClass('hidden');
		this.quick_edit_row.insertAfter( this.row ).show();
	};

	/**
	 * Hides the quick edit form and show the redirect row.
	 */
	RedirectQuickEdit.prototype.remove = function() {
		this.row.removeClass('hidden');
		this.quick_edit_row.remove();
	};

	// Instantiate the quick edit form.
	var redirectsQuickEdit = new RedirectQuickEdit();

	/**
	 * Extending the elements with a wpseo_redirects object
	 * @param {string} arg_type
	 */
	$.fn.wpseo_redirects = function( arg_type ) {
		var that   = this;
		var type   = arg_type.replace( 'table-', '' );
		var ignore = false;

		var last_action;

		/**
		 * Resets the ignore and last_action.
		 */
		var reset_ignore = function() {
			ignore      = false;
			last_action = null;
		};

		this.get_buttons = function( type ) {
			if ( type === 'default' ) {
				return [
					{
						text: wpseo_premium_strings.button_ok,
						click: function() {
							$(this).dialog('close');
						}
					}
				];
			}

			return [
				{
					text: wpseo_premium_strings.button_cancel,
					click: function() {
						reset_ignore();
						$(this).dialog('close');
					}
				},
				{
					text: wpseo_premium_strings.button_save_anyway,
					'class': 'button-primary',
					click: function() {
						ignore = true;

						// The value of last action will be the button pressed to save the redirect.
						last_action();

						$(this).dialog('close');

						reset_ignore();
					}
				}
			];
		};

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
		 * @param {string} type
		 */
		this.dialog = function( title, text, type ) {
			if ( type === undefined || type === 'error' ) {
				type = 'default';
			}

			var buttons = this.get_buttons( type );

			$('#YoastRedirectDialogText').html( text );
			$('#YoastRedirectDialog').dialog(
				{
					title: title,
					width: 500,
					draggable: false,
					resizable: false,
					position: {
						at: 'center center',
						my: 'center center',
						of: window
					},
					buttons: buttons
				}
			);
		};

		/**
		 * Handle the response
		 *
		 * @param {object} success_message The message that will be displayed on success
		 *
		 * @returns {boolean}
		 */
		this.open_dialog = function( success_message ) {
			this.dialog( success_message.title, success_message.message );
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
			redirectsQuickEdit.setup( row, this.row_cells( row ) );
			redirectsQuickEdit.show();

			new RedirectForm( redirectsQuickEdit.quick_edit_row ).getTypeField().trigger('change');
		};

		/**
		 * Create a table row element with the new added redirect data
		 *
		 * @param {string} old_url
		 * @param {string} new_url
		 * @param {string} redirect_type
		 * @returns {void|*|jQuery}
		 */
		this.create_redirect_row = function( old_url, new_url, redirect_type, redirectInfo ) {
			var targetClasses = [ 'val' ];

			if (
				! redirectInfo.isTargetRelative ||
				'' === new_url ||
				'/' === new_url
			) {
				targetClasses.push( 'remove-slashes' );
			}

			if ( redirectInfo.hasTrailingSlash ) {
				targetClasses.push( 'has-trailing-slash' );
			}

			var tr = $( '<tr>' ).append(
				$( '<th>' ).addClass( 'check-column' ).attr( 'role', 'row' ).append(
					$( '<input>' )
						.attr( 'name', 'wpseo_redirects_bulk_delete[]' )
						.attr( 'type', 'checkbox' )
						.val( _.escape( old_url ) )
				)
			).append(
				$( '<td>' ).append(
					$( '<div>' ).addClass( 'val type' ).html( _.escape( redirect_type ) )
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
				$( '<td>' ).addClass( 'column-old' ).append(
					$( '<div>' ).addClass( 'val' ).html( _.escape( old_url ) )
				)
			).append(
				$( '<td>' ).addClass( 'column-new' ).append(
					$( '<div>' ).addClass( targetClasses.join( ' ' ) ).html( _.escape( new_url ) )
				)
			);

			return tr;
		};

		/**
		 * Handles the error.
		 *
		 * @param {ValidateRedirect} validateRedirect
		 * @param {array} error
		 */
		this.handleError = function( validateRedirect, error ) {
			validateRedirect.addValidationError(error.message, error.fields);

			if (error.type === 'warning') {
				that.dialog(wpseo_premium_strings.error_saving_redirect, error.message, error.type);
			}
		};

		/**
		 * Adding the redirect
		 *
		 * @returns {boolean}
		 */
		this.add_redirect = function() {
			// Do the validation.
			var redirectForm     = new RedirectForm( $( '.wpseo-new-redirect-form' ) );
			var validateRedirect = new ValidateRedirect( redirectForm, type );
			if( validateRedirect.validate() === false ) {
				return false;
			}

			var redirect_values = validateRedirect.getFormValues();

			// Do post
			that.post(
				{
					action: 'wpseo_add_redirect_' + type,
					ajax_nonce: $( '.wpseo_redirects_ajax_nonce' ).val(),
					redirect: {
						origin: encodeURIComponent( redirect_values.origin ),
						target: encodeURIComponent( redirect_values.target ),
						type: redirect_values.type
					},
					ignore_warning: ignore
				},
				function( response ) {
					if (response.error) {
						that.handleError( validateRedirect, response.error );

						return true;
					}

					// Empty the form fields.
					redirectForm.getOriginField().val( '' );
					redirectForm.getTargetField().val( '' );

					// Remove the no items row
					that.find( '.no-items' ).remove();

					// Creating tr
					var tr = that.create_redirect_row( response.origin, response.target, response.type, response.info );

					// Add the new row
					$('form#' + type).find('#the-list').prepend(tr);

					that.open_dialog( wpseo_premium_strings.redirect_added );
				}
			);

			return true;
		};

		/**
		 * Updating the redirect
		 *
		 * @returns {boolean}
		 */
		this.update_redirect = function() {
			// Do the validation.
			var redirectForm     = new RedirectForm( redirectsQuickEdit.getForm() );
			var validateRedirect = new ValidateRedirect( redirectForm, type );
			if( validateRedirect.validate() === false ) {
				return false;
			}

			var redirect_values = validateRedirect.getFormValues();

			// Setting the vars for the row and its values.
			var row = redirectsQuickEdit.getRow();
			var row_cells = this.row_cells( row );

			// Post the request.
			that.post(
				{
					action: 'wpseo_update_redirect_' + type,
					ajax_nonce: $( '.wpseo_redirects_ajax_nonce' ).val(),
					old_redirect: {
						origin: encodeURIComponent( row_cells.origin.html() ),
						target: encodeURIComponent( row_cells.target.html() ),
						type: encodeURIComponent( row_cells.type.html() )
					},
					new_redirect: {
						origin: encodeURIComponent( redirect_values.origin ),
						target: encodeURIComponent( redirect_values.target ),
						type: encodeURIComponent( redirect_values.type )
					},
					ignore_warning: ignore
				},
				function( response ) {
					if (response.error) {
						that.handleError( validateRedirect, response.error );

						return true;
					}

					// Updates the table cells.
					row_cells.origin.html( _.escape( response.origin ) );
					row_cells.target.html( _.escape( response.target ) );
					row_cells.type.html( _.escape( response.type ) );

					redirectsQuickEdit.remove();

					that.open_dialog( wpseo_premium_strings.redirect_updated );
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
			var row_cells = this.row_cells( row );

			that.post(
				{
					action:     'wpseo_delete_redirect_' + type,
					ajax_nonce: $( '.wpseo_redirects_ajax_nonce' ).val(),
					redirect: {
						origin: encodeURIComponent( row_cells.origin.html() ),
						target: encodeURIComponent( row_cells.target.html() ),
						type: encodeURIComponent( row_cells.type.html() )
					}
				},
				function() {
					// When the redirect is removed, just fade out the row and remove it after its faded
					row.fadeTo('fast', 0).slideUp(
						function() {
							$(this).remove();
						}
					);

					that.open_dialog( wpseo_premium_strings.redirect_deleted );
				}
			);
		};

		/**
		 * Running the setup of this element.
		 */
		this.setup = function() {
			// Adding dialog
			$('body').append('<div id="YoastRedirectDialog"><div id="YoastRedirectDialogText"></div></div>');

			// When the window will be closed/reloaded and there is a inline edit opened show a message.
			$( window ).on( 'beforeunload',
				function() {
					if( $('#the-list').find('#inline-edit').length > 0 ) {
						return wpseo_premium_strings.unsaved_redirects;
					}
				}
			);

			// Adding the onchange event.
			$('.redirect-table-tab')
				.on( 'change', 'select[name=wpseo_redirects_type]', function( evt ) {
					var type            = parseInt( $( evt.target ).val(), 10 );
					var field_to_toggle = $( evt.target ).closest( '.wpseo_redirect_form' ).find( '.wpseo_redirect_target_holder' );

					// Hide the target field in case of a 410 redirect.
					if( jQuery.inArray( type, ALLOW_EMPTY_TARGET ) > -1 ) {
						$( field_to_toggle ).hide();
					}
					else {
						$( field_to_toggle ).show();
					}
				} );

			// Adding events for the add form
			$('.wpseo-new-redirect-form')
				.on( 'click', 'a.button-primary', function() {
					last_action = function() {
						that.add_redirect();
					};

					that.add_redirect();
					return false;
				} )
				.on( 'keypress', 'input', function( evt ) {
					if ( evt.which === KEYS.ENTER ) {
						last_action = function() {
							that.add_redirect();
						};

						evt.preventDefault();
						that.add_redirect();
					}
				});

			$( '.wp-list-table' )
				.on( 'click', '.edit', function( evt ) {
					var row = $( evt.target ).closest( 'tr' );

					that.edit_row( row );
				})
				.on( 'click', '.trash', function( evt ) {
					var row = $( evt.target ).closest( 'tr' );

					that.delete_redirect( row );
				})
				.on( 'keypress', 'input', function( evt ) {
					if ( evt.which === KEYS.ENTER ) {
						last_action = function() {
							that.update_redirect();
						};

						evt.preventDefault();
						that.update_redirect();
					}
				})
				.on( 'click', '.save', function() {
					last_action = function() {
						that.update_redirect();
					};

					last_action();
				})
				.on( 'click', '.cancel', function() {
					last_action = null;
					redirectsQuickEdit.remove();
				});
		};

		that.setup();
	};

	/**
	 * Adds select2 for selected fields
	 */
	function initSelect2() {
		$( '#wpseo_redirects_type').select2( {
			width: '400px',
			language: wpseoSelect2Locale
		} );
	}

	function init() {
		templateQuickEdit = wp.template( 'redirects-inline-edit' );

		$.each(
			$('.redirect-table-tab'),
			function(key, element) {
				$(element).wpseo_redirects($(element).attr('id'));
			}
		);

		initSelect2();
	}

	$(init);
}(jQuery));
