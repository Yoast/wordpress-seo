(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/* global ajaxurl */
/* global wpseo_bulk_editor_nonce */
/* jshint -W097 */
(function() {
	'use strict';
	var bulk_editor = function( current_table ) {
		var new_class = current_table.find( '[class^=wpseo-new]' ).first().attr( 'class' );
		var new_id = '#' + new_class + '-';
		var existing_id = new_id.replace( 'new', 'existing' );
		var column_value = current_table.find( 'th[id^=col_existing_yoast]' ).first().text().replace( 'Existing ', '' );

		var save_method = new_class.replace( '-new-', '_save_' );
		var save_all_method = 'wpseo_save_all_' + current_table.attr( 'class' ).split( 'wpseo_bulk_' )[ 1 ];

		var bulk_type = save_method.replace( 'wpseo_save_', '' );

		var options = {
			new_class: '.' + new_class,
			new_id: new_id,
			existing_id: existing_id
		};

		var instance = {

			submit_new: function( id ) {
				var new_target = options.new_id + id;
				var existing_target = options.existing_id + id;

				var new_value;
				if ( jQuery( options.new_id + id ).prop( 'type' ) === 'select-one' ) {
					new_value = jQuery( new_target ).find( ':selected' ).text();
				}
				else {
					new_value = jQuery( new_target ).val();
				}

				var current_value = jQuery( existing_target ).html();

				if ( new_value === current_value ) {
					jQuery( new_target ).val( '' ).focus();
				}
				else {
					if ( ( new_value === '' ) && !window.confirm( 'Are you sure you want to remove the existing ' + column_value + '?' ) ) {
						jQuery( new_target ).focus();
						jQuery( new_target ).val( '' ).focus();
						return;
					}

					var data = {
						action: save_method,
						_ajax_nonce: wpseo_bulk_editor_nonce,
						wpseo_post_id: id,
						new_value: new_value,
						existing_value: current_value
					};

					jQuery.post( ajaxurl, data, instance.handle_response );
				}
			},

			submit_all: function( ev ) {
				ev.preventDefault();

				var data = {
					action: save_all_method,
					_ajax_nonce: wpseo_bulk_editor_nonce
				};

				data.send = false;
				data.items = {};
				data.existing_items = {};

				jQuery( options.new_class ).each( function() {
						var id = jQuery( this ).data( 'id' );
						var value = jQuery( this ).val();
						var existing_value = jQuery( options.existing_id + id ).html();

						if ( value !== '' ) {
							if ( value === existing_value ) {
								jQuery( options.new_id + id ).val( '' ).focus();
							}
							else {
								data.send = true;
								data.items[ id ] = value;
								data.existing_items[ id ] = existing_value;
							}
						}
					}
				);

				if ( data.send ) {
					jQuery.post( ajaxurl, data, instance.handle_responses );
				}
			},

			handle_response: function( response, status ) {
				if ( status !== 'success' ) {
					return;
				}

				var resp = response;
				if ( typeof resp === 'string' ) {
					resp = JSON.parse( resp );
				}

				if ( resp instanceof Array ) {
					jQuery.each( resp, function() {
							instance.handle_response( this, status );
						}
					);
				}
				else {
					if ( resp.status === 'success' ) {
						var new_value = resp[ 'new_' + bulk_type ];

						jQuery( options.existing_id + resp.post_id ).html( new_value.replace( /\\(?!\\)/g, '' ) );
						jQuery( options.new_id + resp.post_id ).val( '' ).focus();
					}
				}
			},

			handle_responses: function( responses, status ) {
				var resps = jQuery.parseJSON( responses );
				jQuery.each( resps, function() {
						instance.handle_response( this, status );
					}
				);
			},

			set_events: function() {
				current_table.find( '.wpseo-save' ).click( function() {
						var id = jQuery( this ).data( 'id' );
						instance.submit_new( id, this );
					}
				);

				current_table.find( '.wpseo-save-all' ).click( instance.submit_all );

				current_table.find( options.new_class ).keypress(
					function( ev ) {
						if ( ev.which === 13 ) {
							ev.preventDefault();
							var id = jQuery( this ).data( 'id' );
							instance.submit_new( id, this );
						}
					}
				);
			}
		};

		return instance;
	};
	window.bulk_editor = bulk_editor;

	jQuery( document ).ready( function() {
			var parent_tables = jQuery( 'table[class*="wpseo_bulk"]' );
			parent_tables.each(
				function( number, parent_table ) {
					var current_table = jQuery( parent_table );
					var bulk_edit = bulk_editor( current_table );

					bulk_edit.set_events();
				}
			);
		}
	);
}());

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9zcmMvd3Atc2VvLWJ1bGstZWRpdG9yLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qIGdsb2JhbCBhamF4dXJsICovXG4vKiBnbG9iYWwgd3BzZW9fYnVsa19lZGl0b3Jfbm9uY2UgKi9cbi8qIGpzaGludCAtVzA5NyAqL1xuKGZ1bmN0aW9uKCkge1xuXHQndXNlIHN0cmljdCc7XG5cdHZhciBidWxrX2VkaXRvciA9IGZ1bmN0aW9uKCBjdXJyZW50X3RhYmxlICkge1xuXHRcdHZhciBuZXdfY2xhc3MgPSBjdXJyZW50X3RhYmxlLmZpbmQoICdbY2xhc3NePXdwc2VvLW5ld10nICkuZmlyc3QoKS5hdHRyKCAnY2xhc3MnICk7XG5cdFx0dmFyIG5ld19pZCA9ICcjJyArIG5ld19jbGFzcyArICctJztcblx0XHR2YXIgZXhpc3RpbmdfaWQgPSBuZXdfaWQucmVwbGFjZSggJ25ldycsICdleGlzdGluZycgKTtcblx0XHR2YXIgY29sdW1uX3ZhbHVlID0gY3VycmVudF90YWJsZS5maW5kKCAndGhbaWRePWNvbF9leGlzdGluZ195b2FzdF0nICkuZmlyc3QoKS50ZXh0KCkucmVwbGFjZSggJ0V4aXN0aW5nICcsICcnICk7XG5cblx0XHR2YXIgc2F2ZV9tZXRob2QgPSBuZXdfY2xhc3MucmVwbGFjZSggJy1uZXctJywgJ19zYXZlXycgKTtcblx0XHR2YXIgc2F2ZV9hbGxfbWV0aG9kID0gJ3dwc2VvX3NhdmVfYWxsXycgKyBjdXJyZW50X3RhYmxlLmF0dHIoICdjbGFzcycgKS5zcGxpdCggJ3dwc2VvX2J1bGtfJyApWyAxIF07XG5cblx0XHR2YXIgYnVsa190eXBlID0gc2F2ZV9tZXRob2QucmVwbGFjZSggJ3dwc2VvX3NhdmVfJywgJycgKTtcblxuXHRcdHZhciBvcHRpb25zID0ge1xuXHRcdFx0bmV3X2NsYXNzOiAnLicgKyBuZXdfY2xhc3MsXG5cdFx0XHRuZXdfaWQ6IG5ld19pZCxcblx0XHRcdGV4aXN0aW5nX2lkOiBleGlzdGluZ19pZFxuXHRcdH07XG5cblx0XHR2YXIgaW5zdGFuY2UgPSB7XG5cblx0XHRcdHN1Ym1pdF9uZXc6IGZ1bmN0aW9uKCBpZCApIHtcblx0XHRcdFx0dmFyIG5ld190YXJnZXQgPSBvcHRpb25zLm5ld19pZCArIGlkO1xuXHRcdFx0XHR2YXIgZXhpc3RpbmdfdGFyZ2V0ID0gb3B0aW9ucy5leGlzdGluZ19pZCArIGlkO1xuXG5cdFx0XHRcdHZhciBuZXdfdmFsdWU7XG5cdFx0XHRcdGlmICggalF1ZXJ5KCBvcHRpb25zLm5ld19pZCArIGlkICkucHJvcCggJ3R5cGUnICkgPT09ICdzZWxlY3Qtb25lJyApIHtcblx0XHRcdFx0XHRuZXdfdmFsdWUgPSBqUXVlcnkoIG5ld190YXJnZXQgKS5maW5kKCAnOnNlbGVjdGVkJyApLnRleHQoKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRuZXdfdmFsdWUgPSBqUXVlcnkoIG5ld190YXJnZXQgKS52YWwoKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHZhciBjdXJyZW50X3ZhbHVlID0galF1ZXJ5KCBleGlzdGluZ190YXJnZXQgKS5odG1sKCk7XG5cblx0XHRcdFx0aWYgKCBuZXdfdmFsdWUgPT09IGN1cnJlbnRfdmFsdWUgKSB7XG5cdFx0XHRcdFx0alF1ZXJ5KCBuZXdfdGFyZ2V0ICkudmFsKCAnJyApLmZvY3VzKCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0aWYgKCAoIG5ld192YWx1ZSA9PT0gJycgKSAmJiAhd2luZG93LmNvbmZpcm0oICdBcmUgeW91IHN1cmUgeW91IHdhbnQgdG8gcmVtb3ZlIHRoZSBleGlzdGluZyAnICsgY29sdW1uX3ZhbHVlICsgJz8nICkgKSB7XG5cdFx0XHRcdFx0XHRqUXVlcnkoIG5ld190YXJnZXQgKS5mb2N1cygpO1xuXHRcdFx0XHRcdFx0alF1ZXJ5KCBuZXdfdGFyZ2V0ICkudmFsKCAnJyApLmZvY3VzKCk7XG5cdFx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0dmFyIGRhdGEgPSB7XG5cdFx0XHRcdFx0XHRhY3Rpb246IHNhdmVfbWV0aG9kLFxuXHRcdFx0XHRcdFx0X2FqYXhfbm9uY2U6IHdwc2VvX2J1bGtfZWRpdG9yX25vbmNlLFxuXHRcdFx0XHRcdFx0d3BzZW9fcG9zdF9pZDogaWQsXG5cdFx0XHRcdFx0XHRuZXdfdmFsdWU6IG5ld192YWx1ZSxcblx0XHRcdFx0XHRcdGV4aXN0aW5nX3ZhbHVlOiBjdXJyZW50X3ZhbHVlXG5cdFx0XHRcdFx0fTtcblxuXHRcdFx0XHRcdGpRdWVyeS5wb3N0KCBhamF4dXJsLCBkYXRhLCBpbnN0YW5jZS5oYW5kbGVfcmVzcG9uc2UgKTtcblx0XHRcdFx0fVxuXHRcdFx0fSxcblxuXHRcdFx0c3VibWl0X2FsbDogZnVuY3Rpb24oIGV2ICkge1xuXHRcdFx0XHRldi5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0XHRcdHZhciBkYXRhID0ge1xuXHRcdFx0XHRcdGFjdGlvbjogc2F2ZV9hbGxfbWV0aG9kLFxuXHRcdFx0XHRcdF9hamF4X25vbmNlOiB3cHNlb19idWxrX2VkaXRvcl9ub25jZVxuXHRcdFx0XHR9O1xuXG5cdFx0XHRcdGRhdGEuc2VuZCA9IGZhbHNlO1xuXHRcdFx0XHRkYXRhLml0ZW1zID0ge307XG5cdFx0XHRcdGRhdGEuZXhpc3RpbmdfaXRlbXMgPSB7fTtcblxuXHRcdFx0XHRqUXVlcnkoIG9wdGlvbnMubmV3X2NsYXNzICkuZWFjaCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHR2YXIgaWQgPSBqUXVlcnkoIHRoaXMgKS5kYXRhKCAnaWQnICk7XG5cdFx0XHRcdFx0XHR2YXIgdmFsdWUgPSBqUXVlcnkoIHRoaXMgKS52YWwoKTtcblx0XHRcdFx0XHRcdHZhciBleGlzdGluZ192YWx1ZSA9IGpRdWVyeSggb3B0aW9ucy5leGlzdGluZ19pZCArIGlkICkuaHRtbCgpO1xuXG5cdFx0XHRcdFx0XHRpZiAoIHZhbHVlICE9PSAnJyApIHtcblx0XHRcdFx0XHRcdFx0aWYgKCB2YWx1ZSA9PT0gZXhpc3RpbmdfdmFsdWUgKSB7XG5cdFx0XHRcdFx0XHRcdFx0alF1ZXJ5KCBvcHRpb25zLm5ld19pZCArIGlkICkudmFsKCAnJyApLmZvY3VzKCk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0XHRcdFx0ZGF0YS5zZW5kID0gdHJ1ZTtcblx0XHRcdFx0XHRcdFx0XHRkYXRhLml0ZW1zWyBpZCBdID0gdmFsdWU7XG5cdFx0XHRcdFx0XHRcdFx0ZGF0YS5leGlzdGluZ19pdGVtc1sgaWQgXSA9IGV4aXN0aW5nX3ZhbHVlO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHQpO1xuXG5cdFx0XHRcdGlmICggZGF0YS5zZW5kICkge1xuXHRcdFx0XHRcdGpRdWVyeS5wb3N0KCBhamF4dXJsLCBkYXRhLCBpbnN0YW5jZS5oYW5kbGVfcmVzcG9uc2VzICk7XG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cblx0XHRcdGhhbmRsZV9yZXNwb25zZTogZnVuY3Rpb24oIHJlc3BvbnNlLCBzdGF0dXMgKSB7XG5cdFx0XHRcdGlmICggc3RhdHVzICE9PSAnc3VjY2VzcycgKSB7XG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0dmFyIHJlc3AgPSByZXNwb25zZTtcblx0XHRcdFx0aWYgKCB0eXBlb2YgcmVzcCA9PT0gJ3N0cmluZycgKSB7XG5cdFx0XHRcdFx0cmVzcCA9IEpTT04ucGFyc2UoIHJlc3AgKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmICggcmVzcCBpbnN0YW5jZW9mIEFycmF5ICkge1xuXHRcdFx0XHRcdGpRdWVyeS5lYWNoKCByZXNwLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRcdFx0aW5zdGFuY2UuaGFuZGxlX3Jlc3BvbnNlKCB0aGlzLCBzdGF0dXMgKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHQpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdGlmICggcmVzcC5zdGF0dXMgPT09ICdzdWNjZXNzJyApIHtcblx0XHRcdFx0XHRcdHZhciBuZXdfdmFsdWUgPSByZXNwWyAnbmV3XycgKyBidWxrX3R5cGUgXTtcblxuXHRcdFx0XHRcdFx0alF1ZXJ5KCBvcHRpb25zLmV4aXN0aW5nX2lkICsgcmVzcC5wb3N0X2lkICkuaHRtbCggbmV3X3ZhbHVlLnJlcGxhY2UoIC9cXFxcKD8hXFxcXCkvZywgJycgKSApO1xuXHRcdFx0XHRcdFx0alF1ZXJ5KCBvcHRpb25zLm5ld19pZCArIHJlc3AucG9zdF9pZCApLnZhbCggJycgKS5mb2N1cygpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSxcblxuXHRcdFx0aGFuZGxlX3Jlc3BvbnNlczogZnVuY3Rpb24oIHJlc3BvbnNlcywgc3RhdHVzICkge1xuXHRcdFx0XHR2YXIgcmVzcHMgPSBqUXVlcnkucGFyc2VKU09OKCByZXNwb25zZXMgKTtcblx0XHRcdFx0alF1ZXJ5LmVhY2goIHJlc3BzLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRcdGluc3RhbmNlLmhhbmRsZV9yZXNwb25zZSggdGhpcywgc3RhdHVzICk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHQpO1xuXHRcdFx0fSxcblxuXHRcdFx0c2V0X2V2ZW50czogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGN1cnJlbnRfdGFibGUuZmluZCggJy53cHNlby1zYXZlJyApLmNsaWNrKCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRcdHZhciBpZCA9IGpRdWVyeSggdGhpcyApLmRhdGEoICdpZCcgKTtcblx0XHRcdFx0XHRcdGluc3RhbmNlLnN1Ym1pdF9uZXcoIGlkLCB0aGlzICk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHQpO1xuXG5cdFx0XHRcdGN1cnJlbnRfdGFibGUuZmluZCggJy53cHNlby1zYXZlLWFsbCcgKS5jbGljayggaW5zdGFuY2Uuc3VibWl0X2FsbCApO1xuXG5cdFx0XHRcdGN1cnJlbnRfdGFibGUuZmluZCggb3B0aW9ucy5uZXdfY2xhc3MgKS5rZXlwcmVzcyhcblx0XHRcdFx0XHRmdW5jdGlvbiggZXYgKSB7XG5cdFx0XHRcdFx0XHRpZiAoIGV2LndoaWNoID09PSAxMyApIHtcblx0XHRcdFx0XHRcdFx0ZXYucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0XHRcdFx0dmFyIGlkID0galF1ZXJ5KCB0aGlzICkuZGF0YSggJ2lkJyApO1xuXHRcdFx0XHRcdFx0XHRpbnN0YW5jZS5zdWJtaXRfbmV3KCBpZCwgdGhpcyApO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0KTtcblx0XHRcdH1cblx0XHR9O1xuXG5cdFx0cmV0dXJuIGluc3RhbmNlO1xuXHR9O1xuXHR3aW5kb3cuYnVsa19lZGl0b3IgPSBidWxrX2VkaXRvcjtcblxuXHRqUXVlcnkoIGRvY3VtZW50ICkucmVhZHkoIGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIHBhcmVudF90YWJsZXMgPSBqUXVlcnkoICd0YWJsZVtjbGFzcyo9XCJ3cHNlb19idWxrXCJdJyApO1xuXHRcdFx0cGFyZW50X3RhYmxlcy5lYWNoKFxuXHRcdFx0XHRmdW5jdGlvbiggbnVtYmVyLCBwYXJlbnRfdGFibGUgKSB7XG5cdFx0XHRcdFx0dmFyIGN1cnJlbnRfdGFibGUgPSBqUXVlcnkoIHBhcmVudF90YWJsZSApO1xuXHRcdFx0XHRcdHZhciBidWxrX2VkaXQgPSBidWxrX2VkaXRvciggY3VycmVudF90YWJsZSApO1xuXG5cdFx0XHRcdFx0YnVsa19lZGl0LnNldF9ldmVudHMoKTtcblx0XHRcdFx0fVxuXHRcdFx0KTtcblx0XHR9XG5cdCk7XG59KCkpO1xuIl19
