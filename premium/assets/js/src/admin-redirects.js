/* jshint -W097 */
/* jshint -W098 */
/* jshint -W107 */
/* global ajaxurl, alert, wpseo_premium_strings, wp, _, wpseoSelect2Locale */

( function( $ ) {
	var ALLOW_EMPTY_TARGET = [
		410, 451,
	];

	var TABLE_COLUMNS = {
		ORIGIN: 1,
		TARGET: 2,
		TYPE: 0,
	};

	var KEYS = {
		ENTER: 13,
	};

	var templateQuickEdit;

	/**
	 * Initialize a redirect form object.
	 *
	 * @param {element} form The redirect form.
	 * @constructor
	 */
	var RedirectForm = function( form ) {
		this.form = form;
	};

	/**
	 * Returns the origin field
	 *
	 * @returns {element} The field for the redirect origin.
	 */
	RedirectForm.prototype.getOriginField = function() {
		return this.form.find( "input[name=wpseo_redirects_origin]" );
	};

	/**
	 * Returns the target field
	 *
	 * @returns {element} The field for the redirect target.
	 */
	RedirectForm.prototype.getTargetField = function() {
		return this.form.find( "input[name=wpseo_redirects_target]" );
	};

	/**
	 * Returns the type field
	 *
	 * @returns {element} The field for redirect type.
	 */
	RedirectForm.prototype.getTypeField = function() {
		return this.form.find( "select[name=wpseo_redirects_type]" );
	};

	/**
	 * Clears the form error message.
	 *
	 * @returns {void}
	 */
	RedirectForm.prototype.clearErrorMessage = function() {
		this.form.find( ".wpseo_redirect_form .form_error" ).remove();
	};

	/**
	 * Sets a form error message.
	 *
	 * @param {string} errorMessage The error message to set.
	 *
	 * @returns {void}
	 */
	RedirectForm.prototype.setErrorMessage = function( errorMessage ) {
		this.form.find( ".wpseo_redirect_form" ).prepend( "<div class=\"form_error error\"><p>" + errorMessage + "</p></div>" );
	};

	/**
	 * Removing the row errors
	 *
	 * @returns {void}
	 */
	RedirectForm.prototype.removeRowHighlights = function() {
		this.form.find( ".redirect_form_row" ).removeClass( "field_error" );
	};

	/**
	 * Highlighting the row errors.
	 *
	 * @param {array} fieldsToHighlight The fields to highlight.
	 *
	 * @returns {void}
	 */
	RedirectForm.prototype.highLightRowErrors = function( fieldsToHighlight ) {
		for( var i = 0; i < fieldsToHighlight.length; i++ ) {
			switch( fieldsToHighlight[ i ] ) {
				case "origin":
					this.highlightRow( this.getOriginField() );
					break;
				case "target":
					this.highlightRow( this.getTargetField() );
					break;
				case "type":
					this.highlightRow( this.getTypeField() );
					break;
			}
		}
	};

	/**
	 * Highlights the closest row with an error class.
	 *
	 * @param {element} errorField The field to hightlight.
	 *
	 * @returns {void}
	 */
	RedirectForm.prototype.highlightRow = function( errorField ) {
		jQuery( errorField ).closest( "div.redirect_form_row" ).addClass( "field_error" );
	};

	/**
	 * Clientside validator for the redirect
	 *
	 * @param {RedirectForm} form Form object representing the form.
	 * @param {string} type       The redirect type.
	 *
	 * @returns {void}
	 */
	var ValidateRedirect = function( form, type ) {
		this.form = form;
		this.type = type;
		this.validationError = "";
	};

	/**
	 * Validates for the form fields
	 *
	 * @returns {boolean} True when validation has been successful.
	 */
	ValidateRedirect.prototype.validate = function() {
		this.form.clearErrorMessage();

		this.form.removeRowHighlights();

		if( this.runValidation( this.form.getOriginField(), this.form.getTargetField(), this.form.getTypeField() ) === false ) {
			this.addValidationError( this.validationError );

			return false;
		}

		return true;
	};

	/**
	 * Executes the validation.
	 *
	 * @param {element} originField The origin field.
	 * @param {element} targetField The target field.
	 * @param {element} typeField   The type field.
	 * @returns {boolean} True when validation has been successful.
	 */
	ValidateRedirect.prototype.runValidation = function( originField, targetField, typeField ) {
		// Check old URL.
		if ( "" === originField.val() ) {
			this.form.highlightRow( originField );

			if ( "plain" === this.type ) {
				return this.setError( wpseo_premium_strings.error_old_url );
			}

			return this.setError( wpseo_premium_strings.error_regex );
		}

		// Only when the redirect type is not deleted.
		if(  jQuery.inArray( parseInt( typeField.val(), 10 ), ALLOW_EMPTY_TARGET ) === -1 ) {
			// Check new URL.
			if ( "" === targetField.val() ) {
				this.form.highlightRow( targetField );
				return this.setError( wpseo_premium_strings.error_new_url );
			}

			// Check if both fields aren't the same.
			if ( targetField.val() === originField.val() ) {
				this.form.highlightRow( targetField );
				return this.setError( wpseo_premium_strings.error_circular );
			}
		}

		// Check the redirect type.
		if ( "" === typeField.val() ) {
			this.form.highlightRow( typeField );
			return this.setError( wpseo_premium_strings.error_new_type );
		}

		return true;
	};

	/**
	 * Sets the validation error and return false.
	 *
	 * @param {string} error The error to set.
	 * @returns {boolean} False, because there is an error.
	 */
	ValidateRedirect.prototype.setError = function( error ) {
		this.validationError = error;
		return false;
	};

	/**
	 * Adding the validation error
	 *
	 * @param {string} error  The error message.
	 * @param {object} fields The fields related to the error.
	 *
	 * @returns {void}
	 */
	ValidateRedirect.prototype.addValidationError = function( error, fields ) {
		this.form.setErrorMessage( error );

		if( fields !== undefined ) {
			this.form.highLightRowErrors( fields );
		}
	};

	/**
	 * Returns the values on the quick edit form
	 *
	 * @returns {{origin: (string|*), target: (string|*), type: (string|*)}} Object with the form values.
	 */
	ValidateRedirect.prototype.getFormValues = function() {
		var values = {
			origin: this.form.getOriginField().val().toString(),
			target: this.form.getTargetField().val().toString(),
			type: this.form.getTypeField().val().toString(),
		};

		// When the redirect type is deleted or unavailable, the target can be emptied.
		if ( jQuery.inArray( parseInt( values.type, 10 ), ALLOW_EMPTY_TARGET ) > -1 ) {
			values.target = "";
		}

		return values;
	};

	/**
	 * The quick edit prototype for handling the quick edit on form rows.
	 * @constructor
	 */
	var RedirectQuickEdit = function() {
		this.row = null;
		this.quickEditRow = null;
	};

	/**
	 * Setting upt the quick edit for a row, with the given row values.
	 *
	 * @param {element} row     The form row object.
	 * @param {object} rowCells The form row cells.
	 *
	 * @returns {void}
	 */
	RedirectQuickEdit.prototype.setup = function( row, rowCells ) {
		this.row          = row;
		this.quickEditRow = $(
			templateQuickEdit( {
				origin: _.unescape( rowCells.origin.html() ),
				target: _.unescape( rowCells.target.html() ),
				type: parseInt( rowCells.type.html(), 10 ),
				suffix: $( "#the-list" ).find( "tr" ).index( row ),
			} )
		);
	};

	/**
	 * Returns the original row element
	 *
	 * @returns {element} The row object.
	 */
	RedirectQuickEdit.prototype.getRow = function() {
		return this.row;
	};

	/**
	 * Returns the original row element
	 *
	 * @returns {element} The form object.
	 */
	RedirectQuickEdit.prototype.getForm = function() {
		return this.quickEditRow;
	};

	/**
	 * Shows the quick edit form and hides the redirect row.
	 *
	 * @returns {void}
	 */
	RedirectQuickEdit.prototype.show = function() {
		this.row.addClass( "hidden" );
		this.quickEditRow
			.insertAfter( this.row )
			.show( 400, function() {
				$( this ).find( ":input" ).first().focus();
			} );
	};

	/**
	 * Hides the quick edit form and show the redirect row.
	 *
	 * @returns {void}
	 */
	RedirectQuickEdit.prototype.remove = function() {
		this.row.removeClass( "hidden" );
		this.quickEditRow.remove();
	};

	// Instantiate the quick edit form.
	var redirectsQuickEdit = new RedirectQuickEdit();

	// Extend the jQuery UI dialog widget for our needs.
	$.widget( "ui.dialog", $.ui.dialog, {
		// Extend the `_createOverlay` function.
		_createOverlay: function() {
			this._super();
			// If the modal option is true, add a click event on the overlay.
			if ( this.options.modal ) {
				this._on( this.overlay, {
					click: function( event ) {
						this.close( event );
					},
				} );
			}
		},
	} );

	/**
	 * Extending the elements with a wpseo_redirects object
	 *
	 * @param {string} argType The redirect table.
	 *
	 * @returns {void}
	 */
	$.fn.wpseo_redirects = function( argType ) {
		var that   = this;
		var type   = argType.replace( "table-", "" );
		var ignore = false;

		var lastAction;

		// The element focus keyboard should be moved back to.
		var returnFocusToEl = null;

		/**
		 * Resets the ignore and lastAction.
		 *
		 * @returns {void}
		 */
		var resetIgnore = function() {
			ignore      = false;
			lastAction = null;
		};

		this.getButtons = function( type ) {
			if ( type === "default" ) {
				return [
					{
						text: wpseo_premium_strings.button_ok,
						click: function() {
							$( this ).dialog( "close" );
						},
					},
				];
			}

			return [
				{
					text: wpseo_premium_strings.button_cancel,
					click: function() {
						resetIgnore();
						$( this ).dialog( "close" );
					},
				},
				{
					text: wpseo_premium_strings.button_save_anyway,
					"class": "button-primary",
					click: function() {
						ignore = true;

						// The value of last action will be the button pressed to save the redirect.
						lastAction();

						$( this ).dialog( "close" );

						resetIgnore();
					},
				},
			];
		};

		/**
		 * Returns a mapped object with the row column elements
		 *
		 * @param {Object} row The row object.
		 * @returns {{origin: *, target: *, type: *}} The values of the fields in the row.
		 */
		this.rowCells = function( row ) {
			var rowValues = row.find( ".val" );

			return {
				origin: rowValues.eq( TABLE_COLUMNS.ORIGIN ),
				target: rowValues.eq( TABLE_COLUMNS.TARGET ),
				type: rowValues.eq( TABLE_COLUMNS.TYPE ),
			};
		};

		/**
		 * Showing a dialog on the screen
		 *
		 * @param {string} title Dialog title.
		 * @param {string} text  The text for the dialog.
		 * @param {string} type  The dialog type.
		 *
		 * @returns {void}
		 */
		this.dialog = function( title, text, type ) {
			if ( type === undefined || type === "error" ) {
				type = "default";
			}

			var buttons = this.getButtons( type );

			$( "#YoastRedirectDialogText" ).html( text );
			$( "#YoastRedirectDialog" ).dialog(
				{
					title: title,
					width: 500,
					draggable: false,
					resizable: false,
					position: {
						at: "center center",
						my: "center center",
						of: window,
					},
					buttons: buttons,
					modal: true,
					close: function() {
						returnFocusToEl.focus();
					},
				}
			);
		};

		/**
		 * Handle the response
		 *
		 * @param {object} successMessage The message that will be displayed on success.
		 *
		 * @returns {void}
		 */
		this.openDialog = function( successMessage ) {
			this.dialog( successMessage.title, successMessage.message );
		};

		/**
		 * Sending post request
		 *
		 * @param {object}   data       The data to post.
		 * @param {function} oncomplete Callback when request has been successful.
		 *
		 * @returns {void}
		 */
		this.post = function( data, oncomplete ) {
			$.post( ajaxurl, data, oncomplete, "json" );
		};

		/**
		 * Creating an edit row for editting a redirect.
		 *
		 * @param {object} row The row to edit.
		 *
		 * @returns {void}
		 */
		this.editRow = function( row ) {
			// Just show a dialog when there is already a quick edit form opened.
			if( $( "#the-list" ).find( "#inline-edit" ).length > 0 ) {
				this.dialog(
					wpseo_premium_strings.edit_redirect,
					wpseo_premium_strings.editing_redirect
				);

				return;
			}

			// Running the setup and show the quick edit form.
			redirectsQuickEdit.setup( row, this.rowCells( row ) );
			redirectsQuickEdit.show();

			new RedirectForm( redirectsQuickEdit.quickEditRow ).getTypeField().trigger( "change" );
		};

		/**
		 * Create a table row element with the new added redirect data
		 *
		 * @param {string} oldUrl       The old url.
		 * @param {string} newUrl       The new url.
		 * @param {string} redirectType The type of the redirect (regex or plain).
		 * @param {Object} redirectInfo  Object with details about the redirect.
		 * @returns {void|*|jQuery} The generated row.
		 */
		this.createRedirectRow = function( oldUrl, newUrl, redirectType, redirectInfo ) {
			var targetClasses = [ "val" ];

			if (
				! redirectInfo.isTargetRelative ||
				"" === newUrl ||
				"/" === newUrl
			) {
				targetClasses.push( "remove-slashes" );
			}

			if ( redirectInfo.hasTrailingSlash ) {
				targetClasses.push( "has-trailing-slash" );
			}

			var tr = $( "<tr>" ).append(
				$( "<th>" ).addClass( "check-column" ).attr( "scope", "row" ).append(
					$( "<input>" )
						.attr( "name", "wpseo_redirects_bulk_delete[]" )
						.attr( "type", "checkbox" )
						.val( _.escape( oldUrl ) )
				)
			).append(
				$( "<td>" ).addClass( "type column-type has-row-actions column-primary" ).append(
					$( "<div>" ).addClass( "val type" ).html( _.escape( redirectType ) )
				).append(
					$( "<div>" ).addClass( "row-actions" ).append(
						$( "<span>" ).addClass( "edit" ).append(
							$( "<a>" ).attr( { href: "#", role: "button", "class": "redirect-edit" } ).html( wpseo_premium_strings.editAction )
						).append( " | " )
					).append(
						$( "<span>" ).addClass( "trash" ).append(
							$( "<a>" ).attr( { href: "#", role: "button", "class": "redirect-delete" } ).html( wpseo_premium_strings.deleteAction )
						)
					)
				)
			).append(
				$( "<td>" ).addClass( "column-old" ).append(
					$( "<div>" ).addClass( "val" ).html( _.escape( oldUrl ) )
				)
			).append(
				$( "<td>" ).addClass( "column-new" ).append(
					$( "<div>" ).addClass( targetClasses.join( " " ) ).html( _.escape( newUrl ) )
				)
			);

			return tr;
		};

		/**
		 * Handles the error.
		 *
		 * @param {ValidateRedirect} validateRedirect The validation object.
		 * @param {Object}           error            The error object.
		 *
		 * @returns {void}
		 */
		this.handleError = function( validateRedirect, error ) {
			validateRedirect.addValidationError( error.message, error.fields );

			if ( error.type === "warning" ) {
				that.dialog( wpseo_premium_strings.error_saving_redirect, error.message, error.type );
			}
		};

		/**
		 * Adding the redirect
		 *
		 * @returns {boolean} True when redirect has been added successfully.
		 */
		this.addRedirect = function() {
			// Do the validation.
			var redirectForm     = new RedirectForm( $( ".wpseo-new-redirect-form" ) );
			var validateRedirect = new ValidateRedirect( redirectForm, type );
			if( validateRedirect.validate() === false ) {
				return false;
			}

			var redirectValues = validateRedirect.getFormValues();

			// Do post.
			that.post(
				{
					action: "wpseo_add_redirect_" + type,
					ajax_nonce: $( ".wpseo_redirects_ajax_nonce" ).val(),
					redirect: {
						origin: encodeURIComponent( redirectValues.origin ),
						target: encodeURIComponent( redirectValues.target ),
						type: redirectValues.type,
					},
					ignore_warning: ignore,
				},
				function( response ) {
					if ( response.error ) {
						that.handleError( validateRedirect, response.error );

						return true;
					}

					// Empty the form fields.
					redirectForm.getOriginField().val( "" );
					redirectForm.getTargetField().val( "" );

					// Remove the no items row.
					that.find( ".no-items" ).remove();

					// Creating tr.
					var tr = that.createRedirectRow( response.origin, response.target, response.type, response.info );

					// Add the new row.
					$( "form#" + type ).find( "#the-list" ).prepend( tr );

					that.openDialog( wpseo_premium_strings.redirect_added );
				}
			);

			return true;
		};

		/**
		 * Updating the redirect
		 *
		 * @returns {boolean} True when updates is successful.
		 */
		this.updateRedirect = function() {
			// Do the validation.
			var redirectForm     = new RedirectForm( redirectsQuickEdit.getForm() );
			var validateRedirect = new ValidateRedirect( redirectForm, type );
			if( validateRedirect.validate() === false ) {
				return false;
			}

			var redirectValues = validateRedirect.getFormValues();

			// Setting the vars for the row and its values.
			var row = redirectsQuickEdit.getRow();
			var rowCells = this.rowCells( row );

			// Post the request.
			that.post(
				{
					action: "wpseo_update_redirect_" + type,
					ajax_nonce: $( ".wpseo_redirects_ajax_nonce" ).val(),
					old_redirect: {
						origin: encodeURIComponent( rowCells.origin.html() ),
						target: encodeURIComponent( rowCells.target.html() ),
						type: encodeURIComponent( rowCells.type.html() ),
					},
					new_redirect: {
						origin: encodeURIComponent( redirectValues.origin ),
						target: encodeURIComponent( redirectValues.target ),
						type: encodeURIComponent( redirectValues.type ),
					},
					ignore_warning: ignore,
				},
				function( response ) {
					if ( response.error ) {
						that.handleError( validateRedirect, response.error );

						return true;
					}

					// Updates the table cells.
					rowCells.origin.html( _.escape( response.origin ) );
					rowCells.target.html( _.escape( response.target ) );
					rowCells.type.html( _.escape( response.type ) );

					redirectsQuickEdit.remove();

					that.openDialog( wpseo_premium_strings.redirect_updated );
				}
			);

			return true;
		};

		/**
		 * Removes the redirect
		 *
		 * @param {Object} row The row object.
		 *
		 * @returns {void}
		 */
		this.deleteRedirect = function( row ) {
			var rowCells = this.rowCells( row );

			that.post(
				{
					action: "wpseo_delete_redirect_" + type,
					ajax_nonce: $( ".wpseo_redirects_ajax_nonce" ).val(),
					redirect: {
						origin: encodeURIComponent( rowCells.origin.html() ),
						target: encodeURIComponent( rowCells.target.html() ),
						type: encodeURIComponent( rowCells.type.html() ),
					},
				},
				function() {
					// When the redirect is removed, just fade out the row and remove it after its faded.
					row.fadeTo( "fast", 0 ).slideUp(
						function() {
							$( this ).remove();
						}
					);

					that.openDialog( wpseo_premium_strings.redirect_deleted );
				}
			);
		};

		/**
		 * Running the setup of this element.
		 *
		 * @returns {void}
		 */
		this.setup = function() {
			var $row;
			// Adding dialog.
			$( "body" ).append( "<div id=\"YoastRedirectDialog\"><div id=\"YoastRedirectDialogText\"></div></div>" );

			// When the window will be closed/reloaded and there is a inline edit opened show a message.
			$( window ).on( "beforeunload",
				function() {
					if( $( "#the-list" ).find( "#inline-edit" ).length > 0 ) {
						return wpseo_premium_strings.unsaved_redirects;
					}
				}
			);

			// Adding the onchange event.
			$( ".redirect-table-tab" )
				.on( "change", "select[name=wpseo_redirects_type]", function( evt ) {
					var type            = parseInt( $( evt.target ).val(), 10 );
					var fieldToToggle = $( evt.target ).closest( ".wpseo_redirect_form" ).find( ".wpseo_redirect_target_holder" );

					// Hide the target field in case of a 410 redirect.
					if( jQuery.inArray( type, ALLOW_EMPTY_TARGET ) > -1 ) {
						$( fieldToToggle ).hide();
					} else {
						$( fieldToToggle ).show();
					}
				} );

			// Adding events for the add form.
			$( ".wpseo-new-redirect-form" )
				.on( "click", ".button-primary", function() {
					lastAction = function() {
						that.addRedirect();
					};

					that.addRedirect();
					returnFocusToEl = $( this );
					return false;
				} )
				.on( "keypress", "input", function( evt ) {
					if ( evt.which === KEYS.ENTER ) {
						lastAction = function() {
							that.addRedirect();
						};

						evt.preventDefault();
						that.addRedirect();
					}
				} );

			$( ".wp-list-table" )
				.on( "click", ".redirect-edit", function( evt ) {
					$row = $( evt.target ).closest( "tr" );

					evt.preventDefault();
					that.editRow( $row );
					returnFocusToEl = $( this );
				} )
				.on( "click", ".redirect-delete", function( evt ) {
					$row = $( evt.target ).closest( "tr" );

					evt.preventDefault();
					that.deleteRedirect( $row );
					// When a row gets deleted, where focus should land?
					returnFocusToEl = $( "#cb-select-all-1" );
				} )
				.on( "keypress", "input", function( evt ) {
					if ( evt.which === KEYS.ENTER ) {
						lastAction = function() {
							that.updateRedirect();
						};

						evt.preventDefault();
						that.updateRedirect();
					}
				} )
				.on( "click", ".save", function() {
					lastAction = function() {
						that.updateRedirect();
					};

					lastAction();
				} )
				.on( "click", ".cancel", function() {
					lastAction = null;
					redirectsQuickEdit.remove();
					// Move focus back to the Edit link.
					$row.find( ".redirect-edit" ).focus();
				} );
		};

		that.setup();
	};

	/**
	 * Adds select2 for selected fields
	 *
	 * @returns {void}
	 */
	function initSelect2() {
		$( "#wpseo_redirects_type" ).select2( {
			width: "400px",
			language: wpseoSelect2Locale,
		} );
	}

	/**
	 * Initializes the redirect page.
	 *
	 * @returns {void}
	 */
	function init() {
		templateQuickEdit = wp.template( "redirects-inline-edit" );

		$.each(
			$( ".redirect-table-tab" ),
			function( key, element ) {
				$( element ).wpseo_redirects( $( element ).attr( "id" ) );
			}
		);

		initSelect2();
	}

	$( init );
}( jQuery ) );
