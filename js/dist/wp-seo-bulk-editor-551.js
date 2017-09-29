(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

/* global ajaxurl */
/* global JSON */
/* global wpseoBulkEditorNonce */
/* jshint -W097 */
(function () {
	"use strict";

	var bulkEditor = function bulkEditor(currentTable) {
		var newClass = currentTable.find("[class^=wpseo-new]").first().attr("class");
		var newId = "#" + newClass + "-";
		var existingId = newId.replace("new", "existing");
		var columnValue = currentTable.find("th[id^=col_existing_yoast]").first().text().replace("Existing ", "");

		var saveMethod = newClass.replace("-new-", "_save_");
		var saveAllMethod = "wpseo_save_all_" + currentTable.attr("class").split("wpseo_bulk_")[1];

		var bulkType = saveMethod.replace("wpseo_save_", "");

		var options = {
			newClass: "." + newClass,
			newId: newId,
			existingId: existingId
		};

		var instance = {

			submit_new: function submit_new(id) {
				instance.submitNew(id);
			},
			submitNew: function submitNew(id) {
				var newTarget = options.newId + id;
				var existingTarget = options.existingId + id;

				var newValue;
				if (jQuery(options.newId + id).prop("type") === "select-one") {
					newValue = jQuery(newTarget).find(":selected").text();
				} else {
					newValue = jQuery(newTarget).val();
				}

				var currentValue = jQuery(existingTarget).html();

				if (newValue === currentValue) {
					jQuery(newTarget).val("");
				} else {
					/* eslint-disable no-alert */
					if (newValue === "" && !window.confirm("Are you sure you want to remove the existing " + columnValue + "?")) {
						/* eslint-enable no-alert */
						jQuery(newTarget).val("");
						return;
					}

					/* eslint-disable camelcase */
					var data = {
						action: saveMethod,
						_ajax_nonce: wpseoBulkEditorNonce,
						wpseo_post_id: id,
						new_value: newValue,
						existing_value: currentValue
					};
					/* eslint-enable camelcase */

					jQuery.post(ajaxurl, data, instance.handleResponse);
				}
			},

			submit_all: function submit_all(ev) {
				instance.submitAll(ev);
			},
			submitAll: function submitAll(ev) {
				ev.preventDefault();

				var data = {
					action: saveAllMethod,
					// eslint-disable-next-line
					_ajax_nonce: wpseoBulkEditorNonce
				};

				data.send = false;
				data.items = {};
				data.existingItems = {};

				jQuery(options.newClass).each(function () {
					var id = jQuery(this).data("id");
					var value = jQuery(this).val();
					var existingValue = jQuery(options.existingId + id).html();

					if (value !== "") {
						if (value === existingValue) {
							jQuery(options.newId + id).val("");
						} else {
							data.send = true;
							data.items[id] = value;
							data.existingItems[id] = existingValue;
						}
					}
				});

				if (data.send) {
					jQuery.post(ajaxurl, data, instance.handleResponses);
				}
			},

			handle_response: function handle_response(response, status) {
				instance.handleResponse(response, status);
			},
			handleResponse: function handleResponse(response, status) {
				if (status !== "success") {
					return;
				}

				var resp = response;
				if (typeof resp === "string") {
					resp = JSON.parse(resp);
				}

				if (resp instanceof Array) {
					jQuery.each(resp, function () {
						instance.handleResponse(this, status);
					});
				} else {
					if (resp.status === "success") {
						var newValue = resp["new_" + bulkType];

						jQuery(options.existingId + resp.post_id).html(newValue.replace(/\\(?!\\)/g, ""));
						jQuery(options.newId + resp.post_id).val("");
					}
				}
			},

			handle_responses: function handle_responses(responses, status) {
				instance.handleResponses(responses, status);
			},
			handleResponses: function handleResponses(responses, status) {
				var resps = jQuery.parseJSON(responses);
				jQuery.each(resps, function () {
					instance.handleResponse(this, status);
				});
			},

			set_events: function set_events() {
				instance.setEvents();
			},
			setEvents: function setEvents() {
				// Save link.
				currentTable.find(".wpseo-save").click(function (event) {
					var id = jQuery(this).data("id");

					event.preventDefault();
					instance.submitNew(id, this);
				});

				// Save all link.
				currentTable.find(".wpseo-save-all").click(instance.submitAll);

				// Save title and meta description when pressing Enter on respective field and textarea.
				currentTable.find(options.newClass).keydown(function (ev) {
					if (ev.which === 13) {
						ev.preventDefault();
						var id = jQuery(this).data("id");
						instance.submitNew(id, this);
					}
				});
			}
		};

		return instance;
	};
	// eslint-disable-next-line
	window.bulk_editor = bulkEditor;
	window.bulkEditor = bulkEditor;

	jQuery(document).ready(function () {
		var parentTables = jQuery('table[class*="wpseo_bulk"]');
		parentTables.each(function (number, parentTable) {
			var currentTable = jQuery(parentTable);
			var bulkEdit = bulkEditor(currentTable);

			bulkEdit.setEvents();
		});
	});
})();

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9zcmMvd3Atc2VvLWJ1bGstZWRpdG9yLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNFLGFBQVc7QUFDWjs7QUFDQSxLQUFJLGFBQWEsU0FBYixVQUFhLENBQVUsWUFBVixFQUF5QjtBQUN6QyxNQUFJLFdBQVcsYUFBYSxJQUFiLENBQW1CLG9CQUFuQixFQUEwQyxLQUExQyxHQUFrRCxJQUFsRCxDQUF3RCxPQUF4RCxDQUFmO0FBQ0EsTUFBSSxRQUFRLE1BQU0sUUFBTixHQUFpQixHQUE3QjtBQUNBLE1BQUksYUFBYSxNQUFNLE9BQU4sQ0FBZSxLQUFmLEVBQXNCLFVBQXRCLENBQWpCO0FBQ0EsTUFBSSxjQUFjLGFBQWEsSUFBYixDQUFtQiw0QkFBbkIsRUFBa0QsS0FBbEQsR0FBMEQsSUFBMUQsR0FBaUUsT0FBakUsQ0FBMEUsV0FBMUUsRUFBdUYsRUFBdkYsQ0FBbEI7O0FBRUEsTUFBSSxhQUFhLFNBQVMsT0FBVCxDQUFrQixPQUFsQixFQUEyQixRQUEzQixDQUFqQjtBQUNBLE1BQUksZ0JBQWdCLG9CQUFvQixhQUFhLElBQWIsQ0FBbUIsT0FBbkIsRUFBNkIsS0FBN0IsQ0FBb0MsYUFBcEMsRUFBcUQsQ0FBckQsQ0FBeEM7O0FBRUEsTUFBSSxXQUFXLFdBQVcsT0FBWCxDQUFvQixhQUFwQixFQUFtQyxFQUFuQyxDQUFmOztBQUVBLE1BQUksVUFBVTtBQUNiLGFBQVUsTUFBTSxRQURIO0FBRWIsVUFBTyxLQUZNO0FBR2IsZUFBWTtBQUhDLEdBQWQ7O0FBTUEsTUFBSSxXQUFXOztBQUVkLGVBQVksb0JBQVUsRUFBVixFQUFlO0FBQzFCLGFBQVMsU0FBVCxDQUFvQixFQUFwQjtBQUNBLElBSmE7QUFLZCxjQUFXLG1CQUFVLEVBQVYsRUFBZTtBQUN6QixRQUFJLFlBQVksUUFBUSxLQUFSLEdBQWdCLEVBQWhDO0FBQ0EsUUFB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bUIsaUJBQW5CLEVBQXVDLEtBQXZDLENBQThDLFNBQVMsU0FBdkQ7O0FBRUE7QUFDQSxpQkFBYSxJQUFiLENBQW1CLFFBQVEsUUFBM0IsRUFBc0MsT0FBdEMsQ0FDQyxVQUFVLEVBQVYsRUFBZTtBQUNkLFNBQUssR0FBRyxLQUFILEtBQWEsRUFBbEIsRUFBdUI7QUFDdEIsU0FBRyxjQUFIO0FBQ0EsVUFBSSxLQUFLLE9BQVEsSUFBUixFQUFlLElBQWYsQ0FBcUIsSUFBckIsQ0FBVDtBQUNBLGVBQVMsU0FBVCxDQUFvQixFQUFwQixFQUF3QixJQUF4QjtBQUNBO0FBQ0QsS0FQRjtBQVNBO0FBakphLEdBQWY7O0FBb0pBLFNBQU8sUUFBUDtBQUNBLEVBdEtEO0FBdUtBO0FBQ0EsUUFBTyxXQUFQLEdBQXFCLFVBQXJCO0FBQ0EsUUFBTyxVQUFQLEdBQW9CLFVBQXBCOztBQUVBLFFBQVEsUUFBUixFQUFtQixLQUFuQixDQUEwQixZQUFXO0FBQ3BDLE1BQUksZUFBZSxPQUFRLDRCQUFSLENBQW5CO0FBQ0EsZUFBYSxJQUFiLENBQ0UsVUFBVSxNQUFWLEVBQWtCLFdBQWxCLEVBQWdDO0FBQy9CLE9BQUksZUFBZSxPQUFRLFdBQVIsQ0FBbkI7QUFDQSxPQUFJLFdBQVcsV0FBWSxZQUFaLENBQWY7O0FBRUEsWUFBUyxTQUFUO0FBQ0EsR0FOSDtBQVFBLEVBVkQ7QUFZQSxDQXpMQyxHQUFGIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qIGdsb2JhbCBhamF4dXJsICovXG4vKiBnbG9iYWwgSlNPTiAqL1xuLyogZ2xvYmFsIHdwc2VvQnVsa0VkaXRvck5vbmNlICovXG4vKiBqc2hpbnQgLVcwOTcgKi9cbiggZnVuY3Rpb24oKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXHR2YXIgYnVsa0VkaXRvciA9IGZ1bmN0aW9uKCBjdXJyZW50VGFibGUgKSB7XG5cdFx0dmFyIG5ld0NsYXNzID0gY3VycmVudFRhYmxlLmZpbmQoIFwiW2NsYXNzXj13cHNlby1uZXddXCIgKS5maXJzdCgpLmF0dHIoIFwiY2xhc3NcIiApO1xuXHRcdHZhciBuZXdJZCA9IFwiI1wiICsgbmV3Q2xhc3MgKyBcIi1cIjtcblx0XHR2YXIgZXhpc3RpbmdJZCA9IG5ld0lkLnJlcGxhY2UoIFwibmV3XCIsIFwiZXhpc3RpbmdcIiApO1xuXHRcdHZhciBjb2x1bW5WYWx1ZSA9IGN1cnJlbnRUYWJsZS5maW5kKCBcInRoW2lkXj1jb2xfZXhpc3RpbmdfeW9hc3RdXCIgKS5maXJzdCgpLnRleHQoKS5yZXBsYWNlKCBcIkV4aXN0aW5nIFwiLCBcIlwiICk7XG5cblx0XHR2YXIgc2F2ZU1ldGhvZCA9IG5ld0NsYXNzLnJlcGxhY2UoIFwiLW5ldy1cIiwgXCJfc2F2ZV9cIiApO1xuXHRcdHZhciBzYXZlQWxsTWV0aG9kID0gXCJ3cHNlb19zYXZlX2FsbF9cIiArIGN1cnJlbnRUYWJsZS5hdHRyKCBcImNsYXNzXCIgKS5zcGxpdCggXCJ3cHNlb19idWxrX1wiIClbIDEgXTtcblxuXHRcdHZhciBidWxrVHlwZSA9IHNhdmVNZXRob2QucmVwbGFjZSggXCJ3cHNlb19zYXZlX1wiLCBcIlwiICk7XG5cblx0XHR2YXIgb3B0aW9ucyA9IHtcblx0XHRcdG5ld0NsYXNzOiBcIi5cIiArIG5ld0NsYXNzLFxuXHRcdFx0bmV3SWQ6IG5ld0lkLFxuXHRcdFx0ZXhpc3RpbmdJZDogZXhpc3RpbmdJZCxcblx0XHR9O1xuXG5cdFx0dmFyIGluc3RhbmNlID0ge1xuXG5cdFx0XHRzdWJtaXRfbmV3OiBmdW5jdGlvbiggaWQgKSB7XG5cdFx0XHRcdGluc3RhbmNlLnN1Ym1pdE5ldyggaWQgKTtcblx0XHRcdH0sXG5cdFx0XHRzdWJtaXROZXc6IGZ1bmN0aW9uKCBpZCApIHtcblx0XHRcdFx0dmFyIG5ld1RhcmdldCA9IG9wdGlvbnMubmV3SWQgKyBpZDtcblx0XHRcdFx0dmFyIGV4aXN0aW5nVGFyZ2V0ID0gb3B0aW9ucy5leGlzdGluZ0lkICsgaWQ7XG5cblx0XHRcdFx0dmFyIG5ld1ZhbHVlO1xuXHRcdFx0XHRpZiAoIGpRdWVyeSggb3B0aW9ucy5uZXdJZCArIGlkICkucHJvcCggXCJ0eXBlXCIgKSA9PT0gXCJzZWxlY3Qtb25lXCIgKSB7XG5cdFx0XHRcdFx0bmV3VmFsdWUgPSBqUXVlcnkoIG5ld1RhcmdldCApLmZpbmQoIFwiOnNlbGVjdGVkXCIgKS50ZXh0KCk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0bmV3VmFsdWUgPSBqUXVlcnkoIG5ld1RhcmdldCApLnZhbCgpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0dmFyIGN1cnJlbnRWYWx1ZSA9IGpRdWVyeSggZXhpc3RpbmdUYXJnZXQgKS5odG1sKCk7XG5cblx0XHRcdFx0aWYgKCBuZXdWYWx1ZSA9PT0gY3VycmVudFZhbHVlICkge1xuXHRcdFx0XHRcdGpRdWVyeSggbmV3VGFyZ2V0ICkudmFsKCBcIlwiICk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0LyogZXNsaW50LWRpc2FibGUgbm8tYWxlcnQgKi9cblx0XHRcdFx0XHRpZiAoICggbmV3VmFsdWUgPT09IFwiXCIgKSAmJiAhIHdpbmRvdy5jb25maXJtKCBcIkFyZSB5b3Ugc3VyZSB5b3Ugd2FudCB0byByZW1vdmUgdGhlIGV4aXN0aW5nIFwiICsgY29sdW1uVmFsdWUgKyBcIj9cIiApICkge1xuXHRcdFx0XHRcdFx0LyogZXNsaW50LWVuYWJsZSBuby1hbGVydCAqL1xuXHRcdFx0XHRcdFx0alF1ZXJ5KCBuZXdUYXJnZXQgKS52YWwoIFwiXCIgKTtcblx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHQvKiBlc2xpbnQtZGlzYWJsZSBjYW1lbGNhc2UgKi9cblx0XHRcdFx0XHR2YXIgZGF0YSA9IHtcblx0XHRcdFx0XHRcdGFjdGlvbjogc2F2ZU1ldGhvZCxcblx0XHRcdFx0XHRcdF9hamF4X25vbmNlOiB3cHNlb0J1bGtFZGl0b3JOb25jZSxcblx0XHRcdFx0XHRcdHdwc2VvX3Bvc3RfaWQ6IGlkLFxuXHRcdFx0XHRcdFx0bmV3X3ZhbHVlOiBuZXdWYWx1ZSxcblx0XHRcdFx0XHRcdGV4aXN0aW5nX3ZhbHVlOiBjdXJyZW50VmFsdWUsXG5cdFx0XHRcdFx0fTtcblx0XHRcdFx0XHQvKiBlc2xpbnQtZW5hYmxlIGNhbWVsY2FzZSAqL1xuXG5cdFx0XHRcdFx0alF1ZXJ5LnBvc3QoIGFqYXh1cmwsIGRhdGEsIGluc3RhbmNlLmhhbmRsZVJlc3BvbnNlICk7XG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cblx0XHRcdHN1Ym1pdF9hbGw6IGZ1bmN0aW9uKCBldiApIHtcblx0XHRcdFx0aW5zdGFuY2Uuc3VibWl0QWxsKCBldiApO1xuXHRcdFx0fSxcblx0XHRcdHN1Ym1pdEFsbDogZnVuY3Rpb24oIGV2ICkge1xuXHRcdFx0XHRldi5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0XHRcdHZhciBkYXRhID0ge1xuXHRcdFx0XHRcdGFjdGlvbjogc2F2ZUFsbE1ldGhvZCxcblx0XHRcdFx0XHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmVcblx0XHRcdFx0XHRfYWpheF9ub25jZTogd3BzZW9CdWxrRWRpdG9yTm9uY2UsXG5cdFx0XHRcdH07XG5cblx0XHRcdFx0ZGF0YS5zZW5kID0gZmFsc2U7XG5cdFx0XHRcdGRhdGEuaXRlbXMgPSB7fTtcblx0XHRcdFx0ZGF0YS5leGlzdGluZ0l0ZW1zID0ge307XG5cblx0XHRcdFx0alF1ZXJ5KCBvcHRpb25zLm5ld0NsYXNzICkuZWFjaCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0dmFyIGlkID0galF1ZXJ5KCB0aGlzICkuZGF0YSggXCJpZFwiICk7XG5cdFx0XHRcdFx0dmFyIHZhbHVlID0galF1ZXJ5KCB0aGlzICkudmFsKCk7XG5cdFx0XHRcdFx0dmFyIGV4aXN0aW5nVmFsdWUgPSBqUXVlcnkoIG9wdGlvbnMuZXhpc3RpbmdJZCArIGlkICkuaHRtbCgpO1xuXG5cdFx0XHRcdFx0aWYgKCB2YWx1ZSAhPT0gXCJcIiApIHtcblx0XHRcdFx0XHRcdGlmICggdmFsdWUgPT09IGV4aXN0aW5nVmFsdWUgKSB7XG5cdFx0XHRcdFx0XHRcdGpRdWVyeSggb3B0aW9ucy5uZXdJZCArIGlkICkudmFsKCBcIlwiICk7XG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRkYXRhLnNlbmQgPSB0cnVlO1xuXHRcdFx0XHRcdFx0XHRkYXRhLml0ZW1zWyBpZCBdID0gdmFsdWU7XG5cdFx0XHRcdFx0XHRcdGRhdGEuZXhpc3RpbmdJdGVtc1sgaWQgXSA9IGV4aXN0aW5nVmFsdWU7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdCk7XG5cblx0XHRcdFx0aWYgKCBkYXRhLnNlbmQgKSB7XG5cdFx0XHRcdFx0alF1ZXJ5LnBvc3QoIGFqYXh1cmwsIGRhdGEsIGluc3RhbmNlLmhhbmRsZVJlc3BvbnNlcyApO1xuXHRcdFx0XHR9XG5cdFx0XHR9LFxuXG5cdFx0XHRoYW5kbGVfcmVzcG9uc2U6IGZ1bmN0aW9uKCByZXNwb25zZSwgc3RhdHVzICkge1xuXHRcdFx0XHRpbnN0YW5jZS5oYW5kbGVSZXNwb25zZSggcmVzcG9uc2UsIHN0YXR1cyApO1xuXHRcdFx0fSxcblx0XHRcdGhhbmRsZVJlc3BvbnNlOiBmdW5jdGlvbiggcmVzcG9uc2UsIHN0YXR1cyApIHtcblx0XHRcdFx0aWYgKCBzdGF0dXMgIT09IFwic3VjY2Vzc1wiICkge1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHZhciByZXNwID0gcmVzcG9uc2U7XG5cdFx0XHRcdGlmICggdHlwZW9mIHJlc3AgPT09IFwic3RyaW5nXCIgKSB7XG5cdFx0XHRcdFx0cmVzcCA9IEpTT04ucGFyc2UoIHJlc3AgKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmICggcmVzcCBpbnN0YW5jZW9mIEFycmF5ICkge1xuXHRcdFx0XHRcdGpRdWVyeS5lYWNoKCByZXNwLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRcdGluc3RhbmNlLmhhbmRsZVJlc3BvbnNlKCB0aGlzLCBzdGF0dXMgKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0KTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRpZiAoIHJlc3Auc3RhdHVzID09PSBcInN1Y2Nlc3NcIiApIHtcblx0XHRcdFx0XHRcdHZhciBuZXdWYWx1ZSA9IHJlc3BbIFwibmV3X1wiICsgYnVsa1R5cGUgXTtcblxuXHRcdFx0XHRcdFx0alF1ZXJ5KCBvcHRpb25zLmV4aXN0aW5nSWQgKyByZXNwLnBvc3RfaWQgKS5odG1sKCBuZXdWYWx1ZS5yZXBsYWNlKCAvXFxcXCg/IVxcXFwpL2csIFwiXCIgKSApO1xuXHRcdFx0XHRcdFx0alF1ZXJ5KCBvcHRpb25zLm5ld0lkICsgcmVzcC5wb3N0X2lkICkudmFsKCBcIlwiICk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9LFxuXG5cdFx0XHRoYW5kbGVfcmVzcG9uc2VzOiBmdW5jdGlvbiggcmVzcG9uc2VzLCBzdGF0dXMgKSB7XG5cdFx0XHRcdGluc3RhbmNlLmhhbmRsZVJlc3BvbnNlcyggcmVzcG9uc2VzLCBzdGF0dXMgKTtcblx0XHRcdH0sXG5cdFx0XHRoYW5kbGVSZXNwb25zZXM6IGZ1bmN0aW9uKCByZXNwb25zZXMsIHN0YXR1cyApIHtcblx0XHRcdFx0dmFyIHJlc3BzID0galF1ZXJ5LnBhcnNlSlNPTiggcmVzcG9uc2VzICk7XG5cdFx0XHRcdGpRdWVyeS5lYWNoKCByZXNwcywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0aW5zdGFuY2UuaGFuZGxlUmVzcG9uc2UoIHRoaXMsIHN0YXR1cyApO1xuXHRcdFx0XHR9XG5cdFx0XHRcdCk7XG5cdFx0XHR9LFxuXG5cdFx0XHRzZXRfZXZlbnRzOiBmdW5jdGlvbigpIHtcblx0XHRcdFx0aW5zdGFuY2Uuc2V0RXZlbnRzKCk7XG5cdFx0XHR9LFxuXHRcdFx0c2V0RXZlbnRzOiBmdW5jdGlvbigpIHtcblx0XHRcdFx0Ly8gU2F2ZSBsaW5rLlxuXHRcdFx0XHRjdXJyZW50VGFibGUuZmluZCggXCIud3BzZW8tc2F2ZVwiICkuY2xpY2soIGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHRcdFx0XHR2YXIgaWQgPSBqUXVlcnkoIHRoaXMgKS5kYXRhKCBcImlkXCIgKTtcblxuXHRcdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdFx0aW5zdGFuY2Uuc3VibWl0TmV3KCBpZCwgdGhpcyApO1xuXHRcdFx0XHR9XG5cdFx0XHRcdCk7XG5cblx0XHRcdFx0Ly8gU2F2ZSBhbGwgbGluay5cblx0XHRcdFx0Y3VycmVudFRhYmxlLmZpbmQoIFwiLndwc2VvLXNhdmUtYWxsXCIgKS5jbGljayggaW5zdGFuY2Uuc3VibWl0QWxsICk7XG5cblx0XHRcdFx0Ly8gU2F2ZSB0aXRsZSBhbmQgbWV0YSBkZXNjcmlwdGlvbiB3aGVuIHByZXNzaW5nIEVudGVyIG9uIHJlc3BlY3RpdmUgZmllbGQgYW5kIHRleHRhcmVhLlxuXHRcdFx0XHRjdXJyZW50VGFibGUuZmluZCggb3B0aW9ucy5uZXdDbGFzcyApLmtleWRvd24oXG5cdFx0XHRcdFx0ZnVuY3Rpb24oIGV2ICkge1xuXHRcdFx0XHRcdFx0aWYgKCBldi53aGljaCA9PT0gMTMgKSB7XG5cdFx0XHRcdFx0XHRcdGV2LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdFx0XHRcdHZhciBpZCA9IGpRdWVyeSggdGhpcyApLmRhdGEoIFwiaWRcIiApO1xuXHRcdFx0XHRcdFx0XHRpbnN0YW5jZS5zdWJtaXROZXcoIGlkLCB0aGlzICk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHQpO1xuXHRcdFx0fSxcblx0XHR9O1xuXG5cdFx0cmV0dXJuIGluc3RhbmNlO1xuXHR9O1xuXHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmVcblx0d2luZG93LmJ1bGtfZWRpdG9yID0gYnVsa0VkaXRvcjtcblx0d2luZG93LmJ1bGtFZGl0b3IgPSBidWxrRWRpdG9yO1xuXG5cdGpRdWVyeSggZG9jdW1lbnQgKS5yZWFkeSggZnVuY3Rpb24oKSB7XG5cdFx0dmFyIHBhcmVudFRhYmxlcyA9IGpRdWVyeSggJ3RhYmxlW2NsYXNzKj1cIndwc2VvX2J1bGtcIl0nICk7XG5cdFx0cGFyZW50VGFibGVzLmVhY2goXG5cdFx0XHRcdGZ1bmN0aW9uKCBudW1iZXIsIHBhcmVudFRhYmxlICkge1xuXHRcdFx0XHRcdHZhciBjdXJyZW50VGFibGUgPSBqUXVlcnkoIHBhcmVudFRhYmxlICk7XG5cdFx0XHRcdFx0dmFyIGJ1bGtFZGl0ID0gYnVsa0VkaXRvciggY3VycmVudFRhYmxlICk7XG5cblx0XHRcdFx0XHRidWxrRWRpdC5zZXRFdmVudHMoKTtcblx0XHRcdFx0fVxuXHRcdFx0KTtcblx0fVxuXHQpO1xufSgpICk7XG4iXX0=
