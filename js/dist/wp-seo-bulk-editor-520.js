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

			handleResponses: function handleResponses(responses, status) {
				var resps = jQuery.parseJSON(responses);
				jQuery.each(resps, function () {
					instance.handleResponse(this, status);
				});
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9zcmMvd3Atc2VvLWJ1bGstZWRpdG9yLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNFLGFBQVc7QUFDWjs7QUFDQSxLQUFJLGFBQWEsU0FBYixVQUFhLENBQVUsWUFBVixFQUF5QjtBQUN6QyxNQUFJLFdBQVcsYUFBYSxJQUFiLENBQW1CLG9CQUFuQixFQUEwQyxLQUExQyxHQUFrRCxJQUFsRCxDQUF3RCxPQUF4RCxDQUFmO0FBQ0EsTUFBSSxRQUFRLE1BQU0sUUFBTixHQUFpQixHQUE3QjtBQUNBLE1BQUksYUFBYSxNQUFNLE9BQU4sQ0FBZSxLQUFmLEVBQXNCLFVBQXRCLENBQWpCO0FBQ0EsTUFBSSxjQUFjLGFBQWEsSUFBYixDQUFtQiw0QkFBbkIsRUFBa0QsS0FBbEQsR0FBMEQsSUFBMUQsR0FBaUUsT0FBakUsQ0FBMEUsV0FBMUUsRUFBdUYsRUFBdkYsQ0FBbEI7O0FBRUEsTUFBSSxhQUFhLFNBQVMsT0FBVCxDQUFrQixPQUFsQixFQUEyQixRQUEzQixDQUFqQjtBQUNBLE1BQUksZ0JBQWdCLG9CQUFvQixhQUFhLElBQWIsQ0FBbUIsT0FBbkIsRUFBNkIsS0FBN0IsQ0FBb0MsYUFBcEMsRUFBcUQsQ0FBckQsQ0FBeEM7O0FBRUEsTUFBSSxXQUFXLFdBQVcsT0FBWCxDQUFvQixhQUFwQixFQUFtQyxFQUFuQyxDQUFmOztBQUVBLE1BQUksVUFBVTtBQUNiLGFBQVUsTUFBTSxRQURIO0FBRWIsVUFBTyxLQUZNO0FBR2IsZUFBWTtBQUhDLEdBQWQ7O0FBTUEsTUFBSSxXQUFXOztBQUVkLGNBQVcsbUJBQVUsRUFBVixFQUFlO0FBQ3pCLFFBQUksWUFBWSxRQUFRLEtBQVIsR0FBZ0IsRUFBaEM7QUFDQSxRQUFJLGlCQUFpQixRQUFRLFVBQVIsR0FBcUIsRUFBMUM7O0FBRUEsUUFBSSxRQUFKO0FBQ0EsUUFBSyxPQUFRLFFB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UixFQUFtQixLQUFuQixDQUEwQixZQUFXO0FBQ3BDLE1BQUksZUFBZSxPQUFRLDRCQUFSLENBQW5CO0FBQ0EsZUFBYSxJQUFiLENBQ0UsVUFBVSxNQUFWLEVBQWtCLFdBQWxCLEVBQWdDO0FBQy9CLE9BQUksZUFBZSxPQUFRLFdBQVIsQ0FBbkI7QUFDQSxPQUFJLFdBQVcsV0FBWSxZQUFaLENBQWY7O0FBRUEsWUFBUyxTQUFUO0FBQ0EsR0FOSDtBQVFBLEVBVkQ7QUFZQSxDQXpLQyxHQUFGIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qIGdsb2JhbCBhamF4dXJsICovXG4vKiBnbG9iYWwgSlNPTiAqL1xuLyogZ2xvYmFsIHdwc2VvQnVsa0VkaXRvck5vbmNlICovXG4vKiBqc2hpbnQgLVcwOTcgKi9cbiggZnVuY3Rpb24oKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXHR2YXIgYnVsa0VkaXRvciA9IGZ1bmN0aW9uKCBjdXJyZW50VGFibGUgKSB7XG5cdFx0dmFyIG5ld0NsYXNzID0gY3VycmVudFRhYmxlLmZpbmQoIFwiW2NsYXNzXj13cHNlby1uZXddXCIgKS5maXJzdCgpLmF0dHIoIFwiY2xhc3NcIiApO1xuXHRcdHZhciBuZXdJZCA9IFwiI1wiICsgbmV3Q2xhc3MgKyBcIi1cIjtcblx0XHR2YXIgZXhpc3RpbmdJZCA9IG5ld0lkLnJlcGxhY2UoIFwibmV3XCIsIFwiZXhpc3RpbmdcIiApO1xuXHRcdHZhciBjb2x1bW5WYWx1ZSA9IGN1cnJlbnRUYWJsZS5maW5kKCBcInRoW2lkXj1jb2xfZXhpc3RpbmdfeW9hc3RdXCIgKS5maXJzdCgpLnRleHQoKS5yZXBsYWNlKCBcIkV4aXN0aW5nIFwiLCBcIlwiICk7XG5cblx0XHR2YXIgc2F2ZU1ldGhvZCA9IG5ld0NsYXNzLnJlcGxhY2UoIFwiLW5ldy1cIiwgXCJfc2F2ZV9cIiApO1xuXHRcdHZhciBzYXZlQWxsTWV0aG9kID0gXCJ3cHNlb19zYXZlX2FsbF9cIiArIGN1cnJlbnRUYWJsZS5hdHRyKCBcImNsYXNzXCIgKS5zcGxpdCggXCJ3cHNlb19idWxrX1wiIClbIDEgXTtcblxuXHRcdHZhciBidWxrVHlwZSA9IHNhdmVNZXRob2QucmVwbGFjZSggXCJ3cHNlb19zYXZlX1wiLCBcIlwiICk7XG5cblx0XHR2YXIgb3B0aW9ucyA9IHtcblx0XHRcdG5ld0NsYXNzOiBcIi5cIiArIG5ld0NsYXNzLFxuXHRcdFx0bmV3SWQ6IG5ld0lkLFxuXHRcdFx0ZXhpc3RpbmdJZDogZXhpc3RpbmdJZCxcblx0XHR9O1xuXG5cdFx0dmFyIGluc3RhbmNlID0ge1xuXG5cdFx0XHRzdWJtaXROZXc6IGZ1bmN0aW9uKCBpZCApIHtcblx0XHRcdFx0dmFyIG5ld1RhcmdldCA9IG9wdGlvbnMubmV3SWQgKyBpZDtcblx0XHRcdFx0dmFyIGV4aXN0aW5nVGFyZ2V0ID0gb3B0aW9ucy5leGlzdGluZ0lkICsgaWQ7XG5cblx0XHRcdFx0dmFyIG5ld1ZhbHVlO1xuXHRcdFx0XHRpZiAoIGpRdWVyeSggb3B0aW9ucy5uZXdJZCArIGlkICkucHJvcCggXCJ0eXBlXCIgKSA9PT0gXCJzZWxlY3Qtb25lXCIgKSB7XG5cdFx0XHRcdFx0bmV3VmFsdWUgPSBqUXVlcnkoIG5ld1RhcmdldCApLmZpbmQoIFwiOnNlbGVjdGVkXCIgKS50ZXh0KCk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0bmV3VmFsdWUgPSBqUXVlcnkoIG5ld1RhcmdldCApLnZhbCgpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0dmFyIGN1cnJlbnRWYWx1ZSA9IGpRdWVyeSggZXhpc3RpbmdUYXJnZXQgKS5odG1sKCk7XG5cblx0XHRcdFx0aWYgKCBuZXdWYWx1ZSA9PT0gY3VycmVudFZhbHVlICkge1xuXHRcdFx0XHRcdGpRdWVyeSggbmV3VGFyZ2V0ICkudmFsKCBcIlwiICk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0LyogZXNsaW50LWRpc2FibGUgbm8tYWxlcnQgKi9cblx0XHRcdFx0XHRpZiAoICggbmV3VmFsdWUgPT09IFwiXCIgKSAmJiAhIHdpbmRvdy5jb25maXJtKCBcIkFyZSB5b3Ugc3VyZSB5b3Ugd2FudCB0byByZW1vdmUgdGhlIGV4aXN0aW5nIFwiICsgY29sdW1uVmFsdWUgKyBcIj9cIiApICkge1xuXHRcdFx0XHRcdFx0LyogZXNsaW50LWVuYWJsZSBuby1hbGVydCAqL1xuXHRcdFx0XHRcdFx0alF1ZXJ5KCBuZXdUYXJnZXQgKS52YWwoIFwiXCIgKTtcblx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHQvKiBlc2xpbnQtZGlzYWJsZSBjYW1lbGNhc2UgKi9cblx0XHRcdFx0XHR2YXIgZGF0YSA9IHtcblx0XHRcdFx0XHRcdGFjdGlvbjogc2F2ZU1ldGhvZCxcblx0XHRcdFx0XHRcdF9hamF4X25vbmNlOiB3cHNlb0J1bGtFZGl0b3JOb25jZSxcblx0XHRcdFx0XHRcdHdwc2VvX3Bvc3RfaWQ6IGlkLFxuXHRcdFx0XHRcdFx0bmV3X3ZhbHVlOiBuZXdWYWx1ZSxcblx0XHRcdFx0XHRcdGV4aXN0aW5nX3ZhbHVlOiBjdXJyZW50VmFsdWUsXG5cdFx0XHRcdFx0fTtcblx0XHRcdFx0XHQvKiBlc2xpbnQtZW5hYmxlIGNhbWVsY2FzZSAqL1xuXG5cdFx0XHRcdFx0alF1ZXJ5LnBvc3QoIGFqYXh1cmwsIGRhdGEsIGluc3RhbmNlLmhhbmRsZVJlc3BvbnNlICk7XG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cblx0XHRcdHN1Ym1pdEFsbDogZnVuY3Rpb24oIGV2ICkge1xuXHRcdFx0XHRldi5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0XHRcdHZhciBkYXRhID0ge1xuXHRcdFx0XHRcdGFjdGlvbjogc2F2ZUFsbE1ldGhvZCxcblx0XHRcdFx0XHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmVcblx0XHRcdFx0XHRfYWpheF9ub25jZTogd3BzZW9CdWxrRWRpdG9yTm9uY2UsXG5cdFx0XHRcdH07XG5cblx0XHRcdFx0ZGF0YS5zZW5kID0gZmFsc2U7XG5cdFx0XHRcdGRhdGEuaXRlbXMgPSB7fTtcblx0XHRcdFx0ZGF0YS5leGlzdGluZ0l0ZW1zID0ge307XG5cblx0XHRcdFx0alF1ZXJ5KCBvcHRpb25zLm5ld0NsYXNzICkuZWFjaCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0dmFyIGlkID0galF1ZXJ5KCB0aGlzICkuZGF0YSggXCJpZFwiICk7XG5cdFx0XHRcdFx0dmFyIHZhbHVlID0galF1ZXJ5KCB0aGlzICkudmFsKCk7XG5cdFx0XHRcdFx0dmFyIGV4aXN0aW5nVmFsdWUgPSBqUXVlcnkoIG9wdGlvbnMuZXhpc3RpbmdJZCArIGlkICkuaHRtbCgpO1xuXG5cdFx0XHRcdFx0aWYgKCB2YWx1ZSAhPT0gXCJcIiApIHtcblx0XHRcdFx0XHRcdGlmICggdmFsdWUgPT09IGV4aXN0aW5nVmFsdWUgKSB7XG5cdFx0XHRcdFx0XHRcdGpRdWVyeSggb3B0aW9ucy5uZXdJZCArIGlkICkudmFsKCBcIlwiICk7XG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRkYXRhLnNlbmQgPSB0cnVlO1xuXHRcdFx0XHRcdFx0XHRkYXRhLml0ZW1zWyBpZCBdID0gdmFsdWU7XG5cdFx0XHRcdFx0XHRcdGRhdGEuZXhpc3RpbmdJdGVtc1sgaWQgXSA9IGV4aXN0aW5nVmFsdWU7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdCk7XG5cblx0XHRcdFx0aWYgKCBkYXRhLnNlbmQgKSB7XG5cdFx0XHRcdFx0alF1ZXJ5LnBvc3QoIGFqYXh1cmwsIGRhdGEsIGluc3RhbmNlLmhhbmRsZVJlc3BvbnNlcyApO1xuXHRcdFx0XHR9XG5cdFx0XHR9LFxuXG5cdFx0XHRoYW5kbGVSZXNwb25zZTogZnVuY3Rpb24oIHJlc3BvbnNlLCBzdGF0dXMgKSB7XG5cdFx0XHRcdGlmICggc3RhdHVzICE9PSBcInN1Y2Nlc3NcIiApIHtcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblxuXHRcdFx0XHR2YXIgcmVzcCA9IHJlc3BvbnNlO1xuXHRcdFx0XHRpZiAoIHR5cGVvZiByZXNwID09PSBcInN0cmluZ1wiICkge1xuXHRcdFx0XHRcdHJlc3AgPSBKU09OLnBhcnNlKCByZXNwICk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAoIHJlc3AgaW5zdGFuY2VvZiBBcnJheSApIHtcblx0XHRcdFx0XHRqUXVlcnkuZWFjaCggcmVzcCwgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHRpbnN0YW5jZS5oYW5kbGVSZXNwb25zZSggdGhpcywgc3RhdHVzICk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdCk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0aWYgKCByZXNwLnN0YXR1cyA9PT0gXCJzdWNjZXNzXCIgKSB7XG5cdFx0XHRcdFx0XHR2YXIgbmV3VmFsdWUgPSByZXNwWyBcIm5ld19cIiArIGJ1bGtUeXBlIF07XG5cblx0XHRcdFx0XHRcdGpRdWVyeSggb3B0aW9ucy5leGlzdGluZ0lkICsgcmVzcC5wb3N0X2lkICkuaHRtbCggbmV3VmFsdWUucmVwbGFjZSggL1xcXFwoPyFcXFxcKS9nLCBcIlwiICkgKTtcblx0XHRcdFx0XHRcdGpRdWVyeSggb3B0aW9ucy5uZXdJZCArIHJlc3AucG9zdF9pZCApLnZhbCggXCJcIiApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSxcblxuXHRcdFx0aGFuZGxlUmVzcG9uc2VzOiBmdW5jdGlvbiggcmVzcG9uc2VzLCBzdGF0dXMgKSB7XG5cdFx0XHRcdHZhciByZXNwcyA9IGpRdWVyeS5wYXJzZUpTT04oIHJlc3BvbnNlcyApO1xuXHRcdFx0XHRqUXVlcnkuZWFjaCggcmVzcHMsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdGluc3RhbmNlLmhhbmRsZVJlc3BvbnNlKCB0aGlzLCBzdGF0dXMgKTtcblx0XHRcdFx0fVxuXHRcdFx0XHQpO1xuXHRcdFx0fSxcblxuXHRcdFx0c2V0RXZlbnRzOiBmdW5jdGlvbigpIHtcblx0XHRcdFx0Ly8gU2F2ZSBsaW5rLlxuXHRcdFx0XHRjdXJyZW50VGFibGUuZmluZCggXCIud3BzZW8tc2F2ZVwiICkuY2xpY2soIGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHRcdFx0XHR2YXIgaWQgPSBqUXVlcnkoIHRoaXMgKS5kYXRhKCBcImlkXCIgKTtcblxuXHRcdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdFx0aW5zdGFuY2Uuc3VibWl0TmV3KCBpZCwgdGhpcyApO1xuXHRcdFx0XHR9XG5cdFx0XHRcdCk7XG5cblx0XHRcdFx0Ly8gU2F2ZSBhbGwgbGluay5cblx0XHRcdFx0Y3VycmVudFRhYmxlLmZpbmQoIFwiLndwc2VvLXNhdmUtYWxsXCIgKS5jbGljayggaW5zdGFuY2Uuc3VibWl0QWxsICk7XG5cblx0XHRcdFx0Ly8gU2F2ZSB0aXRsZSBhbmQgbWV0YSBkZXNjcmlwdGlvbiB3aGVuIHByZXNzaW5nIEVudGVyIG9uIHJlc3BlY3RpdmUgZmllbGQgYW5kIHRleHRhcmVhLlxuXHRcdFx0XHRjdXJyZW50VGFibGUuZmluZCggb3B0aW9ucy5uZXdDbGFzcyApLmtleWRvd24oXG5cdFx0XHRcdFx0ZnVuY3Rpb24oIGV2ICkge1xuXHRcdFx0XHRcdFx0aWYgKCBldi53aGljaCA9PT0gMTMgKSB7XG5cdFx0XHRcdFx0XHRcdGV2LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdFx0XHRcdHZhciBpZCA9IGpRdWVyeSggdGhpcyApLmRhdGEoIFwiaWRcIiApO1xuXHRcdFx0XHRcdFx0XHRpbnN0YW5jZS5zdWJtaXROZXcoIGlkLCB0aGlzICk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHQpO1xuXHRcdFx0fSxcblx0XHR9O1xuXG5cdFx0cmV0dXJuIGluc3RhbmNlO1xuXHR9O1xuXHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmVcblx0d2luZG93LmJ1bGtfZWRpdG9yID0gYnVsa0VkaXRvcjtcblxuXHRqUXVlcnkoIGRvY3VtZW50ICkucmVhZHkoIGZ1bmN0aW9uKCkge1xuXHRcdHZhciBwYXJlbnRUYWJsZXMgPSBqUXVlcnkoICd0YWJsZVtjbGFzcyo9XCJ3cHNlb19idWxrXCJdJyApO1xuXHRcdHBhcmVudFRhYmxlcy5lYWNoKFxuXHRcdFx0XHRmdW5jdGlvbiggbnVtYmVyLCBwYXJlbnRUYWJsZSApIHtcblx0XHRcdFx0XHR2YXIgY3VycmVudFRhYmxlID0galF1ZXJ5KCBwYXJlbnRUYWJsZSApO1xuXHRcdFx0XHRcdHZhciBidWxrRWRpdCA9IGJ1bGtFZGl0b3IoIGN1cnJlbnRUYWJsZSApO1xuXG5cdFx0XHRcdFx0YnVsa0VkaXQuc2V0RXZlbnRzKCk7XG5cdFx0XHRcdH1cblx0XHRcdCk7XG5cdH1cblx0KTtcbn0oKSApO1xuIl19
