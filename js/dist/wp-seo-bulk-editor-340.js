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

},{}]},{},[1]);
