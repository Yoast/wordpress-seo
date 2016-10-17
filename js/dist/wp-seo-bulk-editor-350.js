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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9ncnVudC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqc1xcc3JjXFx3cC1zZW8tYnVsay1lZGl0b3IuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0UsYUFBVztBQUNaOztBQUNBLEtBQUksY0FBYyxTQUFkLFdBQWMsQ0FBVSxhQUFWLEVBQTBCO0FBQzNDLE1BQUksWUFBWSxjQUFjLElBQWQsQ0FBb0Isb0JBQXBCLEVBQTJDLEtBQTNDLEdBQW1ELElBQW5ELENBQXlELE9BQXpELENBQWhCO0FBQ0EsTUFBSSxTQUFTLE1BQU0sU0FBTixHQUFrQixHQUEvQjtBQUNBLE1BQUksY0FBYyxPQUFPLE9BQVAsQ0FBZ0IsS0FBaEIsRUFBdUIsVUFBdkIsQ0FBbEI7QUFDQSxNQUFJLGVBQWUsY0FBYyxJQUFkLENBQW9CLDRCQUFwQixFQUFtRCxLQUFuRCxHQUEyRCxJQUEzRCxHQUFrRSxPQUFsRSxDQUEyRSxXQUEzRSxFQUF3RixFQUF4RixDQUFuQjs7QUFFQSxNQUFJLGNBQWMsVUFBVSxPQUFWLENBQW1CLE9BQW5CLEVBQTRCLFFBQTVCLENBQWxCO0FBQ0EsTUFBSSxrQkFBa0Isb0JBQW9CLGNBQWMsSUFBZCxDQUFvQixPQUFwQixFQUE4QixLQUE5QixDQUFxQyxhQUFyQyxFQUFzRCxDQUF0RCxDQUExQzs7QUFFQSxNQUFJLFlBQVksWUFBWSxPQUFaLENBQXFCLGFBQXJCLEVBQW9DLEVBQXBDLENBQWhCOztBQUVBLE1BQUksVUFBVTtBQUNiLGNBQVcsTUFBTSxTQURKO0FBRWIsV0FBUSxNQUZLO0FBR2IsZ0JBQWE7QUFIQSxHQUFkOztBQU1BLE1BQUksV0FBVzs7QUFFZCxlQUFZLG9CQUFVLEVBQVYsRUFBZTtBQUMxQixRQUFJLGFBQWEsUUFBUSxNQUFSLEdBQWlCLEVBQWxDO0FBQ0EsUUFBSSxrQkFBa0IsUUFBUSxXQUFSLEdBQXNCLEVBQTVDOztBQUVBLFFBQUksU0FBSjtBQUNBLFFBQUssT0FBUSxRQUFRLE1BQVIsR0FBaUIsRUFBekIsRUFBOEIsSUFBOUIsQ0FBb0MsTUFBcEMsTUFBaUQsWUFBdEQsRUFBcUU7QUFDcEUsaUJBQVksT0FBUSxVQUFSLEVBQXFCLElBQXJCLENBQTJCLFdBQTNCLEVBQXlDLElBQXpDLEVBQVo7QUFDQSxLQUZELE1BRU87QUFDTixpQkFBWSxPQUFRLFVBQVIsRUFBcUIsR0FBckIsRUFBWjtBQUNBOztBQUVELFFBQUksZ0JBQWdCLE9BQVEsZUFBUixFQUEwQixJQUExQixFQUFwQjs7QUFFQSxRQUFLLGNBQWMsYUFBbkIsRUFBbUM7QUFDbEMsWUFBUSxVQUFSLEVBQXFCLEdBQXJCLENBQTBCLEVBQTFCO0FBQ0EsS0FGRCxNQUVPO0FBQ047QUFDQSxTQUFPLGNBQWMsRUFBaEIsSUFBd0IsQ0FBRSxPQUFPLE9BQVAsQ0FBZ0Isa0RBQWtELFlBQWxELEdBQWlFLEdBQWpGLENBQS9CLEVBQXdIO0FBQ3ZIO0FBQ0EsYUFBUSxVQUFSLEVBQXFCLEdBQXJCLENBQTBCLEVBQTFCO0FBQ0E7QUFDQTs7QUFFRCxTQUFJLE9BQU87QUFDVixjQUFRLFdBREU7QUFFVixtQkFBYSx1QkFGSDtBQUdWLHFCQUFlLEVBSEw7QUFJVixpQkFBVyxTQUpEO0FBS1Ysc0JBQWdCO0FBTE4sTUFBWDs7QUFRQSxZQUFPLElBQVAsQ0FBYSxPQUFiLEVBQXNCLElBQXRCLEVBQTRCLFNBQVMsZUFBckM7QUFDQTtBQUNELElBbkNhOztBQXFDZCxlQUFZLG9CQUFVLEVBQVYsRUFBZTtBQUMxQixPQUFHLGNBQUg7O0FBRUEsUUFBSSxPQUFPO0FBQ1YsYUFBUSxlQURFO0FBRVYsa0JBQWE7QUFGSCxLQUFYOztBQUtBLFNBQUssSUFBTCxHQUFZLEtBQVo7QUFDQSxTQUFLLEtBQUwsR0FBYSxFQUFiO0FBQ0EsU0FBSyxjQUFMLEdBQXNCLEVBQXRCOztBQUVBLFdBQVEsUUFBUSxTQUFoQixFQUE0QixJQUE1QixDQUFrQyxZQUFXO0FBQzVDLFNBQUksS0FBSyxPQUFRLElBQVIsRUFBZSxJQUFmLENBQXFCLElBQXJCLENBQVQ7QUFDQSxTQUFJLFFBQVEsT0FBUSxJQUFSLEVBQWUsR0FBZixFQUFaO0FBQ0EsU0FBSSxpQkFBaUIsT0FBUSxRQUFRLFdBQVIsR0FBc0IsRUFBOUIsRUFBbUMsSUFBbkMsRUFBckI7O0FBRUEsU0FBSyxVQUFVLEVBQWYsRUFBb0I7QUFDbkIsVUFBSyxVQUFVLGNBQWYsRUFBZ0M7QUFDL0IsY0FBUSxRQUFRLE1BQVIsR0FBaUIsRUFBekIsRUFBOEIsR0FBOUIsQ0FBbUMsRUFBbkM7QUFDQSxPQUZELE1BRU87QUFDTixZQUFLLElBQUwsR0FBWSxJQUFaO0FBQ0EsWUFBSyxLQUFMLENBQVksRUFBWixJQUFtQixLQUFuQjtBQUNBLFlBQUssY0FBTCxDQUFxQixFQUFyQixJQUE0QixjQUE1QjtBQUNBO0FBQ0Q7QUFDRCxLQWREOztBQWlCQSxRQUFLLEtBQUssSUFBVixFQUFpQjtBQUNoQixZQUFPLElBQVAsQ0FBYSxPQUFiLEVBQXNCLElBQXRCLEVBQTRCLFNBQVMsZ0JBQXJDO0FBQ0E7QUFDRCxJQXJFYTs7QUF1RWQsb0JBQWlCLHlCQUFVLFFBQVYsRUFBb0IsTUFBcEIsRUFBNkI7QUFDN0MsUUFBSyxXQUFXLFNBQWhCLEVBQTRCO0FBQzNCO0FBQ0E7O0FBRUQsUUFBSSxPQUFPLFFBQVg7QUFDQSxRQUFLLE9BQU8sSUFBUCxLQUFnQixRQUFyQixFQUFnQztBQUMvQixZQUFPLEtBQUssS0FBTCxDQUFZLElBQVosQ0FBUDtBQUNBOztBQUVELFFBQUssZ0JBQWdCLEtBQXJCLEVBQTZCO0FBQzVCLFlBQU8sSUFBUCxDQUFhLElBQWIsRUFBbUIsWUFBVztBQUM3QixlQUFTLGVBQVQsQ0FBMEIsSUFBMUIsRUFBZ0MsTUFBaEM7QUFDQSxNQUZEO0FBSUEsS0FMRCxNQUtPO0FBQ04sU0FBSyxLQUFLLE1BQUwsS0FBZ0IsU0FBckIsRUFBaUM7QUFDaEMsVUFBSSxZQUFZLEtBQU0sU0FBUyxTQUFmLENBQWhCOztBQUVBLGFBQVEsUUFBUSxXQUFSLEdBQXNCLEtBQUssT0FBbkMsRUFBNkMsSUFBN0MsQ0FBbUQsVUFBVSxPQUFWLENBQW1CLFdBQW5CLEVBQWdDLEVBQWhDLENBQW5EO0FBQ0EsYUFBUSxRQUFRLE1BQVIsR0FBaUIsS0FBSyxPQUE5QixFQUF3QyxHQUF4QyxDQUE2QyxFQUE3QztBQUNBO0FBQ0Q7QUFDRCxJQTlGYTs7QUFnR2QscUJBQWtCLDBCQUFVLFNBQVYsRUFBcUIsTUFBckIsRUFBOEI7QUFDL0MsUUFBSSxRQUFRLE9BQU8sU0FBUCxDQUFrQixTQUFsQixDQUFaO0FBQ0EsV0FBTyxJQUFQLENBQWEsS0FBYixFQUFvQixZQUFXO0FBQzlCLGNBQVMsZUFBVCxDQUEwQixJQUExQixFQUFnQyxNQUFoQztBQUNBLEtBRkQ7QUFJQSxJQXRHYTs7QUF3R2QsZUFBWSxzQkFBVztBQUN0QjtBQUNBLGtCQUFjLElBQWQsQ0FBb0IsYUFBcEIsRUFBb0MsS0FBcEMsQ0FBMkMsVUFBVSxLQUFWLEVBQWtCO0FBQzVELFNBQUksS0FBSyxPQUFRLElBQVIsRUFBZSxJQUFmLENBQXFCLElBQXJCLENBQVQ7O0FBRUEsV0FBTSxjQUFOO0FBQ0EsY0FBUyxVQUFULENBQXFCLEVBQXJCLEVBQXlCLElBQXpCO0FBQ0EsS0FMRDs7QUFRQTtBQUNBLGtCQUFjLElBQWQsQ0FBb0IsaUJBQXBCLEVBQXdDLEtBQXhDLENBQStDLFNBQVMsVUFBeEQ7O0FBRUE7QUFDQSxrQkFBYyxJQUFkLENBQW9CLFFBQVEsU0FBNUIsRUFBd0MsT0FBeEMsQ0FDQyxVQUFVLEVBQVYsRUFBZTtBQUNkLFNBQUssR0FBRyxLQUFILEtBQWEsRUFBbEIsRUFBdUI7QUFDdEIsU0FBRyxjQUFIO0FBQ0EsVUFBSSxLQUFLLE9BQVEsSUFBUixFQUFlLElBQWYsQ0FBcUIsSUFBckIsQ0FBVDtBQUNBLGVBQVMsVUFBVCxDQUFxQixFQUFyQixFQUF5QixJQUF6QjtBQUNBO0FBQ0QsS0FQRjtBQVNBO0FBL0hhLEdBQWY7O0FBa0lBLFNBQU8sUUFBUDtBQUNBLEVBcEpEO0FBcUpBLFFBQU8sV0FBUCxHQUFxQixXQUFyQjs7QUFFQSxRQUFRLFFBQVIsRUFBbUIsS0FBbkIsQ0FBMEIsWUFBVztBQUNwQyxNQUFJLGdCQUFnQixPQUFRLDRCQUFSLENBQXBCO0FBQ0EsZ0JBQWMsSUFBZCxDQUNFLFVBQVUsTUFBVixFQUFrQixZQUFsQixFQUFpQztBQUNoQyxPQUFJLGdCQUFnQixPQUFRLFlBQVIsQ0FBcEI7QUFDQSxPQUFJLFlBQVksWUFBYSxhQUFiLENBQWhCOztBQUVBLGFBQVUsVUFBVjtBQUNBLEdBTkg7QUFRQSxFQVZEO0FBWUEsQ0FyS0MsR0FBRiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKiBnbG9iYWwgYWpheHVybCAqL1xyXG4vKiBnbG9iYWwgSlNPTiAqL1xyXG4vKiBnbG9iYWwgd3BzZW9fYnVsa19lZGl0b3Jfbm9uY2UgKi9cclxuLyoganNoaW50IC1XMDk3ICovXHJcbiggZnVuY3Rpb24oKSB7XHJcblx0XCJ1c2Ugc3RyaWN0XCI7XHJcblx0dmFyIGJ1bGtfZWRpdG9yID0gZnVuY3Rpb24oIGN1cnJlbnRfdGFibGUgKSB7XHJcblx0XHR2YXIgbmV3X2NsYXNzID0gY3VycmVudF90YWJsZS5maW5kKCBcIltjbGFzc149d3BzZW8tbmV3XVwiICkuZmlyc3QoKS5hdHRyKCBcImNsYXNzXCIgKTtcclxuXHRcdHZhciBuZXdfaWQgPSBcIiNcIiArIG5ld19jbGFzcyArIFwiLVwiO1xyXG5cdFx0dmFyIGV4aXN0aW5nX2lkID0gbmV3X2lkLnJlcGxhY2UoIFwibmV3XCIsIFwiZXhpc3RpbmdcIiApO1xyXG5cdFx0dmFyIGNvbHVtbl92YWx1ZSA9IGN1cnJlbnRfdGFibGUuZmluZCggXCJ0aFtpZF49Y29sX2V4aXN0aW5nX3lvYXN0XVwiICkuZmlyc3QoKS50ZXh0KCkucmVwbGFjZSggXCJFeGlzdGluZyBcIiwgXCJcIiApO1xyXG5cclxuXHRcdHZhciBzYXZlX21ldGhvZCA9IG5ld19jbGFzcy5yZXBsYWNlKCBcIi1uZXctXCIsIFwiX3NhdmVfXCIgKTtcclxuXHRcdHZhciBzYXZlX2FsbF9tZXRob2QgPSBcIndwc2VvX3NhdmVfYWxsX1wiICsgY3VycmVudF90YWJsZS5hdHRyKCBcImNsYXNzXCIgKS5zcGxpdCggXCJ3cHNlb19idWxrX1wiIClbIDEgXTtcclxuXHJcblx0XHR2YXIgYnVsa190eXBlID0gc2F2ZV9tZXRob2QucmVwbGFjZSggXCJ3cHNlb19zYXZlX1wiLCBcIlwiICk7XHJcblxyXG5cdFx0dmFyIG9wdGlvbnMgPSB7XHJcblx0XHRcdG5ld19jbGFzczogXCIuXCIgKyBuZXdfY2xhc3MsXHJcblx0XHRcdG5ld19pZDogbmV3X2lkLFxyXG5cdFx0XHRleGlzdGluZ19pZDogZXhpc3RpbmdfaWQsXHJcblx0XHR9O1xyXG5cclxuXHRcdHZhciBpbnN0YW5jZSA9IHtcclxuXHJcblx0XHRcdHN1Ym1pdF9uZXc6IGZ1bmN0aW9uKCBpZCApIHtcclxuXHRcdFx0XHR2YXIgbmV3X3RhcmdldCA9IG9wdGlvbnMubmV3X2lkICsgaWQ7XHJcblx0XHRcdFx0dmFyIGV4aXN0aW5nX3RhcmdldCA9IG9wdGlvbnMuZXhpc3RpbmdfaWQgKyBpZDtcclxuXHJcblx0XHRcdFx0dmFyIG5ld192YWx1ZTtcclxuXHRcdFx0XHRpZiAoIGpRdWVyeSggb3B0aW9ucy5uZXdfaWQgKyBpZCApLnByb3AoIFwidHlwZVwiICkgPT09IFwic2VsZWN0LW9uZVwiICkge1xyXG5cdFx0XHRcdFx0bmV3X3ZhbHVlID0galF1ZXJ5KCBuZXdfdGFyZ2V0ICkuZmluZCggXCI6c2VsZWN0ZWRcIiApLnRleHQoKTtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0bmV3X3ZhbHVlID0galF1ZXJ5KCBuZXdfdGFyZ2V0ICkudmFsKCk7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHR2YXIgY3VycmVudF92YWx1ZSA9IGpRdWVyeSggZXhpc3RpbmdfdGFyZ2V0ICkuaHRtbCgpO1xyXG5cclxuXHRcdFx0XHRpZiAoIG5ld192YWx1ZSA9PT0gY3VycmVudF92YWx1ZSApIHtcclxuXHRcdFx0XHRcdGpRdWVyeSggbmV3X3RhcmdldCApLnZhbCggXCJcIiApO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHQvKiBlc2xpbnQtZGlzYWJsZSBuby1hbGVydCAqL1xyXG5cdFx0XHRcdFx0aWYgKCAoIG5ld192YWx1ZSA9PT0gXCJcIiApICYmICEgd2luZG93LmNvbmZpcm0oIFwiQXJlIHlvdSBzdXJlIHlvdSB3YW50IHRvIHJlbW92ZSB0aGUgZXhpc3RpbmcgXCIgKyBjb2x1bW5fdmFsdWUgKyBcIj9cIiApICkge1xyXG5cdFx0XHRcdFx0XHQvKiBlc2xpbnQtZW5hYmxlIG5vLWFsZXJ0ICovXHJcblx0XHRcdFx0XHRcdGpRdWVyeSggbmV3X3RhcmdldCApLnZhbCggXCJcIiApO1xyXG5cdFx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0dmFyIGRhdGEgPSB7XHJcblx0XHRcdFx0XHRcdGFjdGlvbjogc2F2ZV9tZXRob2QsXHJcblx0XHRcdFx0XHRcdF9hamF4X25vbmNlOiB3cHNlb19idWxrX2VkaXRvcl9ub25jZSxcclxuXHRcdFx0XHRcdFx0d3BzZW9fcG9zdF9pZDogaWQsXHJcblx0XHRcdFx0XHRcdG5ld192YWx1ZTogbmV3X3ZhbHVlLFxyXG5cdFx0XHRcdFx0XHRleGlzdGluZ192YWx1ZTogY3VycmVudF92YWx1ZSxcclxuXHRcdFx0XHRcdH07XHJcblxyXG5cdFx0XHRcdFx0alF1ZXJ5LnBvc3QoIGFqYXh1cmwsIGRhdGEsIGluc3RhbmNlLmhhbmRsZV9yZXNwb25zZSApO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSxcclxuXHJcblx0XHRcdHN1Ym1pdF9hbGw6IGZ1bmN0aW9uKCBldiApIHtcclxuXHRcdFx0XHRldi5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuXHRcdFx0XHR2YXIgZGF0YSA9IHtcclxuXHRcdFx0XHRcdGFjdGlvbjogc2F2ZV9hbGxfbWV0aG9kLFxyXG5cdFx0XHRcdFx0X2FqYXhfbm9uY2U6IHdwc2VvX2J1bGtfZWRpdG9yX25vbmNlLFxyXG5cdFx0XHRcdH07XHJcblxyXG5cdFx0XHRcdGRhdGEuc2VuZCA9IGZhbHNlO1xyXG5cdFx0XHRcdGRhdGEuaXRlbXMgPSB7fTtcclxuXHRcdFx0XHRkYXRhLmV4aXN0aW5nX2l0ZW1zID0ge307XHJcblxyXG5cdFx0XHRcdGpRdWVyeSggb3B0aW9ucy5uZXdfY2xhc3MgKS5lYWNoKCBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRcdHZhciBpZCA9IGpRdWVyeSggdGhpcyApLmRhdGEoIFwiaWRcIiApO1xyXG5cdFx0XHRcdFx0dmFyIHZhbHVlID0galF1ZXJ5KCB0aGlzICkudmFsKCk7XHJcblx0XHRcdFx0XHR2YXIgZXhpc3RpbmdfdmFsdWUgPSBqUXVlcnkoIG9wdGlvbnMuZXhpc3RpbmdfaWQgKyBpZCApLmh0bWwoKTtcclxuXHJcblx0XHRcdFx0XHRpZiAoIHZhbHVlICE9PSBcIlwiICkge1xyXG5cdFx0XHRcdFx0XHRpZiAoIHZhbHVlID09PSBleGlzdGluZ192YWx1ZSApIHtcclxuXHRcdFx0XHRcdFx0XHRqUXVlcnkoIG9wdGlvbnMubmV3X2lkICsgaWQgKS52YWwoIFwiXCIgKTtcclxuXHRcdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0XHRkYXRhLnNlbmQgPSB0cnVlO1xyXG5cdFx0XHRcdFx0XHRcdGRhdGEuaXRlbXNbIGlkIF0gPSB2YWx1ZTtcclxuXHRcdFx0XHRcdFx0XHRkYXRhLmV4aXN0aW5nX2l0ZW1zWyBpZCBdID0gZXhpc3RpbmdfdmFsdWU7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0KTtcclxuXHJcblx0XHRcdFx0aWYgKCBkYXRhLnNlbmQgKSB7XHJcblx0XHRcdFx0XHRqUXVlcnkucG9zdCggYWpheHVybCwgZGF0YSwgaW5zdGFuY2UuaGFuZGxlX3Jlc3BvbnNlcyApO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSxcclxuXHJcblx0XHRcdGhhbmRsZV9yZXNwb25zZTogZnVuY3Rpb24oIHJlc3BvbnNlLCBzdGF0dXMgKSB7XHJcblx0XHRcdFx0aWYgKCBzdGF0dXMgIT09IFwic3VjY2Vzc1wiICkge1xyXG5cdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0dmFyIHJlc3AgPSByZXNwb25zZTtcclxuXHRcdFx0XHRpZiAoIHR5cGVvZiByZXNwID09PSBcInN0cmluZ1wiICkge1xyXG5cdFx0XHRcdFx0cmVzcCA9IEpTT04ucGFyc2UoIHJlc3AgKTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdGlmICggcmVzcCBpbnN0YW5jZW9mIEFycmF5ICkge1xyXG5cdFx0XHRcdFx0alF1ZXJ5LmVhY2goIHJlc3AsIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdFx0XHRpbnN0YW5jZS5oYW5kbGVfcmVzcG9uc2UoIHRoaXMsIHN0YXR1cyApO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0KTtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0aWYgKCByZXNwLnN0YXR1cyA9PT0gXCJzdWNjZXNzXCIgKSB7XHJcblx0XHRcdFx0XHRcdHZhciBuZXdfdmFsdWUgPSByZXNwWyBcIm5ld19cIiArIGJ1bGtfdHlwZSBdO1xyXG5cclxuXHRcdFx0XHRcdFx0alF1ZXJ5KCBvcHRpb25zLmV4aXN0aW5nX2lkICsgcmVzcC5wb3N0X2lkICkuaHRtbCggbmV3X3ZhbHVlLnJlcGxhY2UoIC9cXFxcKD8hXFxcXCkvZywgXCJcIiApICk7XHJcblx0XHRcdFx0XHRcdGpRdWVyeSggb3B0aW9ucy5uZXdfaWQgKyByZXNwLnBvc3RfaWQgKS52YWwoIFwiXCIgKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH0sXHJcblxyXG5cdFx0XHRoYW5kbGVfcmVzcG9uc2VzOiBmdW5jdGlvbiggcmVzcG9uc2VzLCBzdGF0dXMgKSB7XHJcblx0XHRcdFx0dmFyIHJlc3BzID0galF1ZXJ5LnBhcnNlSlNPTiggcmVzcG9uc2VzICk7XHJcblx0XHRcdFx0alF1ZXJ5LmVhY2goIHJlc3BzLCBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRcdGluc3RhbmNlLmhhbmRsZV9yZXNwb25zZSggdGhpcywgc3RhdHVzICk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdCk7XHJcblx0XHRcdH0sXHJcblxyXG5cdFx0XHRzZXRfZXZlbnRzOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHQvLyBTYXZlIGxpbmsuXHJcblx0XHRcdFx0Y3VycmVudF90YWJsZS5maW5kKCBcIi53cHNlby1zYXZlXCIgKS5jbGljayggZnVuY3Rpb24oIGV2ZW50ICkge1xyXG5cdFx0XHRcdFx0dmFyIGlkID0galF1ZXJ5KCB0aGlzICkuZGF0YSggXCJpZFwiICk7XHJcblxyXG5cdFx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuXHRcdFx0XHRcdGluc3RhbmNlLnN1Ym1pdF9uZXcoIGlkLCB0aGlzICk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdCk7XHJcblxyXG5cdFx0XHRcdC8vIFNhdmUgYWxsIGxpbmsuXHJcblx0XHRcdFx0Y3VycmVudF90YWJsZS5maW5kKCBcIi53cHNlby1zYXZlLWFsbFwiICkuY2xpY2soIGluc3RhbmNlLnN1Ym1pdF9hbGwgKTtcclxuXHJcblx0XHRcdFx0Ly8gU2F2ZSB0aXRsZSBhbmQgbWV0YSBkZXNjcmlwdGlvbiB3aGVuIHByZXNzaW5nIEVudGVyIG9uIHJlc3BlY3RpdmUgZmllbGQgYW5kIHRleHRhcmVhLlxyXG5cdFx0XHRcdGN1cnJlbnRfdGFibGUuZmluZCggb3B0aW9ucy5uZXdfY2xhc3MgKS5rZXlkb3duKFxyXG5cdFx0XHRcdFx0ZnVuY3Rpb24oIGV2ICkge1xyXG5cdFx0XHRcdFx0XHRpZiAoIGV2LndoaWNoID09PSAxMyApIHtcclxuXHRcdFx0XHRcdFx0XHRldi5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdFx0XHRcdFx0XHRcdHZhciBpZCA9IGpRdWVyeSggdGhpcyApLmRhdGEoIFwiaWRcIiApO1xyXG5cdFx0XHRcdFx0XHRcdGluc3RhbmNlLnN1Ym1pdF9uZXcoIGlkLCB0aGlzICk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHQpO1xyXG5cdFx0XHR9LFxyXG5cdFx0fTtcclxuXHJcblx0XHRyZXR1cm4gaW5zdGFuY2U7XHJcblx0fTtcclxuXHR3aW5kb3cuYnVsa19lZGl0b3IgPSBidWxrX2VkaXRvcjtcclxuXHJcblx0alF1ZXJ5KCBkb2N1bWVudCApLnJlYWR5KCBmdW5jdGlvbigpIHtcclxuXHRcdHZhciBwYXJlbnRfdGFibGVzID0galF1ZXJ5KCAndGFibGVbY2xhc3MqPVwid3BzZW9fYnVsa1wiXScgKTtcclxuXHRcdHBhcmVudF90YWJsZXMuZWFjaChcclxuXHRcdFx0XHRmdW5jdGlvbiggbnVtYmVyLCBwYXJlbnRfdGFibGUgKSB7XHJcblx0XHRcdFx0XHR2YXIgY3VycmVudF90YWJsZSA9IGpRdWVyeSggcGFyZW50X3RhYmxlICk7XHJcblx0XHRcdFx0XHR2YXIgYnVsa19lZGl0ID0gYnVsa19lZGl0b3IoIGN1cnJlbnRfdGFibGUgKTtcclxuXHJcblx0XHRcdFx0XHRidWxrX2VkaXQuc2V0X2V2ZW50cygpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0KTtcclxuXHR9XHJcblx0KTtcclxufSgpICk7XHJcbiJdfQ==
