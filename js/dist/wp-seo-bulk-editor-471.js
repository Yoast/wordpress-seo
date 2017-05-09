(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

/* global ajaxurl */
/* global JSON */
/* global wpseo_bulk_editor_nonce */
/* jshint -W097 */
(function () {
	"use strict";

	var bulk_editor = function bulk_editor(current_table) {
		var new_class = current_table.find("[class^=wpseo-new]").first().attr("class");
		var new_id = "#" + new_class + "-";
		var existing_id = new_id.replace("new", "existing");
		var column_value = current_table.find("th[id^=col_existing_yoast]").first().text().replace("Existing ", "");

		var save_method = new_class.replace("-new-", "_save_");
		var save_all_method = "wpseo_save_all_" + current_table.attr("class").split("wpseo_bulk_")[1];

		var bulk_type = save_method.replace("wpseo_save_", "");

		var options = {
			new_class: "." + new_class,
			new_id: new_id,
			existing_id: existing_id
		};

		var instance = {

			submit_new: function submit_new(id) {
				var new_target = options.new_id + id;
				var existing_target = options.existing_id + id;

				var new_value;
				if (jQuery(options.new_id + id).prop("type") === "select-one") {
					new_value = jQuery(new_target).find(":selected").text();
				} else {
					new_value = jQuery(new_target).val();
				}

				var current_value = jQuery(existing_target).html();

				if (new_value === current_value) {
					jQuery(new_target).val("");
				} else {
					/* eslint-disable no-alert */
					if (new_value === "" && !window.confirm("Are you sure you want to remove the existing " + column_value + "?")) {
						/* eslint-enable no-alert */
						jQuery(new_target).val("");
						return;
					}

					var data = {
						action: save_method,
						_ajax_nonce: wpseo_bulk_editor_nonce,
						wpseo_post_id: id,
						new_value: new_value,
						existing_value: current_value
					};

					jQuery.post(ajaxurl, data, instance.handle_response);
				}
			},

			submit_all: function submit_all(ev) {
				ev.preventDefault();

				var data = {
					action: save_all_method,
					_ajax_nonce: wpseo_bulk_editor_nonce
				};

				data.send = false;
				data.items = {};
				data.existing_items = {};

				jQuery(options.new_class).each(function () {
					var id = jQuery(this).data("id");
					var value = jQuery(this).val();
					var existing_value = jQuery(options.existing_id + id).html();

					if (value !== "") {
						if (value === existing_value) {
							jQuery(options.new_id + id).val("");
						} else {
							data.send = true;
							data.items[id] = value;
							data.existing_items[id] = existing_value;
						}
					}
				});

				if (data.send) {
					jQuery.post(ajaxurl, data, instance.handle_responses);
				}
			},

			handle_response: function handle_response(response, status) {
				if (status !== "success") {
					return;
				}

				var resp = response;
				if (typeof resp === "string") {
					resp = JSON.parse(resp);
				}

				if (resp instanceof Array) {
					jQuery.each(resp, function () {
						instance.handle_response(this, status);
					});
				} else {
					if (resp.status === "success") {
						var new_value = resp["new_" + bulk_type];

						jQuery(options.existing_id + resp.post_id).html(new_value.replace(/\\(?!\\)/g, ""));
						jQuery(options.new_id + resp.post_id).val("");
					}
				}
			},

			handle_responses: function handle_responses(responses, status) {
				var resps = jQuery.parseJSON(responses);
				jQuery.each(resps, function () {
					instance.handle_response(this, status);
				});
			},

			set_events: function set_events() {
				// Save link.
				current_table.find(".wpseo-save").click(function (event) {
					var id = jQuery(this).data("id");

					event.preventDefault();
					instance.submit_new(id, this);
				});

				// Save all link.
				current_table.find(".wpseo-save-all").click(instance.submit_all);

				// Save title and meta description when pressing Enter on respective field and textarea.
				current_table.find(options.new_class).keydown(function (ev) {
					if (ev.which === 13) {
						ev.preventDefault();
						var id = jQuery(this).data("id");
						instance.submit_new(id, this);
					}
				});
			}
		};

		return instance;
	};
	window.bulk_editor = bulk_editor;

	jQuery(document).ready(function () {
		var parent_tables = jQuery('table[class*="wpseo_bulk"]');
		parent_tables.each(function (number, parent_table) {
			var current_table = jQuery(parent_table);
			var bulk_edit = bulk_editor(current_table);

			bulk_edit.set_events();
		});
	});
})();

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9zcmMvd3Atc2VvLWJ1bGstZWRpdG9yLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNFLGFBQVc7QUFDWjs7QUFDQSxLQUFJLGNBQWMsU0FBZCxXQUFjLENBQVUsYUFBVixFQUEwQjtBQUMzQyxNQUFJLFlBQVksY0FBYyxJQUFkLENBQW9CLG9CQUFwQixFQUEyQyxLQUEzQyxHQUFtRCxJQUFuRCxDQUF5RCxPQUF6RCxDQUFoQjtBQUNBLE1BQUksU0FBUyxNQUFNLFNBQU4sR0FBa0IsR0FBL0I7QUFDQSxNQUFJLGNBQWMsT0FBTyxPQUFQLENBQWdCLEtBQWhCLEVBQXVCLFVBQXZCLENBQWxCO0FBQ0EsTUFBSSxlQUFlLGNBQWMsSUFBZCxDQUFvQiw0QkFBcEIsRUFBbUQsS0FBbkQsR0FBMkQsSUFBM0QsR0FBa0UsT0FBbEUsQ0FBMkUsV0FBM0UsRUFBd0YsRUFBeEYsQ0FBbkI7O0FBRUEsTUFBSSxjQUFjLFVBQVUsT0FBVixDQUFtQixPQUFuQixFQUE0QixRQUE1QixDQUFsQjtBQUNBLE1BQUksa0JBQWtCLG9CQUFvQixjQUFjLElBQWQsQ0FBb0IsT0FBcEIsRUFBOEIsS0FBOUIsQ0FBcUMsYUFBckMsRUFBc0QsQ0FBdEQsQ0FBMUM7O0FBRUEsTUFBSSxZQUFZLFlBQVksT0FBWixDQUFxQixhQUFyQixFQUFvQyxFQUFwQyxDQUFoQjs7QUFFQSxNQUFJLFVBQVU7QUFDYixjQUFXLE1BQU0sU0FESjtBQUViLFdBQVEsTUFGSztBQUdiLGdCQUFhO0FBSEEsR0FBZDs7QUFNQSxNQUFJLFdBQVc7O0FBRWQsZUFBWSxvQkFBVSxFQUFWLEVBQWU7QUFDMUIsUUFBSSxhQUFhLFFBQVEsTUFBUixHQUFpQixFQUFsQztBQUNBLFFBQUksa0JBQWtCLFFBQVEsV0FBUixHQUFzQixFQUE1Qzs7QUFFQSxRQUFJLFNBQUo7QUFDQSxRQUFLLE9B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QW5CLENBQTBCLFlBQVc7QUFDcEMsTUFBSSxnQkFBZ0IsT0FBUSw0QkFBUixDQUFwQjtBQUNBLGdCQUFjLElBQWQsQ0FDRSxVQUFVLE1BQVYsRUFBa0IsWUFBbEIsRUFBaUM7QUFDaEMsT0FBSSxnQkFBZ0IsT0FBUSxZQUFSLENBQXBCO0FBQ0EsT0FBSSxZQUFZLFlBQWEsYUFBYixDQUFoQjs7QUFFQSxhQUFVLFVBQVY7QUFDQSxHQU5IO0FBUUEsRUFWRDtBQVlBLENBcktDLEdBQUYiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLyogZ2xvYmFsIGFqYXh1cmwgKi9cbi8qIGdsb2JhbCBKU09OICovXG4vKiBnbG9iYWwgd3BzZW9fYnVsa19lZGl0b3Jfbm9uY2UgKi9cbi8qIGpzaGludCAtVzA5NyAqL1xuKCBmdW5jdGlvbigpIHtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cdHZhciBidWxrX2VkaXRvciA9IGZ1bmN0aW9uKCBjdXJyZW50X3RhYmxlICkge1xuXHRcdHZhciBuZXdfY2xhc3MgPSBjdXJyZW50X3RhYmxlLmZpbmQoIFwiW2NsYXNzXj13cHNlby1uZXddXCIgKS5maXJzdCgpLmF0dHIoIFwiY2xhc3NcIiApO1xuXHRcdHZhciBuZXdfaWQgPSBcIiNcIiArIG5ld19jbGFzcyArIFwiLVwiO1xuXHRcdHZhciBleGlzdGluZ19pZCA9IG5ld19pZC5yZXBsYWNlKCBcIm5ld1wiLCBcImV4aXN0aW5nXCIgKTtcblx0XHR2YXIgY29sdW1uX3ZhbHVlID0gY3VycmVudF90YWJsZS5maW5kKCBcInRoW2lkXj1jb2xfZXhpc3RpbmdfeW9hc3RdXCIgKS5maXJzdCgpLnRleHQoKS5yZXBsYWNlKCBcIkV4aXN0aW5nIFwiLCBcIlwiICk7XG5cblx0XHR2YXIgc2F2ZV9tZXRob2QgPSBuZXdfY2xhc3MucmVwbGFjZSggXCItbmV3LVwiLCBcIl9zYXZlX1wiICk7XG5cdFx0dmFyIHNhdmVfYWxsX21ldGhvZCA9IFwid3BzZW9fc2F2ZV9hbGxfXCIgKyBjdXJyZW50X3RhYmxlLmF0dHIoIFwiY2xhc3NcIiApLnNwbGl0KCBcIndwc2VvX2J1bGtfXCIgKVsgMSBdO1xuXG5cdFx0dmFyIGJ1bGtfdHlwZSA9IHNhdmVfbWV0aG9kLnJlcGxhY2UoIFwid3BzZW9fc2F2ZV9cIiwgXCJcIiApO1xuXG5cdFx0dmFyIG9wdGlvbnMgPSB7XG5cdFx0XHRuZXdfY2xhc3M6IFwiLlwiICsgbmV3X2NsYXNzLFxuXHRcdFx0bmV3X2lkOiBuZXdfaWQsXG5cdFx0XHRleGlzdGluZ19pZDogZXhpc3RpbmdfaWQsXG5cdFx0fTtcblxuXHRcdHZhciBpbnN0YW5jZSA9IHtcblxuXHRcdFx0c3VibWl0X25ldzogZnVuY3Rpb24oIGlkICkge1xuXHRcdFx0XHR2YXIgbmV3X3RhcmdldCA9IG9wdGlvbnMubmV3X2lkICsgaWQ7XG5cdFx0XHRcdHZhciBleGlzdGluZ190YXJnZXQgPSBvcHRpb25zLmV4aXN0aW5nX2lkICsgaWQ7XG5cblx0XHRcdFx0dmFyIG5ld192YWx1ZTtcblx0XHRcdFx0aWYgKCBqUXVlcnkoIG9wdGlvbnMubmV3X2lkICsgaWQgKS5wcm9wKCBcInR5cGVcIiApID09PSBcInNlbGVjdC1vbmVcIiApIHtcblx0XHRcdFx0XHRuZXdfdmFsdWUgPSBqUXVlcnkoIG5ld190YXJnZXQgKS5maW5kKCBcIjpzZWxlY3RlZFwiICkudGV4dCgpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdG5ld192YWx1ZSA9IGpRdWVyeSggbmV3X3RhcmdldCApLnZhbCgpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0dmFyIGN1cnJlbnRfdmFsdWUgPSBqUXVlcnkoIGV4aXN0aW5nX3RhcmdldCApLmh0bWwoKTtcblxuXHRcdFx0XHRpZiAoIG5ld192YWx1ZSA9PT0gY3VycmVudF92YWx1ZSApIHtcblx0XHRcdFx0XHRqUXVlcnkoIG5ld190YXJnZXQgKS52YWwoIFwiXCIgKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHQvKiBlc2xpbnQtZGlzYWJsZSBuby1hbGVydCAqL1xuXHRcdFx0XHRcdGlmICggKCBuZXdfdmFsdWUgPT09IFwiXCIgKSAmJiAhIHdpbmRvdy5jb25maXJtKCBcIkFyZSB5b3Ugc3VyZSB5b3Ugd2FudCB0byByZW1vdmUgdGhlIGV4aXN0aW5nIFwiICsgY29sdW1uX3ZhbHVlICsgXCI/XCIgKSApIHtcblx0XHRcdFx0XHRcdC8qIGVzbGludC1lbmFibGUgbm8tYWxlcnQgKi9cblx0XHRcdFx0XHRcdGpRdWVyeSggbmV3X3RhcmdldCApLnZhbCggXCJcIiApO1xuXHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdHZhciBkYXRhID0ge1xuXHRcdFx0XHRcdFx0YWN0aW9uOiBzYXZlX21ldGhvZCxcblx0XHRcdFx0XHRcdF9hamF4X25vbmNlOiB3cHNlb19idWxrX2VkaXRvcl9ub25jZSxcblx0XHRcdFx0XHRcdHdwc2VvX3Bvc3RfaWQ6IGlkLFxuXHRcdFx0XHRcdFx0bmV3X3ZhbHVlOiBuZXdfdmFsdWUsXG5cdFx0XHRcdFx0XHRleGlzdGluZ192YWx1ZTogY3VycmVudF92YWx1ZSxcblx0XHRcdFx0XHR9O1xuXG5cdFx0XHRcdFx0alF1ZXJ5LnBvc3QoIGFqYXh1cmwsIGRhdGEsIGluc3RhbmNlLmhhbmRsZV9yZXNwb25zZSApO1xuXHRcdFx0XHR9XG5cdFx0XHR9LFxuXG5cdFx0XHRzdWJtaXRfYWxsOiBmdW5jdGlvbiggZXYgKSB7XG5cdFx0XHRcdGV2LnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHRcdFx0dmFyIGRhdGEgPSB7XG5cdFx0XHRcdFx0YWN0aW9uOiBzYXZlX2FsbF9tZXRob2QsXG5cdFx0XHRcdFx0X2FqYXhfbm9uY2U6IHdwc2VvX2J1bGtfZWRpdG9yX25vbmNlLFxuXHRcdFx0XHR9O1xuXG5cdFx0XHRcdGRhdGEuc2VuZCA9IGZhbHNlO1xuXHRcdFx0XHRkYXRhLml0ZW1zID0ge307XG5cdFx0XHRcdGRhdGEuZXhpc3RpbmdfaXRlbXMgPSB7fTtcblxuXHRcdFx0XHRqUXVlcnkoIG9wdGlvbnMubmV3X2NsYXNzICkuZWFjaCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0dmFyIGlkID0galF1ZXJ5KCB0aGlzICkuZGF0YSggXCJpZFwiICk7XG5cdFx0XHRcdFx0dmFyIHZhbHVlID0galF1ZXJ5KCB0aGlzICkudmFsKCk7XG5cdFx0XHRcdFx0dmFyIGV4aXN0aW5nX3ZhbHVlID0galF1ZXJ5KCBvcHRpb25zLmV4aXN0aW5nX2lkICsgaWQgKS5odG1sKCk7XG5cblx0XHRcdFx0XHRpZiAoIHZhbHVlICE9PSBcIlwiICkge1xuXHRcdFx0XHRcdFx0aWYgKCB2YWx1ZSA9PT0gZXhpc3RpbmdfdmFsdWUgKSB7XG5cdFx0XHRcdFx0XHRcdGpRdWVyeSggb3B0aW9ucy5uZXdfaWQgKyBpZCApLnZhbCggXCJcIiApO1xuXHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0ZGF0YS5zZW5kID0gdHJ1ZTtcblx0XHRcdFx0XHRcdFx0ZGF0YS5pdGVtc1sgaWQgXSA9IHZhbHVlO1xuXHRcdFx0XHRcdFx0XHRkYXRhLmV4aXN0aW5nX2l0ZW1zWyBpZCBdID0gZXhpc3RpbmdfdmFsdWU7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdCk7XG5cblx0XHRcdFx0aWYgKCBkYXRhLnNlbmQgKSB7XG5cdFx0XHRcdFx0alF1ZXJ5LnBvc3QoIGFqYXh1cmwsIGRhdGEsIGluc3RhbmNlLmhhbmRsZV9yZXNwb25zZXMgKTtcblx0XHRcdFx0fVxuXHRcdFx0fSxcblxuXHRcdFx0aGFuZGxlX3Jlc3BvbnNlOiBmdW5jdGlvbiggcmVzcG9uc2UsIHN0YXR1cyApIHtcblx0XHRcdFx0aWYgKCBzdGF0dXMgIT09IFwic3VjY2Vzc1wiICkge1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHZhciByZXNwID0gcmVzcG9uc2U7XG5cdFx0XHRcdGlmICggdHlwZW9mIHJlc3AgPT09IFwic3RyaW5nXCIgKSB7XG5cdFx0XHRcdFx0cmVzcCA9IEpTT04ucGFyc2UoIHJlc3AgKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmICggcmVzcCBpbnN0YW5jZW9mIEFycmF5ICkge1xuXHRcdFx0XHRcdGpRdWVyeS5lYWNoKCByZXNwLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRcdGluc3RhbmNlLmhhbmRsZV9yZXNwb25zZSggdGhpcywgc3RhdHVzICk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdCk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0aWYgKCByZXNwLnN0YXR1cyA9PT0gXCJzdWNjZXNzXCIgKSB7XG5cdFx0XHRcdFx0XHR2YXIgbmV3X3ZhbHVlID0gcmVzcFsgXCJuZXdfXCIgKyBidWxrX3R5cGUgXTtcblxuXHRcdFx0XHRcdFx0alF1ZXJ5KCBvcHRpb25zLmV4aXN0aW5nX2lkICsgcmVzcC5wb3N0X2lkICkuaHRtbCggbmV3X3ZhbHVlLnJlcGxhY2UoIC9cXFxcKD8hXFxcXCkvZywgXCJcIiApICk7XG5cdFx0XHRcdFx0XHRqUXVlcnkoIG9wdGlvbnMubmV3X2lkICsgcmVzcC5wb3N0X2lkICkudmFsKCBcIlwiICk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9LFxuXG5cdFx0XHRoYW5kbGVfcmVzcG9uc2VzOiBmdW5jdGlvbiggcmVzcG9uc2VzLCBzdGF0dXMgKSB7XG5cdFx0XHRcdHZhciByZXNwcyA9IGpRdWVyeS5wYXJzZUpTT04oIHJlc3BvbnNlcyApO1xuXHRcdFx0XHRqUXVlcnkuZWFjaCggcmVzcHMsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdGluc3RhbmNlLmhhbmRsZV9yZXNwb25zZSggdGhpcywgc3RhdHVzICk7XG5cdFx0XHRcdH1cblx0XHRcdFx0KTtcblx0XHRcdH0sXG5cblx0XHRcdHNldF9ldmVudHM6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHQvLyBTYXZlIGxpbmsuXG5cdFx0XHRcdGN1cnJlbnRfdGFibGUuZmluZCggXCIud3BzZW8tc2F2ZVwiICkuY2xpY2soIGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHRcdFx0XHR2YXIgaWQgPSBqUXVlcnkoIHRoaXMgKS5kYXRhKCBcImlkXCIgKTtcblxuXHRcdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdFx0aW5zdGFuY2Uuc3VibWl0X25ldyggaWQsIHRoaXMgKTtcblx0XHRcdFx0fVxuXHRcdFx0XHQpO1xuXG5cdFx0XHRcdC8vIFNhdmUgYWxsIGxpbmsuXG5cdFx0XHRcdGN1cnJlbnRfdGFibGUuZmluZCggXCIud3BzZW8tc2F2ZS1hbGxcIiApLmNsaWNrKCBpbnN0YW5jZS5zdWJtaXRfYWxsICk7XG5cblx0XHRcdFx0Ly8gU2F2ZSB0aXRsZSBhbmQgbWV0YSBkZXNjcmlwdGlvbiB3aGVuIHByZXNzaW5nIEVudGVyIG9uIHJlc3BlY3RpdmUgZmllbGQgYW5kIHRleHRhcmVhLlxuXHRcdFx0XHRjdXJyZW50X3RhYmxlLmZpbmQoIG9wdGlvbnMubmV3X2NsYXNzICkua2V5ZG93bihcblx0XHRcdFx0XHRmdW5jdGlvbiggZXYgKSB7XG5cdFx0XHRcdFx0XHRpZiAoIGV2LndoaWNoID09PSAxMyApIHtcblx0XHRcdFx0XHRcdFx0ZXYucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0XHRcdFx0dmFyIGlkID0galF1ZXJ5KCB0aGlzICkuZGF0YSggXCJpZFwiICk7XG5cdFx0XHRcdFx0XHRcdGluc3RhbmNlLnN1Ym1pdF9uZXcoIGlkLCB0aGlzICk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHQpO1xuXHRcdFx0fSxcblx0XHR9O1xuXG5cdFx0cmV0dXJuIGluc3RhbmNlO1xuXHR9O1xuXHR3aW5kb3cuYnVsa19lZGl0b3IgPSBidWxrX2VkaXRvcjtcblxuXHRqUXVlcnkoIGRvY3VtZW50ICkucmVhZHkoIGZ1bmN0aW9uKCkge1xuXHRcdHZhciBwYXJlbnRfdGFibGVzID0galF1ZXJ5KCAndGFibGVbY2xhc3MqPVwid3BzZW9fYnVsa1wiXScgKTtcblx0XHRwYXJlbnRfdGFibGVzLmVhY2goXG5cdFx0XHRcdGZ1bmN0aW9uKCBudW1iZXIsIHBhcmVudF90YWJsZSApIHtcblx0XHRcdFx0XHR2YXIgY3VycmVudF90YWJsZSA9IGpRdWVyeSggcGFyZW50X3RhYmxlICk7XG5cdFx0XHRcdFx0dmFyIGJ1bGtfZWRpdCA9IGJ1bGtfZWRpdG9yKCBjdXJyZW50X3RhYmxlICk7XG5cblx0XHRcdFx0XHRidWxrX2VkaXQuc2V0X2V2ZW50cygpO1xuXHRcdFx0XHR9XG5cdFx0XHQpO1xuXHR9XG5cdCk7XG59KCkgKTtcbiJdfQ==
