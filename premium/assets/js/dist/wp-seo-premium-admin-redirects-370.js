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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhc3NldHNcXGpzXFxzcmNcXGFkbWluLXJlZGlyZWN0cy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUUsV0FBVSxDQUFWLEVBQWM7QUFDZixLQUFJLHFCQUFxQixDQUN4QixHQUR3QixFQUNuQixHQURtQixDQUF6Qjs7QUFJQSxLQUFJLGdCQUFnQjtBQUNuQixVQUFRLENBRFc7QUFFbkIsVUFBUSxDQUZXO0FBR25CLFFBQU07QUFIYSxFQUFwQjs7QUFNQSxLQUFJLE9BQU87QUFDVixTQUFPO0FBREcsRUFBWDs7QUFJQSxLQUFJLGlCQUFKOztBQUVBOzs7Ozs7QUFNQSxLQUFJLGVBQWUsU0FBZixZQUFlLENBQVUsSUFBVixFQUFpQjtBQUNuQyxPQUFLLElBQUwsR0FBWSxJQUFaO0FBQ0EsRUFGRDs7QUFJQTs7Ozs7QUFLQSxjQUFhLFNBQWIsQ0FBdUIsY0FBdkIsR0FBd0MsWUFBVztBQUNsRCxTQUFPLEtBQUssSUFBTCxDQUFVLElBQVYsQ0FBZ0Isb0NBQWhCLENBQVA7QUFDQSxFQUZEOztBQUlBOzs7OztBQUtBLGNBQWEsU0FBYixDQUF1QixjQUF2QixHQUF3QyxZQUFXO0FBQ2xELFNBQU8sS0FBSyxJQUFMLENBQVUsSUFBVixDQUFnQixvQ0FBaEIsQ0FBUDtBQUNBLEVBRkQ7O0FBSUE7Ozs7O0FBS0EsY0FBYSxTQUFiLENBQXVCLFlBQXZCLEdBQXNDLFlBQVc7QUFDaEQsU0FBTyxLQUFLLElBQUwsQ0FBVSxJQUFWLENBQWdCLG1DQUFoQixDQUFQO0FBQ0EsRUFGRDs7QUFJQTs7Ozs7QUFLQSxjQUFhLFNBQWIsQ0FBdUIsaUJBQXZCLEdBQTJDLFlBQVc7QUFDckQsT0FBSyxJQUFMLENBQVUsSUFBVixDQUFnQixrQ0FBaEIsRUFBcUQsTUFBckQ7QUFDQSxFQUZEOztBQUlBOzs7Ozs7O0FBT0EsY0FBYSxTQUFiLENBQXVCLGVB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QkFBYixDQUFwQjs7QUFFQSxJQUFFLElBQUYsQ0FDQyxFQUFHLHFCQUFILENBREQsRUFFQyxVQUFVLEdBQVYsRUFBZSxPQUFmLEVBQXlCO0FBQ3hCLEtBQUcsT0FBSCxFQUFhLGVBQWIsQ0FBOEIsRUFBRyxPQUFILEVBQWEsSUFBYixDQUFtQixJQUFuQixDQUE5QjtBQUNBLEdBSkY7O0FBT0E7QUFDQTs7QUFFRCxHQUFHLElBQUg7QUFDQSxDQTUwQkMsRUE0MEJDLE1BNTBCRCxDQUFGIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qIGpzaGludCAtVzA5NyAqL1xyXG4vKiBqc2hpbnQgLVcwOTggKi9cclxuLyoganNoaW50IC1XMTA3ICovXHJcbi8qIGdsb2JhbCBhamF4dXJsLCBhbGVydCwgd3BzZW9fcHJlbWl1bV9zdHJpbmdzLCB3cCwgXywgd3BzZW9TZWxlY3QyTG9jYWxlICovXHJcblxyXG4oIGZ1bmN0aW9uKCAkICkge1xyXG5cdHZhciBBTExPV19FTVBUWV9UQVJHRVQgPSBbXHJcblx0XHQ0MTAsIDQ1MSxcclxuXHRdO1xyXG5cclxuXHR2YXIgVEFCTEVfQ09MVU1OUyA9IHtcclxuXHRcdE9SSUdJTjogMSxcclxuXHRcdFRBUkdFVDogMixcclxuXHRcdFRZUEU6IDAsXHJcblx0fTtcclxuXHJcblx0dmFyIEtFWVMgPSB7XHJcblx0XHRFTlRFUjogMTMsXHJcblx0fTtcclxuXHJcblx0dmFyIHRlbXBsYXRlUXVpY2tFZGl0O1xyXG5cclxuXHQvKipcclxuXHQgKiBJbml0aWFsaXplIGEgcmVkaXJlY3QgZm9ybSBvYmplY3QuXHJcblx0ICpcclxuXHQgKiBAcGFyYW0ge2VsZW1lbnR9IGZvcm0gVGhlIHJlZGlyZWN0IGZvcm0uXHJcblx0ICogQGNvbnN0cnVjdG9yXHJcblx0ICovXHJcblx0dmFyIFJlZGlyZWN0Rm9ybSA9IGZ1bmN0aW9uKCBmb3JtICkge1xyXG5cdFx0dGhpcy5mb3JtID0gZm9ybTtcclxuXHR9O1xyXG5cclxuXHQvKipcclxuXHQgKiBSZXR1cm5zIHRoZSBvcmlnaW4gZmllbGRcclxuXHQgKlxyXG5cdCAqIEByZXR1cm5zIHtlbGVtZW50fSBUaGUgZmllbGQgZm9yIHRoZSByZWRpcmVjdCBvcmlnaW4uXHJcblx0ICovXHJcblx0UmVkaXJlY3RGb3JtLnByb3RvdHlwZS5nZXRPcmlnaW5GaWVsZCA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0cmV0dXJuIHRoaXMuZm9ybS5maW5kKCBcImlucHV0W25hbWU9d3BzZW9fcmVkaXJlY3RzX29yaWdpbl1cIiApO1xyXG5cdH07XHJcblxyXG5cdC8qKlxyXG5cdCAqIFJldHVybnMgdGhlIHRhcmdldCBmaWVsZFxyXG5cdCAqXHJcblx0ICogQHJldHVybnMge2VsZW1lbnR9IFRoZSBmaWVsZCBmb3IgdGhlIHJlZGlyZWN0IHRhcmdldC5cclxuXHQgKi9cclxuXHRSZWRpcmVjdEZvcm0ucHJvdG90eXBlLmdldFRhcmdldEZpZWxkID0gZnVuY3Rpb24oKSB7XHJcblx0XHRyZXR1cm4gdGhpcy5mb3JtLmZpbmQoIFwiaW5wdXRbbmFtZT13cHNlb19yZWRpcmVjdHNfdGFyZ2V0XVwiICk7XHJcblx0fTtcclxuXHJcblx0LyoqXHJcblx0ICogUmV0dXJucyB0aGUgdHlwZSBmaWVsZFxyXG5cdCAqXHJcblx0ICogQHJldHVybnMge2VsZW1lbnR9IFRoZSBmaWVsZCBmb3IgcmVkaXJlY3QgdHlwZS5cclxuXHQgKi9cclxuXHRSZWRpcmVjdEZvcm0ucHJvdG90eXBlLmdldFR5cGVGaWVsZCA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0cmV0dXJuIHRoaXMuZm9ybS5maW5kKCBcInNlbGVjdFtuYW1lPXdwc2VvX3JlZGlyZWN0c190eXBlXVwiICk7XHJcblx0fTtcclxuXHJcblx0LyoqXHJcblx0ICogQ2xlYXJzIHRoZSBmb3JtIGVycm9yIG1lc3NhZ2UuXHJcblx0ICpcclxuXHQgKiBAcmV0dXJucyB7dm9pZH1cclxuXHQgKi9cclxuXHRSZWRpcmVjdEZvcm0ucHJvdG90eXBlLmNsZWFyRXJyb3JNZXNzYWdlID0gZnVuY3Rpb24oKSB7XHJcblx0XHR0aGlzLmZvcm0uZmluZCggXCIud3BzZW9fcmVkaXJlY3RfZm9ybSAuZm9ybV9lcnJvclwiICkucmVtb3ZlKCk7XHJcblx0fTtcclxuXHJcblx0LyoqXHJcblx0ICogU2V0cyBhIGZvcm0gZXJyb3IgbWVzc2FnZS5cclxuXHQgKlxyXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBlcnJvck1lc3NhZ2UgVGhlIGVycm9yIG1lc3NhZ2UgdG8gc2V0LlxyXG5cdCAqXHJcblx0ICogQHJldHVybnMge3ZvaWR9XHJcblx0ICovXHJcblx0UmVkaXJlY3RGb3JtLnByb3RvdHlwZS5zZXRFcnJvck1lc3NhZ2UgPSBmdW5jdGlvbiggZXJyb3JNZXNzYWdlICkge1xyXG5cdFx0dGhpcy5mb3JtLmZpbmQoIFwiLndwc2VvX3JlZGlyZWN0X2Zvcm1cIiApLnByZXBlbmQoIFwiPGRpdiBjbGFzcz1cXFwiZm9ybV9lcnJvciBlcnJvclxcXCI+PHA+XCIgKyBlcnJvck1lc3NhZ2UgKyBcIjwvcD48L2Rpdj5cIiApO1xyXG5cdH07XHJcblxyXG5cdC8qKlxyXG5cdCAqIFJlbW92aW5nIHRoZSByb3cgZXJyb3JzXHJcblx0ICpcclxuXHQgKiBAcmV0dXJucyB7dm9pZH1cclxuXHQgKi9cclxuXHRSZWRpcmVjdEZvcm0ucHJvdG90eXBlLnJlbW92ZVJvd0hpZ2hsaWdodHMgPSBmdW5jdGlvbigpIHtcclxuXHRcdHRoaXMuZm9ybS5maW5kKCBcIi5yZWRpcmVjdF9mb3JtX3Jvd1wiICkucmVtb3ZlQ2xhc3MoIFwiZmllbGRfZXJyb3JcIiApO1xyXG5cdH07XHJcblxyXG5cdC8qKlxyXG5cdCAqIEhpZ2hsaWdodGluZyB0aGUgcm93IGVycm9ycy5cclxuXHQgKlxyXG5cdCAqIEBwYXJhbSB7YXJyYXl9IGZpZWxkc1RvSGlnaGxpZ2h0IFRoZSBmaWVsZHMgdG8gaGlnaGxpZ2h0LlxyXG5cdCAqXHJcblx0ICogQHJldHVybnMge3ZvaWR9XHJcblx0ICovXHJcblx0UmVkaXJlY3RGb3JtLnByb3RvdHlwZS5oaWdoTGlnaHRSb3dFcnJvcnMgPSBmdW5jdGlvbiggZmllbGRzVG9IaWdobGlnaHQgKSB7XHJcblx0XHRmb3IoIHZhciBpID0gMDsgaSA8IGZpZWxkc1RvSGlnaGxpZ2h0Lmxlbmd0aDsgaSsrICkge1xyXG5cdFx0XHRzd2l0Y2goIGZpZWxkc1RvSGlnaGxpZ2h0WyBpIF0gKSB7XHJcblx0XHRcdFx0Y2FzZSBcIm9yaWdpblwiOlxyXG5cdFx0XHRcdFx0dGhpcy5oaWdobGlnaHRSb3coIHRoaXMuZ2V0T3JpZ2luRmllbGQoKSApO1xyXG5cdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0Y2FzZSBcInRhcmdldFwiOlxyXG5cdFx0XHRcdFx0dGhpcy5oaWdobGlnaHRSb3coIHRoaXMuZ2V0VGFyZ2V0RmllbGQoKSApO1xyXG5cdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0Y2FzZSBcInR5cGVcIjpcclxuXHRcdFx0XHRcdHRoaXMuaGlnaGxpZ2h0Um93KCB0aGlzLmdldFR5cGVGaWVsZCgpICk7XHJcblx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH07XHJcblxyXG5cdC8qKlxyXG5cdCAqIEhpZ2hsaWdodHMgdGhlIGNsb3Nlc3Qgcm93IHdpdGggYW4gZXJyb3IgY2xhc3MuXHJcblx0ICpcclxuXHQgKiBAcGFyYW0ge2VsZW1lbnR9IGVycm9yRmllbGQgVGhlIGZpZWxkIHRvIGhpZ2h0bGlnaHQuXHJcblx0ICpcclxuXHQgKiBAcmV0dXJucyB7dm9pZH1cclxuXHQgKi9cclxuXHRSZWRpcmVjdEZvcm0ucHJvdG90eXBlLmhpZ2hsaWdodFJvdyA9IGZ1bmN0aW9uKCBlcnJvckZpZWxkICkge1xyXG5cdFx0alF1ZXJ5KCBlcnJvckZpZWxkICkuY2xvc2VzdCggXCJkaXYucmVkaXJlY3RfZm9ybV9yb3dcIiApLmFkZENsYXNzKCBcImZpZWxkX2Vycm9yXCIgKTtcclxuXHR9O1xyXG5cclxuXHQvKipcclxuXHQgKiBDbGllbnRzaWRlIHZhbGlkYXRvciBmb3IgdGhlIHJlZGlyZWN0XHJcblx0ICpcclxuXHQgKiBAcGFyYW0ge1JlZGlyZWN0Rm9ybX0gZm9ybSBGb3JtIG9iamVjdCByZXByZXNlbnRpbmcgdGhlIGZvcm0uXHJcblx0ICogQHBhcmFtIHtzdHJpbmd9IHR5cGUgICAgICAgVGhlIHJlZGlyZWN0IHR5cGUuXHJcblx0ICpcclxuXHQgKiBAcmV0dXJucyB7dm9pZH1cclxuXHQgKi9cclxuXHR2YXIgVmFsaWRhdGVSZWRpcmVjdCA9IGZ1bmN0aW9uKCBmb3JtLCB0eXBlICkge1xyXG5cdFx0dGhpcy5mb3JtID0gZm9ybTtcclxuXHRcdHRoaXMudHlwZSA9IHR5cGU7XHJcblx0XHR0aGlzLnZhbGlkYXRpb25FcnJvciA9IFwiXCI7XHJcblx0fTtcclxuXHJcblx0LyoqXHJcblx0ICogVmFsaWRhdGVzIGZvciB0aGUgZm9ybSBmaWVsZHNcclxuXHQgKlxyXG5cdCAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIHdoZW4gdmFsaWRhdGlvbiBoYXMgYmVlbiBzdWNjZXNzZnVsLlxyXG5cdCAqL1xyXG5cdFZhbGlkYXRlUmVkaXJlY3QucHJvdG90eXBlLnZhbGlkYXRlID0gZnVuY3Rpb24oKSB7XHJcblx0XHR0aGlzLmZvcm0uY2xlYXJFcnJvck1lc3NhZ2UoKTtcclxuXHJcblx0XHR0aGlzLmZvcm0ucmVtb3ZlUm93SGlnaGxpZ2h0cygpO1xyXG5cclxuXHRcdGlmKCB0aGlzLnJ1blZhbGlkYXRpb24oIHRoaXMuZm9ybS5nZXRPcmlnaW5GaWVsZCgpLCB0aGlzLmZvcm0uZ2V0VGFyZ2V0RmllbGQoKSwgdGhpcy5mb3JtLmdldFR5cGVGaWVsZCgpICkgPT09IGZhbHNlICkge1xyXG5cdFx0XHR0aGlzLmFkZFZhbGlkYXRpb25FcnJvciggdGhpcy52YWxpZGF0aW9uRXJyb3IgKTtcclxuXHJcblx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gdHJ1ZTtcclxuXHR9O1xyXG5cclxuXHQvKipcclxuXHQgKiBFeGVjdXRlcyB0aGUgdmFsaWRhdGlvbi5cclxuXHQgKlxyXG5cdCAqIEBwYXJhbSB7ZWxlbWVudH0gb3JpZ2luRmllbGQgVGhlIG9yaWdpbiBmaWVsZC5cclxuXHQgKiBAcGFyYW0ge2VsZW1lbnR9IHRhcmdldEZpZWxkIFRoZSB0YXJnZXQgZmllbGQuXHJcblx0ICogQHBhcmFtIHtlbGVtZW50fSB0eXBlRmllbGQgICBUaGUgdHlwZSBmaWVsZC5cclxuXHQgKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSB3aGVuIHZhbGlkYXRpb24gaGFzIGJlZW4gc3VjY2Vzc2Z1bC5cclxuXHQgKi9cclxuXHRWYWxpZGF0ZVJlZGlyZWN0LnByb3RvdHlwZS5ydW5WYWxpZGF0aW9uID0gZnVuY3Rpb24oIG9yaWdpbkZpZWxkLCB0YXJnZXRGaWVsZCwgdHlwZUZpZWxkICkge1xyXG5cdFx0Ly8gQ2hlY2sgb2xkIFVSTC5cclxuXHRcdGlmICggXCJcIiA9PT0gb3JpZ2luRmllbGQudmFsKCkgKSB7XHJcblx0XHRcdHRoaXMuZm9ybS5oaWdobGlnaHRSb3coIG9yaWdpbkZpZWxkICk7XHJcblxyXG5cdFx0XHRpZiAoIFwicGxhaW5cIiA9PT0gdGhpcy50eXBlICkge1xyXG5cdFx0XHRcdHJldHVybiB0aGlzLnNldEVycm9yKCB3cHNlb19wcmVtaXVtX3N0cmluZ3MuZXJyb3Jfb2xkX3VybCApO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRyZXR1cm4gdGhpcy5zZXRFcnJvciggd3BzZW9fcHJlbWl1bV9zdHJpbmdzLmVycm9yX3JlZ2V4ICk7XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gT25seSB3aGVuIHRoZSByZWRpcmVjdCB0eXBlIGlzIG5vdCBkZWxldGVkLlxyXG5cdFx0aWYoICBqUXVlcnkuaW5BcnJheSggcGFyc2VJbnQoIHR5cGVGaWVsZC52YWwoKSwgMTAgKSwgQUxMT1dfRU1QVFlfVEFSR0VUICkgPT09IC0xICkge1xyXG5cdFx0XHQvLyBDaGVjayBuZXcgVVJMLlxyXG5cdFx0XHRpZiAoIFwiXCIgPT09IHRhcmdldEZpZWxkLnZhbCgpICkge1xyXG5cdFx0XHRcdHRoaXMuZm9ybS5oaWdobGlnaHRSb3coIHRhcmdldEZpZWxkICk7XHJcblx0XHRcdFx0cmV0dXJuIHRoaXMuc2V0RXJyb3IoIHdwc2VvX3ByZW1pdW1fc3RyaW5ncy5lcnJvcl9uZXdfdXJsICk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdC8vIENoZWNrIGlmIGJvdGggZmllbGRzIGFyZW4ndCB0aGUgc2FtZS5cclxuXHRcdFx0aWYgKCB0YXJnZXRGaWVsZC52YWwoKSA9PT0gb3JpZ2luRmllbGQudmFsKCkgKSB7XHJcblx0XHRcdFx0dGhpcy5mb3JtLmhpZ2hsaWdodFJvdyggdGFyZ2V0RmllbGQgKTtcclxuXHRcdFx0XHRyZXR1cm4gdGhpcy5zZXRFcnJvciggd3BzZW9fcHJlbWl1bV9zdHJpbmdzLmVycm9yX2NpcmN1bGFyICk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHQvLyBDaGVjayB0aGUgcmVkaXJlY3QgdHlwZS5cclxuXHRcdGlmICggXCJcIiA9PT0gdHlwZUZpZWxkLnZhbCgpICkge1xyXG5cdFx0XHR0aGlzLmZvcm0uaGlnaGxpZ2h0Um93KCB0eXBlRmllbGQgKTtcclxuXHRcdFx0cmV0dXJuIHRoaXMuc2V0RXJyb3IoIHdwc2VvX3ByZW1pdW1fc3RyaW5ncy5lcnJvcl9uZXdfdHlwZSApO1xyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiB0cnVlO1xyXG5cdH07XHJcblxyXG5cdC8qKlxyXG5cdCAqIFNldHMgdGhlIHZhbGlkYXRpb24gZXJyb3IgYW5kIHJldHVybiBmYWxzZS5cclxuXHQgKlxyXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBlcnJvciBUaGUgZXJyb3IgdG8gc2V0LlxyXG5cdCAqIEByZXR1cm5zIHtib29sZWFufSBGYWxzZSwgYmVjYXVzZSB0aGVyZSBpcyBhbiBlcnJvci5cclxuXHQgKi9cclxuXHRWYWxpZGF0ZVJlZGlyZWN0LnByb3RvdHlwZS5zZXRFcnJvciA9IGZ1bmN0aW9uKCBlcnJvciApIHtcclxuXHRcdHRoaXMudmFsaWRhdGlvbkVycm9yID0gZXJyb3I7XHJcblx0XHRyZXR1cm4gZmFsc2U7XHJcblx0fTtcclxuXHJcblx0LyoqXHJcblx0ICogQWRkaW5nIHRoZSB2YWxpZGF0aW9uIGVycm9yXHJcblx0ICpcclxuXHQgKiBAcGFyYW0ge3N0cmluZ30gZXJyb3IgIFRoZSBlcnJvciBtZXNzYWdlLlxyXG5cdCAqIEBwYXJhbSB7b2JqZWN0fSBmaWVsZHMgVGhlIGZpZWxkcyByZWxhdGVkIHRvIHRoZSBlcnJvci5cclxuXHQgKlxyXG5cdCAqIEByZXR1cm5zIHt2b2lkfVxyXG5cdCAqL1xyXG5cdFZhbGlkYXRlUmVkaXJlY3QucHJvdG90eXBlLmFkZFZhbGlkYXRpb25FcnJvciA9IGZ1bmN0aW9uKCBlcnJvciwgZmllbGRzICkge1xyXG5cdFx0dGhpcy5mb3JtLnNldEVycm9yTWVzc2FnZSggZXJyb3IgKTtcclxuXHJcblx0XHRpZiggZmllbGRzICE9PSB1bmRlZmluZWQgKSB7XHJcblx0XHRcdHRoaXMuZm9ybS5oaWdoTGlnaHRSb3dFcnJvcnMoIGZpZWxkcyApO1xyXG5cdFx0fVxyXG5cdH07XHJcblxyXG5cdC8qKlxyXG5cdCAqIFJldHVybnMgdGhlIHZhbHVlcyBvbiB0aGUgcXVpY2sgZWRpdCBmb3JtXHJcblx0ICpcclxuXHQgKiBAcmV0dXJucyB7e29yaWdpbjogKHN0cmluZ3wqKSwgdGFyZ2V0OiAoc3RyaW5nfCopLCB0eXBlOiAoc3RyaW5nfCopfX0gT2JqZWN0IHdpdGggdGhlIGZvcm0gdmFsdWVzLlxyXG5cdCAqL1xyXG5cdFZhbGlkYXRlUmVkaXJlY3QucHJvdG90eXBlLmdldEZvcm1WYWx1ZXMgPSBmdW5jdGlvbigpIHtcclxuXHRcdHZhciB2YWx1ZXMgPSB7XHJcblx0XHRcdG9yaWdpbjogdGhpcy5mb3JtLmdldE9yaWdpbkZpZWxkKCkudmFsKCkudG9TdHJpbmcoKSxcclxuXHRcdFx0dGFyZ2V0OiB0aGlzLmZvcm0uZ2V0VGFyZ2V0RmllbGQoKS52YWwoKS50b1N0cmluZygpLFxyXG5cdFx0XHR0eXBlOiB0aGlzLmZvcm0uZ2V0VHlwZUZpZWxkKCkudmFsKCkudG9TdHJpbmcoKSxcclxuXHRcdH07XHJcblxyXG5cdFx0Ly8gV2hlbiB0aGUgcmVkaXJlY3QgdHlwZSBpcyBkZWxldGVkIG9yIHVuYXZhaWxhYmxlLCB0aGUgdGFyZ2V0IGNhbiBiZSBlbXB0aWVkLlxyXG5cdFx0aWYgKCBqUXVlcnkuaW5BcnJheSggcGFyc2VJbnQoIHZhbHVlcy50eXBlLCAxMCApLCBBTExPV19FTVBUWV9UQVJHRVQgKSA+IC0xICkge1xyXG5cdFx0XHR2YWx1ZXMudGFyZ2V0ID0gXCJcIjtcclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gdmFsdWVzO1xyXG5cdH07XHJcblxyXG5cdC8qKlxyXG5cdCAqIFRoZSBxdWljayBlZGl0IHByb3RvdHlwZSBmb3IgaGFuZGxpbmcgdGhlIHF1aWNrIGVkaXQgb24gZm9ybSByb3dzLlxyXG5cdCAqIEBjb25zdHJ1Y3RvclxyXG5cdCAqL1xyXG5cdHZhciBSZWRpcmVjdFF1aWNrRWRpdCA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0dGhpcy5yb3cgPSBudWxsO1xyXG5cdFx0dGhpcy5xdWlja0VkaXRSb3cgPSBudWxsO1xyXG5cdH07XHJcblxyXG5cdC8qKlxyXG5cdCAqIFNldHRpbmcgdXB0IHRoZSBxdWljayBlZGl0IGZvciBhIHJvdywgd2l0aCB0aGUgZ2l2ZW4gcm93IHZhbHVlcy5cclxuXHQgKlxyXG5cdCAqIEBwYXJhbSB7ZWxlbWVudH0gcm93ICAgICBUaGUgZm9ybSByb3cgb2JqZWN0LlxyXG5cdCAqIEBwYXJhbSB7b2JqZWN0fSByb3dDZWxscyBUaGUgZm9ybSByb3cgY2VsbHMuXHJcblx0ICpcclxuXHQgKiBAcmV0dXJucyB7dm9pZH1cclxuXHQgKi9cclxuXHRSZWRpcmVjdFF1aWNrRWRpdC5wcm90b3R5cGUuc2V0dXAgPSBmdW5jdGlvbiggcm93LCByb3dDZWxscyApIHtcclxuXHRcdHRoaXMucm93ICAgICAgICAgID0gcm93O1xyXG5cdFx0dGhpcy5xdWlja0VkaXRSb3cgPSAkKFxyXG5cdFx0XHR0ZW1wbGF0ZVF1aWNrRWRpdCgge1xyXG5cdFx0XHRcdG9yaWdpbjogXy51bmVzY2FwZSggcm93Q2VsbHMub3JpZ2luLmh0bWwoKSApLFxyXG5cdFx0XHRcdHRhcmdldDogXy51bmVzY2FwZSggcm93Q2VsbHMudGFyZ2V0Lmh0bWwoKSApLFxyXG5cdFx0XHRcdHR5cGU6IHBhcnNlSW50KCByb3dDZWxscy50eXBlLmh0bWwoKSwgMTAgKSxcclxuXHRcdFx0XHRzdWZmaXg6ICQoIFwiI3RoZS1saXN0XCIgKS5maW5kKCBcInRyXCIgKS5pbmRleCggcm93ICksXHJcblx0XHRcdH0gKVxyXG5cdFx0KTtcclxuXHR9O1xyXG5cclxuXHQvKipcclxuXHQgKiBSZXR1cm5zIHRoZSBvcmlnaW5hbCByb3cgZWxlbWVudFxyXG5cdCAqXHJcblx0ICogQHJldHVybnMge2VsZW1lbnR9IFRoZSByb3cgb2JqZWN0LlxyXG5cdCAqL1xyXG5cdFJlZGlyZWN0UXVpY2tFZGl0LnByb3RvdHlwZS5nZXRSb3cgPSBmdW5jdGlvbigpIHtcclxuXHRcdHJldHVybiB0aGlzLnJvdztcclxuXHR9O1xyXG5cclxuXHQvKipcclxuXHQgKiBSZXR1cm5zIHRoZSBvcmlnaW5hbCByb3cgZWxlbWVudFxyXG5cdCAqXHJcblx0ICogQHJldHVybnMge2VsZW1lbnR9IFRoZSBmb3JtIG9iamVjdC5cclxuXHQgKi9cclxuXHRSZWRpcmVjdFF1aWNrRWRpdC5wcm90b3R5cGUuZ2V0Rm9ybSA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0cmV0dXJuIHRoaXMucXVpY2tFZGl0Um93O1xyXG5cdH07XHJcblxyXG5cdC8qKlxyXG5cdCAqIFNob3dzIHRoZSBxdWljayBlZGl0IGZvcm0gYW5kIGhpZGVzIHRoZSByZWRpcmVjdCByb3cuXHJcblx0ICpcclxuXHQgKiBAcmV0dXJucyB7dm9pZH1cclxuXHQgKi9cclxuXHRSZWRpcmVjdFF1aWNrRWRpdC5wcm90b3R5cGUuc2hvdyA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0dGhpcy5yb3cuYWRkQ2xhc3MoIFwiaGlkZGVuXCIgKTtcclxuXHRcdHRoaXMucXVpY2tFZGl0Um93XHJcblx0XHRcdC5pbnNlcnRBZnRlciggdGhpcy5yb3cgKVxyXG5cdFx0XHQuc2hvdyggNDAwLCBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHQkKCB0aGlzICkuZmluZCggXCI6aW5wdXRcIiApLmZpcnN0KCkuZm9jdXMoKTtcclxuXHRcdFx0fSApO1xyXG5cdH07XHJcblxyXG5cdC8qKlxyXG5cdCAqIEhpZGVzIHRoZSBxdWljayBlZGl0IGZvcm0gYW5kIHNob3cgdGhlIHJlZGlyZWN0IHJvdy5cclxuXHQgKlxyXG5cdCAqIEByZXR1cm5zIHt2b2lkfVxyXG5cdCAqL1xyXG5cdFJlZGlyZWN0UXVpY2tFZGl0LnByb3RvdHlwZS5yZW1vdmUgPSBmdW5jdGlvbigpIHtcclxuXHRcdHRoaXMucm93LnJlbW92ZUNsYXNzKCBcImhpZGRlblwiICk7XHJcblx0XHR0aGlzLnF1aWNrRWRpdFJvdy5yZW1vdmUoKTtcclxuXHR9O1xyXG5cclxuXHQvLyBJbnN0YW50aWF0ZSB0aGUgcXVpY2sgZWRpdCBmb3JtLlxyXG5cdHZhciByZWRpcmVjdHNRdWlja0VkaXQgPSBuZXcgUmVkaXJlY3RRdWlja0VkaXQoKTtcclxuXHJcblx0Ly8gRXh0ZW5kIHRoZSBqUXVlcnkgVUkgZGlhbG9nIHdpZGdldCBmb3Igb3VyIG5lZWRzLlxyXG5cdCQud2lkZ2V0KCBcInVpLmRpYWxvZ1wiLCAkLnVpLmRpYWxvZywge1xyXG5cdFx0Ly8gRXh0ZW5kIHRoZSBgX2NyZWF0ZU92ZXJsYXlgIGZ1bmN0aW9uLlxyXG5cdFx0X2NyZWF0ZU92ZXJsYXk6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHR0aGlzLl9zdXBlcigpO1xyXG5cdFx0XHQvLyBJZiB0aGUgbW9kYWwgb3B0aW9uIGlzIHRydWUsIGFkZCBhIGNsaWNrIGV2ZW50IG9uIHRoZSBvdmVybGF5LlxyXG5cdFx0XHRpZiAoIHRoaXMub3B0aW9ucy5tb2RhbCApIHtcclxuXHRcdFx0XHR0aGlzLl9vbiggdGhpcy5vdmVybGF5LCB7XHJcblx0XHRcdFx0XHRjbGljazogZnVuY3Rpb24oIGV2ZW50ICkge1xyXG5cdFx0XHRcdFx0XHR0aGlzLmNsb3NlKCBldmVudCApO1xyXG5cdFx0XHRcdFx0fSxcclxuXHRcdFx0XHR9ICk7XHJcblx0XHRcdH1cclxuXHRcdH0sXHJcblx0fSApO1xyXG5cclxuXHQvKipcclxuXHQgKiBFeHRlbmRpbmcgdGhlIGVsZW1lbnRzIHdpdGggYSB3cHNlb19yZWRpcmVjdHMgb2JqZWN0XHJcblx0ICpcclxuXHQgKiBAcGFyYW0ge3N0cmluZ30gYXJnVHlwZSBUaGUgcmVkaXJlY3QgdGFibGUuXHJcblx0ICpcclxuXHQgKiBAcmV0dXJucyB7dm9pZH1cclxuXHQgKi9cclxuXHQkLmZuLndwc2VvX3JlZGlyZWN0cyA9IGZ1bmN0aW9uKCBhcmdUeXBlICkge1xyXG5cdFx0dmFyIHRoYXQgICA9IHRoaXM7XHJcblx0XHR2YXIgdHlwZSAgID0gYXJnVHlwZS5yZXBsYWNlKCBcInRhYmxlLVwiLCBcIlwiICk7XHJcblx0XHR2YXIgaWdub3JlID0gZmFsc2U7XHJcblxyXG5cdFx0dmFyIGxhc3RBY3Rpb247XHJcblxyXG5cdFx0Ly8gVGhlIGVsZW1lbnQgZm9jdXMga2V5Ym9hcmQgc2hvdWxkIGJlIG1vdmVkIGJhY2sgdG8uXHJcblx0XHR2YXIgcmV0dXJuRm9jdXNUb0VsID0gbnVsbDtcclxuXHJcblx0XHQvKipcclxuXHRcdCAqIFJlc2V0cyB0aGUgaWdub3JlIGFuZCBsYXN0QWN0aW9uLlxyXG5cdFx0ICpcclxuXHRcdCAqIEByZXR1cm5zIHt2b2lkfVxyXG5cdFx0ICovXHJcblx0XHR2YXIgcmVzZXRJZ25vcmUgPSBmdW5jdGlvbigpIHtcclxuXHRcdFx0aWdub3JlICAgICAgPSBmYWxzZTtcclxuXHRcdFx0bGFzdEFjdGlvbiA9IG51bGw7XHJcblx0XHR9O1xyXG5cclxuXHRcdHRoaXMuZ2V0QnV0dG9ucyA9IGZ1bmN0aW9uKCB0eXBlICkge1xyXG5cdFx0XHRpZiAoIHR5cGUgPT09IFwiZGVmYXVsdFwiICkge1xyXG5cdFx0XHRcdHJldHVybiBbXHJcblx0XHRcdFx0XHR7XHJcblx0XHRcdFx0XHRcdHRleHQ6IHdwc2VvX3ByZW1pdW1fc3RyaW5ncy5idXR0b25fb2ssXHJcblx0XHRcdFx0XHRcdGNsaWNrOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRcdFx0XHQkKCB0aGlzICkuZGlhbG9nKCBcImNsb3NlXCIgKTtcclxuXHRcdFx0XHRcdFx0fSxcclxuXHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0cmV0dXJuIFtcclxuXHRcdFx0XHR7XHJcblx0XHRcdFx0XHR0ZXh0OiB3cHNlb19wcmVtaXVtX3N0cmluZ3MuYnV0dG9uX2NhbmNlbCxcclxuXHRcdFx0XHRcdGNsaWNrOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRcdFx0cmVzZXRJZ25vcmUoKTtcclxuXHRcdFx0XHRcdFx0JCggdGhpcyApLmRpYWxvZyggXCJjbG9zZVwiICk7XHJcblx0XHRcdFx0XHR9LFxyXG5cdFx0XHRcdH0sXHJcblx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0dGV4dDogd3BzZW9fcHJlbWl1bV9zdHJpbmdzLmJ1dHRvbl9zYXZlX2FueXdheSxcclxuXHRcdFx0XHRcdFwiY2xhc3NcIjogXCJidXR0b24tcHJpbWFyeVwiLFxyXG5cdFx0XHRcdFx0Y2xpY2s6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdFx0XHRpZ25vcmUgPSB0cnVlO1xyXG5cclxuXHRcdFx0XHRcdFx0Ly8gVGhlIHZhbHVlIG9mIGxhc3QgYWN0aW9uIHdpbGwgYmUgdGhlIGJ1dHRvbiBwcmVzc2VkIHRvIHNhdmUgdGhlIHJlZGlyZWN0LlxyXG5cdFx0XHRcdFx0XHRsYXN0QWN0aW9uKCk7XHJcblxyXG5cdFx0XHRcdFx0XHQkKCB0aGlzICkuZGlhbG9nKCBcImNsb3NlXCIgKTtcclxuXHJcblx0XHRcdFx0XHRcdHJlc2V0SWdub3JlKCk7XHJcblx0XHRcdFx0XHR9LFxyXG5cdFx0XHRcdH0sXHJcblx0XHRcdF07XHJcblx0XHR9O1xyXG5cclxuXHRcdC8qKlxyXG5cdFx0ICogUmV0dXJucyBhIG1hcHBlZCBvYmplY3Qgd2l0aCB0aGUgcm93IGNvbHVtbiBlbGVtZW50c1xyXG5cdFx0ICpcclxuXHRcdCAqIEBwYXJhbSB7T2JqZWN0fSByb3cgVGhlIHJvdyBvYmplY3QuXHJcblx0XHQgKiBAcmV0dXJucyB7e29yaWdpbjogKiwgdGFyZ2V0OiAqLCB0eXBlOiAqfX0gVGhlIHZhbHVlcyBvZiB0aGUgZmllbGRzIGluIHRoZSByb3cuXHJcblx0XHQgKi9cclxuXHRcdHRoaXMucm93Q2VsbHMgPSBmdW5jdGlvbiggcm93ICkge1xyXG5cdFx0XHR2YXIgcm93VmFsdWVzID0gcm93LmZpbmQoIFwiLnZhbFwiICk7XHJcblxyXG5cdFx0XHRyZXR1cm4ge1xyXG5cdFx0XHRcdG9yaWdpbjogcm93VmFsdWVzLmVxKCBUQUJMRV9DT0xVTU5TLk9SSUdJTiApLFxyXG5cdFx0XHRcdHRhcmdldDogcm93VmFsdWVzLmVxKCBUQUJMRV9DT0xVTU5TLlRBUkdFVCApLFxyXG5cdFx0XHRcdHR5cGU6IHJvd1ZhbHVlcy5lcSggVEFCTEVfQ09MVU1OUy5UWVBFICksXHJcblx0XHRcdH07XHJcblx0XHR9O1xyXG5cclxuXHRcdC8qKlxyXG5cdFx0ICogU2hvd2luZyBhIGRpYWxvZyBvbiB0aGUgc2NyZWVuXHJcblx0XHQgKlxyXG5cdFx0ICogQHBhcmFtIHtzdHJpbmd9IHRpdGxlIERpYWxvZyB0aXRsZS5cclxuXHRcdCAqIEBwYXJhbSB7c3RyaW5nfSB0ZXh0ICBUaGUgdGV4dCBmb3IgdGhlIGRpYWxvZy5cclxuXHRcdCAqIEBwYXJhbSB7c3RyaW5nfSB0eXBlICBUaGUgZGlhbG9nIHR5cGUuXHJcblx0XHQgKlxyXG5cdFx0ICogQHJldHVybnMge3ZvaWR9XHJcblx0XHQgKi9cclxuXHRcdHRoaXMuZGlhbG9nID0gZnVuY3Rpb24oIHRpdGxlLCB0ZXh0LCB0eXBlICkge1xyXG5cdFx0XHRpZiAoIHR5cGUgPT09IHVuZGVmaW5lZCB8fCB0eXBlID09PSBcImVycm9yXCIgKSB7XHJcblx0XHRcdFx0dHlwZSA9IFwiZGVmYXVsdFwiO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHR2YXIgYnV0dG9ucyA9IHRoaXMuZ2V0QnV0dG9ucyggdHlwZSApO1xyXG5cclxuXHRcdFx0JCggXCIjWW9hc3RSZWRpcmVjdERpYWxvZ1RleHRcIiApLmh0bWwoIHRleHQgKTtcclxuXHRcdFx0JCggXCIjWW9hc3RSZWRpcmVjdERpYWxvZ1wiICkuZGlhbG9nKFxyXG5cdFx0XHRcdHtcclxuXHRcdFx0XHRcdHRpdGxlOiB0aXRsZSxcclxuXHRcdFx0XHRcdHdpZHRoOiA1MDAsXHJcblx0XHRcdFx0XHRkcmFnZ2FibGU6IGZhbHNlLFxyXG5cdFx0XHRcdFx0cmVzaXphYmxlOiBmYWxzZSxcclxuXHRcdFx0XHRcdHBvc2l0aW9uOiB7XHJcblx0XHRcdFx0XHRcdGF0OiBcImNlbnRlciBjZW50ZXJcIixcclxuXHRcdFx0XHRcdFx0bXk6IFwiY2VudGVyIGNlbnRlclwiLFxyXG5cdFx0XHRcdFx0XHRvZjogd2luZG93LFxyXG5cdFx0XHRcdFx0fSxcclxuXHRcdFx0XHRcdGJ1dHRvbnM6IGJ1dHRvbnMsXHJcblx0XHRcdFx0XHRtb2RhbDogdHJ1ZSxcclxuXHRcdFx0XHRcdGNsb3NlOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRcdFx0cmV0dXJuRm9jdXNUb0VsLmZvY3VzKCk7XHJcblx0XHRcdFx0XHR9LFxyXG5cdFx0XHRcdH1cclxuXHRcdFx0KTtcclxuXHRcdH07XHJcblxyXG5cdFx0LyoqXHJcblx0XHQgKiBIYW5kbGUgdGhlIHJlc3BvbnNlXHJcblx0XHQgKlxyXG5cdFx0ICogQHBhcmFtIHtvYmplY3R9IHN1Y2Nlc3NNZXNzYWdlIFRoZSBtZXNzYWdlIHRoYXQgd2lsbCBiZSBkaXNwbGF5ZWQgb24gc3VjY2Vzcy5cclxuXHRcdCAqXHJcblx0XHQgKiBAcmV0dXJucyB7dm9pZH1cclxuXHRcdCAqL1xyXG5cdFx0dGhpcy5vcGVuRGlhbG9nID0gZnVuY3Rpb24oIHN1Y2Nlc3NNZXNzYWdlICkge1xyXG5cdFx0XHR0aGlzLmRpYWxvZyggc3VjY2Vzc01lc3NhZ2UudGl0bGUsIHN1Y2Nlc3NNZXNzYWdlLm1lc3NhZ2UgKTtcclxuXHRcdH07XHJcblxyXG5cdFx0LyoqXHJcblx0XHQgKiBTZW5kaW5nIHBvc3QgcmVxdWVzdFxyXG5cdFx0ICpcclxuXHRcdCAqIEBwYXJhbSB7b2JqZWN0fSAgIGRhdGEgICAgICAgVGhlIGRhdGEgdG8gcG9zdC5cclxuXHRcdCAqIEBwYXJhbSB7ZnVuY3Rpb259IG9uY29tcGxldGUgQ2FsbGJhY2sgd2hlbiByZXF1ZXN0IGhhcyBiZWVuIHN1Y2Nlc3NmdWwuXHJcblx0XHQgKlxyXG5cdFx0ICogQHJldHVybnMge3ZvaWR9XHJcblx0XHQgKi9cclxuXHRcdHRoaXMucG9zdCA9IGZ1bmN0aW9uKCBkYXRhLCBvbmNvbXBsZXRlICkge1xyXG5cdFx0XHQkLnBvc3QoIGFqYXh1cmwsIGRhdGEsIG9uY29tcGxldGUsIFwianNvblwiICk7XHJcblx0XHR9O1xyXG5cclxuXHRcdC8qKlxyXG5cdFx0ICogQ3JlYXRpbmcgYW4gZWRpdCByb3cgZm9yIGVkaXR0aW5nIGEgcmVkaXJlY3QuXHJcblx0XHQgKlxyXG5cdFx0ICogQHBhcmFtIHtvYmplY3R9IHJvdyBUaGUgcm93IHRvIGVkaXQuXHJcblx0XHQgKlxyXG5cdFx0ICogQHJldHVybnMge3ZvaWR9XHJcblx0XHQgKi9cclxuXHRcdHRoaXMuZWRpdFJvdyA9IGZ1bmN0aW9uKCByb3cgKSB7XHJcblx0XHRcdC8vIEp1c3Qgc2hvdyBhIGRpYWxvZyB3aGVuIHRoZXJlIGlzIGFscmVhZHkgYSBxdWljayBlZGl0IGZvcm0gb3BlbmVkLlxyXG5cdFx0XHRpZiggJCggXCIjdGhlLWxpc3RcIiApLmZpbmQoIFwiI2lubGluZS1lZGl0XCIgKS5sZW5ndGggPiAwICkge1xyXG5cdFx0XHRcdHRoaXMuZGlhbG9nKFxyXG5cdFx0XHRcdFx0d3BzZW9fcHJlbWl1bV9zdHJpbmdzLmVkaXRfcmVkaXJlY3QsXHJcblx0XHRcdFx0XHR3cHNlb19wcmVtaXVtX3N0cmluZ3MuZWRpdGluZ19yZWRpcmVjdFxyXG5cdFx0XHRcdCk7XHJcblxyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Ly8gUnVubmluZyB0aGUgc2V0dXAgYW5kIHNob3cgdGhlIHF1aWNrIGVkaXQgZm9ybS5cclxuXHRcdFx0cmVkaXJlY3RzUXVpY2tFZGl0LnNldHVwKCByb3csIHRoaXMucm93Q2VsbHMoIHJvdyApICk7XHJcblx0XHRcdHJlZGlyZWN0c1F1aWNrRWRpdC5zaG93KCk7XHJcblxyXG5cdFx0XHRuZXcgUmVkaXJlY3RGb3JtKCByZWRpcmVjdHNRdWlja0VkaXQucXVpY2tFZGl0Um93ICkuZ2V0VHlwZUZpZWxkKCkudHJpZ2dlciggXCJjaGFuZ2VcIiApO1xyXG5cdFx0fTtcclxuXHJcblx0XHQvKipcclxuXHRcdCAqIENyZWF0ZSBhIHRhYmxlIHJvdyBlbGVtZW50IHdpdGggdGhlIG5ldyBhZGRlZCByZWRpcmVjdCBkYXRhXHJcblx0XHQgKlxyXG5cdFx0ICogQHBhcmFtIHtzdHJpbmd9IG9sZFVybCAgICAgICBUaGUgb2xkIHVybC5cclxuXHRcdCAqIEBwYXJhbSB7c3RyaW5nfSBuZXdVcmwgICAgICAgVGhlIG5ldyB1cmwuXHJcblx0XHQgKiBAcGFyYW0ge3N0cmluZ30gcmVkaXJlY3RUeXBlIFRoZSB0eXBlIG9mIHRoZSByZWRpcmVjdCAocmVnZXggb3IgcGxhaW4pLlxyXG5cdFx0ICogQHBhcmFtIHtPYmplY3R9IHJlZGlyZWN0SW5mbyAgT2JqZWN0IHdpdGggZGV0YWlscyBhYm91dCB0aGUgcmVkaXJlY3QuXHJcblx0XHQgKiBAcmV0dXJucyB7dm9pZHwqfGpRdWVyeX0gVGhlIGdlbmVyYXRlZCByb3cuXHJcblx0XHQgKi9cclxuXHRcdHRoaXMuY3JlYXRlUmVkaXJlY3RSb3cgPSBmdW5jdGlvbiggb2xkVXJsLCBuZXdVcmwsIHJlZGlyZWN0VHlwZSwgcmVkaXJlY3RJbmZvICkge1xyXG5cdFx0XHR2YXIgdGFyZ2V0Q2xhc3NlcyA9IFsgXCJ2YWxcIiBdO1xyXG5cclxuXHRcdFx0aWYgKFxyXG5cdFx0XHRcdCEgcmVkaXJlY3RJbmZvLmlzVGFyZ2V0UmVsYXRpdmUgfHxcclxuXHRcdFx0XHRcIlwiID09PSBuZXdVcmwgfHxcclxuXHRcdFx0XHRcIi9cIiA9PT0gbmV3VXJsXHJcblx0XHRcdCkge1xyXG5cdFx0XHRcdHRhcmdldENsYXNzZXMucHVzaCggXCJyZW1vdmUtc2xhc2hlc1wiICk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmICggcmVkaXJlY3RJbmZvLmhhc1RyYWlsaW5nU2xhc2ggKSB7XHJcblx0XHRcdFx0dGFyZ2V0Q2xhc3Nlcy5wdXNoKCBcImhhcy10cmFpbGluZy1zbGFzaFwiICk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHZhciB0ciA9ICQoIFwiPHRyPlwiICkuYXBwZW5kKFxyXG5cdFx0XHRcdCQoIFwiPHRoPlwiICkuYWRkQ2xhc3MoIFwiY2hlY2stY29sdW1uXCIgKS5hdHRyKCBcInNjb3BlXCIsIFwicm93XCIgKS5hcHBlbmQoXHJcblx0XHRcdFx0XHQkKCBcIjxpbnB1dD5cIiApXHJcblx0XHRcdFx0XHRcdC5hdHRyKCBcIm5hbWVcIiwgXCJ3cHNlb19yZWRpcmVjdHNfYnVsa19kZWxldGVbXVwiIClcclxuXHRcdFx0XHRcdFx0LmF0dHIoIFwidHlwZVwiLCBcImNoZWNrYm94XCIgKVxyXG5cdFx0XHRcdFx0XHQudmFsKCBfLmVzY2FwZSggb2xkVXJsICkgKVxyXG5cdFx0XHRcdClcclxuXHRcdFx0KS5hcHBlbmQoXHJcblx0XHRcdFx0JCggXCI8dGQ+XCIgKS5hZGRDbGFzcyggXCJ0eXBlIGNvbHVtbi10eXBlIGhhcy1yb3ctYWN0aW9ucyBjb2x1bW4tcHJpbWFyeVwiICkuYXBwZW5kKFxyXG5cdFx0XHRcdFx0JCggXCI8ZGl2PlwiICkuYWRkQ2xhc3MoIFwidmFsIHR5cGVcIiApLmh0bWwoIF8uZXNjYXBlKCByZWRpcmVjdFR5cGUgKSApXHJcblx0XHRcdFx0KS5hcHBlbmQoXHJcblx0XHRcdFx0XHQkKCBcIjxkaXY+XCIgKS5hZGRDbGFzcyggXCJyb3ctYWN0aW9uc1wiICkuYXBwZW5kKFxyXG5cdFx0XHRcdFx0XHQkKCBcIjxzcGFuPlwiICkuYWRkQ2xhc3MoIFwiZWRpdFwiICkuYXBwZW5kKFxyXG5cdFx0XHRcdFx0XHRcdCQoIFwiPGE+XCIgKS5hdHRyKCB7IGhyZWY6IFwiI1wiLCByb2xlOiBcImJ1dHRvblwiLCBcImNsYXNzXCI6IFwicmVkaXJlY3QtZWRpdFwiIH0gKS5odG1sKCB3cHNlb19wcmVtaXVtX3N0cmluZ3MuZWRpdEFjdGlvbiApXHJcblx0XHRcdFx0XHRcdCkuYXBwZW5kKCBcIiB8IFwiIClcclxuXHRcdFx0XHRcdCkuYXBwZW5kKFxyXG5cdFx0XHRcdFx0XHQkKCBcIjxzcGFuPlwiICkuYWRkQ2xhc3MoIFwidHJhc2hcIiApLmFwcGVuZChcclxuXHRcdFx0XHRcdFx0XHQkKCBcIjxhPlwiICkuYXR0ciggeyBocmVmOiBcIiNcIiwgcm9sZTogXCJidXR0b25cIiwgXCJjbGFzc1wiOiBcInJlZGlyZWN0LWRlbGV0ZVwiIH0gKS5odG1sKCB3cHNlb19wcmVtaXVtX3N0cmluZ3MuZGVsZXRlQWN0aW9uIClcclxuXHRcdFx0XHRcdFx0KVxyXG5cdFx0XHRcdFx0KVxyXG5cdFx0XHRcdClcclxuXHRcdFx0KS5hcHBlbmQoXHJcblx0XHRcdFx0JCggXCI8dGQ+XCIgKS5hZGRDbGFzcyggXCJjb2x1bW4tb2xkXCIgKS5hcHBlbmQoXHJcblx0XHRcdFx0XHQkKCBcIjxkaXY+XCIgKS5hZGRDbGFzcyggXCJ2YWxcIiApLmh0bWwoIF8uZXNjYXBlKCBvbGRVcmwgKSApXHJcblx0XHRcdFx0KVxyXG5cdFx0XHQpLmFwcGVuZChcclxuXHRcdFx0XHQkKCBcIjx0ZD5cIiApLmFkZENsYXNzKCBcImNvbHVtbi1uZXdcIiApLmFwcGVuZChcclxuXHRcdFx0XHRcdCQoIFwiPGRpdj5cIiApLmFkZENsYXNzKCB0YXJnZXRDbGFzc2VzLmpvaW4oIFwiIFwiICkgKS5odG1sKCBfLmVzY2FwZSggbmV3VXJsICkgKVxyXG5cdFx0XHRcdClcclxuXHRcdFx0KTtcclxuXHJcblx0XHRcdHJldHVybiB0cjtcclxuXHRcdH07XHJcblxyXG5cdFx0LyoqXHJcblx0XHQgKiBIYW5kbGVzIHRoZSBlcnJvci5cclxuXHRcdCAqXHJcblx0XHQgKiBAcGFyYW0ge1ZhbGlkYXRlUmVkaXJlY3R9IHZhbGlkYXRlUmVkaXJlY3QgVGhlIHZhbGlkYXRpb24gb2JqZWN0LlxyXG5cdFx0ICogQHBhcmFtIHtPYmplY3R9ICAgICAgICAgICBlcnJvciAgICAgICAgICAgIFRoZSBlcnJvciBvYmplY3QuXHJcblx0XHQgKlxyXG5cdFx0ICogQHJldHVybnMge3ZvaWR9XHJcblx0XHQgKi9cclxuXHRcdHRoaXMuaGFuZGxlRXJyb3IgPSBmdW5jdGlvbiggdmFsaWRhdGVSZWRpcmVjdCwgZXJyb3IgKSB7XHJcblx0XHRcdHZhbGlkYXRlUmVkaXJlY3QuYWRkVmFsaWRhdGlvbkVycm9yKCBlcnJvci5tZXNzYWdlLCBlcnJvci5maWVsZHMgKTtcclxuXHJcblx0XHRcdGlmICggZXJyb3IudHlwZSA9PT0gXCJ3YXJuaW5nXCIgKSB7XHJcblx0XHRcdFx0dGhhdC5kaWFsb2coIHdwc2VvX3ByZW1pdW1fc3RyaW5ncy5lcnJvcl9zYXZpbmdfcmVkaXJlY3QsIGVycm9yLm1lc3NhZ2UsIGVycm9yLnR5cGUgKTtcclxuXHRcdFx0fVxyXG5cdFx0fTtcclxuXHJcblx0XHQvKipcclxuXHRcdCAqIEFkZGluZyB0aGUgcmVkaXJlY3RcclxuXHRcdCAqXHJcblx0XHQgKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSB3aGVuIHJlZGlyZWN0IGhhcyBiZWVuIGFkZGVkIHN1Y2Nlc3NmdWxseS5cclxuXHRcdCAqL1xyXG5cdFx0dGhpcy5hZGRSZWRpcmVjdCA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHQvLyBEbyB0aGUgdmFsaWRhdGlvbi5cclxuXHRcdFx0dmFyIHJlZGlyZWN0Rm9ybSAgICAgPSBuZXcgUmVkaXJlY3RGb3JtKCAkKCBcIi53cHNlby1uZXctcmVkaXJlY3QtZm9ybVwiICkgKTtcclxuXHRcdFx0dmFyIHZhbGlkYXRlUmVkaXJlY3QgPSBuZXcgVmFsaWRhdGVSZWRpcmVjdCggcmVkaXJlY3RGb3JtLCB0eXBlICk7XHJcblx0XHRcdGlmKCB2YWxpZGF0ZVJlZGlyZWN0LnZhbGlkYXRlKCkgPT09IGZhbHNlICkge1xyXG5cdFx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0dmFyIHJlZGlyZWN0VmFsdWVzID0gdmFsaWRhdGVSZWRpcmVjdC5nZXRGb3JtVmFsdWVzKCk7XHJcblxyXG5cdFx0XHQvLyBEbyBwb3N0LlxyXG5cdFx0XHR0aGF0LnBvc3QoXHJcblx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0YWN0aW9uOiBcIndwc2VvX2FkZF9yZWRpcmVjdF9cIiArIHR5cGUsXHJcblx0XHRcdFx0XHRhamF4X25vbmNlOiAkKCBcIi53cHNlb19yZWRpcmVjdHNfYWpheF9ub25jZVwiICkudmFsKCksXHJcblx0XHRcdFx0XHRyZWRpcmVjdDoge1xyXG5cdFx0XHRcdFx0XHRvcmlnaW46IGVuY29kZVVSSUNvbXBvbmVudCggcmVkaXJlY3RWYWx1ZXMub3JpZ2luICksXHJcblx0XHRcdFx0XHRcdHRhcmdldDogZW5jb2RlVVJJQ29tcG9uZW50KCByZWRpcmVjdFZhbHVlcy50YXJnZXQgKSxcclxuXHRcdFx0XHRcdFx0dHlwZTogcmVkaXJlY3RWYWx1ZXMudHlwZSxcclxuXHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHRpZ25vcmVfd2FybmluZzogaWdub3JlLFxyXG5cdFx0XHRcdH0sXHJcblx0XHRcdFx0ZnVuY3Rpb24oIHJlc3BvbnNlICkge1xyXG5cdFx0XHRcdFx0aWYgKCByZXNwb25zZS5lcnJvciApIHtcclxuXHRcdFx0XHRcdFx0dGhhdC5oYW5kbGVFcnJvciggdmFsaWRhdGVSZWRpcmVjdCwgcmVzcG9uc2UuZXJyb3IgKTtcclxuXHJcblx0XHRcdFx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdC8vIEVtcHR5IHRoZSBmb3JtIGZpZWxkcy5cclxuXHRcdFx0XHRcdHJlZGlyZWN0Rm9ybS5nZXRPcmlnaW5GaWVsZCgpLnZhbCggXCJcIiApO1xyXG5cdFx0XHRcdFx0cmVkaXJlY3RGb3JtLmdldFRhcmdldEZpZWxkKCkudmFsKCBcIlwiICk7XHJcblxyXG5cdFx0XHRcdFx0Ly8gUmVtb3ZlIHRoZSBubyBpdGVtcyByb3cuXHJcblx0XHRcdFx0XHR0aGF0LmZpbmQoIFwiLm5vLWl0ZW1zXCIgKS5yZW1vdmUoKTtcclxuXHJcblx0XHRcdFx0XHQvLyBDcmVhdGluZyB0ci5cclxuXHRcdFx0XHRcdHZhciB0ciA9IHRoYXQuY3JlYXRlUmVkaXJlY3RSb3coIHJlc3BvbnNlLm9yaWdpbiwgcmVzcG9uc2UudGFyZ2V0LCByZXNwb25zZS50eXBlLCByZXNwb25zZS5pbmZvICk7XHJcblxyXG5cdFx0XHRcdFx0Ly8gQWRkIHRoZSBuZXcgcm93LlxyXG5cdFx0XHRcdFx0JCggXCJmb3JtI1wiICsgdHlwZSApLmZpbmQoIFwiI3RoZS1saXN0XCIgKS5wcmVwZW5kKCB0ciApO1xyXG5cclxuXHRcdFx0XHRcdHRoYXQub3BlbkRpYWxvZyggd3BzZW9fcHJlbWl1bV9zdHJpbmdzLnJlZGlyZWN0X2FkZGVkICk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHQpO1xyXG5cclxuXHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHR9O1xyXG5cclxuXHRcdC8qKlxyXG5cdFx0ICogVXBkYXRpbmcgdGhlIHJlZGlyZWN0XHJcblx0XHQgKlxyXG5cdFx0ICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgd2hlbiB1cGRhdGVzIGlzIHN1Y2Nlc3NmdWwuXHJcblx0XHQgKi9cclxuXHRcdHRoaXMudXBkYXRlUmVkaXJlY3QgPSBmdW5jdGlvbigpIHtcclxuXHRcdFx0Ly8gRG8gdGhlIHZhbGlkYXRpb24uXHJcblx0XHRcdHZhciByZWRpcmVjdEZvcm0gICAgID0gbmV3IFJlZGlyZWN0Rm9ybSggcmVkaXJlY3RzUXVpY2tFZGl0LmdldEZvcm0oKSApO1xyXG5cdFx0XHR2YXIgdmFsaWRhdGVSZWRpcmVjdCA9IG5ldyBWYWxpZGF0ZVJlZGlyZWN0KCByZWRpcmVjdEZvcm0sIHR5cGUgKTtcclxuXHRcdFx0aWYoIHZhbGlkYXRlUmVkaXJlY3QudmFsaWRhdGUoKSA9PT0gZmFsc2UgKSB7XHJcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHR2YXIgcmVkaXJlY3RWYWx1ZXMgPSB2YWxpZGF0ZVJlZGlyZWN0LmdldEZvcm1WYWx1ZXMoKTtcclxuXHJcblx0XHRcdC8vIFNldHRpbmcgdGhlIHZhcnMgZm9yIHRoZSByb3cgYW5kIGl0cyB2YWx1ZXMuXHJcblx0XHRcdHZhciByb3cgPSByZWRpcmVjdHNRdWlja0VkaXQuZ2V0Um93KCk7XHJcblx0XHRcdHZhciByb3dDZWxscyA9IHRoaXMucm93Q2VsbHMoIHJvdyApO1xyXG5cclxuXHRcdFx0Ly8gUG9zdCB0aGUgcmVxdWVzdC5cclxuXHRcdFx0dGhhdC5wb3N0KFxyXG5cdFx0XHRcdHtcclxuXHRcdFx0XHRcdGFjdGlvbjogXCJ3cHNlb191cGRhdGVfcmVkaXJlY3RfXCIgKyB0eXBlLFxyXG5cdFx0XHRcdFx0YWpheF9ub25jZTogJCggXCIud3BzZW9fcmVkaXJlY3RzX2FqYXhfbm9uY2VcIiApLnZhbCgpLFxyXG5cdFx0XHRcdFx0b2xkX3JlZGlyZWN0OiB7XHJcblx0XHRcdFx0XHRcdG9yaWdpbjogZW5jb2RlVVJJQ29tcG9uZW50KCByb3dDZWxscy5vcmlnaW4uaHRtbCgpICksXHJcblx0XHRcdFx0XHRcdHRhcmdldDogZW5jb2RlVVJJQ29tcG9uZW50KCByb3dDZWxscy50YXJnZXQuaHRtbCgpICksXHJcblx0XHRcdFx0XHRcdHR5cGU6IGVuY29kZVVSSUNvbXBvbmVudCggcm93Q2VsbHMudHlwZS5odG1sKCkgKSxcclxuXHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHRuZXdfcmVkaXJlY3Q6IHtcclxuXHRcdFx0XHRcdFx0b3JpZ2luOiBlbmNvZGVVUklDb21wb25lbnQoIHJlZGlyZWN0VmFsdWVzLm9yaWdpbiApLFxyXG5cdFx0XHRcdFx0XHR0YXJnZXQ6IGVuY29kZVVSSUNvbXBvbmVudCggcmVkaXJlY3RWYWx1ZXMudGFyZ2V0ICksXHJcblx0XHRcdFx0XHRcdHR5cGU6IGVuY29kZVVSSUNvbXBvbmVudCggcmVkaXJlY3RWYWx1ZXMudHlwZSApLFxyXG5cdFx0XHRcdFx0fSxcclxuXHRcdFx0XHRcdGlnbm9yZV93YXJuaW5nOiBpZ25vcmUsXHJcblx0XHRcdFx0fSxcclxuXHRcdFx0XHRmdW5jdGlvbiggcmVzcG9uc2UgKSB7XHJcblx0XHRcdFx0XHRpZiAoIHJlc3BvbnNlLmVycm9yICkge1xyXG5cdFx0XHRcdFx0XHR0aGF0LmhhbmRsZUVycm9yKCB2YWxpZGF0ZVJlZGlyZWN0LCByZXNwb25zZS5lcnJvciApO1xyXG5cclxuXHRcdFx0XHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0Ly8gVXBkYXRlcyB0aGUgdGFibGUgY2VsbHMuXHJcblx0XHRcdFx0XHRyb3dDZWxscy5vcmlnaW4uaHRtbCggXy5lc2NhcGUoIHJlc3BvbnNlLm9yaWdpbiApICk7XHJcblx0XHRcdFx0XHRyb3dDZWxscy50YXJnZXQuaHRtbCggXy5lc2NhcGUoIHJlc3BvbnNlLnRhcmdldCApICk7XHJcblx0XHRcdFx0XHRyb3dDZWxscy50eXBlLmh0bWwoIF8uZXNjYXBlKCByZXNwb25zZS50eXBlICkgKTtcclxuXHJcblx0XHRcdFx0XHRyZWRpcmVjdHNRdWlja0VkaXQucmVtb3ZlKCk7XHJcblxyXG5cdFx0XHRcdFx0dGhhdC5vcGVuRGlhbG9nKCB3cHNlb19wcmVtaXVtX3N0cmluZ3MucmVkaXJlY3RfdXBkYXRlZCApO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0KTtcclxuXHJcblx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0fTtcclxuXHJcblx0XHQvKipcclxuXHRcdCAqIFJlbW92ZXMgdGhlIHJlZGlyZWN0XHJcblx0XHQgKlxyXG5cdFx0ICogQHBhcmFtIHtPYmplY3R9IHJvdyBUaGUgcm93IG9iamVjdC5cclxuXHRcdCAqXHJcblx0XHQgKiBAcmV0dXJucyB7dm9pZH1cclxuXHRcdCAqL1xyXG5cdFx0dGhpcy5kZWxldGVSZWRpcmVjdCA9IGZ1bmN0aW9uKCByb3cgKSB7XHJcblx0XHRcdHZhciByb3dDZWxscyA9IHRoaXMucm93Q2VsbHMoIHJvdyApO1xyXG5cclxuXHRcdFx0dGhhdC5wb3N0KFxyXG5cdFx0XHRcdHtcclxuXHRcdFx0XHRcdGFjdGlvbjogXCJ3cHNlb19kZWxldGVfcmVkaXJlY3RfXCIgKyB0eXBlLFxyXG5cdFx0XHRcdFx0YWpheF9ub25jZTogJCggXCIud3BzZW9fcmVkaXJlY3RzX2FqYXhfbm9uY2VcIiApLnZhbCgpLFxyXG5cdFx0XHRcdFx0cmVkaXJlY3Q6IHtcclxuXHRcdFx0XHRcdFx0b3JpZ2luOiBlbmNvZGVVUklDb21wb25lbnQoIHJvd0NlbGxzLm9yaWdpbi5odG1sKCkgKSxcclxuXHRcdFx0XHRcdFx0dGFyZ2V0OiBlbmNvZGVVUklDb21wb25lbnQoIHJvd0NlbGxzLnRhcmdldC5odG1sKCkgKSxcclxuXHRcdFx0XHRcdFx0dHlwZTogZW5jb2RlVVJJQ29tcG9uZW50KCByb3dDZWxscy50eXBlLmh0bWwoKSApLFxyXG5cdFx0XHRcdFx0fSxcclxuXHRcdFx0XHR9LFxyXG5cdFx0XHRcdGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdFx0Ly8gV2hlbiB0aGUgcmVkaXJlY3QgaXMgcmVtb3ZlZCwganVzdCBmYWRlIG91dCB0aGUgcm93IGFuZCByZW1vdmUgaXQgYWZ0ZXIgaXRzIGZhZGVkLlxyXG5cdFx0XHRcdFx0cm93LmZhZGVUbyggXCJmYXN0XCIsIDAgKS5zbGlkZVVwKFxyXG5cdFx0XHRcdFx0XHRmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRcdFx0XHQkKCB0aGlzICkucmVtb3ZlKCk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdCk7XHJcblxyXG5cdFx0XHRcdFx0dGhhdC5vcGVuRGlhbG9nKCB3cHNlb19wcmVtaXVtX3N0cmluZ3MucmVkaXJlY3RfZGVsZXRlZCApO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0KTtcclxuXHRcdH07XHJcblxyXG5cdFx0LyoqXHJcblx0XHQgKiBSdW5uaW5nIHRoZSBzZXR1cCBvZiB0aGlzIGVsZW1lbnQuXHJcblx0XHQgKlxyXG5cdFx0ICogQHJldHVybnMge3ZvaWR9XHJcblx0XHQgKi9cclxuXHRcdHRoaXMuc2V0dXAgPSBmdW5jdGlvbigpIHtcclxuXHRcdFx0dmFyICRyb3c7XHJcblx0XHRcdC8vIEFkZGluZyBkaWFsb2cuXHJcblx0XHRcdCQoIFwiYm9keVwiICkuYXBwZW5kKCBcIjxkaXYgaWQ9XFxcIllvYXN0UmVkaXJlY3REaWFsb2dcXFwiPjxkaXYgaWQ9XFxcIllvYXN0UmVkaXJlY3REaWFsb2dUZXh0XFxcIj48L2Rpdj48L2Rpdj5cIiApO1xyXG5cclxuXHRcdFx0Ly8gV2hlbiB0aGUgd2luZG93IHdpbGwgYmUgY2xvc2VkL3JlbG9hZGVkIGFuZCB0aGVyZSBpcyBhIGlubGluZSBlZGl0IG9wZW5lZCBzaG93IGEgbWVzc2FnZS5cclxuXHRcdFx0JCggd2luZG93ICkub24oIFwiYmVmb3JldW5sb2FkXCIsXHJcblx0XHRcdFx0ZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0XHRpZiggJCggXCIjdGhlLWxpc3RcIiApLmZpbmQoIFwiI2lubGluZS1lZGl0XCIgKS5sZW5ndGggPiAwICkge1xyXG5cdFx0XHRcdFx0XHRyZXR1cm4gd3BzZW9fcHJlbWl1bV9zdHJpbmdzLnVuc2F2ZWRfcmVkaXJlY3RzO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0KTtcclxuXHJcblx0XHRcdC8vIEFkZGluZyB0aGUgb25jaGFuZ2UgZXZlbnQuXHJcblx0XHRcdCQoIFwiLnJlZGlyZWN0LXRhYmxlLXRhYlwiIClcclxuXHRcdFx0XHQub24oIFwiY2hhbmdlXCIsIFwic2VsZWN0W25hbWU9d3BzZW9fcmVkaXJlY3RzX3R5cGVdXCIsIGZ1bmN0aW9uKCBldnQgKSB7XHJcblx0XHRcdFx0XHR2YXIgdHlwZSAgICAgICAgICAgID0gcGFyc2VJbnQoICQoIGV2dC50YXJnZXQgKS52YWwoKSwgMTAgKTtcclxuXHRcdFx0XHRcdHZhciBmaWVsZFRvVG9nZ2xlID0gJCggZXZ0LnRhcmdldCApLmNsb3Nlc3QoIFwiLndwc2VvX3JlZGlyZWN0X2Zvcm1cIiApLmZpbmQoIFwiLndwc2VvX3JlZGlyZWN0X3RhcmdldF9ob2xkZXJcIiApO1xyXG5cclxuXHRcdFx0XHRcdC8vIEhpZGUgdGhlIHRhcmdldCBmaWVsZCBpbiBjYXNlIG9mIGEgNDEwIHJlZGlyZWN0LlxyXG5cdFx0XHRcdFx0aWYoIGpRdWVyeS5pbkFycmF5KCB0eXBlLCBBTExPV19FTVBUWV9UQVJHRVQgKSA+IC0xICkge1xyXG5cdFx0XHRcdFx0XHQkKCBmaWVsZFRvVG9nZ2xlICkuaGlkZSgpO1xyXG5cdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0JCggZmllbGRUb1RvZ2dsZSApLnNob3coKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9ICk7XHJcblxyXG5cdFx0XHQvLyBBZGRpbmcgZXZlbnRzIGZvciB0aGUgYWRkIGZvcm0uXHJcblx0XHRcdCQoIFwiLndwc2VvLW5ldy1yZWRpcmVjdC1mb3JtXCIgKVxyXG5cdFx0XHRcdC5vbiggXCJjbGlja1wiLCBcIi5idXR0b24tcHJpbWFyeVwiLCBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRcdGxhc3RBY3Rpb24gPSBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRcdFx0dGhhdC5hZGRSZWRpcmVjdCgpO1xyXG5cdFx0XHRcdFx0fTtcclxuXHJcblx0XHRcdFx0XHR0aGF0LmFkZFJlZGlyZWN0KCk7XHJcblx0XHRcdFx0XHRyZXR1cm5Gb2N1c1RvRWwgPSAkKCB0aGlzICk7XHJcblx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHRcdFx0fSApXHJcblx0XHRcdFx0Lm9uKCBcImtleXByZXNzXCIsIFwiaW5wdXRcIiwgZnVuY3Rpb24oIGV2dCApIHtcclxuXHRcdFx0XHRcdGlmICggZXZ0LndoaWNoID09PSBLRVlTLkVOVEVSICkge1xyXG5cdFx0XHRcdFx0XHRsYXN0QWN0aW9uID0gZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0XHRcdFx0dGhhdC5hZGRSZWRpcmVjdCgpO1xyXG5cdFx0XHRcdFx0XHR9O1xyXG5cclxuXHRcdFx0XHRcdFx0ZXZ0LnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHRcdFx0XHRcdHRoYXQuYWRkUmVkaXJlY3QoKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9ICk7XHJcblxyXG5cdFx0XHQkKCBcIi53cC1saXN0LXRhYmxlXCIgKVxyXG5cdFx0XHRcdC5vbiggXCJjbGlja1wiLCBcIi5yZWRpcmVjdC1lZGl0XCIsIGZ1bmN0aW9uKCBldnQgKSB7XHJcblx0XHRcdFx0XHQkcm93ID0gJCggZXZ0LnRhcmdldCApLmNsb3Nlc3QoIFwidHJcIiApO1xyXG5cclxuXHRcdFx0XHRcdGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdFx0XHRcdFx0dGhhdC5lZGl0Um93KCAkcm93ICk7XHJcblx0XHRcdFx0XHRyZXR1cm5Gb2N1c1RvRWwgPSAkKCB0aGlzICk7XHJcblx0XHRcdFx0fSApXHJcblx0XHRcdFx0Lm9uKCBcImNsaWNrXCIsIFwiLnJlZGlyZWN0LWRlbGV0ZVwiLCBmdW5jdGlvbiggZXZ0ICkge1xyXG5cdFx0XHRcdFx0JHJvdyA9ICQoIGV2dC50YXJnZXQgKS5jbG9zZXN0KCBcInRyXCIgKTtcclxuXHJcblx0XHRcdFx0XHRldnQucHJldmVudERlZmF1bHQoKTtcclxuXHRcdFx0XHRcdHRoYXQuZGVsZXRlUmVkaXJlY3QoICRyb3cgKTtcclxuXHRcdFx0XHRcdC8vIFdoZW4gYSByb3cgZ2V0cyBkZWxldGVkLCB3aGVyZSBmb2N1cyBzaG91bGQgbGFuZD9cclxuXHRcdFx0XHRcdHJldHVybkZvY3VzVG9FbCA9ICQoIFwiI2NiLXNlbGVjdC1hbGwtMVwiICk7XHJcblx0XHRcdFx0fSApXHJcblx0XHRcdFx0Lm9uKCBcImtleXByZXNzXCIsIFwiaW5wdXRcIiwgZnVuY3Rpb24oIGV2dCApIHtcclxuXHRcdFx0XHRcdGlmICggZXZ0LndoaWNoID09PSBLRVlTLkVOVEVSICkge1xyXG5cdFx0XHRcdFx0XHRsYXN0QWN0aW9uID0gZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0XHRcdFx0dGhhdC51cGRhdGVSZWRpcmVjdCgpO1xyXG5cdFx0XHRcdFx0XHR9O1xyXG5cclxuXHRcdFx0XHRcdFx0ZXZ0LnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHRcdFx0XHRcdHRoYXQudXBkYXRlUmVkaXJlY3QoKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9IClcclxuXHRcdFx0XHQub24oIFwiY2xpY2tcIiwgXCIuc2F2ZVwiLCBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRcdGxhc3RBY3Rpb24gPSBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRcdFx0dGhhdC51cGRhdGVSZWRpcmVjdCgpO1xyXG5cdFx0XHRcdFx0fTtcclxuXHJcblx0XHRcdFx0XHRsYXN0QWN0aW9uKCk7XHJcblx0XHRcdFx0fSApXHJcblx0XHRcdFx0Lm9uKCBcImNsaWNrXCIsIFwiLmNhbmNlbFwiLCBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRcdGxhc3RBY3Rpb24gPSBudWxsO1xyXG5cdFx0XHRcdFx0cmVkaXJlY3RzUXVpY2tFZGl0LnJlbW92ZSgpO1xyXG5cdFx0XHRcdFx0Ly8gTW92ZSBmb2N1cyBiYWNrIHRvIHRoZSBFZGl0IGxpbmsuXHJcblx0XHRcdFx0XHQkcm93LmZpbmQoIFwiLnJlZGlyZWN0LWVkaXRcIiApLmZvY3VzKCk7XHJcblx0XHRcdFx0fSApO1xyXG5cdFx0fTtcclxuXHJcblx0XHR0aGF0LnNldHVwKCk7XHJcblx0fTtcclxuXHJcblx0LyoqXHJcblx0ICogQWRkcyBzZWxlY3QyIGZvciBzZWxlY3RlZCBmaWVsZHNcclxuXHQgKlxyXG5cdCAqIEByZXR1cm5zIHt2b2lkfVxyXG5cdCAqL1xyXG5cdGZ1bmN0aW9uIGluaXRTZWxlY3QyKCkge1xyXG5cdFx0JCggXCIjd3BzZW9fcmVkaXJlY3RzX3R5cGVcIiApLnNlbGVjdDIoIHtcclxuXHRcdFx0d2lkdGg6IFwiNDAwcHhcIixcclxuXHRcdFx0bGFuZ3VhZ2U6IHdwc2VvU2VsZWN0MkxvY2FsZSxcclxuXHRcdH0gKTtcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIEluaXRpYWxpemVzIHRoZSByZWRpcmVjdCBwYWdlLlxyXG5cdCAqXHJcblx0ICogQHJldHVybnMge3ZvaWR9XHJcblx0ICovXHJcblx0ZnVuY3Rpb24gaW5pdCgpIHtcclxuXHRcdHRlbXBsYXRlUXVpY2tFZGl0ID0gd3AudGVtcGxhdGUoIFwicmVkaXJlY3RzLWlubGluZS1lZGl0XCIgKTtcclxuXHJcblx0XHQkLmVhY2goXHJcblx0XHRcdCQoIFwiLnJlZGlyZWN0LXRhYmxlLXRhYlwiICksXHJcblx0XHRcdGZ1bmN0aW9uKCBrZXksIGVsZW1lbnQgKSB7XHJcblx0XHRcdFx0JCggZWxlbWVudCApLndwc2VvX3JlZGlyZWN0cyggJCggZWxlbWVudCApLmF0dHIoIFwiaWRcIiApICk7XHJcblx0XHRcdH1cclxuXHRcdCk7XHJcblxyXG5cdFx0aW5pdFNlbGVjdDIoKTtcclxuXHR9XHJcblxyXG5cdCQoIGluaXQgKTtcclxufSggalF1ZXJ5ICkgKTtcclxuIl19
