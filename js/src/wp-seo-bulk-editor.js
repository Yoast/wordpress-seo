/* global ajaxurl */
/* global JSON */
/* global wpseoBulkEditorNonce */
/* jshint -W097 */
import "./helpers/babel-polyfill";

( function() {
	"use strict";
	var bulkEditor = function( currentTable ) {
		var newClass = currentTable.find( "[class^=wpseo-new]" ).first().attr( "class" );
		var newId = "#" + newClass + "-";
		var existingId = newId.replace( "new", "existing" );
		var columnValue = currentTable.find( "th[id^=col_existing_yoast]" ).first().text().replace( "Existing ", "" );

		var saveMethod = newClass.replace( "-new-", "_save_" );
		var saveAllMethod = "wpseo_save_all_" + currentTable.attr( "class" ).split( "wpseo_bulk_" )[ 1 ];

		var bulkType = saveMethod.replace( "wpseo_save_", "" );

		var options = {
			newClass: "." + newClass,
			newId: newId,
			existingId: existingId,
		};

		var instance = {

			submit_new: function( id ) {
				instance.submitNew( id );
			},
			submitNew: function( id ) {
				var newTarget = options.newId + id;
				var existingTarget = options.existingId + id;

				var newValue;
				if ( jQuery( options.newId + id ).prop( "type" ) === "select-one" ) {
					newValue = jQuery( newTarget ).find( ":selected" ).text();
				} else {
					newValue = jQuery( newTarget ).val();
				}

				var currentValue = jQuery( existingTarget ).html();

				if ( newValue === currentValue ) {
					jQuery( newTarget ).val( "" );
				} else {
					/* eslint-disable no-alert */
					if ( ( newValue === "" ) && ! window.confirm( "Are you sure you want to remove the existing " + columnValue + "?" ) ) {
						/* eslint-enable no-alert */
						jQuery( newTarget ).val( "" );
						return;
					}

					/* eslint-disable camelcase */
					var data = {
						action: saveMethod,
						_ajax_nonce: wpseoBulkEditorNonce,
						wpseo_post_id: id,
						new_value: newValue,
						existing_value: currentValue,
					};
					/* eslint-enable camelcase */

					jQuery.post( ajaxurl, data, instance.handleResponse );
				}
			},

			submit_all: function( ev ) {
				instance.submitAll( ev );
			},
			submitAll: function( ev ) {
				ev.preventDefault();

				var data = {
					action: saveAllMethod,
					// eslint-disable-next-line
					_ajax_nonce: wpseoBulkEditorNonce,
				};

				data.send = false;
				data.items = {};
				data.existingItems = {};

				jQuery( options.newClass ).each( function() {
					var id = jQuery( this ).data( "id" );
					var value = jQuery( this ).val();
					var existingValue = jQuery( options.existingId + id ).html();

					if ( value !== "" ) {
						if ( value === existingValue ) {
							jQuery( options.newId + id ).val( "" );
						} else {
							data.send = true;
							data.items[ id ] = value;
							data.existingItems[ id ] = existingValue;
						}
					}
				}
				);

				if ( data.send ) {
					jQuery.post( ajaxurl, data, instance.handleResponses );
				}
			},

			handle_response: function( response, status ) {
				instance.handleResponse( response, status );
			},
			handleResponse: function( response, status ) {
				if ( status !== "success" ) {
					return;
				}

				var resp = response;
				if ( typeof resp === "string" ) {
					resp = JSON.parse( resp );
				}

				if ( resp instanceof Array ) {
					jQuery.each( resp, function() {
						instance.handleResponse( this, status );
					}
					);
				} else {
					if ( resp.status === "success" ) {
						var newValue = resp[ "new_" + bulkType ];

						jQuery( options.existingId + resp.post_id ).html( newValue.replace( /\\(?!\\)/g, "" ) );
						jQuery( options.newId + resp.post_id ).val( "" );
					}
				}
			},

			handle_responses: function( responses, status ) {
				instance.handleResponses( responses, status );
			},
			handleResponses: function( responses, status ) {
				var resps = jQuery.parseJSON( responses );
				jQuery.each( resps, function() {
					instance.handleResponse( this, status );
				}
				);
			},

			set_events: function() {
				instance.setEvents();
			},
			setEvents: function() {
				// Save link.
				currentTable.find( ".wpseo-save" ).click( function( event ) {
					var id = jQuery( this ).data( "id" );

					event.preventDefault();
					instance.submitNew( id, this );
				}
				);

				// Save all link.
				currentTable.find( ".wpseo-save-all" ).click( instance.submitAll );

				// Save title and meta description when pressing Enter on respective field and textarea.
				currentTable.find( options.newClass ).keydown(
					function( ev ) {
						if ( ev.which === 13 ) {
							ev.preventDefault();
							var id = jQuery( this ).data( "id" );
							instance.submitNew( id, this );
						}
					}
				);
			},
		};

		return instance;
	};
	// eslint-disable-next-line
	window.bulk_editor = bulkEditor;
	window.bulkEditor = bulkEditor;

	jQuery( document ).ready( function() {
		var parentTables = jQuery( 'table[class*="wpseo_bulk"]' );
		parentTables.each(
				function( number, parentTable ) {
					var currentTable = jQuery( parentTable );
					var bulkEdit = bulkEditor( currentTable );

					bulkEdit.setEvents();
				}
			);
	}
	);
}() );
