(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

/* jshint -W097 */
/* jshint -W098 */
/* jshint -W107 */
/* global ajaxurl, alert, wpseo_premium_strings, wp, _, wpseoSelect2Locale */

(function ($) {
	var ALLOW_EMPTY_TARGET = [410, 451];

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
  * @param {element} form The redirect form.
  * @constructor
  */
	var RedirectForm = function RedirectForm(form) {
		this.form = form;
	};

	/**
  * Returns the origin field
  *
  * @returns {element} The field for the redirect origin.
  */
	RedirectForm.prototype.getOriginField = function () {
		return this.form.find("input[name=wpseo_redirects_origin]");
	};

	/**
  * Returns the target field
  *
  * @returns {element} The field for the redirect target.
  */
	RedirectForm.prototype.getTargetField = function () {
		return this.form.find("input[name=wpseo_redirects_target]");
	};

	/**
  * Returns the type field
  *
  * @returns {element} The field for redirect type.
  */
	RedirectForm.prototype.getTypeField = function () {
		return this.form.find("select[name=wpseo_redirects_type]");
	};

	/**
  * Clears the form error message.
  *
  * @returns {void}
  */
	RedirectForm.prototype.clearErrorMessage = function () {
		this.form.find(".wpseo_redirect_form .form_error").remove();
	};

	/**
  * Sets a form error message.
  *
  * @param {string} errorMessage The error message to set.
  *
  * @returns {void}
  */
	RedirectForm.prototype.setErrorMessage = function (errorMessage) {
		this.form.find(".wpseo_redirect_form").prepend("<div class=\"form_error error\"><p>" + errorMessage + "</p></div>");
	};

	/**
  * Removing the row errors
  *
  * @returns {void}
  */
	RedirectForm.prototype.removeRowHighlights = function () {
		this.form.find(".redirect_form_row").removeClass("field_error");
	};

	/**
  * Highlighting the row errors.
  *
  * @param {array} fieldsToHighlight The fields to highlight.
  *
  * @returns {void}
  */
	RedirectForm.prototype.highLightRowErrors = function (fieldsToHighlight) {
		for (var i = 0; i < fieldsToHighlight.length; i++) {
			switch (fieldsToHighlight[i]) {
				case "origin":
					this.highlightRow(this.getOriginField());
					break;
				case "target":
					this.highlightRow(this.getTargetField());
					break;
				case "type":
					this.highlightRow(this.getTypeField());
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
	RedirectForm.prototype.highlightRow = function (errorField) {
		jQuery(errorField).closest("div.redirect_form_row").addClass("field_error");
	};

	/**
  * Clientside validator for the redirect
  *
  * @param {RedirectForm} form Form object representing the form.
  * @param {string} type       The redirect type.
  *
  * @returns {void}
  */
	var ValidateRedirect = function ValidateRedirect(form, type) {
		this.form = form;
		this.type = type;
		this.validationError = "";
	};

	/**
  * Validates for the form fields
  *
  * @returns {boolean} True when validation has been successful.
  */
	ValidateRedirect.prototype.validate = function () {
		this.form.clearErrorMessage();

		this.form.removeRowHighlights();

		if (this.runValidation(this.form.getOriginField(), this.form.getTargetField(), this.form.getTypeField()) === false) {
			this.addValidationError(this.validationError);

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
	ValidateRedirect.prototype.runValidation = function (originField, targetField, typeField) {
		// Check old URL.
		if ("" === originField.val()) {
			this.form.highlightRow(originField);

			if ("plain" === this.type) {
				return this.setError(wpseo_premium_strings.error_old_url);
			}

			return this.setError(wpseo_premium_strings.error_regex);
		}

		// Only when the redirect type is not deleted.
		if (jQuery.inArray(parseInt(typeField.val(), 10), ALLOW_EMPTY_TARGET) === -1) {
			// Check new URL.
			if ("" === targetField.val()) {
				this.form.highlightRow(targetField);
				return this.setError(wpseo_premium_strings.error_new_url);
			}

			// Check if both fields aren't the same.
			if (targetField.val() === originField.val()) {
				this.form.highlightRow(targetField);
				return this.setError(wpseo_premium_strings.error_circular);
			}
		}

		// Check the redirect type.
		if ("" === typeField.val()) {
			this.form.highlightRow(typeField);
			return this.setError(wpseo_premium_strings.error_new_type);
		}

		return true;
	};

	/**
  * Sets the validation error and return false.
  *
  * @param {string} error The error to set.
  * @returns {boolean} False, because there is an error.
  */
	ValidateRedirect.prototype.setError = function (error) {
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
	ValidateRedirect.prototype.addValidationError = function (error, fields) {
		this.form.setErrorMessage(error);

		if (fields !== undefined) {
			this.form.highLightRowErrors(fields);
		}
	};

	/**
  * Returns the values on the quick edit form
  *
  * @returns {{origin: (string|*), target: (string|*), type: (string|*)}} Object with the form values.
  */
	ValidateRedirect.prototype.getFormValues = function () {
		var values = {
			origin: this.form.getOriginField().val().toString(),
			target: this.form.getTargetField().val().toString(),
			type: this.form.getTypeField().val().toString()
		};

		// When the redirect type is deleted or unavailable, the target can be emptied.
		if (jQuery.inArray(parseInt(values.type, 10), ALLOW_EMPTY_TARGET) > -1) {
			values.target = "";
		}

		return values;
	};

	/**
  * The quick edit prototype for handling the quick edit on form rows.
  * @constructor
  */
	var RedirectQuickEdit = function RedirectQuickEdit() {
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
	RedirectQuickEdit.prototype.setup = function (row, rowCells) {
		this.row = row;
		this.quickEditRow = $(templateQuickEdit({
			origin: _.unescape(rowCells.origin.html()),
			target: _.unescape(rowCells.target.html()),
			type: parseInt(rowCells.type.html(), 10),
			suffix: $("#the-list").find("tr").index(row)
		}));
	};

	/**
  * Returns the original row element
  *
  * @returns {element} The row object.
  */
	RedirectQuickEdit.prototype.getRow = function () {
		return this.row;
	};

	/**
  * Returns the original row element
  *
  * @returns {element} The form object.
  */
	RedirectQuickEdit.prototype.getForm = function () {
		return this.quickEditRow;
	};

	/**
  * Shows the quick edit form and hides the redirect row.
  *
  * @returns {void}
  */
	RedirectQuickEdit.prototype.show = function () {
		this.row.addClass("hidden");
		this.quickEditRow.insertAfter(this.row).show(400, function () {
			$(this).find(":input").first().focus();
		});
	};

	/**
  * Hides the quick edit form and show the redirect row.
  *
  * @returns {void}
  */
	RedirectQuickEdit.prototype.remove = function () {
		this.row.removeClass("hidden");
		this.quickEditRow.remove();
	};

	// Instantiate the quick edit form.
	var redirectsQuickEdit = new RedirectQuickEdit();

	// Extend the jQuery UI dialog widget for our needs.
	$.widget("ui.dialog", $.ui.dialog, {
		// Extend the `_createOverlay` function.
		_createOverlay: function _createOverlay() {
			this._super();
			// If the modal option is true, add a click event on the overlay.
			if (this.options.modal) {
				this._on(this.overlay, {
					click: function click(event) {
						this.close(event);
					}
				});
			}
		}
	});

	/**
  * Extending the elements with a wpseo_redirects object
  *
  * @param {string} argType The redirect table.
  *
  * @returns {void}
  */
	$.fn.wpseo_redirects = function (argType) {
		var that = this;
		var type = argType.replace("table-", "");
		var ignore = false;

		var lastAction;

		// The element focus keyboard should be moved back to.
		var returnFocusToEl = null;

		/**
   * Resets the ignore and lastAction.
   *
   * @returns {void}
   */
		var resetIgnore = function resetIgnore() {
			ignore = false;
			lastAction = null;
		};

		this.getButtons = function (type) {
			if (type === "default") {
				return [{
					text: wpseo_premium_strings.button_ok,
					click: function click() {
						$(this).dialog("close");
					}
				}];
			}

			return [{
				text: wpseo_premium_strings.button_cancel,
				click: function click() {
					resetIgnore();
					$(this).dialog("close");
				}
			}, {
				text: wpseo_premium_strings.button_save_anyway,
				"class": "button-primary",
				click: function click() {
					ignore = true;

					// The value of last action will be the button pressed to save the redirect.
					lastAction();

					$(this).dialog("close");

					resetIgnore();
				}
			}];
		};

		/**
   * Returns a mapped object with the row column elements
   *
   * @param {Object} row The row object.
   * @returns {{origin: *, target: *, type: *}} The values of the fields in the row.
   */
		this.rowCells = function (row) {
			var rowValues = row.find(".val");

			return {
				origin: rowValues.eq(TABLE_COLUMNS.ORIGIN),
				target: rowValues.eq(TABLE_COLUMNS.TARGET),
				type: rowValues.eq(TABLE_COLUMNS.TYPE)
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
		this.dialog = function (title, text, type) {
			if (type === undefined || type === "error") {
				type = "default";
			}

			var buttons = this.getButtons(type);

			$("#YoastRedirectDialogText").html(text);
			$("#YoastRedirectDialog").dialog({
				title: title,
				width: 500,
				draggable: false,
				resizable: false,
				position: {
					at: "center center",
					my: "center center",
					of: window
				},
				buttons: buttons,
				modal: true,
				close: function close() {
					returnFocusToEl.focus();
				}
			});
		};

		/**
   * Handle the response
   *
   * @param {object} successMessage The message that will be displayed on success.
   *
   * @returns {void}
   */
		this.openDialog = function (successMessage) {
			this.dialog(successMessage.title, successMessage.message);
		};

		/**
   * Sending post request
   *
   * @param {object}   data       The data to post.
   * @param {function} oncomplete Callback when request has been successful.
   *
   * @returns {void}
   */
		this.post = function (data, oncomplete) {
			$.post(ajaxurl, data, oncomplete, "json");
		};

		/**
   * Creating an edit row for editting a redirect.
   *
   * @param {object} row The row to edit.
   *
   * @returns {void}
   */
		this.editRow = function (row) {
			// Just show a dialog when there is already a quick edit form opened.
			if ($("#the-list").find("#inline-edit").length > 0) {
				this.dialog(wpseo_premium_strings.edit_redirect, wpseo_premium_strings.editing_redirect);

				return;
			}

			// Running the setup and show the quick edit form.
			redirectsQuickEdit.setup(row, this.rowCells(row));
			redirectsQuickEdit.show();

			new RedirectForm(redirectsQuickEdit.quickEditRow).getTypeField().trigger("change");
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
		this.createRedirectRow = function (oldUrl, newUrl, redirectType, redirectInfo) {
			var targetClasses = ["val"];

			if (!redirectInfo.isTargetRelative || "" === newUrl || "/" === newUrl) {
				targetClasses.push("remove-slashes");
			}

			if (redirectInfo.hasTrailingSlash) {
				targetClasses.push("has-trailing-slash");
			}

			var tr = $("<tr>").append($("<th>").addClass("check-column").attr("scope", "row").append($("<input>").attr("name", "wpseo_redirects_bulk_delete[]").attr("type", "checkbox").val(_.escape(oldUrl)))).append($("<td>").addClass("type column-type has-row-actions column-primary").append($("<div>").addClass("val type").html(_.escape(redirectType))).append($("<div>").addClass("row-actions").append($("<span>").addClass("edit").append($("<a>").attr({ href: "#", role: "button", "class": "redirect-edit" }).html(wpseo_premium_strings.editAction)).append(" | ")).append($("<span>").addClass("trash").append($("<a>").attr({ href: "#", role: "button", "class": "redirect-delete" }).html(wpseo_premium_strings.deleteAction))))).append($("<td>").addClass("column-old").append($("<div>").addClass("val").html(_.escape(oldUrl)))).append($("<td>").addClass("column-new").append($("<div>").addClass(targetClasses.join(" ")).html(_.escape(newUrl))));

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
		this.handleError = function (validateRedirect, error) {
			validateRedirect.addValidationError(error.message, error.fields);

			if (error.type === "warning") {
				that.dialog(wpseo_premium_strings.error_saving_redirect, error.message, error.type);
			}
		};

		/**
   * Adding the redirect
   *
   * @returns {boolean} True when redirect has been added successfully.
   */
		this.addRedirect = function () {
			// Do the validation.
			var redirectForm = new RedirectForm($(".wpseo-new-redirect-form"));
			var validateRedirect = new ValidateRedirect(redirectForm, type);
			if (validateRedirect.validate() === false) {
				return false;
			}

			var redirectValues = validateRedirect.getFormValues();

			// Do post.
			that.post({
				action: "wpseo_add_redirect_" + type,
				ajax_nonce: $(".wpseo_redirects_ajax_nonce").val(),
				redirect: {
					origin: encodeURIComponent(redirectValues.origin),
					target: encodeURIComponent(redirectValues.target),
					type: redirectValues.type
				},
				ignore_warning: ignore
			}, function (response) {
				if (response.error) {
					that.handleError(validateRedirect, response.error);

					return true;
				}

				// Empty the form fields.
				redirectForm.getOriginField().val("");
				redirectForm.getTargetField().val("");

				// Remove the no items row.
				that.find(".no-items").remove();

				// Creating tr.
				var tr = that.createRedirectRow(response.origin, response.target, response.type, response.info);

				// Add the new row.
				$("form#" + type).find("#the-list").prepend(tr);

				that.openDialog(wpseo_premium_strings.redirect_added);
			});

			return true;
		};

		/**
   * Updating the redirect
   *
   * @returns {boolean} True when updates is successful.
   */
		this.updateRedirect = function () {
			// Do the validation.
			var redirectForm = new RedirectForm(redirectsQuickEdit.getForm());
			var validateRedirect = new ValidateRedirect(redirectForm, type);
			if (validateRedirect.validate() === false) {
				return false;
			}

			var redirectValues = validateRedirect.getFormValues();

			// Setting the vars for the row and its values.
			var row = redirectsQuickEdit.getRow();
			var rowCells = this.rowCells(row);

			// Post the request.
			that.post({
				action: "wpseo_update_redirect_" + type,
				ajax_nonce: $(".wpseo_redirects_ajax_nonce").val(),
				old_redirect: {
					origin: encodeURIComponent(rowCells.origin.html()),
					target: encodeURIComponent(rowCells.target.html()),
					type: encodeURIComponent(rowCells.type.html())
				},
				new_redirect: {
					origin: encodeURIComponent(redirectValues.origin),
					target: encodeURIComponent(redirectValues.target),
					type: encodeURIComponent(redirectValues.type)
				},
				ignore_warning: ignore
			}, function (response) {
				if (response.error) {
					that.handleError(validateRedirect, response.error);

					return true;
				}

				// Updates the table cells.
				rowCells.origin.html(_.escape(response.origin));
				rowCells.target.html(_.escape(response.target));
				rowCells.type.html(_.escape(response.type));

				redirectsQuickEdit.remove();

				that.openDialog(wpseo_premium_strings.redirect_updated);
			});

			return true;
		};

		/**
   * Removes the redirect
   *
   * @param {Object} row The row object.
   *
   * @returns {void}
   */
		this.deleteRedirect = function (row) {
			var rowCells = this.rowCells(row);

			that.post({
				action: "wpseo_delete_redirect_" + type,
				ajax_nonce: $(".wpseo_redirects_ajax_nonce").val(),
				redirect: {
					origin: encodeURIComponent(rowCells.origin.html()),
					target: encodeURIComponent(rowCells.target.html()),
					type: encodeURIComponent(rowCells.type.html())
				}
			}, function () {
				// When the redirect is removed, just fade out the row and remove it after its faded.
				row.fadeTo("fast", 0).slideUp(function () {
					$(this).remove();
				});

				that.openDialog(wpseo_premium_strings.redirect_deleted);
			});
		};

		/**
   * Running the setup of this element.
   *
   * @returns {void}
   */
		this.setup = function () {
			var $row;
			// Adding dialog.
			$("body").append("<div id=\"YoastRedirectDialog\"><div id=\"YoastRedirectDialogText\"></div></div>");

			// When the window will be closed/reloaded and there is a inline edit opened show a message.
			$(window).on("beforeunload", function () {
				if ($("#the-list").find("#inline-edit").length > 0) {
					return wpseo_premium_strings.unsaved_redirects;
				}
			});

			// Adding the onchange event.
			$(".redirect-table-tab").on("change", "select[name=wpseo_redirects_type]", function (evt) {
				var type = parseInt($(evt.target).val(), 10);
				var fieldToToggle = $(evt.target).closest(".wpseo_redirect_form").find(".wpseo_redirect_target_holder");

				// Hide the target field in case of a 410 redirect.
				if (jQuery.inArray(type, ALLOW_EMPTY_TARGET) > -1) {
					$(fieldToToggle).hide();
				} else {
					$(fieldToToggle).show();
				}
			});

			// Adding events for the add form.
			$(".wpseo-new-redirect-form").on("click", ".button-primary", function () {
				lastAction = function lastAction() {
					that.addRedirect();
				};

				that.addRedirect();
				returnFocusToEl = $(this);
				return false;
			}).on("keypress", "input", function (evt) {
				if (evt.which === KEYS.ENTER) {
					lastAction = function lastAction() {
						that.addRedirect();
					};

					evt.preventDefault();
					that.addRedirect();
				}
			});

			$(".wp-list-table").on("click", ".redirect-edit", function (evt) {
				$row = $(evt.target).closest("tr");

				evt.preventDefault();
				that.editRow($row);
				returnFocusToEl = $(this);
			}).on("click", ".redirect-delete", function (evt) {
				$row = $(evt.target).closest("tr");

				evt.preventDefault();
				that.deleteRedirect($row);
				// When a row gets deleted, where focus should land?
				returnFocusToEl = $("#cb-select-all-1");
			}).on("keypress", "input", function (evt) {
				if (evt.which === KEYS.ENTER) {
					lastAction = function lastAction() {
						that.updateRedirect();
					};

					evt.preventDefault();
					that.updateRedirect();
				}
			}).on("click", ".save", function () {
				lastAction = function lastAction() {
					that.updateRedirect();
				};

				lastAction();
			}).on("click", ".cancel", function () {
				lastAction = null;
				redirectsQuickEdit.remove();
				// Move focus back to the Edit link.
				$row.find(".redirect-edit").focus();
			});
		};

		that.setup();
	};

	/**
  * Adds select2 for selected fields
  *
  * @returns {void}
  */
	function initSelect2() {
		$("#wpseo_redirects_type").select2({
			width: "400px",
			language: wpseoSelect2Locale
		});
	}

	/**
  * Initializes the redirect page.
  *
  * @returns {void}
  */
	function init() {
		templateQuickEdit = wp.template("redirects-inline-edit");

		$.each($(".redirect-table-tab"), function (key, element) {
			$(element).wpseo_redirects($(element).attr("id"));
		});

		initSelect2();
	}

	$(init);
})(jQuery);

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhc3NldHMvanMvc3JjL2FkbWluLXJlZGlyZWN0cy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUUsV0FBVSxDQUFWLEVBQWM7QUFDZixLQUFJLHFCQUFxQixDQUN4QixHQUR3QixFQUNuQixHQURtQixDQUF6Qjs7QUFJQSxLQUFJLGdCQUFnQjtBQUNuQixVQUFRLENBRFc7QUFFbkIsVUFBUSxDQUZXO0FBR25CLFFBQU07QUFIYSxFQUFwQjs7QUFNQSxLQUFJLE9BQU87QUFDVixTQUFPO0FBREcsRUFBWDs7QUFJQSxLQUFJLGlCQUFKOztBQUVBOzs7Ozs7QUFNQSxLQUFJLGVBQWUsU0FBZixZQUFlLENBQVUsSUFBVixFQUFpQjtBQUNuQyxPQUFLLElBQUwsR0FBWSxJQUFaO0FBQ0EsRUFGRDs7QUFJQTs7Ozs7QUFLQSxjQUFhLFNBQWIsQ0FBdUIsY0FBdkIsR0FBd0MsWUFBVztBQUNsRCxTQUFPLEtBQUssSUFBTCxDQUFVLElBQVYsQ0FBZ0Isb0NBQWhCLENBQVA7QUFDQSxFQUZEOztBQUlBOzs7OztBQUtBLGNBQWEsU0FBYixDQUF1QixjQUF2QixHQUF3QyxZQUFXO0FBQ2xELFNBQU8sS0FBSyxJQUFMLENBQVUsSUFBVixDQUFnQixvQ0FBaEIsQ0FBUDtBQUNBLEVBRkQ7O0FBSUE7Ozs7O0FBS0EsY0FBYSxTQUFiLENBQXVCLFlBQXZCLEdBQXNDLFlBQVc7QUFDaEQsU0FBTyxLQUFLLElBQUwsQ0FBVSxJQUFWLENBQWdCLG1DQUFoQixDQUFQO0FBQ0EsRUFGRDs7QUFJQTs7Ozs7QUFLQSxjQUFhLFNBQWIsQ0FBdUIsaUJBQXZCLEdBQTJDLFlBQVc7QUFDckQsT0FBSyxJQUFMLENBQVUsSUFBVixDQUFnQixrQ0FBaEIsRUFBcUQsTUFBckQ7QUFDQSxFQUZEOztBQUlBOzs7Ozs7O0FBT0EsY0FBYSxTQUFiLENBQXVCLGVBQXZC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YixDQUFwQjs7QUFFQSxJQUFFLElBQUYsQ0FDQyxFQUFHLHFCQUFILENBREQsRUFFQyxVQUFVLEdBQVYsRUFBZSxPQUFmLEVBQXlCO0FBQ3hCLEtBQUcsT0FBSCxFQUFhLGVBQWIsQ0FBOEIsRUFBRyxPQUFILEVBQWEsSUFBYixDQUFtQixJQUFuQixDQUE5QjtBQUNBLEdBSkY7O0FBT0E7QUFDQTs7QUFFRCxHQUFHLElBQUg7QUFDQSxDQTUwQkMsRUE0MEJDLE1BNTBCRCxDQUFGIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qIGpzaGludCAtVzA5NyAqL1xuLyoganNoaW50IC1XMDk4ICovXG4vKiBqc2hpbnQgLVcxMDcgKi9cbi8qIGdsb2JhbCBhamF4dXJsLCBhbGVydCwgd3BzZW9fcHJlbWl1bV9zdHJpbmdzLCB3cCwgXywgd3BzZW9TZWxlY3QyTG9jYWxlICovXG5cbiggZnVuY3Rpb24oICQgKSB7XG5cdHZhciBBTExPV19FTVBUWV9UQVJHRVQgPSBbXG5cdFx0NDEwLCA0NTEsXG5cdF07XG5cblx0dmFyIFRBQkxFX0NPTFVNTlMgPSB7XG5cdFx0T1JJR0lOOiAxLFxuXHRcdFRBUkdFVDogMixcblx0XHRUWVBFOiAwLFxuXHR9O1xuXG5cdHZhciBLRVlTID0ge1xuXHRcdEVOVEVSOiAxMyxcblx0fTtcblxuXHR2YXIgdGVtcGxhdGVRdWlja0VkaXQ7XG5cblx0LyoqXG5cdCAqIEluaXRpYWxpemUgYSByZWRpcmVjdCBmb3JtIG9iamVjdC5cblx0ICpcblx0ICogQHBhcmFtIHtlbGVtZW50fSBmb3JtIFRoZSByZWRpcmVjdCBmb3JtLlxuXHQgKiBAY29uc3RydWN0b3Jcblx0ICovXG5cdHZhciBSZWRpcmVjdEZvcm0gPSBmdW5jdGlvbiggZm9ybSApIHtcblx0XHR0aGlzLmZvcm0gPSBmb3JtO1xuXHR9O1xuXG5cdC8qKlxuXHQgKiBSZXR1cm5zIHRoZSBvcmlnaW4gZmllbGRcblx0ICpcblx0ICogQHJldHVybnMge2VsZW1lbnR9IFRoZSBmaWVsZCBmb3IgdGhlIHJlZGlyZWN0IG9yaWdpbi5cblx0ICovXG5cdFJlZGlyZWN0Rm9ybS5wcm90b3R5cGUuZ2V0T3JpZ2luRmllbGQgPSBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gdGhpcy5mb3JtLmZpbmQoIFwiaW5wdXRbbmFtZT13cHNlb19yZWRpcmVjdHNfb3JpZ2luXVwiICk7XG5cdH07XG5cblx0LyoqXG5cdCAqIFJldHVybnMgdGhlIHRhcmdldCBmaWVsZFxuXHQgKlxuXHQgKiBAcmV0dXJucyB7ZWxlbWVudH0gVGhlIGZpZWxkIGZvciB0aGUgcmVkaXJlY3QgdGFyZ2V0LlxuXHQgKi9cblx0UmVkaXJlY3RGb3JtLnByb3RvdHlwZS5nZXRUYXJnZXRGaWVsZCA9IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiB0aGlzLmZvcm0uZmluZCggXCJpbnB1dFtuYW1lPXdwc2VvX3JlZGlyZWN0c190YXJnZXRdXCIgKTtcblx0fTtcblxuXHQvKipcblx0ICogUmV0dXJucyB0aGUgdHlwZSBmaWVsZFxuXHQgKlxuXHQgKiBAcmV0dXJucyB7ZWxlbWVudH0gVGhlIGZpZWxkIGZvciByZWRpcmVjdCB0eXBlLlxuXHQgKi9cblx0UmVkaXJlY3RGb3JtLnByb3RvdHlwZS5nZXRUeXBlRmllbGQgPSBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gdGhpcy5mb3JtLmZpbmQoIFwic2VsZWN0W25hbWU9d3BzZW9fcmVkaXJlY3RzX3R5cGVdXCIgKTtcblx0fTtcblxuXHQvKipcblx0ICogQ2xlYXJzIHRoZSBmb3JtIGVycm9yIG1lc3NhZ2UuXG5cdCAqXG5cdCAqIEByZXR1cm5zIHt2b2lkfVxuXHQgKi9cblx0UmVkaXJlY3RGb3JtLnByb3RvdHlwZS5jbGVhckVycm9yTWVzc2FnZSA9IGZ1bmN0aW9uKCkge1xuXHRcdHRoaXMuZm9ybS5maW5kKCBcIi53cHNlb19yZWRpcmVjdF9mb3JtIC5mb3JtX2Vycm9yXCIgKS5yZW1vdmUoKTtcblx0fTtcblxuXHQvKipcblx0ICogU2V0cyBhIGZvcm0gZXJyb3IgbWVzc2FnZS5cblx0ICpcblx0ICogQHBhcmFtIHtzdHJpbmd9IGVycm9yTWVzc2FnZSBUaGUgZXJyb3IgbWVzc2FnZSB0byBzZXQuXG5cdCAqXG5cdCAqIEByZXR1cm5zIHt2b2lkfVxuXHQgKi9cblx0UmVkaXJlY3RGb3JtLnByb3RvdHlwZS5zZXRFcnJvck1lc3NhZ2UgPSBmdW5jdGlvbiggZXJyb3JNZXNzYWdlICkge1xuXHRcdHRoaXMuZm9ybS5maW5kKCBcIi53cHNlb19yZWRpcmVjdF9mb3JtXCIgKS5wcmVwZW5kKCBcIjxkaXYgY2xhc3M9XFxcImZvcm1fZXJyb3IgZXJyb3JcXFwiPjxwPlwiICsgZXJyb3JNZXNzYWdlICsgXCI8L3A+PC9kaXY+XCIgKTtcblx0fTtcblxuXHQvKipcblx0ICogUmVtb3ZpbmcgdGhlIHJvdyBlcnJvcnNcblx0ICpcblx0ICogQHJldHVybnMge3ZvaWR9XG5cdCAqL1xuXHRSZWRpcmVjdEZvcm0ucHJvdG90eXBlLnJlbW92ZVJvd0hpZ2hsaWdodHMgPSBmdW5jdGlvbigpIHtcblx0XHR0aGlzLmZvcm0uZmluZCggXCIucmVkaXJlY3RfZm9ybV9yb3dcIiApLnJlbW92ZUNsYXNzKCBcImZpZWxkX2Vycm9yXCIgKTtcblx0fTtcblxuXHQvKipcblx0ICogSGlnaGxpZ2h0aW5nIHRoZSByb3cgZXJyb3JzLlxuXHQgKlxuXHQgKiBAcGFyYW0ge2FycmF5fSBmaWVsZHNUb0hpZ2hsaWdodCBUaGUgZmllbGRzIHRvIGhpZ2hsaWdodC5cblx0ICpcblx0ICogQHJldHVybnMge3ZvaWR9XG5cdCAqL1xuXHRSZWRpcmVjdEZvcm0ucHJvdG90eXBlLmhpZ2hMaWdodFJvd0Vycm9ycyA9IGZ1bmN0aW9uKCBmaWVsZHNUb0hpZ2hsaWdodCApIHtcblx0XHRmb3IoIHZhciBpID0gMDsgaSA8IGZpZWxkc1RvSGlnaGxpZ2h0Lmxlbmd0aDsgaSsrICkge1xuXHRcdFx0c3dpdGNoKCBmaWVsZHNUb0hpZ2hsaWdodFsgaSBdICkge1xuXHRcdFx0XHRjYXNlIFwib3JpZ2luXCI6XG5cdFx0XHRcdFx0dGhpcy5oaWdobGlnaHRSb3coIHRoaXMuZ2V0T3JpZ2luRmllbGQoKSApO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIFwidGFyZ2V0XCI6XG5cdFx0XHRcdFx0dGhpcy5oaWdobGlnaHRSb3coIHRoaXMuZ2V0VGFyZ2V0RmllbGQoKSApO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIFwidHlwZVwiOlxuXHRcdFx0XHRcdHRoaXMuaGlnaGxpZ2h0Um93KCB0aGlzLmdldFR5cGVGaWVsZCgpICk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cdFx0fVxuXHR9O1xuXG5cdC8qKlxuXHQgKiBIaWdobGlnaHRzIHRoZSBjbG9zZXN0IHJvdyB3aXRoIGFuIGVycm9yIGNsYXNzLlxuXHQgKlxuXHQgKiBAcGFyYW0ge2VsZW1lbnR9IGVycm9yRmllbGQgVGhlIGZpZWxkIHRvIGhpZ2h0bGlnaHQuXG5cdCAqXG5cdCAqIEByZXR1cm5zIHt2b2lkfVxuXHQgKi9cblx0UmVkaXJlY3RGb3JtLnByb3RvdHlwZS5oaWdobGlnaHRSb3cgPSBmdW5jdGlvbiggZXJyb3JGaWVsZCApIHtcblx0XHRqUXVlcnkoIGVycm9yRmllbGQgKS5jbG9zZXN0KCBcImRpdi5yZWRpcmVjdF9mb3JtX3Jvd1wiICkuYWRkQ2xhc3MoIFwiZmllbGRfZXJyb3JcIiApO1xuXHR9O1xuXG5cdC8qKlxuXHQgKiBDbGllbnRzaWRlIHZhbGlkYXRvciBmb3IgdGhlIHJlZGlyZWN0XG5cdCAqXG5cdCAqIEBwYXJhbSB7UmVkaXJlY3RGb3JtfSBmb3JtIEZvcm0gb2JqZWN0IHJlcHJlc2VudGluZyB0aGUgZm9ybS5cblx0ICogQHBhcmFtIHtzdHJpbmd9IHR5cGUgICAgICAgVGhlIHJlZGlyZWN0IHR5cGUuXG5cdCAqXG5cdCAqIEByZXR1cm5zIHt2b2lkfVxuXHQgKi9cblx0dmFyIFZhbGlkYXRlUmVkaXJlY3QgPSBmdW5jdGlvbiggZm9ybSwgdHlwZSApIHtcblx0XHR0aGlzLmZvcm0gPSBmb3JtO1xuXHRcdHRoaXMudHlwZSA9IHR5cGU7XG5cdFx0dGhpcy52YWxpZGF0aW9uRXJyb3IgPSBcIlwiO1xuXHR9O1xuXG5cdC8qKlxuXHQgKiBWYWxpZGF0ZXMgZm9yIHRoZSBmb3JtIGZpZWxkc1xuXHQgKlxuXHQgKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSB3aGVuIHZhbGlkYXRpb24gaGFzIGJlZW4gc3VjY2Vzc2Z1bC5cblx0ICovXG5cdFZhbGlkYXRlUmVkaXJlY3QucHJvdG90eXBlLnZhbGlkYXRlID0gZnVuY3Rpb24oKSB7XG5cdFx0dGhpcy5mb3JtLmNsZWFyRXJyb3JNZXNzYWdlKCk7XG5cblx0XHR0aGlzLmZvcm0ucmVtb3ZlUm93SGlnaGxpZ2h0cygpO1xuXG5cdFx0aWYoIHRoaXMucnVuVmFsaWRhdGlvbiggdGhpcy5mb3JtLmdldE9yaWdpbkZpZWxkKCksIHRoaXMuZm9ybS5nZXRUYXJnZXRGaWVsZCgpLCB0aGlzLmZvcm0uZ2V0VHlwZUZpZWxkKCkgKSA9PT0gZmFsc2UgKSB7XG5cdFx0XHR0aGlzLmFkZFZhbGlkYXRpb25FcnJvciggdGhpcy52YWxpZGF0aW9uRXJyb3IgKTtcblxuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdHJldHVybiB0cnVlO1xuXHR9O1xuXG5cdC8qKlxuXHQgKiBFeGVjdXRlcyB0aGUgdmFsaWRhdGlvbi5cblx0ICpcblx0ICogQHBhcmFtIHtlbGVtZW50fSBvcmlnaW5GaWVsZCBUaGUgb3JpZ2luIGZpZWxkLlxuXHQgKiBAcGFyYW0ge2VsZW1lbnR9IHRhcmdldEZpZWxkIFRoZSB0YXJnZXQgZmllbGQuXG5cdCAqIEBwYXJhbSB7ZWxlbWVudH0gdHlwZUZpZWxkICAgVGhlIHR5cGUgZmllbGQuXG5cdCAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIHdoZW4gdmFsaWRhdGlvbiBoYXMgYmVlbiBzdWNjZXNzZnVsLlxuXHQgKi9cblx0VmFsaWRhdGVSZWRpcmVjdC5wcm90b3R5cGUucnVuVmFsaWRhdGlvbiA9IGZ1bmN0aW9uKCBvcmlnaW5GaWVsZCwgdGFyZ2V0RmllbGQsIHR5cGVGaWVsZCApIHtcblx0XHQvLyBDaGVjayBvbGQgVVJMLlxuXHRcdGlmICggXCJcIiA9PT0gb3JpZ2luRmllbGQudmFsKCkgKSB7XG5cdFx0XHR0aGlzLmZvcm0uaGlnaGxpZ2h0Um93KCBvcmlnaW5GaWVsZCApO1xuXG5cdFx0XHRpZiAoIFwicGxhaW5cIiA9PT0gdGhpcy50eXBlICkge1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5zZXRFcnJvciggd3BzZW9fcHJlbWl1bV9zdHJpbmdzLmVycm9yX29sZF91cmwgKTtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIHRoaXMuc2V0RXJyb3IoIHdwc2VvX3ByZW1pdW1fc3RyaW5ncy5lcnJvcl9yZWdleCApO1xuXHRcdH1cblxuXHRcdC8vIE9ubHkgd2hlbiB0aGUgcmVkaXJlY3QgdHlwZSBpcyBub3QgZGVsZXRlZC5cblx0XHRpZiggIGpRdWVyeS5pbkFycmF5KCBwYXJzZUludCggdHlwZUZpZWxkLnZhbCgpLCAxMCApLCBBTExPV19FTVBUWV9UQVJHRVQgKSA9PT0gLTEgKSB7XG5cdFx0XHQvLyBDaGVjayBuZXcgVVJMLlxuXHRcdFx0aWYgKCBcIlwiID09PSB0YXJnZXRGaWVsZC52YWwoKSApIHtcblx0XHRcdFx0dGhpcy5mb3JtLmhpZ2hsaWdodFJvdyggdGFyZ2V0RmllbGQgKTtcblx0XHRcdFx0cmV0dXJuIHRoaXMuc2V0RXJyb3IoIHdwc2VvX3ByZW1pdW1fc3RyaW5ncy5lcnJvcl9uZXdfdXJsICk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIENoZWNrIGlmIGJvdGggZmllbGRzIGFyZW4ndCB0aGUgc2FtZS5cblx0XHRcdGlmICggdGFyZ2V0RmllbGQudmFsKCkgPT09IG9yaWdpbkZpZWxkLnZhbCgpICkge1xuXHRcdFx0XHR0aGlzLmZvcm0uaGlnaGxpZ2h0Um93KCB0YXJnZXRGaWVsZCApO1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5zZXRFcnJvciggd3BzZW9fcHJlbWl1bV9zdHJpbmdzLmVycm9yX2NpcmN1bGFyICk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0Ly8gQ2hlY2sgdGhlIHJlZGlyZWN0IHR5cGUuXG5cdFx0aWYgKCBcIlwiID09PSB0eXBlRmllbGQudmFsKCkgKSB7XG5cdFx0XHR0aGlzLmZvcm0uaGlnaGxpZ2h0Um93KCB0eXBlRmllbGQgKTtcblx0XHRcdHJldHVybiB0aGlzLnNldEVycm9yKCB3cHNlb19wcmVtaXVtX3N0cmluZ3MuZXJyb3JfbmV3X3R5cGUgKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gdHJ1ZTtcblx0fTtcblxuXHQvKipcblx0ICogU2V0cyB0aGUgdmFsaWRhdGlvbiBlcnJvciBhbmQgcmV0dXJuIGZhbHNlLlxuXHQgKlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gZXJyb3IgVGhlIGVycm9yIHRvIHNldC5cblx0ICogQHJldHVybnMge2Jvb2xlYW59IEZhbHNlLCBiZWNhdXNlIHRoZXJlIGlzIGFuIGVycm9yLlxuXHQgKi9cblx0VmFsaWRhdGVSZWRpcmVjdC5wcm90b3R5cGUuc2V0RXJyb3IgPSBmdW5jdGlvbiggZXJyb3IgKSB7XG5cdFx0dGhpcy52YWxpZGF0aW9uRXJyb3IgPSBlcnJvcjtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH07XG5cblx0LyoqXG5cdCAqIEFkZGluZyB0aGUgdmFsaWRhdGlvbiBlcnJvclxuXHQgKlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gZXJyb3IgIFRoZSBlcnJvciBtZXNzYWdlLlxuXHQgKiBAcGFyYW0ge29iamVjdH0gZmllbGRzIFRoZSBmaWVsZHMgcmVsYXRlZCB0byB0aGUgZXJyb3IuXG5cdCAqXG5cdCAqIEByZXR1cm5zIHt2b2lkfVxuXHQgKi9cblx0VmFsaWRhdGVSZWRpcmVjdC5wcm90b3R5cGUuYWRkVmFsaWRhdGlvbkVycm9yID0gZnVuY3Rpb24oIGVycm9yLCBmaWVsZHMgKSB7XG5cdFx0dGhpcy5mb3JtLnNldEVycm9yTWVzc2FnZSggZXJyb3IgKTtcblxuXHRcdGlmKCBmaWVsZHMgIT09IHVuZGVmaW5lZCApIHtcblx0XHRcdHRoaXMuZm9ybS5oaWdoTGlnaHRSb3dFcnJvcnMoIGZpZWxkcyApO1xuXHRcdH1cblx0fTtcblxuXHQvKipcblx0ICogUmV0dXJucyB0aGUgdmFsdWVzIG9uIHRoZSBxdWljayBlZGl0IGZvcm1cblx0ICpcblx0ICogQHJldHVybnMge3tvcmlnaW46IChzdHJpbmd8KiksIHRhcmdldDogKHN0cmluZ3wqKSwgdHlwZTogKHN0cmluZ3wqKX19IE9iamVjdCB3aXRoIHRoZSBmb3JtIHZhbHVlcy5cblx0ICovXG5cdFZhbGlkYXRlUmVkaXJlY3QucHJvdG90eXBlLmdldEZvcm1WYWx1ZXMgPSBmdW5jdGlvbigpIHtcblx0XHR2YXIgdmFsdWVzID0ge1xuXHRcdFx0b3JpZ2luOiB0aGlzLmZvcm0uZ2V0T3JpZ2luRmllbGQoKS52YWwoKS50b1N0cmluZygpLFxuXHRcdFx0dGFyZ2V0OiB0aGlzLmZvcm0uZ2V0VGFyZ2V0RmllbGQoKS52YWwoKS50b1N0cmluZygpLFxuXHRcdFx0dHlwZTogdGhpcy5mb3JtLmdldFR5cGVGaWVsZCgpLnZhbCgpLnRvU3RyaW5nKCksXG5cdFx0fTtcblxuXHRcdC8vIFdoZW4gdGhlIHJlZGlyZWN0IHR5cGUgaXMgZGVsZXRlZCBvciB1bmF2YWlsYWJsZSwgdGhlIHRhcmdldCBjYW4gYmUgZW1wdGllZC5cblx0XHRpZiAoIGpRdWVyeS5pbkFycmF5KCBwYXJzZUludCggdmFsdWVzLnR5cGUsIDEwICksIEFMTE9XX0VNUFRZX1RBUkdFVCApID4gLTEgKSB7XG5cdFx0XHR2YWx1ZXMudGFyZ2V0ID0gXCJcIjtcblx0XHR9XG5cblx0XHRyZXR1cm4gdmFsdWVzO1xuXHR9O1xuXG5cdC8qKlxuXHQgKiBUaGUgcXVpY2sgZWRpdCBwcm90b3R5cGUgZm9yIGhhbmRsaW5nIHRoZSBxdWljayBlZGl0IG9uIGZvcm0gcm93cy5cblx0ICogQGNvbnN0cnVjdG9yXG5cdCAqL1xuXHR2YXIgUmVkaXJlY3RRdWlja0VkaXQgPSBmdW5jdGlvbigpIHtcblx0XHR0aGlzLnJvdyA9IG51bGw7XG5cdFx0dGhpcy5xdWlja0VkaXRSb3cgPSBudWxsO1xuXHR9O1xuXG5cdC8qKlxuXHQgKiBTZXR0aW5nIHVwdCB0aGUgcXVpY2sgZWRpdCBmb3IgYSByb3csIHdpdGggdGhlIGdpdmVuIHJvdyB2YWx1ZXMuXG5cdCAqXG5cdCAqIEBwYXJhbSB7ZWxlbWVudH0gcm93ICAgICBUaGUgZm9ybSByb3cgb2JqZWN0LlxuXHQgKiBAcGFyYW0ge29iamVjdH0gcm93Q2VsbHMgVGhlIGZvcm0gcm93IGNlbGxzLlxuXHQgKlxuXHQgKiBAcmV0dXJucyB7dm9pZH1cblx0ICovXG5cdFJlZGlyZWN0UXVpY2tFZGl0LnByb3RvdHlwZS5zZXR1cCA9IGZ1bmN0aW9uKCByb3csIHJvd0NlbGxzICkge1xuXHRcdHRoaXMucm93ICAgICAgICAgID0gcm93O1xuXHRcdHRoaXMucXVpY2tFZGl0Um93ID0gJChcblx0XHRcdHRlbXBsYXRlUXVpY2tFZGl0KCB7XG5cdFx0XHRcdG9yaWdpbjogXy51bmVzY2FwZSggcm93Q2VsbHMub3JpZ2luLmh0bWwoKSApLFxuXHRcdFx0XHR0YXJnZXQ6IF8udW5lc2NhcGUoIHJvd0NlbGxzLnRhcmdldC5odG1sKCkgKSxcblx0XHRcdFx0dHlwZTogcGFyc2VJbnQoIHJvd0NlbGxzLnR5cGUuaHRtbCgpLCAxMCApLFxuXHRcdFx0XHRzdWZmaXg6ICQoIFwiI3RoZS1saXN0XCIgKS5maW5kKCBcInRyXCIgKS5pbmRleCggcm93ICksXG5cdFx0XHR9IClcblx0XHQpO1xuXHR9O1xuXG5cdC8qKlxuXHQgKiBSZXR1cm5zIHRoZSBvcmlnaW5hbCByb3cgZWxlbWVudFxuXHQgKlxuXHQgKiBAcmV0dXJucyB7ZWxlbWVudH0gVGhlIHJvdyBvYmplY3QuXG5cdCAqL1xuXHRSZWRpcmVjdFF1aWNrRWRpdC5wcm90b3R5cGUuZ2V0Um93ID0gZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIHRoaXMucm93O1xuXHR9O1xuXG5cdC8qKlxuXHQgKiBSZXR1cm5zIHRoZSBvcmlnaW5hbCByb3cgZWxlbWVudFxuXHQgKlxuXHQgKiBAcmV0dXJucyB7ZWxlbWVudH0gVGhlIGZvcm0gb2JqZWN0LlxuXHQgKi9cblx0UmVkaXJlY3RRdWlja0VkaXQucHJvdG90eXBlLmdldEZvcm0gPSBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gdGhpcy5xdWlja0VkaXRSb3c7XG5cdH07XG5cblx0LyoqXG5cdCAqIFNob3dzIHRoZSBxdWljayBlZGl0IGZvcm0gYW5kIGhpZGVzIHRoZSByZWRpcmVjdCByb3cuXG5cdCAqXG5cdCAqIEByZXR1cm5zIHt2b2lkfVxuXHQgKi9cblx0UmVkaXJlY3RRdWlja0VkaXQucHJvdG90eXBlLnNob3cgPSBmdW5jdGlvbigpIHtcblx0XHR0aGlzLnJvdy5hZGRDbGFzcyggXCJoaWRkZW5cIiApO1xuXHRcdHRoaXMucXVpY2tFZGl0Um93XG5cdFx0XHQuaW5zZXJ0QWZ0ZXIoIHRoaXMucm93IClcblx0XHRcdC5zaG93KCA0MDAsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHQkKCB0aGlzICkuZmluZCggXCI6aW5wdXRcIiApLmZpcnN0KCkuZm9jdXMoKTtcblx0XHRcdH0gKTtcblx0fTtcblxuXHQvKipcblx0ICogSGlkZXMgdGhlIHF1aWNrIGVkaXQgZm9ybSBhbmQgc2hvdyB0aGUgcmVkaXJlY3Qgcm93LlxuXHQgKlxuXHQgKiBAcmV0dXJucyB7dm9pZH1cblx0ICovXG5cdFJlZGlyZWN0UXVpY2tFZGl0LnByb3RvdHlwZS5yZW1vdmUgPSBmdW5jdGlvbigpIHtcblx0XHR0aGlzLnJvdy5yZW1vdmVDbGFzcyggXCJoaWRkZW5cIiApO1xuXHRcdHRoaXMucXVpY2tFZGl0Um93LnJlbW92ZSgpO1xuXHR9O1xuXG5cdC8vIEluc3RhbnRpYXRlIHRoZSBxdWljayBlZGl0IGZvcm0uXG5cdHZhciByZWRpcmVjdHNRdWlja0VkaXQgPSBuZXcgUmVkaXJlY3RRdWlja0VkaXQoKTtcblxuXHQvLyBFeHRlbmQgdGhlIGpRdWVyeSBVSSBkaWFsb2cgd2lkZ2V0IGZvciBvdXIgbmVlZHMuXG5cdCQud2lkZ2V0KCBcInVpLmRpYWxvZ1wiLCAkLnVpLmRpYWxvZywge1xuXHRcdC8vIEV4dGVuZCB0aGUgYF9jcmVhdGVPdmVybGF5YCBmdW5jdGlvbi5cblx0XHRfY3JlYXRlT3ZlcmxheTogZnVuY3Rpb24oKSB7XG5cdFx0XHR0aGlzLl9zdXBlcigpO1xuXHRcdFx0Ly8gSWYgdGhlIG1vZGFsIG9wdGlvbiBpcyB0cnVlLCBhZGQgYSBjbGljayBldmVudCBvbiB0aGUgb3ZlcmxheS5cblx0XHRcdGlmICggdGhpcy5vcHRpb25zLm1vZGFsICkge1xuXHRcdFx0XHR0aGlzLl9vbiggdGhpcy5vdmVybGF5LCB7XG5cdFx0XHRcdFx0Y2xpY2s6IGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHRcdFx0XHRcdHRoaXMuY2xvc2UoIGV2ZW50ICk7XG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0fSApO1xuXHRcdFx0fVxuXHRcdH0sXG5cdH0gKTtcblxuXHQvKipcblx0ICogRXh0ZW5kaW5nIHRoZSBlbGVtZW50cyB3aXRoIGEgd3BzZW9fcmVkaXJlY3RzIG9iamVjdFxuXHQgKlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gYXJnVHlwZSBUaGUgcmVkaXJlY3QgdGFibGUuXG5cdCAqXG5cdCAqIEByZXR1cm5zIHt2b2lkfVxuXHQgKi9cblx0JC5mbi53cHNlb19yZWRpcmVjdHMgPSBmdW5jdGlvbiggYXJnVHlwZSApIHtcblx0XHR2YXIgdGhhdCAgID0gdGhpcztcblx0XHR2YXIgdHlwZSAgID0gYXJnVHlwZS5yZXBsYWNlKCBcInRhYmxlLVwiLCBcIlwiICk7XG5cdFx0dmFyIGlnbm9yZSA9IGZhbHNlO1xuXG5cdFx0dmFyIGxhc3RBY3Rpb247XG5cblx0XHQvLyBUaGUgZWxlbWVudCBmb2N1cyBrZXlib2FyZCBzaG91bGQgYmUgbW92ZWQgYmFjayB0by5cblx0XHR2YXIgcmV0dXJuRm9jdXNUb0VsID0gbnVsbDtcblxuXHRcdC8qKlxuXHRcdCAqIFJlc2V0cyB0aGUgaWdub3JlIGFuZCBsYXN0QWN0aW9uLlxuXHRcdCAqXG5cdFx0ICogQHJldHVybnMge3ZvaWR9XG5cdFx0ICovXG5cdFx0dmFyIHJlc2V0SWdub3JlID0gZnVuY3Rpb24oKSB7XG5cdFx0XHRpZ25vcmUgICAgICA9IGZhbHNlO1xuXHRcdFx0bGFzdEFjdGlvbiA9IG51bGw7XG5cdFx0fTtcblxuXHRcdHRoaXMuZ2V0QnV0dG9ucyA9IGZ1bmN0aW9uKCB0eXBlICkge1xuXHRcdFx0aWYgKCB0eXBlID09PSBcImRlZmF1bHRcIiApIHtcblx0XHRcdFx0cmV0dXJuIFtcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHR0ZXh0OiB3cHNlb19wcmVtaXVtX3N0cmluZ3MuYnV0dG9uX29rLFxuXHRcdFx0XHRcdFx0Y2xpY2s6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0XHQkKCB0aGlzICkuZGlhbG9nKCBcImNsb3NlXCIgKTtcblx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XTtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIFtcblx0XHRcdFx0e1xuXHRcdFx0XHRcdHRleHQ6IHdwc2VvX3ByZW1pdW1fc3RyaW5ncy5idXR0b25fY2FuY2VsLFxuXHRcdFx0XHRcdGNsaWNrOiBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRcdHJlc2V0SWdub3JlKCk7XG5cdFx0XHRcdFx0XHQkKCB0aGlzICkuZGlhbG9nKCBcImNsb3NlXCIgKTtcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0dGV4dDogd3BzZW9fcHJlbWl1bV9zdHJpbmdzLmJ1dHRvbl9zYXZlX2FueXdheSxcblx0XHRcdFx0XHRcImNsYXNzXCI6IFwiYnV0dG9uLXByaW1hcnlcIixcblx0XHRcdFx0XHRjbGljazogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHRpZ25vcmUgPSB0cnVlO1xuXG5cdFx0XHRcdFx0XHQvLyBUaGUgdmFsdWUgb2YgbGFzdCBhY3Rpb24gd2lsbCBiZSB0aGUgYnV0dG9uIHByZXNzZWQgdG8gc2F2ZSB0aGUgcmVkaXJlY3QuXG5cdFx0XHRcdFx0XHRsYXN0QWN0aW9uKCk7XG5cblx0XHRcdFx0XHRcdCQoIHRoaXMgKS5kaWFsb2coIFwiY2xvc2VcIiApO1xuXG5cdFx0XHRcdFx0XHRyZXNldElnbm9yZSgpO1xuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdH0sXG5cdFx0XHRdO1xuXHRcdH07XG5cblx0XHQvKipcblx0XHQgKiBSZXR1cm5zIGEgbWFwcGVkIG9iamVjdCB3aXRoIHRoZSByb3cgY29sdW1uIGVsZW1lbnRzXG5cdFx0ICpcblx0XHQgKiBAcGFyYW0ge09iamVjdH0gcm93IFRoZSByb3cgb2JqZWN0LlxuXHRcdCAqIEByZXR1cm5zIHt7b3JpZ2luOiAqLCB0YXJnZXQ6ICosIHR5cGU6ICp9fSBUaGUgdmFsdWVzIG9mIHRoZSBmaWVsZHMgaW4gdGhlIHJvdy5cblx0XHQgKi9cblx0XHR0aGlzLnJvd0NlbGxzID0gZnVuY3Rpb24oIHJvdyApIHtcblx0XHRcdHZhciByb3dWYWx1ZXMgPSByb3cuZmluZCggXCIudmFsXCIgKTtcblxuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0b3JpZ2luOiByb3dWYWx1ZXMuZXEoIFRBQkxFX0NPTFVNTlMuT1JJR0lOICksXG5cdFx0XHRcdHRhcmdldDogcm93VmFsdWVzLmVxKCBUQUJMRV9DT0xVTU5TLlRBUkdFVCApLFxuXHRcdFx0XHR0eXBlOiByb3dWYWx1ZXMuZXEoIFRBQkxFX0NPTFVNTlMuVFlQRSApLFxuXHRcdFx0fTtcblx0XHR9O1xuXG5cdFx0LyoqXG5cdFx0ICogU2hvd2luZyBhIGRpYWxvZyBvbiB0aGUgc2NyZWVuXG5cdFx0ICpcblx0XHQgKiBAcGFyYW0ge3N0cmluZ30gdGl0bGUgRGlhbG9nIHRpdGxlLlxuXHRcdCAqIEBwYXJhbSB7c3RyaW5nfSB0ZXh0ICBUaGUgdGV4dCBmb3IgdGhlIGRpYWxvZy5cblx0XHQgKiBAcGFyYW0ge3N0cmluZ30gdHlwZSAgVGhlIGRpYWxvZyB0eXBlLlxuXHRcdCAqXG5cdFx0ICogQHJldHVybnMge3ZvaWR9XG5cdFx0ICovXG5cdFx0dGhpcy5kaWFsb2cgPSBmdW5jdGlvbiggdGl0bGUsIHRleHQsIHR5cGUgKSB7XG5cdFx0XHRpZiAoIHR5cGUgPT09IHVuZGVmaW5lZCB8fCB0eXBlID09PSBcImVycm9yXCIgKSB7XG5cdFx0XHRcdHR5cGUgPSBcImRlZmF1bHRcIjtcblx0XHRcdH1cblxuXHRcdFx0dmFyIGJ1dHRvbnMgPSB0aGlzLmdldEJ1dHRvbnMoIHR5cGUgKTtcblxuXHRcdFx0JCggXCIjWW9hc3RSZWRpcmVjdERpYWxvZ1RleHRcIiApLmh0bWwoIHRleHQgKTtcblx0XHRcdCQoIFwiI1lvYXN0UmVkaXJlY3REaWFsb2dcIiApLmRpYWxvZyhcblx0XHRcdFx0e1xuXHRcdFx0XHRcdHRpdGxlOiB0aXRsZSxcblx0XHRcdFx0XHR3aWR0aDogNTAwLFxuXHRcdFx0XHRcdGRyYWdnYWJsZTogZmFsc2UsXG5cdFx0XHRcdFx0cmVzaXphYmxlOiBmYWxzZSxcblx0XHRcdFx0XHRwb3NpdGlvbjoge1xuXHRcdFx0XHRcdFx0YXQ6IFwiY2VudGVyIGNlbnRlclwiLFxuXHRcdFx0XHRcdFx0bXk6IFwiY2VudGVyIGNlbnRlclwiLFxuXHRcdFx0XHRcdFx0b2Y6IHdpbmRvdyxcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdGJ1dHRvbnM6IGJ1dHRvbnMsXG5cdFx0XHRcdFx0bW9kYWw6IHRydWUsXG5cdFx0XHRcdFx0Y2xvc2U6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0cmV0dXJuRm9jdXNUb0VsLmZvY3VzKCk7XG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0fVxuXHRcdFx0KTtcblx0XHR9O1xuXG5cdFx0LyoqXG5cdFx0ICogSGFuZGxlIHRoZSByZXNwb25zZVxuXHRcdCAqXG5cdFx0ICogQHBhcmFtIHtvYmplY3R9IHN1Y2Nlc3NNZXNzYWdlIFRoZSBtZXNzYWdlIHRoYXQgd2lsbCBiZSBkaXNwbGF5ZWQgb24gc3VjY2Vzcy5cblx0XHQgKlxuXHRcdCAqIEByZXR1cm5zIHt2b2lkfVxuXHRcdCAqL1xuXHRcdHRoaXMub3BlbkRpYWxvZyA9IGZ1bmN0aW9uKCBzdWNjZXNzTWVzc2FnZSApIHtcblx0XHRcdHRoaXMuZGlhbG9nKCBzdWNjZXNzTWVzc2FnZS50aXRsZSwgc3VjY2Vzc01lc3NhZ2UubWVzc2FnZSApO1xuXHRcdH07XG5cblx0XHQvKipcblx0XHQgKiBTZW5kaW5nIHBvc3QgcmVxdWVzdFxuXHRcdCAqXG5cdFx0ICogQHBhcmFtIHtvYmplY3R9ICAgZGF0YSAgICAgICBUaGUgZGF0YSB0byBwb3N0LlxuXHRcdCAqIEBwYXJhbSB7ZnVuY3Rpb259IG9uY29tcGxldGUgQ2FsbGJhY2sgd2hlbiByZXF1ZXN0IGhhcyBiZWVuIHN1Y2Nlc3NmdWwuXG5cdFx0ICpcblx0XHQgKiBAcmV0dXJucyB7dm9pZH1cblx0XHQgKi9cblx0XHR0aGlzLnBvc3QgPSBmdW5jdGlvbiggZGF0YSwgb25jb21wbGV0ZSApIHtcblx0XHRcdCQucG9zdCggYWpheHVybCwgZGF0YSwgb25jb21wbGV0ZSwgXCJqc29uXCIgKTtcblx0XHR9O1xuXG5cdFx0LyoqXG5cdFx0ICogQ3JlYXRpbmcgYW4gZWRpdCByb3cgZm9yIGVkaXR0aW5nIGEgcmVkaXJlY3QuXG5cdFx0ICpcblx0XHQgKiBAcGFyYW0ge29iamVjdH0gcm93IFRoZSByb3cgdG8gZWRpdC5cblx0XHQgKlxuXHRcdCAqIEByZXR1cm5zIHt2b2lkfVxuXHRcdCAqL1xuXHRcdHRoaXMuZWRpdFJvdyA9IGZ1bmN0aW9uKCByb3cgKSB7XG5cdFx0XHQvLyBKdXN0IHNob3cgYSBkaWFsb2cgd2hlbiB0aGVyZSBpcyBhbHJlYWR5IGEgcXVpY2sgZWRpdCBmb3JtIG9wZW5lZC5cblx0XHRcdGlmKCAkKCBcIiN0aGUtbGlzdFwiICkuZmluZCggXCIjaW5saW5lLWVkaXRcIiApLmxlbmd0aCA+IDAgKSB7XG5cdFx0XHRcdHRoaXMuZGlhbG9nKFxuXHRcdFx0XHRcdHdwc2VvX3ByZW1pdW1fc3RyaW5ncy5lZGl0X3JlZGlyZWN0LFxuXHRcdFx0XHRcdHdwc2VvX3ByZW1pdW1fc3RyaW5ncy5lZGl0aW5nX3JlZGlyZWN0XG5cdFx0XHRcdCk7XG5cblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBSdW5uaW5nIHRoZSBzZXR1cCBhbmQgc2hvdyB0aGUgcXVpY2sgZWRpdCBmb3JtLlxuXHRcdFx0cmVkaXJlY3RzUXVpY2tFZGl0LnNldHVwKCByb3csIHRoaXMucm93Q2VsbHMoIHJvdyApICk7XG5cdFx0XHRyZWRpcmVjdHNRdWlja0VkaXQuc2hvdygpO1xuXG5cdFx0XHRuZXcgUmVkaXJlY3RGb3JtKCByZWRpcmVjdHNRdWlja0VkaXQucXVpY2tFZGl0Um93ICkuZ2V0VHlwZUZpZWxkKCkudHJpZ2dlciggXCJjaGFuZ2VcIiApO1xuXHRcdH07XG5cblx0XHQvKipcblx0XHQgKiBDcmVhdGUgYSB0YWJsZSByb3cgZWxlbWVudCB3aXRoIHRoZSBuZXcgYWRkZWQgcmVkaXJlY3QgZGF0YVxuXHRcdCAqXG5cdFx0ICogQHBhcmFtIHtzdHJpbmd9IG9sZFVybCAgICAgICBUaGUgb2xkIHVybC5cblx0XHQgKiBAcGFyYW0ge3N0cmluZ30gbmV3VXJsICAgICAgIFRoZSBuZXcgdXJsLlxuXHRcdCAqIEBwYXJhbSB7c3RyaW5nfSByZWRpcmVjdFR5cGUgVGhlIHR5cGUgb2YgdGhlIHJlZGlyZWN0IChyZWdleCBvciBwbGFpbikuXG5cdFx0ICogQHBhcmFtIHtPYmplY3R9IHJlZGlyZWN0SW5mbyAgT2JqZWN0IHdpdGggZGV0YWlscyBhYm91dCB0aGUgcmVkaXJlY3QuXG5cdFx0ICogQHJldHVybnMge3ZvaWR8KnxqUXVlcnl9IFRoZSBnZW5lcmF0ZWQgcm93LlxuXHRcdCAqL1xuXHRcdHRoaXMuY3JlYXRlUmVkaXJlY3RSb3cgPSBmdW5jdGlvbiggb2xkVXJsLCBuZXdVcmwsIHJlZGlyZWN0VHlwZSwgcmVkaXJlY3RJbmZvICkge1xuXHRcdFx0dmFyIHRhcmdldENsYXNzZXMgPSBbIFwidmFsXCIgXTtcblxuXHRcdFx0aWYgKFxuXHRcdFx0XHQhIHJlZGlyZWN0SW5mby5pc1RhcmdldFJlbGF0aXZlIHx8XG5cdFx0XHRcdFwiXCIgPT09IG5ld1VybCB8fFxuXHRcdFx0XHRcIi9cIiA9PT0gbmV3VXJsXG5cdFx0XHQpIHtcblx0XHRcdFx0dGFyZ2V0Q2xhc3Nlcy5wdXNoKCBcInJlbW92ZS1zbGFzaGVzXCIgKTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKCByZWRpcmVjdEluZm8uaGFzVHJhaWxpbmdTbGFzaCApIHtcblx0XHRcdFx0dGFyZ2V0Q2xhc3Nlcy5wdXNoKCBcImhhcy10cmFpbGluZy1zbGFzaFwiICk7XG5cdFx0XHR9XG5cblx0XHRcdHZhciB0ciA9ICQoIFwiPHRyPlwiICkuYXBwZW5kKFxuXHRcdFx0XHQkKCBcIjx0aD5cIiApLmFkZENsYXNzKCBcImNoZWNrLWNvbHVtblwiICkuYXR0ciggXCJzY29wZVwiLCBcInJvd1wiICkuYXBwZW5kKFxuXHRcdFx0XHRcdCQoIFwiPGlucHV0PlwiIClcblx0XHRcdFx0XHRcdC5hdHRyKCBcIm5hbWVcIiwgXCJ3cHNlb19yZWRpcmVjdHNfYnVsa19kZWxldGVbXVwiIClcblx0XHRcdFx0XHRcdC5hdHRyKCBcInR5cGVcIiwgXCJjaGVja2JveFwiIClcblx0XHRcdFx0XHRcdC52YWwoIF8uZXNjYXBlKCBvbGRVcmwgKSApXG5cdFx0XHRcdClcblx0XHRcdCkuYXBwZW5kKFxuXHRcdFx0XHQkKCBcIjx0ZD5cIiApLmFkZENsYXNzKCBcInR5cGUgY29sdW1uLXR5cGUgaGFzLXJvdy1hY3Rpb25zIGNvbHVtbi1wcmltYXJ5XCIgKS5hcHBlbmQoXG5cdFx0XHRcdFx0JCggXCI8ZGl2PlwiICkuYWRkQ2xhc3MoIFwidmFsIHR5cGVcIiApLmh0bWwoIF8uZXNjYXBlKCByZWRpcmVjdFR5cGUgKSApXG5cdFx0XHRcdCkuYXBwZW5kKFxuXHRcdFx0XHRcdCQoIFwiPGRpdj5cIiApLmFkZENsYXNzKCBcInJvdy1hY3Rpb25zXCIgKS5hcHBlbmQoXG5cdFx0XHRcdFx0XHQkKCBcIjxzcGFuPlwiICkuYWRkQ2xhc3MoIFwiZWRpdFwiICkuYXBwZW5kKFxuXHRcdFx0XHRcdFx0XHQkKCBcIjxhPlwiICkuYXR0ciggeyBocmVmOiBcIiNcIiwgcm9sZTogXCJidXR0b25cIiwgXCJjbGFzc1wiOiBcInJlZGlyZWN0LWVkaXRcIiB9ICkuaHRtbCggd3BzZW9fcHJlbWl1bV9zdHJpbmdzLmVkaXRBY3Rpb24gKVxuXHRcdFx0XHRcdFx0KS5hcHBlbmQoIFwiIHwgXCIgKVxuXHRcdFx0XHRcdCkuYXBwZW5kKFxuXHRcdFx0XHRcdFx0JCggXCI8c3Bhbj5cIiApLmFkZENsYXNzKCBcInRyYXNoXCIgKS5hcHBlbmQoXG5cdFx0XHRcdFx0XHRcdCQoIFwiPGE+XCIgKS5hdHRyKCB7IGhyZWY6IFwiI1wiLCByb2xlOiBcImJ1dHRvblwiLCBcImNsYXNzXCI6IFwicmVkaXJlY3QtZGVsZXRlXCIgfSApLmh0bWwoIHdwc2VvX3ByZW1pdW1fc3RyaW5ncy5kZWxldGVBY3Rpb24gKVxuXHRcdFx0XHRcdFx0KVxuXHRcdFx0XHRcdClcblx0XHRcdFx0KVxuXHRcdFx0KS5hcHBlbmQoXG5cdFx0XHRcdCQoIFwiPHRkPlwiICkuYWRkQ2xhc3MoIFwiY29sdW1uLW9sZFwiICkuYXBwZW5kKFxuXHRcdFx0XHRcdCQoIFwiPGRpdj5cIiApLmFkZENsYXNzKCBcInZhbFwiICkuaHRtbCggXy5lc2NhcGUoIG9sZFVybCApIClcblx0XHRcdFx0KVxuXHRcdFx0KS5hcHBlbmQoXG5cdFx0XHRcdCQoIFwiPHRkPlwiICkuYWRkQ2xhc3MoIFwiY29sdW1uLW5ld1wiICkuYXBwZW5kKFxuXHRcdFx0XHRcdCQoIFwiPGRpdj5cIiApLmFkZENsYXNzKCB0YXJnZXRDbGFzc2VzLmpvaW4oIFwiIFwiICkgKS5odG1sKCBfLmVzY2FwZSggbmV3VXJsICkgKVxuXHRcdFx0XHQpXG5cdFx0XHQpO1xuXG5cdFx0XHRyZXR1cm4gdHI7XG5cdFx0fTtcblxuXHRcdC8qKlxuXHRcdCAqIEhhbmRsZXMgdGhlIGVycm9yLlxuXHRcdCAqXG5cdFx0ICogQHBhcmFtIHtWYWxpZGF0ZVJlZGlyZWN0fSB2YWxpZGF0ZVJlZGlyZWN0IFRoZSB2YWxpZGF0aW9uIG9iamVjdC5cblx0XHQgKiBAcGFyYW0ge09iamVjdH0gICAgICAgICAgIGVycm9yICAgICAgICAgICAgVGhlIGVycm9yIG9iamVjdC5cblx0XHQgKlxuXHRcdCAqIEByZXR1cm5zIHt2b2lkfVxuXHRcdCAqL1xuXHRcdHRoaXMuaGFuZGxlRXJyb3IgPSBmdW5jdGlvbiggdmFsaWRhdGVSZWRpcmVjdCwgZXJyb3IgKSB7XG5cdFx0XHR2YWxpZGF0ZVJlZGlyZWN0LmFkZFZhbGlkYXRpb25FcnJvciggZXJyb3IubWVzc2FnZSwgZXJyb3IuZmllbGRzICk7XG5cblx0XHRcdGlmICggZXJyb3IudHlwZSA9PT0gXCJ3YXJuaW5nXCIgKSB7XG5cdFx0XHRcdHRoYXQuZGlhbG9nKCB3cHNlb19wcmVtaXVtX3N0cmluZ3MuZXJyb3Jfc2F2aW5nX3JlZGlyZWN0LCBlcnJvci5tZXNzYWdlLCBlcnJvci50eXBlICk7XG5cdFx0XHR9XG5cdFx0fTtcblxuXHRcdC8qKlxuXHRcdCAqIEFkZGluZyB0aGUgcmVkaXJlY3Rcblx0XHQgKlxuXHRcdCAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIHdoZW4gcmVkaXJlY3QgaGFzIGJlZW4gYWRkZWQgc3VjY2Vzc2Z1bGx5LlxuXHRcdCAqL1xuXHRcdHRoaXMuYWRkUmVkaXJlY3QgPSBmdW5jdGlvbigpIHtcblx0XHRcdC8vIERvIHRoZSB2YWxpZGF0aW9uLlxuXHRcdFx0dmFyIHJlZGlyZWN0Rm9ybSAgICAgPSBuZXcgUmVkaXJlY3RGb3JtKCAkKCBcIi53cHNlby1uZXctcmVkaXJlY3QtZm9ybVwiICkgKTtcblx0XHRcdHZhciB2YWxpZGF0ZVJlZGlyZWN0ID0gbmV3IFZhbGlkYXRlUmVkaXJlY3QoIHJlZGlyZWN0Rm9ybSwgdHlwZSApO1xuXHRcdFx0aWYoIHZhbGlkYXRlUmVkaXJlY3QudmFsaWRhdGUoKSA9PT0gZmFsc2UgKSB7XG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdH1cblxuXHRcdFx0dmFyIHJlZGlyZWN0VmFsdWVzID0gdmFsaWRhdGVSZWRpcmVjdC5nZXRGb3JtVmFsdWVzKCk7XG5cblx0XHRcdC8vIERvIHBvc3QuXG5cdFx0XHR0aGF0LnBvc3QoXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRhY3Rpb246IFwid3BzZW9fYWRkX3JlZGlyZWN0X1wiICsgdHlwZSxcblx0XHRcdFx0XHRhamF4X25vbmNlOiAkKCBcIi53cHNlb19yZWRpcmVjdHNfYWpheF9ub25jZVwiICkudmFsKCksXG5cdFx0XHRcdFx0cmVkaXJlY3Q6IHtcblx0XHRcdFx0XHRcdG9yaWdpbjogZW5jb2RlVVJJQ29tcG9uZW50KCByZWRpcmVjdFZhbHVlcy5vcmlnaW4gKSxcblx0XHRcdFx0XHRcdHRhcmdldDogZW5jb2RlVVJJQ29tcG9uZW50KCByZWRpcmVjdFZhbHVlcy50YXJnZXQgKSxcblx0XHRcdFx0XHRcdHR5cGU6IHJlZGlyZWN0VmFsdWVzLnR5cGUsXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRpZ25vcmVfd2FybmluZzogaWdub3JlLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHRmdW5jdGlvbiggcmVzcG9uc2UgKSB7XG5cdFx0XHRcdFx0aWYgKCByZXNwb25zZS5lcnJvciApIHtcblx0XHRcdFx0XHRcdHRoYXQuaGFuZGxlRXJyb3IoIHZhbGlkYXRlUmVkaXJlY3QsIHJlc3BvbnNlLmVycm9yICk7XG5cblx0XHRcdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdC8vIEVtcHR5IHRoZSBmb3JtIGZpZWxkcy5cblx0XHRcdFx0XHRyZWRpcmVjdEZvcm0uZ2V0T3JpZ2luRmllbGQoKS52YWwoIFwiXCIgKTtcblx0XHRcdFx0XHRyZWRpcmVjdEZvcm0uZ2V0VGFyZ2V0RmllbGQoKS52YWwoIFwiXCIgKTtcblxuXHRcdFx0XHRcdC8vIFJlbW92ZSB0aGUgbm8gaXRlbXMgcm93LlxuXHRcdFx0XHRcdHRoYXQuZmluZCggXCIubm8taXRlbXNcIiApLnJlbW92ZSgpO1xuXG5cdFx0XHRcdFx0Ly8gQ3JlYXRpbmcgdHIuXG5cdFx0XHRcdFx0dmFyIHRyID0gdGhhdC5jcmVhdGVSZWRpcmVjdFJvdyggcmVzcG9uc2Uub3JpZ2luLCByZXNwb25zZS50YXJnZXQsIHJlc3BvbnNlLnR5cGUsIHJlc3BvbnNlLmluZm8gKTtcblxuXHRcdFx0XHRcdC8vIEFkZCB0aGUgbmV3IHJvdy5cblx0XHRcdFx0XHQkKCBcImZvcm0jXCIgKyB0eXBlICkuZmluZCggXCIjdGhlLWxpc3RcIiApLnByZXBlbmQoIHRyICk7XG5cblx0XHRcdFx0XHR0aGF0Lm9wZW5EaWFsb2coIHdwc2VvX3ByZW1pdW1fc3RyaW5ncy5yZWRpcmVjdF9hZGRlZCApO1xuXHRcdFx0XHR9XG5cdFx0XHQpO1xuXG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9O1xuXG5cdFx0LyoqXG5cdFx0ICogVXBkYXRpbmcgdGhlIHJlZGlyZWN0XG5cdFx0ICpcblx0XHQgKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSB3aGVuIHVwZGF0ZXMgaXMgc3VjY2Vzc2Z1bC5cblx0XHQgKi9cblx0XHR0aGlzLnVwZGF0ZVJlZGlyZWN0ID0gZnVuY3Rpb24oKSB7XG5cdFx0XHQvLyBEbyB0aGUgdmFsaWRhdGlvbi5cblx0XHRcdHZhciByZWRpcmVjdEZvcm0gICAgID0gbmV3IFJlZGlyZWN0Rm9ybSggcmVkaXJlY3RzUXVpY2tFZGl0LmdldEZvcm0oKSApO1xuXHRcdFx0dmFyIHZhbGlkYXRlUmVkaXJlY3QgPSBuZXcgVmFsaWRhdGVSZWRpcmVjdCggcmVkaXJlY3RGb3JtLCB0eXBlICk7XG5cdFx0XHRpZiggdmFsaWRhdGVSZWRpcmVjdC52YWxpZGF0ZSgpID09PSBmYWxzZSApIHtcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0fVxuXG5cdFx0XHR2YXIgcmVkaXJlY3RWYWx1ZXMgPSB2YWxpZGF0ZVJlZGlyZWN0LmdldEZvcm1WYWx1ZXMoKTtcblxuXHRcdFx0Ly8gU2V0dGluZyB0aGUgdmFycyBmb3IgdGhlIHJvdyBhbmQgaXRzIHZhbHVlcy5cblx0XHRcdHZhciByb3cgPSByZWRpcmVjdHNRdWlja0VkaXQuZ2V0Um93KCk7XG5cdFx0XHR2YXIgcm93Q2VsbHMgPSB0aGlzLnJvd0NlbGxzKCByb3cgKTtcblxuXHRcdFx0Ly8gUG9zdCB0aGUgcmVxdWVzdC5cblx0XHRcdHRoYXQucG9zdChcblx0XHRcdFx0e1xuXHRcdFx0XHRcdGFjdGlvbjogXCJ3cHNlb191cGRhdGVfcmVkaXJlY3RfXCIgKyB0eXBlLFxuXHRcdFx0XHRcdGFqYXhfbm9uY2U6ICQoIFwiLndwc2VvX3JlZGlyZWN0c19hamF4X25vbmNlXCIgKS52YWwoKSxcblx0XHRcdFx0XHRvbGRfcmVkaXJlY3Q6IHtcblx0XHRcdFx0XHRcdG9yaWdpbjogZW5jb2RlVVJJQ29tcG9uZW50KCByb3dDZWxscy5vcmlnaW4uaHRtbCgpICksXG5cdFx0XHRcdFx0XHR0YXJnZXQ6IGVuY29kZVVSSUNvbXBvbmVudCggcm93Q2VsbHMudGFyZ2V0Lmh0bWwoKSApLFxuXHRcdFx0XHRcdFx0dHlwZTogZW5jb2RlVVJJQ29tcG9uZW50KCByb3dDZWxscy50eXBlLmh0bWwoKSApLFxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0bmV3X3JlZGlyZWN0OiB7XG5cdFx0XHRcdFx0XHRvcmlnaW46IGVuY29kZVVSSUNvbXBvbmVudCggcmVkaXJlY3RWYWx1ZXMub3JpZ2luICksXG5cdFx0XHRcdFx0XHR0YXJnZXQ6IGVuY29kZVVSSUNvbXBvbmVudCggcmVkaXJlY3RWYWx1ZXMudGFyZ2V0ICksXG5cdFx0XHRcdFx0XHR0eXBlOiBlbmNvZGVVUklDb21wb25lbnQoIHJlZGlyZWN0VmFsdWVzLnR5cGUgKSxcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdGlnbm9yZV93YXJuaW5nOiBpZ25vcmUsXG5cdFx0XHRcdH0sXG5cdFx0XHRcdGZ1bmN0aW9uKCByZXNwb25zZSApIHtcblx0XHRcdFx0XHRpZiAoIHJlc3BvbnNlLmVycm9yICkge1xuXHRcdFx0XHRcdFx0dGhhdC5oYW5kbGVFcnJvciggdmFsaWRhdGVSZWRpcmVjdCwgcmVzcG9uc2UuZXJyb3IgKTtcblxuXHRcdFx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0Ly8gVXBkYXRlcyB0aGUgdGFibGUgY2VsbHMuXG5cdFx0XHRcdFx0cm93Q2VsbHMub3JpZ2luLmh0bWwoIF8uZXNjYXBlKCByZXNwb25zZS5vcmlnaW4gKSApO1xuXHRcdFx0XHRcdHJvd0NlbGxzLnRhcmdldC5odG1sKCBfLmVzY2FwZSggcmVzcG9uc2UudGFyZ2V0ICkgKTtcblx0XHRcdFx0XHRyb3dDZWxscy50eXBlLmh0bWwoIF8uZXNjYXBlKCByZXNwb25zZS50eXBlICkgKTtcblxuXHRcdFx0XHRcdHJlZGlyZWN0c1F1aWNrRWRpdC5yZW1vdmUoKTtcblxuXHRcdFx0XHRcdHRoYXQub3BlbkRpYWxvZyggd3BzZW9fcHJlbWl1bV9zdHJpbmdzLnJlZGlyZWN0X3VwZGF0ZWQgKTtcblx0XHRcdFx0fVxuXHRcdFx0KTtcblxuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fTtcblxuXHRcdC8qKlxuXHRcdCAqIFJlbW92ZXMgdGhlIHJlZGlyZWN0XG5cdFx0ICpcblx0XHQgKiBAcGFyYW0ge09iamVjdH0gcm93IFRoZSByb3cgb2JqZWN0LlxuXHRcdCAqXG5cdFx0ICogQHJldHVybnMge3ZvaWR9XG5cdFx0ICovXG5cdFx0dGhpcy5kZWxldGVSZWRpcmVjdCA9IGZ1bmN0aW9uKCByb3cgKSB7XG5cdFx0XHR2YXIgcm93Q2VsbHMgPSB0aGlzLnJvd0NlbGxzKCByb3cgKTtcblxuXHRcdFx0dGhhdC5wb3N0KFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0YWN0aW9uOiBcIndwc2VvX2RlbGV0ZV9yZWRpcmVjdF9cIiArIHR5cGUsXG5cdFx0XHRcdFx0YWpheF9ub25jZTogJCggXCIud3BzZW9fcmVkaXJlY3RzX2FqYXhfbm9uY2VcIiApLnZhbCgpLFxuXHRcdFx0XHRcdHJlZGlyZWN0OiB7XG5cdFx0XHRcdFx0XHRvcmlnaW46IGVuY29kZVVSSUNvbXBvbmVudCggcm93Q2VsbHMub3JpZ2luLmh0bWwoKSApLFxuXHRcdFx0XHRcdFx0dGFyZ2V0OiBlbmNvZGVVUklDb21wb25lbnQoIHJvd0NlbGxzLnRhcmdldC5odG1sKCkgKSxcblx0XHRcdFx0XHRcdHR5cGU6IGVuY29kZVVSSUNvbXBvbmVudCggcm93Q2VsbHMudHlwZS5odG1sKCkgKSxcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHR9LFxuXHRcdFx0XHRmdW5jdGlvbigpIHtcblx0XHRcdFx0XHQvLyBXaGVuIHRoZSByZWRpcmVjdCBpcyByZW1vdmVkLCBqdXN0IGZhZGUgb3V0IHRoZSByb3cgYW5kIHJlbW92ZSBpdCBhZnRlciBpdHMgZmFkZWQuXG5cdFx0XHRcdFx0cm93LmZhZGVUbyggXCJmYXN0XCIsIDAgKS5zbGlkZVVwKFxuXHRcdFx0XHRcdFx0ZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHRcdCQoIHRoaXMgKS5yZW1vdmUoKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHQpO1xuXG5cdFx0XHRcdFx0dGhhdC5vcGVuRGlhbG9nKCB3cHNlb19wcmVtaXVtX3N0cmluZ3MucmVkaXJlY3RfZGVsZXRlZCApO1xuXHRcdFx0XHR9XG5cdFx0XHQpO1xuXHRcdH07XG5cblx0XHQvKipcblx0XHQgKiBSdW5uaW5nIHRoZSBzZXR1cCBvZiB0aGlzIGVsZW1lbnQuXG5cdFx0ICpcblx0XHQgKiBAcmV0dXJucyB7dm9pZH1cblx0XHQgKi9cblx0XHR0aGlzLnNldHVwID0gZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgJHJvdztcblx0XHRcdC8vIEFkZGluZyBkaWFsb2cuXG5cdFx0XHQkKCBcImJvZHlcIiApLmFwcGVuZCggXCI8ZGl2IGlkPVxcXCJZb2FzdFJlZGlyZWN0RGlhbG9nXFxcIj48ZGl2IGlkPVxcXCJZb2FzdFJlZGlyZWN0RGlhbG9nVGV4dFxcXCI+PC9kaXY+PC9kaXY+XCIgKTtcblxuXHRcdFx0Ly8gV2hlbiB0aGUgd2luZG93IHdpbGwgYmUgY2xvc2VkL3JlbG9hZGVkIGFuZCB0aGVyZSBpcyBhIGlubGluZSBlZGl0IG9wZW5lZCBzaG93IGEgbWVzc2FnZS5cblx0XHRcdCQoIHdpbmRvdyApLm9uKCBcImJlZm9yZXVubG9hZFwiLFxuXHRcdFx0XHRmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRpZiggJCggXCIjdGhlLWxpc3RcIiApLmZpbmQoIFwiI2lubGluZS1lZGl0XCIgKS5sZW5ndGggPiAwICkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIHdwc2VvX3ByZW1pdW1fc3RyaW5ncy51bnNhdmVkX3JlZGlyZWN0cztcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdCk7XG5cblx0XHRcdC8vIEFkZGluZyB0aGUgb25jaGFuZ2UgZXZlbnQuXG5cdFx0XHQkKCBcIi5yZWRpcmVjdC10YWJsZS10YWJcIiApXG5cdFx0XHRcdC5vbiggXCJjaGFuZ2VcIiwgXCJzZWxlY3RbbmFtZT13cHNlb19yZWRpcmVjdHNfdHlwZV1cIiwgZnVuY3Rpb24oIGV2dCApIHtcblx0XHRcdFx0XHR2YXIgdHlwZSAgICAgICAgICAgID0gcGFyc2VJbnQoICQoIGV2dC50YXJnZXQgKS52YWwoKSwgMTAgKTtcblx0XHRcdFx0XHR2YXIgZmllbGRUb1RvZ2dsZSA9ICQoIGV2dC50YXJnZXQgKS5jbG9zZXN0KCBcIi53cHNlb19yZWRpcmVjdF9mb3JtXCIgKS5maW5kKCBcIi53cHNlb19yZWRpcmVjdF90YXJnZXRfaG9sZGVyXCIgKTtcblxuXHRcdFx0XHRcdC8vIEhpZGUgdGhlIHRhcmdldCBmaWVsZCBpbiBjYXNlIG9mIGEgNDEwIHJlZGlyZWN0LlxuXHRcdFx0XHRcdGlmKCBqUXVlcnkuaW5BcnJheSggdHlwZSwgQUxMT1dfRU1QVFlfVEFSR0VUICkgPiAtMSApIHtcblx0XHRcdFx0XHRcdCQoIGZpZWxkVG9Ub2dnbGUgKS5oaWRlKCk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdCQoIGZpZWxkVG9Ub2dnbGUgKS5zaG93KCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9ICk7XG5cblx0XHRcdC8vIEFkZGluZyBldmVudHMgZm9yIHRoZSBhZGQgZm9ybS5cblx0XHRcdCQoIFwiLndwc2VvLW5ldy1yZWRpcmVjdC1mb3JtXCIgKVxuXHRcdFx0XHQub24oIFwiY2xpY2tcIiwgXCIuYnV0dG9uLXByaW1hcnlcIiwgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0bGFzdEFjdGlvbiA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0dGhhdC5hZGRSZWRpcmVjdCgpO1xuXHRcdFx0XHRcdH07XG5cblx0XHRcdFx0XHR0aGF0LmFkZFJlZGlyZWN0KCk7XG5cdFx0XHRcdFx0cmV0dXJuRm9jdXNUb0VsID0gJCggdGhpcyApO1xuXHRcdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdFx0fSApXG5cdFx0XHRcdC5vbiggXCJrZXlwcmVzc1wiLCBcImlucHV0XCIsIGZ1bmN0aW9uKCBldnQgKSB7XG5cdFx0XHRcdFx0aWYgKCBldnQud2hpY2ggPT09IEtFWVMuRU5URVIgKSB7XG5cdFx0XHRcdFx0XHRsYXN0QWN0aW9uID0gZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHRcdHRoYXQuYWRkUmVkaXJlY3QoKTtcblx0XHRcdFx0XHRcdH07XG5cblx0XHRcdFx0XHRcdGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHRcdFx0dGhhdC5hZGRSZWRpcmVjdCgpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSApO1xuXG5cdFx0XHQkKCBcIi53cC1saXN0LXRhYmxlXCIgKVxuXHRcdFx0XHQub24oIFwiY2xpY2tcIiwgXCIucmVkaXJlY3QtZWRpdFwiLCBmdW5jdGlvbiggZXZ0ICkge1xuXHRcdFx0XHRcdCRyb3cgPSAkKCBldnQudGFyZ2V0ICkuY2xvc2VzdCggXCJ0clwiICk7XG5cblx0XHRcdFx0XHRldnQucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0XHR0aGF0LmVkaXRSb3coICRyb3cgKTtcblx0XHRcdFx0XHRyZXR1cm5Gb2N1c1RvRWwgPSAkKCB0aGlzICk7XG5cdFx0XHRcdH0gKVxuXHRcdFx0XHQub24oIFwiY2xpY2tcIiwgXCIucmVkaXJlY3QtZGVsZXRlXCIsIGZ1bmN0aW9uKCBldnQgKSB7XG5cdFx0XHRcdFx0JHJvdyA9ICQoIGV2dC50YXJnZXQgKS5jbG9zZXN0KCBcInRyXCIgKTtcblxuXHRcdFx0XHRcdGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHRcdHRoYXQuZGVsZXRlUmVkaXJlY3QoICRyb3cgKTtcblx0XHRcdFx0XHQvLyBXaGVuIGEgcm93IGdldHMgZGVsZXRlZCwgd2hlcmUgZm9jdXMgc2hvdWxkIGxhbmQ/XG5cdFx0XHRcdFx0cmV0dXJuRm9jdXNUb0VsID0gJCggXCIjY2Itc2VsZWN0LWFsbC0xXCIgKTtcblx0XHRcdFx0fSApXG5cdFx0XHRcdC5vbiggXCJrZXlwcmVzc1wiLCBcImlucHV0XCIsIGZ1bmN0aW9uKCBldnQgKSB7XG5cdFx0XHRcdFx0aWYgKCBldnQud2hpY2ggPT09IEtFWVMuRU5URVIgKSB7XG5cdFx0XHRcdFx0XHRsYXN0QWN0aW9uID0gZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHRcdHRoYXQudXBkYXRlUmVkaXJlY3QoKTtcblx0XHRcdFx0XHRcdH07XG5cblx0XHRcdFx0XHRcdGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHRcdFx0dGhhdC51cGRhdGVSZWRpcmVjdCgpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSApXG5cdFx0XHRcdC5vbiggXCJjbGlja1wiLCBcIi5zYXZlXCIsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdGxhc3RBY3Rpb24gPSBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRcdHRoYXQudXBkYXRlUmVkaXJlY3QoKTtcblx0XHRcdFx0XHR9O1xuXG5cdFx0XHRcdFx0bGFzdEFjdGlvbigpO1xuXHRcdFx0XHR9IClcblx0XHRcdFx0Lm9uKCBcImNsaWNrXCIsIFwiLmNhbmNlbFwiLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRsYXN0QWN0aW9uID0gbnVsbDtcblx0XHRcdFx0XHRyZWRpcmVjdHNRdWlja0VkaXQucmVtb3ZlKCk7XG5cdFx0XHRcdFx0Ly8gTW92ZSBmb2N1cyBiYWNrIHRvIHRoZSBFZGl0IGxpbmsuXG5cdFx0XHRcdFx0JHJvdy5maW5kKCBcIi5yZWRpcmVjdC1lZGl0XCIgKS5mb2N1cygpO1xuXHRcdFx0XHR9ICk7XG5cdFx0fTtcblxuXHRcdHRoYXQuc2V0dXAoKTtcblx0fTtcblxuXHQvKipcblx0ICogQWRkcyBzZWxlY3QyIGZvciBzZWxlY3RlZCBmaWVsZHNcblx0ICpcblx0ICogQHJldHVybnMge3ZvaWR9XG5cdCAqL1xuXHRmdW5jdGlvbiBpbml0U2VsZWN0MigpIHtcblx0XHQkKCBcIiN3cHNlb19yZWRpcmVjdHNfdHlwZVwiICkuc2VsZWN0Migge1xuXHRcdFx0d2lkdGg6IFwiNDAwcHhcIixcblx0XHRcdGxhbmd1YWdlOiB3cHNlb1NlbGVjdDJMb2NhbGUsXG5cdFx0fSApO1xuXHR9XG5cblx0LyoqXG5cdCAqIEluaXRpYWxpemVzIHRoZSByZWRpcmVjdCBwYWdlLlxuXHQgKlxuXHQgKiBAcmV0dXJucyB7dm9pZH1cblx0ICovXG5cdGZ1bmN0aW9uIGluaXQoKSB7XG5cdFx0dGVtcGxhdGVRdWlja0VkaXQgPSB3cC50ZW1wbGF0ZSggXCJyZWRpcmVjdHMtaW5saW5lLWVkaXRcIiApO1xuXG5cdFx0JC5lYWNoKFxuXHRcdFx0JCggXCIucmVkaXJlY3QtdGFibGUtdGFiXCIgKSxcblx0XHRcdGZ1bmN0aW9uKCBrZXksIGVsZW1lbnQgKSB7XG5cdFx0XHRcdCQoIGVsZW1lbnQgKS53cHNlb19yZWRpcmVjdHMoICQoIGVsZW1lbnQgKS5hdHRyKCBcImlkXCIgKSApO1xuXHRcdFx0fVxuXHRcdCk7XG5cblx0XHRpbml0U2VsZWN0MigpO1xuXHR9XG5cblx0JCggaW5pdCApO1xufSggalF1ZXJ5ICkgKTtcbiJdfQ==
