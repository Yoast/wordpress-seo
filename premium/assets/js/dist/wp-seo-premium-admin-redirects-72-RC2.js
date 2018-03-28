(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

/* jshint -W097 */
/* jshint -W098 */
/* jshint -W107 */
/* global ajaxurl, alert, wpseoPremiumStrings, wp, _, wpseoSelect2Locale */

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
				return this.setError(wpseoPremiumStrings.error_old_url);
			}

			return this.setError(wpseoPremiumStrings.error_regex);
		}

		// Only when the redirect type is not deleted.
		if (jQuery.inArray(parseInt(typeField.val(), 10), ALLOW_EMPTY_TARGET) === -1) {
			// Check new URL.
			if ("" === targetField.val()) {
				this.form.highlightRow(targetField);
				return this.setError(wpseoPremiumStrings.error_new_url);
			}

			// Check if both fields aren't the same.
			if (targetField.val() === originField.val()) {
				this.form.highlightRow(targetField);
				return this.setError(wpseoPremiumStrings.error_circular);
			}
		}

		// Check the redirect type.
		if ("" === typeField.val()) {
			this.form.highlightRow(typeField);
			return this.setError(wpseoPremiumStrings.error_new_type);
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

		if (typeof fields !== "undefined") {
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
	$.fn.wpseoRedirects = function (argType) {
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
					text: wpseoPremiumStrings.button_ok,
					click: function click() {
						$(this).dialog("close");
					}
				}];
			}

			return [{
				text: wpseoPremiumStrings.button_cancel,
				click: function click() {
					resetIgnore();
					$(this).dialog("close");
				}
			}, {
				text: wpseoPremiumStrings.button_save_anyway,
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
			if (typeof type === "undefined" || type === "error") {
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
				/* eslint-disable camelcase */
				this.dialog(wpseoPremiumStrings.edit_redirect, wpseoPremiumStrings.editing_redirect);
				/* eslint-enable camelcase */

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

			var tr = $("<tr>").append($("<th>").addClass("check-column").attr("scope", "row").append($("<input>").attr("name", "wpseo_redirects_bulk_delete[]").attr("type", "checkbox").val(_.escape(oldUrl)))).append($("<td>").addClass("type column-type has-row-actions column-primary").append($("<div>").addClass("val type").html(_.escape(redirectType))).append($("<div>").addClass("row-actions").append($("<span>").addClass("edit").append($("<a>").attr({ href: "#", role: "button", "class": "redirect-edit" }).html(wpseoPremiumStrings.editAction)).append(" | ")).append($("<span>").addClass("trash").append($("<a>").attr({ href: "#", role: "button", "class": "redirect-delete" }).html(wpseoPremiumStrings.deleteAction))))).append($("<td>").addClass("column-old").append($("<div>").addClass("val").html(_.escape(oldUrl)))).append($("<td>").addClass("column-new").append($("<div>").addClass(targetClasses.join(" ")).html(_.escape(newUrl))));

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
				that.dialog(wpseoPremiumStrings.error_saving_redirect, error.message, error.type);
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

				that.openDialog(wpseoPremiumStrings.redirect_added);
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
				/* eslint-disable camelcase */
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

				that.openDialog(wpseoPremiumStrings.redirect_updated);
			}
			/* eslint-enable camelcase */
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

				that.openDialog(wpseoPremiumStrings.redirect_deleted);
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
					return wpseoPremiumStrings.unsaved_redirects;
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
			$(element).wpseoRedirects($(element).attr("id"));
		});

		initSelect2();
	}

	$(init);
})(jQuery);

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhc3NldHMvanMvc3JjL2FkbWluLXJlZGlyZWN0cy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUUsV0FBVSxDQUFWLEVBQWM7QUFDZixLQUFJLHFCQUFxQixDQUN4QixHQUR3QixFQUNuQixHQURtQixDQUF6Qjs7QUFJQSxLQUFJLGdCQUFnQjtBQUNuQixVQUFRLENBRFc7QUFFbkIsVUFBUSxDQUZXO0FBR25CLFFBQU07QUFIYSxFQUFwQjs7QUFNQSxLQUFJLE9BQU87QUFDVixTQUFPO0FBREcsRUFBWDs7QUFJQSxLQUFJLGlCQUFKOztBQUVBOzs7Ozs7QUFNQSxLQUFJLGVBQWUsU0FBZixZQUFlLENBQVUsSUFBVixFQUFpQjtBQUNuQyxPQUFLLElBQUwsR0FBWSxJQUFaO0FBQ0EsRUFGRDs7QUFJQTs7Ozs7QUFLQSxjQUFhLFNBQWIsQ0FBdUIsY0FBdkIsR0FBd0MsWUFBVztBQUNsRCxTQUFPLEtBQUssSUFBTCxDQUFVLElBQVYsQ0FBZ0Isb0NBQWhCLENBQVA7QUFDQSxFQUZEOztBQUlBOzs7OztBQUtBLGNBQWEsU0FBYixDQUF1QixjQUF2QixHQUF3QyxZQUFXO0FBQ2xELFNBQU8sS0FBSyxJQUFMLENBQVUsSUFBVixDQUFnQixvQ0FBaEIsQ0FBUDtBQUNBLEVBRkQ7O0FBSUE7Ozs7O0FBS0EsY0FBYSxTQUFiLENBQXVCLFlBQXZCLEdBQXNDLFlBQVc7QUFDaEQsU0FBTyxLQUFLLElBQUwsQ0FBVSxJQUFWLENBQWdCLG1DQUFoQixDQUFQO0FBQ0EsRUFGRDs7QUFJQTs7Ozs7QUFLQSxjQUFhLFNBQWIsQ0FBdUIsaUJBQXZCLEdBQTJDLFlBQVc7QUFDckQsT0FBSyxJQUFMLENBQVUsSUFBVixDQUFnQixrQ0FBaEIsRUFBcUQsTUFBckQ7QUFDQSxFQUZEOztBQUlBOzs7Ozs7O0FBT0EsY0FBYSxTQUFiLENBQXVCLGVBQXZC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UyxJQUFULEdBQWdCO0FBQ2Ysc0JBQW9CLEdBQUcsUUFBSCxDQUFhLHVCQUFiLENBQXBCOztBQUVBLElBQUUsSUFBRixDQUNDLEVBQUcscUJBQUgsQ0FERCxFQUVDLFVBQVUsR0FBVixFQUFlLE9BQWYsRUFBeUI7QUFDeEIsS0FBRyxPQUFILEVBQWEsY0FBYixDQUE2QixFQUFHLE9BQUgsRUFBYSxJQUFiLENBQW1CLElBQW5CLENBQTdCO0FBQ0EsR0FKRjs7QUFPQTtBQUNBOztBQUVELEdBQUcsSUFBSDtBQUNBLENBaDFCQyxFQWcxQkMsTUFoMUJELENBQUYiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLyoganNoaW50IC1XMDk3ICovXG4vKiBqc2hpbnQgLVcwOTggKi9cbi8qIGpzaGludCAtVzEwNyAqL1xuLyogZ2xvYmFsIGFqYXh1cmwsIGFsZXJ0LCB3cHNlb1ByZW1pdW1TdHJpbmdzLCB3cCwgXywgd3BzZW9TZWxlY3QyTG9jYWxlICovXG5cbiggZnVuY3Rpb24oICQgKSB7XG5cdHZhciBBTExPV19FTVBUWV9UQVJHRVQgPSBbXG5cdFx0NDEwLCA0NTEsXG5cdF07XG5cblx0dmFyIFRBQkxFX0NPTFVNTlMgPSB7XG5cdFx0T1JJR0lOOiAxLFxuXHRcdFRBUkdFVDogMixcblx0XHRUWVBFOiAwLFxuXHR9O1xuXG5cdHZhciBLRVlTID0ge1xuXHRcdEVOVEVSOiAxMyxcblx0fTtcblxuXHR2YXIgdGVtcGxhdGVRdWlja0VkaXQ7XG5cblx0LyoqXG5cdCAqIEluaXRpYWxpemUgYSByZWRpcmVjdCBmb3JtIG9iamVjdC5cblx0ICpcblx0ICogQHBhcmFtIHtlbGVtZW50fSBmb3JtIFRoZSByZWRpcmVjdCBmb3JtLlxuXHQgKiBAY29uc3RydWN0b3Jcblx0ICovXG5cdHZhciBSZWRpcmVjdEZvcm0gPSBmdW5jdGlvbiggZm9ybSApIHtcblx0XHR0aGlzLmZvcm0gPSBmb3JtO1xuXHR9O1xuXG5cdC8qKlxuXHQgKiBSZXR1cm5zIHRoZSBvcmlnaW4gZmllbGRcblx0ICpcblx0ICogQHJldHVybnMge2VsZW1lbnR9IFRoZSBmaWVsZCBmb3IgdGhlIHJlZGlyZWN0IG9yaWdpbi5cblx0ICovXG5cdFJlZGlyZWN0Rm9ybS5wcm90b3R5cGUuZ2V0T3JpZ2luRmllbGQgPSBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gdGhpcy5mb3JtLmZpbmQoIFwiaW5wdXRbbmFtZT13cHNlb19yZWRpcmVjdHNfb3JpZ2luXVwiICk7XG5cdH07XG5cblx0LyoqXG5cdCAqIFJldHVybnMgdGhlIHRhcmdldCBmaWVsZFxuXHQgKlxuXHQgKiBAcmV0dXJucyB7ZWxlbWVudH0gVGhlIGZpZWxkIGZvciB0aGUgcmVkaXJlY3QgdGFyZ2V0LlxuXHQgKi9cblx0UmVkaXJlY3RGb3JtLnByb3RvdHlwZS5nZXRUYXJnZXRGaWVsZCA9IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiB0aGlzLmZvcm0uZmluZCggXCJpbnB1dFtuYW1lPXdwc2VvX3JlZGlyZWN0c190YXJnZXRdXCIgKTtcblx0fTtcblxuXHQvKipcblx0ICogUmV0dXJucyB0aGUgdHlwZSBmaWVsZFxuXHQgKlxuXHQgKiBAcmV0dXJucyB7ZWxlbWVudH0gVGhlIGZpZWxkIGZvciByZWRpcmVjdCB0eXBlLlxuXHQgKi9cblx0UmVkaXJlY3RGb3JtLnByb3RvdHlwZS5nZXRUeXBlRmllbGQgPSBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gdGhpcy5mb3JtLmZpbmQoIFwic2VsZWN0W25hbWU9d3BzZW9fcmVkaXJlY3RzX3R5cGVdXCIgKTtcblx0fTtcblxuXHQvKipcblx0ICogQ2xlYXJzIHRoZSBmb3JtIGVycm9yIG1lc3NhZ2UuXG5cdCAqXG5cdCAqIEByZXR1cm5zIHt2b2lkfVxuXHQgKi9cblx0UmVkaXJlY3RGb3JtLnByb3RvdHlwZS5jbGVhckVycm9yTWVzc2FnZSA9IGZ1bmN0aW9uKCkge1xuXHRcdHRoaXMuZm9ybS5maW5kKCBcIi53cHNlb19yZWRpcmVjdF9mb3JtIC5mb3JtX2Vycm9yXCIgKS5yZW1vdmUoKTtcblx0fTtcblxuXHQvKipcblx0ICogU2V0cyBhIGZvcm0gZXJyb3IgbWVzc2FnZS5cblx0ICpcblx0ICogQHBhcmFtIHtzdHJpbmd9IGVycm9yTWVzc2FnZSBUaGUgZXJyb3IgbWVzc2FnZSB0byBzZXQuXG5cdCAqXG5cdCAqIEByZXR1cm5zIHt2b2lkfVxuXHQgKi9cblx0UmVkaXJlY3RGb3JtLnByb3RvdHlwZS5zZXRFcnJvck1lc3NhZ2UgPSBmdW5jdGlvbiggZXJyb3JNZXNzYWdlICkge1xuXHRcdHRoaXMuZm9ybS5maW5kKCBcIi53cHNlb19yZWRpcmVjdF9mb3JtXCIgKS5wcmVwZW5kKCBcIjxkaXYgY2xhc3M9XFxcImZvcm1fZXJyb3IgZXJyb3JcXFwiPjxwPlwiICsgZXJyb3JNZXNzYWdlICsgXCI8L3A+PC9kaXY+XCIgKTtcblx0fTtcblxuXHQvKipcblx0ICogUmVtb3ZpbmcgdGhlIHJvdyBlcnJvcnNcblx0ICpcblx0ICogQHJldHVybnMge3ZvaWR9XG5cdCAqL1xuXHRSZWRpcmVjdEZvcm0ucHJvdG90eXBlLnJlbW92ZVJvd0hpZ2hsaWdodHMgPSBmdW5jdGlvbigpIHtcblx0XHR0aGlzLmZvcm0uZmluZCggXCIucmVkaXJlY3RfZm9ybV9yb3dcIiApLnJlbW92ZUNsYXNzKCBcImZpZWxkX2Vycm9yXCIgKTtcblx0fTtcblxuXHQvKipcblx0ICogSGlnaGxpZ2h0aW5nIHRoZSByb3cgZXJyb3JzLlxuXHQgKlxuXHQgKiBAcGFyYW0ge2FycmF5fSBmaWVsZHNUb0hpZ2hsaWdodCBUaGUgZmllbGRzIHRvIGhpZ2hsaWdodC5cblx0ICpcblx0ICogQHJldHVybnMge3ZvaWR9XG5cdCAqL1xuXHRSZWRpcmVjdEZvcm0ucHJvdG90eXBlLmhpZ2hMaWdodFJvd0Vycm9ycyA9IGZ1bmN0aW9uKCBmaWVsZHNUb0hpZ2hsaWdodCApIHtcblx0XHRmb3IoIHZhciBpID0gMDsgaSA8IGZpZWxkc1RvSGlnaGxpZ2h0Lmxlbmd0aDsgaSsrICkge1xuXHRcdFx0c3dpdGNoKCBmaWVsZHNUb0hpZ2hsaWdodFsgaSBdICkge1xuXHRcdFx0XHRjYXNlIFwib3JpZ2luXCI6XG5cdFx0XHRcdFx0dGhpcy5oaWdobGlnaHRSb3coIHRoaXMuZ2V0T3JpZ2luRmllbGQoKSApO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIFwidGFyZ2V0XCI6XG5cdFx0XHRcdFx0dGhpcy5oaWdobGlnaHRSb3coIHRoaXMuZ2V0VGFyZ2V0RmllbGQoKSApO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIFwidHlwZVwiOlxuXHRcdFx0XHRcdHRoaXMuaGlnaGxpZ2h0Um93KCB0aGlzLmdldFR5cGVGaWVsZCgpICk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cdFx0fVxuXHR9O1xuXG5cdC8qKlxuXHQgKiBIaWdobGlnaHRzIHRoZSBjbG9zZXN0IHJvdyB3aXRoIGFuIGVycm9yIGNsYXNzLlxuXHQgKlxuXHQgKiBAcGFyYW0ge2VsZW1lbnR9IGVycm9yRmllbGQgVGhlIGZpZWxkIHRvIGhpZ2h0bGlnaHQuXG5cdCAqXG5cdCAqIEByZXR1cm5zIHt2b2lkfVxuXHQgKi9cblx0UmVkaXJlY3RGb3JtLnByb3RvdHlwZS5oaWdobGlnaHRSb3cgPSBmdW5jdGlvbiggZXJyb3JGaWVsZCApIHtcblx0XHRqUXVlcnkoIGVycm9yRmllbGQgKS5jbG9zZXN0KCBcImRpdi5yZWRpcmVjdF9mb3JtX3Jvd1wiICkuYWRkQ2xhc3MoIFwiZmllbGRfZXJyb3JcIiApO1xuXHR9O1xuXG5cdC8qKlxuXHQgKiBDbGllbnRzaWRlIHZhbGlkYXRvciBmb3IgdGhlIHJlZGlyZWN0XG5cdCAqXG5cdCAqIEBwYXJhbSB7UmVkaXJlY3RGb3JtfSBmb3JtIEZvcm0gb2JqZWN0IHJlcHJlc2VudGluZyB0aGUgZm9ybS5cblx0ICogQHBhcmFtIHtzdHJpbmd9IHR5cGUgICAgICAgVGhlIHJlZGlyZWN0IHR5cGUuXG5cdCAqXG5cdCAqIEByZXR1cm5zIHt2b2lkfVxuXHQgKi9cblx0dmFyIFZhbGlkYXRlUmVkaXJlY3QgPSBmdW5jdGlvbiggZm9ybSwgdHlwZSApIHtcblx0XHR0aGlzLmZvcm0gPSBmb3JtO1xuXHRcdHRoaXMudHlwZSA9IHR5cGU7XG5cdFx0dGhpcy52YWxpZGF0aW9uRXJyb3IgPSBcIlwiO1xuXHR9O1xuXG5cdC8qKlxuXHQgKiBWYWxpZGF0ZXMgZm9yIHRoZSBmb3JtIGZpZWxkc1xuXHQgKlxuXHQgKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSB3aGVuIHZhbGlkYXRpb24gaGFzIGJlZW4gc3VjY2Vzc2Z1bC5cblx0ICovXG5cdFZhbGlkYXRlUmVkaXJlY3QucHJvdG90eXBlLnZhbGlkYXRlID0gZnVuY3Rpb24oKSB7XG5cdFx0dGhpcy5mb3JtLmNsZWFyRXJyb3JNZXNzYWdlKCk7XG5cblx0XHR0aGlzLmZvcm0ucmVtb3ZlUm93SGlnaGxpZ2h0cygpO1xuXG5cdFx0aWYoIHRoaXMucnVuVmFsaWRhdGlvbiggdGhpcy5mb3JtLmdldE9yaWdpbkZpZWxkKCksIHRoaXMuZm9ybS5nZXRUYXJnZXRGaWVsZCgpLCB0aGlzLmZvcm0uZ2V0VHlwZUZpZWxkKCkgKSA9PT0gZmFsc2UgKSB7XG5cdFx0XHR0aGlzLmFkZFZhbGlkYXRpb25FcnJvciggdGhpcy52YWxpZGF0aW9uRXJyb3IgKTtcblxuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdHJldHVybiB0cnVlO1xuXHR9O1xuXG5cdC8qKlxuXHQgKiBFeGVjdXRlcyB0aGUgdmFsaWRhdGlvbi5cblx0ICpcblx0ICogQHBhcmFtIHtlbGVtZW50fSBvcmlnaW5GaWVsZCBUaGUgb3JpZ2luIGZpZWxkLlxuXHQgKiBAcGFyYW0ge2VsZW1lbnR9IHRhcmdldEZpZWxkIFRoZSB0YXJnZXQgZmllbGQuXG5cdCAqIEBwYXJhbSB7ZWxlbWVudH0gdHlwZUZpZWxkICAgVGhlIHR5cGUgZmllbGQuXG5cdCAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIHdoZW4gdmFsaWRhdGlvbiBoYXMgYmVlbiBzdWNjZXNzZnVsLlxuXHQgKi9cblx0VmFsaWRhdGVSZWRpcmVjdC5wcm90b3R5cGUucnVuVmFsaWRhdGlvbiA9IGZ1bmN0aW9uKCBvcmlnaW5GaWVsZCwgdGFyZ2V0RmllbGQsIHR5cGVGaWVsZCApIHtcblx0XHQvLyBDaGVjayBvbGQgVVJMLlxuXHRcdGlmICggXCJcIiA9PT0gb3JpZ2luRmllbGQudmFsKCkgKSB7XG5cdFx0XHR0aGlzLmZvcm0uaGlnaGxpZ2h0Um93KCBvcmlnaW5GaWVsZCApO1xuXG5cdFx0XHRpZiAoIFwicGxhaW5cIiA9PT0gdGhpcy50eXBlICkge1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5zZXRFcnJvciggd3BzZW9QcmVtaXVtU3RyaW5ncy5lcnJvcl9vbGRfdXJsICk7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiB0aGlzLnNldEVycm9yKCB3cHNlb1ByZW1pdW1TdHJpbmdzLmVycm9yX3JlZ2V4ICk7XG5cdFx0fVxuXG5cdFx0Ly8gT25seSB3aGVuIHRoZSByZWRpcmVjdCB0eXBlIGlzIG5vdCBkZWxldGVkLlxuXHRcdGlmKCAgalF1ZXJ5LmluQXJyYXkoIHBhcnNlSW50KCB0eXBlRmllbGQudmFsKCksIDEwICksIEFMTE9XX0VNUFRZX1RBUkdFVCApID09PSAtMSApIHtcblx0XHRcdC8vIENoZWNrIG5ldyBVUkwuXG5cdFx0XHRpZiAoIFwiXCIgPT09IHRhcmdldEZpZWxkLnZhbCgpICkge1xuXHRcdFx0XHR0aGlzLmZvcm0uaGlnaGxpZ2h0Um93KCB0YXJnZXRGaWVsZCApO1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5zZXRFcnJvciggd3BzZW9QcmVtaXVtU3RyaW5ncy5lcnJvcl9uZXdfdXJsICk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIENoZWNrIGlmIGJvdGggZmllbGRzIGFyZW4ndCB0aGUgc2FtZS5cblx0XHRcdGlmICggdGFyZ2V0RmllbGQudmFsKCkgPT09IG9yaWdpbkZpZWxkLnZhbCgpICkge1xuXHRcdFx0XHR0aGlzLmZvcm0uaGlnaGxpZ2h0Um93KCB0YXJnZXRGaWVsZCApO1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5zZXRFcnJvciggd3BzZW9QcmVtaXVtU3RyaW5ncy5lcnJvcl9jaXJjdWxhciApO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdC8vIENoZWNrIHRoZSByZWRpcmVjdCB0eXBlLlxuXHRcdGlmICggXCJcIiA9PT0gdHlwZUZpZWxkLnZhbCgpICkge1xuXHRcdFx0dGhpcy5mb3JtLmhpZ2hsaWdodFJvdyggdHlwZUZpZWxkICk7XG5cdFx0XHRyZXR1cm4gdGhpcy5zZXRFcnJvciggd3BzZW9QcmVtaXVtU3RyaW5ncy5lcnJvcl9uZXdfdHlwZSApO1xuXHRcdH1cblxuXHRcdHJldHVybiB0cnVlO1xuXHR9O1xuXG5cdC8qKlxuXHQgKiBTZXRzIHRoZSB2YWxpZGF0aW9uIGVycm9yIGFuZCByZXR1cm4gZmFsc2UuXG5cdCAqXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBlcnJvciBUaGUgZXJyb3IgdG8gc2V0LlxuXHQgKiBAcmV0dXJucyB7Ym9vbGVhbn0gRmFsc2UsIGJlY2F1c2UgdGhlcmUgaXMgYW4gZXJyb3IuXG5cdCAqL1xuXHRWYWxpZGF0ZVJlZGlyZWN0LnByb3RvdHlwZS5zZXRFcnJvciA9IGZ1bmN0aW9uKCBlcnJvciApIHtcblx0XHR0aGlzLnZhbGlkYXRpb25FcnJvciA9IGVycm9yO1xuXHRcdHJldHVybiBmYWxzZTtcblx0fTtcblxuXHQvKipcblx0ICogQWRkaW5nIHRoZSB2YWxpZGF0aW9uIGVycm9yXG5cdCAqXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBlcnJvciAgVGhlIGVycm9yIG1lc3NhZ2UuXG5cdCAqIEBwYXJhbSB7b2JqZWN0fSBmaWVsZHMgVGhlIGZpZWxkcyByZWxhdGVkIHRvIHRoZSBlcnJvci5cblx0ICpcblx0ICogQHJldHVybnMge3ZvaWR9XG5cdCAqL1xuXHRWYWxpZGF0ZVJlZGlyZWN0LnByb3RvdHlwZS5hZGRWYWxpZGF0aW9uRXJyb3IgPSBmdW5jdGlvbiggZXJyb3IsIGZpZWxkcyApIHtcblx0XHR0aGlzLmZvcm0uc2V0RXJyb3JNZXNzYWdlKCBlcnJvciApO1xuXG5cdFx0aWYoIHR5cGVvZiBmaWVsZHMgIT09IFwidW5kZWZpbmVkXCIgKSB7XG5cdFx0XHR0aGlzLmZvcm0uaGlnaExpZ2h0Um93RXJyb3JzKCBmaWVsZHMgKTtcblx0XHR9XG5cdH07XG5cblx0LyoqXG5cdCAqIFJldHVybnMgdGhlIHZhbHVlcyBvbiB0aGUgcXVpY2sgZWRpdCBmb3JtXG5cdCAqXG5cdCAqIEByZXR1cm5zIHt7b3JpZ2luOiAoc3RyaW5nfCopLCB0YXJnZXQ6IChzdHJpbmd8KiksIHR5cGU6IChzdHJpbmd8Kil9fSBPYmplY3Qgd2l0aCB0aGUgZm9ybSB2YWx1ZXMuXG5cdCAqL1xuXHRWYWxpZGF0ZVJlZGlyZWN0LnByb3RvdHlwZS5nZXRGb3JtVmFsdWVzID0gZnVuY3Rpb24oKSB7XG5cdFx0dmFyIHZhbHVlcyA9IHtcblx0XHRcdG9yaWdpbjogdGhpcy5mb3JtLmdldE9yaWdpbkZpZWxkKCkudmFsKCkudG9TdHJpbmcoKSxcblx0XHRcdHRhcmdldDogdGhpcy5mb3JtLmdldFRhcmdldEZpZWxkKCkudmFsKCkudG9TdHJpbmcoKSxcblx0XHRcdHR5cGU6IHRoaXMuZm9ybS5nZXRUeXBlRmllbGQoKS52YWwoKS50b1N0cmluZygpLFxuXHRcdH07XG5cblx0XHQvLyBXaGVuIHRoZSByZWRpcmVjdCB0eXBlIGlzIGRlbGV0ZWQgb3IgdW5hdmFpbGFibGUsIHRoZSB0YXJnZXQgY2FuIGJlIGVtcHRpZWQuXG5cdFx0aWYgKCBqUXVlcnkuaW5BcnJheSggcGFyc2VJbnQoIHZhbHVlcy50eXBlLCAxMCApLCBBTExPV19FTVBUWV9UQVJHRVQgKSA+IC0xICkge1xuXHRcdFx0dmFsdWVzLnRhcmdldCA9IFwiXCI7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHZhbHVlcztcblx0fTtcblxuXHQvKipcblx0ICogVGhlIHF1aWNrIGVkaXQgcHJvdG90eXBlIGZvciBoYW5kbGluZyB0aGUgcXVpY2sgZWRpdCBvbiBmb3JtIHJvd3MuXG5cdCAqIEBjb25zdHJ1Y3RvclxuXHQgKi9cblx0dmFyIFJlZGlyZWN0UXVpY2tFZGl0ID0gZnVuY3Rpb24oKSB7XG5cdFx0dGhpcy5yb3cgPSBudWxsO1xuXHRcdHRoaXMucXVpY2tFZGl0Um93ID0gbnVsbDtcblx0fTtcblxuXHQvKipcblx0ICogU2V0dGluZyB1cHQgdGhlIHF1aWNrIGVkaXQgZm9yIGEgcm93LCB3aXRoIHRoZSBnaXZlbiByb3cgdmFsdWVzLlxuXHQgKlxuXHQgKiBAcGFyYW0ge2VsZW1lbnR9IHJvdyAgICAgVGhlIGZvcm0gcm93IG9iamVjdC5cblx0ICogQHBhcmFtIHtvYmplY3R9IHJvd0NlbGxzIFRoZSBmb3JtIHJvdyBjZWxscy5cblx0ICpcblx0ICogQHJldHVybnMge3ZvaWR9XG5cdCAqL1xuXHRSZWRpcmVjdFF1aWNrRWRpdC5wcm90b3R5cGUuc2V0dXAgPSBmdW5jdGlvbiggcm93LCByb3dDZWxscyApIHtcblx0XHR0aGlzLnJvdyAgICAgICAgICA9IHJvdztcblx0XHR0aGlzLnF1aWNrRWRpdFJvdyA9ICQoXG5cdFx0XHR0ZW1wbGF0ZVF1aWNrRWRpdCgge1xuXHRcdFx0XHRvcmlnaW46IF8udW5lc2NhcGUoIHJvd0NlbGxzLm9yaWdpbi5odG1sKCkgKSxcblx0XHRcdFx0dGFyZ2V0OiBfLnVuZXNjYXBlKCByb3dDZWxscy50YXJnZXQuaHRtbCgpICksXG5cdFx0XHRcdHR5cGU6IHBhcnNlSW50KCByb3dDZWxscy50eXBlLmh0bWwoKSwgMTAgKSxcblx0XHRcdFx0c3VmZml4OiAkKCBcIiN0aGUtbGlzdFwiICkuZmluZCggXCJ0clwiICkuaW5kZXgoIHJvdyApLFxuXHRcdFx0fSApXG5cdFx0KTtcblx0fTtcblxuXHQvKipcblx0ICogUmV0dXJucyB0aGUgb3JpZ2luYWwgcm93IGVsZW1lbnRcblx0ICpcblx0ICogQHJldHVybnMge2VsZW1lbnR9IFRoZSByb3cgb2JqZWN0LlxuXHQgKi9cblx0UmVkaXJlY3RRdWlja0VkaXQucHJvdG90eXBlLmdldFJvdyA9IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiB0aGlzLnJvdztcblx0fTtcblxuXHQvKipcblx0ICogUmV0dXJucyB0aGUgb3JpZ2luYWwgcm93IGVsZW1lbnRcblx0ICpcblx0ICogQHJldHVybnMge2VsZW1lbnR9IFRoZSBmb3JtIG9iamVjdC5cblx0ICovXG5cdFJlZGlyZWN0UXVpY2tFZGl0LnByb3RvdHlwZS5nZXRGb3JtID0gZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIHRoaXMucXVpY2tFZGl0Um93O1xuXHR9O1xuXG5cdC8qKlxuXHQgKiBTaG93cyB0aGUgcXVpY2sgZWRpdCBmb3JtIGFuZCBoaWRlcyB0aGUgcmVkaXJlY3Qgcm93LlxuXHQgKlxuXHQgKiBAcmV0dXJucyB7dm9pZH1cblx0ICovXG5cdFJlZGlyZWN0UXVpY2tFZGl0LnByb3RvdHlwZS5zaG93ID0gZnVuY3Rpb24oKSB7XG5cdFx0dGhpcy5yb3cuYWRkQ2xhc3MoIFwiaGlkZGVuXCIgKTtcblx0XHR0aGlzLnF1aWNrRWRpdFJvd1xuXHRcdFx0Lmluc2VydEFmdGVyKCB0aGlzLnJvdyApXG5cdFx0XHQuc2hvdyggNDAwLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0JCggdGhpcyApLmZpbmQoIFwiOmlucHV0XCIgKS5maXJzdCgpLmZvY3VzKCk7XG5cdFx0XHR9ICk7XG5cdH07XG5cblx0LyoqXG5cdCAqIEhpZGVzIHRoZSBxdWljayBlZGl0IGZvcm0gYW5kIHNob3cgdGhlIHJlZGlyZWN0IHJvdy5cblx0ICpcblx0ICogQHJldHVybnMge3ZvaWR9XG5cdCAqL1xuXHRSZWRpcmVjdFF1aWNrRWRpdC5wcm90b3R5cGUucmVtb3ZlID0gZnVuY3Rpb24oKSB7XG5cdFx0dGhpcy5yb3cucmVtb3ZlQ2xhc3MoIFwiaGlkZGVuXCIgKTtcblx0XHR0aGlzLnF1aWNrRWRpdFJvdy5yZW1vdmUoKTtcblx0fTtcblxuXHQvLyBJbnN0YW50aWF0ZSB0aGUgcXVpY2sgZWRpdCBmb3JtLlxuXHR2YXIgcmVkaXJlY3RzUXVpY2tFZGl0ID0gbmV3IFJlZGlyZWN0UXVpY2tFZGl0KCk7XG5cblx0Ly8gRXh0ZW5kIHRoZSBqUXVlcnkgVUkgZGlhbG9nIHdpZGdldCBmb3Igb3VyIG5lZWRzLlxuXHQkLndpZGdldCggXCJ1aS5kaWFsb2dcIiwgJC51aS5kaWFsb2csIHtcblx0XHQvLyBFeHRlbmQgdGhlIGBfY3JlYXRlT3ZlcmxheWAgZnVuY3Rpb24uXG5cdFx0X2NyZWF0ZU92ZXJsYXk6IGZ1bmN0aW9uKCkge1xuXHRcdFx0dGhpcy5fc3VwZXIoKTtcblx0XHRcdC8vIElmIHRoZSBtb2RhbCBvcHRpb24gaXMgdHJ1ZSwgYWRkIGEgY2xpY2sgZXZlbnQgb24gdGhlIG92ZXJsYXkuXG5cdFx0XHRpZiAoIHRoaXMub3B0aW9ucy5tb2RhbCApIHtcblx0XHRcdFx0dGhpcy5fb24oIHRoaXMub3ZlcmxheSwge1xuXHRcdFx0XHRcdGNsaWNrOiBmdW5jdGlvbiggZXZlbnQgKSB7XG5cdFx0XHRcdFx0XHR0aGlzLmNsb3NlKCBldmVudCApO1xuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdH0gKTtcblx0XHRcdH1cblx0XHR9LFxuXHR9ICk7XG5cblx0LyoqXG5cdCAqIEV4dGVuZGluZyB0aGUgZWxlbWVudHMgd2l0aCBhIHdwc2VvX3JlZGlyZWN0cyBvYmplY3Rcblx0ICpcblx0ICogQHBhcmFtIHtzdHJpbmd9IGFyZ1R5cGUgVGhlIHJlZGlyZWN0IHRhYmxlLlxuXHQgKlxuXHQgKiBAcmV0dXJucyB7dm9pZH1cblx0ICovXG5cdCQuZm4ud3BzZW9SZWRpcmVjdHMgPSBmdW5jdGlvbiggYXJnVHlwZSApIHtcblx0XHR2YXIgdGhhdCAgID0gdGhpcztcblx0XHR2YXIgdHlwZSAgID0gYXJnVHlwZS5yZXBsYWNlKCBcInRhYmxlLVwiLCBcIlwiICk7XG5cdFx0dmFyIGlnbm9yZSA9IGZhbHNlO1xuXG5cdFx0dmFyIGxhc3RBY3Rpb247XG5cblx0XHQvLyBUaGUgZWxlbWVudCBmb2N1cyBrZXlib2FyZCBzaG91bGQgYmUgbW92ZWQgYmFjayB0by5cblx0XHR2YXIgcmV0dXJuRm9jdXNUb0VsID0gbnVsbDtcblxuXHRcdC8qKlxuXHRcdCAqIFJlc2V0cyB0aGUgaWdub3JlIGFuZCBsYXN0QWN0aW9uLlxuXHRcdCAqXG5cdFx0ICogQHJldHVybnMge3ZvaWR9XG5cdFx0ICovXG5cdFx0dmFyIHJlc2V0SWdub3JlID0gZnVuY3Rpb24oKSB7XG5cdFx0XHRpZ25vcmUgICAgICA9IGZhbHNlO1xuXHRcdFx0bGFzdEFjdGlvbiA9IG51bGw7XG5cdFx0fTtcblxuXHRcdHRoaXMuZ2V0QnV0dG9ucyA9IGZ1bmN0aW9uKCB0eXBlICkge1xuXHRcdFx0aWYgKCB0eXBlID09PSBcImRlZmF1bHRcIiApIHtcblx0XHRcdFx0cmV0dXJuIFtcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHR0ZXh0OiB3cHNlb1ByZW1pdW1TdHJpbmdzLmJ1dHRvbl9vayxcblx0XHRcdFx0XHRcdGNsaWNrOiBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRcdFx0JCggdGhpcyApLmRpYWxvZyggXCJjbG9zZVwiICk7XG5cdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdF07XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBbXG5cdFx0XHRcdHtcblx0XHRcdFx0XHR0ZXh0OiB3cHNlb1ByZW1pdW1TdHJpbmdzLmJ1dHRvbl9jYW5jZWwsXG5cdFx0XHRcdFx0Y2xpY2s6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0cmVzZXRJZ25vcmUoKTtcblx0XHRcdFx0XHRcdCQoIHRoaXMgKS5kaWFsb2coIFwiY2xvc2VcIiApO1xuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHR0ZXh0OiB3cHNlb1ByZW1pdW1TdHJpbmdzLmJ1dHRvbl9zYXZlX2FueXdheSxcblx0XHRcdFx0XHRcImNsYXNzXCI6IFwiYnV0dG9uLXByaW1hcnlcIixcblx0XHRcdFx0XHRjbGljazogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHRpZ25vcmUgPSB0cnVlO1xuXG5cdFx0XHRcdFx0XHQvLyBUaGUgdmFsdWUgb2YgbGFzdCBhY3Rpb24gd2lsbCBiZSB0aGUgYnV0dG9uIHByZXNzZWQgdG8gc2F2ZSB0aGUgcmVkaXJlY3QuXG5cdFx0XHRcdFx0XHRsYXN0QWN0aW9uKCk7XG5cblx0XHRcdFx0XHRcdCQoIHRoaXMgKS5kaWFsb2coIFwiY2xvc2VcIiApO1xuXG5cdFx0XHRcdFx0XHRyZXNldElnbm9yZSgpO1xuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdH0sXG5cdFx0XHRdO1xuXHRcdH07XG5cblx0XHQvKipcblx0XHQgKiBSZXR1cm5zIGEgbWFwcGVkIG9iamVjdCB3aXRoIHRoZSByb3cgY29sdW1uIGVsZW1lbnRzXG5cdFx0ICpcblx0XHQgKiBAcGFyYW0ge09iamVjdH0gcm93IFRoZSByb3cgb2JqZWN0LlxuXHRcdCAqIEByZXR1cm5zIHt7b3JpZ2luOiAqLCB0YXJnZXQ6ICosIHR5cGU6ICp9fSBUaGUgdmFsdWVzIG9mIHRoZSBmaWVsZHMgaW4gdGhlIHJvdy5cblx0XHQgKi9cblx0XHR0aGlzLnJvd0NlbGxzID0gZnVuY3Rpb24oIHJvdyApIHtcblx0XHRcdHZhciByb3dWYWx1ZXMgPSByb3cuZmluZCggXCIudmFsXCIgKTtcblxuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0b3JpZ2luOiByb3dWYWx1ZXMuZXEoIFRBQkxFX0NPTFVNTlMuT1JJR0lOICksXG5cdFx0XHRcdHRhcmdldDogcm93VmFsdWVzLmVxKCBUQUJMRV9DT0xVTU5TLlRBUkdFVCApLFxuXHRcdFx0XHR0eXBlOiByb3dWYWx1ZXMuZXEoIFRBQkxFX0NPTFVNTlMuVFlQRSApLFxuXHRcdFx0fTtcblx0XHR9O1xuXG5cdFx0LyoqXG5cdFx0ICogU2hvd2luZyBhIGRpYWxvZyBvbiB0aGUgc2NyZWVuXG5cdFx0ICpcblx0XHQgKiBAcGFyYW0ge3N0cmluZ30gdGl0bGUgRGlhbG9nIHRpdGxlLlxuXHRcdCAqIEBwYXJhbSB7c3RyaW5nfSB0ZXh0ICBUaGUgdGV4dCBmb3IgdGhlIGRpYWxvZy5cblx0XHQgKiBAcGFyYW0ge3N0cmluZ30gdHlwZSAgVGhlIGRpYWxvZyB0eXBlLlxuXHRcdCAqXG5cdFx0ICogQHJldHVybnMge3ZvaWR9XG5cdFx0ICovXG5cdFx0dGhpcy5kaWFsb2cgPSBmdW5jdGlvbiggdGl0bGUsIHRleHQsIHR5cGUgKSB7XG5cdFx0XHRpZiAoIHR5cGVvZiB0eXBlID09PSBcInVuZGVmaW5lZFwiIHx8IHR5cGUgPT09IFwiZXJyb3JcIiApIHtcblx0XHRcdFx0dHlwZSA9IFwiZGVmYXVsdFwiO1xuXHRcdFx0fVxuXG5cdFx0XHR2YXIgYnV0dG9ucyA9IHRoaXMuZ2V0QnV0dG9ucyggdHlwZSApO1xuXG5cdFx0XHQkKCBcIiNZb2FzdFJlZGlyZWN0RGlhbG9nVGV4dFwiICkuaHRtbCggdGV4dCApO1xuXHRcdFx0JCggXCIjWW9hc3RSZWRpcmVjdERpYWxvZ1wiICkuZGlhbG9nKFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0dGl0bGU6IHRpdGxlLFxuXHRcdFx0XHRcdHdpZHRoOiA1MDAsXG5cdFx0XHRcdFx0ZHJhZ2dhYmxlOiBmYWxzZSxcblx0XHRcdFx0XHRyZXNpemFibGU6IGZhbHNlLFxuXHRcdFx0XHRcdHBvc2l0aW9uOiB7XG5cdFx0XHRcdFx0XHRhdDogXCJjZW50ZXIgY2VudGVyXCIsXG5cdFx0XHRcdFx0XHRteTogXCJjZW50ZXIgY2VudGVyXCIsXG5cdFx0XHRcdFx0XHRvZjogd2luZG93LFxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0YnV0dG9uczogYnV0dG9ucyxcblx0XHRcdFx0XHRtb2RhbDogdHJ1ZSxcblx0XHRcdFx0XHRjbG9zZTogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm5Gb2N1c1RvRWwuZm9jdXMoKTtcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHR9XG5cdFx0XHQpO1xuXHRcdH07XG5cblx0XHQvKipcblx0XHQgKiBIYW5kbGUgdGhlIHJlc3BvbnNlXG5cdFx0ICpcblx0XHQgKiBAcGFyYW0ge29iamVjdH0gc3VjY2Vzc01lc3NhZ2UgVGhlIG1lc3NhZ2UgdGhhdCB3aWxsIGJlIGRpc3BsYXllZCBvbiBzdWNjZXNzLlxuXHRcdCAqXG5cdFx0ICogQHJldHVybnMge3ZvaWR9XG5cdFx0ICovXG5cdFx0dGhpcy5vcGVuRGlhbG9nID0gZnVuY3Rpb24oIHN1Y2Nlc3NNZXNzYWdlICkge1xuXHRcdFx0dGhpcy5kaWFsb2coIHN1Y2Nlc3NNZXNzYWdlLnRpdGxlLCBzdWNjZXNzTWVzc2FnZS5tZXNzYWdlICk7XG5cdFx0fTtcblxuXHRcdC8qKlxuXHRcdCAqIFNlbmRpbmcgcG9zdCByZXF1ZXN0XG5cdFx0ICpcblx0XHQgKiBAcGFyYW0ge29iamVjdH0gICBkYXRhICAgICAgIFRoZSBkYXRhIHRvIHBvc3QuXG5cdFx0ICogQHBhcmFtIHtmdW5jdGlvbn0gb25jb21wbGV0ZSBDYWxsYmFjayB3aGVuIHJlcXVlc3QgaGFzIGJlZW4gc3VjY2Vzc2Z1bC5cblx0XHQgKlxuXHRcdCAqIEByZXR1cm5zIHt2b2lkfVxuXHRcdCAqL1xuXHRcdHRoaXMucG9zdCA9IGZ1bmN0aW9uKCBkYXRhLCBvbmNvbXBsZXRlICkge1xuXHRcdFx0JC5wb3N0KCBhamF4dXJsLCBkYXRhLCBvbmNvbXBsZXRlLCBcImpzb25cIiApO1xuXHRcdH07XG5cblx0XHQvKipcblx0XHQgKiBDcmVhdGluZyBhbiBlZGl0IHJvdyBmb3IgZWRpdHRpbmcgYSByZWRpcmVjdC5cblx0XHQgKlxuXHRcdCAqIEBwYXJhbSB7b2JqZWN0fSByb3cgVGhlIHJvdyB0byBlZGl0LlxuXHRcdCAqXG5cdFx0ICogQHJldHVybnMge3ZvaWR9XG5cdFx0ICovXG5cdFx0dGhpcy5lZGl0Um93ID0gZnVuY3Rpb24oIHJvdyApIHtcblx0XHRcdC8vIEp1c3Qgc2hvdyBhIGRpYWxvZyB3aGVuIHRoZXJlIGlzIGFscmVhZHkgYSBxdWljayBlZGl0IGZvcm0gb3BlbmVkLlxuXHRcdFx0aWYoICQoIFwiI3RoZS1saXN0XCIgKS5maW5kKCBcIiNpbmxpbmUtZWRpdFwiICkubGVuZ3RoID4gMCApIHtcblx0XHRcdFx0LyogZXNsaW50LWRpc2FibGUgY2FtZWxjYXNlICovXG5cdFx0XHRcdHRoaXMuZGlhbG9nKFxuXHRcdFx0XHRcdHdwc2VvUHJlbWl1bVN0cmluZ3MuZWRpdF9yZWRpcmVjdCxcblx0XHRcdFx0XHR3cHNlb1ByZW1pdW1TdHJpbmdzLmVkaXRpbmdfcmVkaXJlY3Rcblx0XHRcdFx0KTtcblx0XHRcdFx0LyogZXNsaW50LWVuYWJsZSBjYW1lbGNhc2UgKi9cblxuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdC8vIFJ1bm5pbmcgdGhlIHNldHVwIGFuZCBzaG93IHRoZSBxdWljayBlZGl0IGZvcm0uXG5cdFx0XHRyZWRpcmVjdHNRdWlja0VkaXQuc2V0dXAoIHJvdywgdGhpcy5yb3dDZWxscyggcm93ICkgKTtcblx0XHRcdHJlZGlyZWN0c1F1aWNrRWRpdC5zaG93KCk7XG5cblx0XHRcdG5ldyBSZWRpcmVjdEZvcm0oIHJlZGlyZWN0c1F1aWNrRWRpdC5xdWlja0VkaXRSb3cgKS5nZXRUeXBlRmllbGQoKS50cmlnZ2VyKCBcImNoYW5nZVwiICk7XG5cdFx0fTtcblxuXHRcdC8qKlxuXHRcdCAqIENyZWF0ZSBhIHRhYmxlIHJvdyBlbGVtZW50IHdpdGggdGhlIG5ldyBhZGRlZCByZWRpcmVjdCBkYXRhXG5cdFx0ICpcblx0XHQgKiBAcGFyYW0ge3N0cmluZ30gb2xkVXJsICAgICAgIFRoZSBvbGQgdXJsLlxuXHRcdCAqIEBwYXJhbSB7c3RyaW5nfSBuZXdVcmwgICAgICAgVGhlIG5ldyB1cmwuXG5cdFx0ICogQHBhcmFtIHtzdHJpbmd9IHJlZGlyZWN0VHlwZSBUaGUgdHlwZSBvZiB0aGUgcmVkaXJlY3QgKHJlZ2V4IG9yIHBsYWluKS5cblx0XHQgKiBAcGFyYW0ge09iamVjdH0gcmVkaXJlY3RJbmZvICBPYmplY3Qgd2l0aCBkZXRhaWxzIGFib3V0IHRoZSByZWRpcmVjdC5cblx0XHQgKiBAcmV0dXJucyB7dm9pZHwqfGpRdWVyeX0gVGhlIGdlbmVyYXRlZCByb3cuXG5cdFx0ICovXG5cdFx0dGhpcy5jcmVhdGVSZWRpcmVjdFJvdyA9IGZ1bmN0aW9uKCBvbGRVcmwsIG5ld1VybCwgcmVkaXJlY3RUeXBlLCByZWRpcmVjdEluZm8gKSB7XG5cdFx0XHR2YXIgdGFyZ2V0Q2xhc3NlcyA9IFsgXCJ2YWxcIiBdO1xuXG5cdFx0XHRpZiAoXG5cdFx0XHRcdCEgcmVkaXJlY3RJbmZvLmlzVGFyZ2V0UmVsYXRpdmUgfHxcblx0XHRcdFx0XCJcIiA9PT0gbmV3VXJsIHx8XG5cdFx0XHRcdFwiL1wiID09PSBuZXdVcmxcblx0XHRcdCkge1xuXHRcdFx0XHR0YXJnZXRDbGFzc2VzLnB1c2goIFwicmVtb3ZlLXNsYXNoZXNcIiApO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoIHJlZGlyZWN0SW5mby5oYXNUcmFpbGluZ1NsYXNoICkge1xuXHRcdFx0XHR0YXJnZXRDbGFzc2VzLnB1c2goIFwiaGFzLXRyYWlsaW5nLXNsYXNoXCIgKTtcblx0XHRcdH1cblxuXHRcdFx0dmFyIHRyID0gJCggXCI8dHI+XCIgKS5hcHBlbmQoXG5cdFx0XHRcdCQoIFwiPHRoPlwiICkuYWRkQ2xhc3MoIFwiY2hlY2stY29sdW1uXCIgKS5hdHRyKCBcInNjb3BlXCIsIFwicm93XCIgKS5hcHBlbmQoXG5cdFx0XHRcdFx0JCggXCI8aW5wdXQ+XCIgKVxuXHRcdFx0XHRcdFx0LmF0dHIoIFwibmFtZVwiLCBcIndwc2VvX3JlZGlyZWN0c19idWxrX2RlbGV0ZVtdXCIgKVxuXHRcdFx0XHRcdFx0LmF0dHIoIFwidHlwZVwiLCBcImNoZWNrYm94XCIgKVxuXHRcdFx0XHRcdFx0LnZhbCggXy5lc2NhcGUoIG9sZFVybCApIClcblx0XHRcdFx0KVxuXHRcdFx0KS5hcHBlbmQoXG5cdFx0XHRcdCQoIFwiPHRkPlwiICkuYWRkQ2xhc3MoIFwidHlwZSBjb2x1bW4tdHlwZSBoYXMtcm93LWFjdGlvbnMgY29sdW1uLXByaW1hcnlcIiApLmFwcGVuZChcblx0XHRcdFx0XHQkKCBcIjxkaXY+XCIgKS5hZGRDbGFzcyggXCJ2YWwgdHlwZVwiICkuaHRtbCggXy5lc2NhcGUoIHJlZGlyZWN0VHlwZSApIClcblx0XHRcdFx0KS5hcHBlbmQoXG5cdFx0XHRcdFx0JCggXCI8ZGl2PlwiICkuYWRkQ2xhc3MoIFwicm93LWFjdGlvbnNcIiApLmFwcGVuZChcblx0XHRcdFx0XHRcdCQoIFwiPHNwYW4+XCIgKS5hZGRDbGFzcyggXCJlZGl0XCIgKS5hcHBlbmQoXG5cdFx0XHRcdFx0XHRcdCQoIFwiPGE+XCIgKS5hdHRyKCB7IGhyZWY6IFwiI1wiLCByb2xlOiBcImJ1dHRvblwiLCBcImNsYXNzXCI6IFwicmVkaXJlY3QtZWRpdFwiIH0gKS5odG1sKCB3cHNlb1ByZW1pdW1TdHJpbmdzLmVkaXRBY3Rpb24gKVxuXHRcdFx0XHRcdFx0KS5hcHBlbmQoIFwiIHwgXCIgKVxuXHRcdFx0XHRcdCkuYXBwZW5kKFxuXHRcdFx0XHRcdFx0JCggXCI8c3Bhbj5cIiApLmFkZENsYXNzKCBcInRyYXNoXCIgKS5hcHBlbmQoXG5cdFx0XHRcdFx0XHRcdCQoIFwiPGE+XCIgKS5hdHRyKCB7IGhyZWY6IFwiI1wiLCByb2xlOiBcImJ1dHRvblwiLCBcImNsYXNzXCI6IFwicmVkaXJlY3QtZGVsZXRlXCIgfSApLmh0bWwoIHdwc2VvUHJlbWl1bVN0cmluZ3MuZGVsZXRlQWN0aW9uIClcblx0XHRcdFx0XHRcdClcblx0XHRcdFx0XHQpXG5cdFx0XHRcdClcblx0XHRcdCkuYXBwZW5kKFxuXHRcdFx0XHQkKCBcIjx0ZD5cIiApLmFkZENsYXNzKCBcImNvbHVtbi1vbGRcIiApLmFwcGVuZChcblx0XHRcdFx0XHQkKCBcIjxkaXY+XCIgKS5hZGRDbGFzcyggXCJ2YWxcIiApLmh0bWwoIF8uZXNjYXBlKCBvbGRVcmwgKSApXG5cdFx0XHRcdClcblx0XHRcdCkuYXBwZW5kKFxuXHRcdFx0XHQkKCBcIjx0ZD5cIiApLmFkZENsYXNzKCBcImNvbHVtbi1uZXdcIiApLmFwcGVuZChcblx0XHRcdFx0XHQkKCBcIjxkaXY+XCIgKS5hZGRDbGFzcyggdGFyZ2V0Q2xhc3Nlcy5qb2luKCBcIiBcIiApICkuaHRtbCggXy5lc2NhcGUoIG5ld1VybCApIClcblx0XHRcdFx0KVxuXHRcdFx0KTtcblxuXHRcdFx0cmV0dXJuIHRyO1xuXHRcdH07XG5cblx0XHQvKipcblx0XHQgKiBIYW5kbGVzIHRoZSBlcnJvci5cblx0XHQgKlxuXHRcdCAqIEBwYXJhbSB7VmFsaWRhdGVSZWRpcmVjdH0gdmFsaWRhdGVSZWRpcmVjdCBUaGUgdmFsaWRhdGlvbiBvYmplY3QuXG5cdFx0ICogQHBhcmFtIHtPYmplY3R9ICAgICAgICAgICBlcnJvciAgICAgICAgICAgIFRoZSBlcnJvciBvYmplY3QuXG5cdFx0ICpcblx0XHQgKiBAcmV0dXJucyB7dm9pZH1cblx0XHQgKi9cblx0XHR0aGlzLmhhbmRsZUVycm9yID0gZnVuY3Rpb24oIHZhbGlkYXRlUmVkaXJlY3QsIGVycm9yICkge1xuXHRcdFx0dmFsaWRhdGVSZWRpcmVjdC5hZGRWYWxpZGF0aW9uRXJyb3IoIGVycm9yLm1lc3NhZ2UsIGVycm9yLmZpZWxkcyApO1xuXG5cdFx0XHRpZiAoIGVycm9yLnR5cGUgPT09IFwid2FybmluZ1wiICkge1xuXHRcdFx0XHR0aGF0LmRpYWxvZyggd3BzZW9QcmVtaXVtU3RyaW5ncy5lcnJvcl9zYXZpbmdfcmVkaXJlY3QsIGVycm9yLm1lc3NhZ2UsIGVycm9yLnR5cGUgKTtcblx0XHRcdH1cblx0XHR9O1xuXG5cdFx0LyoqXG5cdFx0ICogQWRkaW5nIHRoZSByZWRpcmVjdFxuXHRcdCAqXG5cdFx0ICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgd2hlbiByZWRpcmVjdCBoYXMgYmVlbiBhZGRlZCBzdWNjZXNzZnVsbHkuXG5cdFx0ICovXG5cdFx0dGhpcy5hZGRSZWRpcmVjdCA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0Ly8gRG8gdGhlIHZhbGlkYXRpb24uXG5cdFx0XHR2YXIgcmVkaXJlY3RGb3JtICAgICA9IG5ldyBSZWRpcmVjdEZvcm0oICQoIFwiLndwc2VvLW5ldy1yZWRpcmVjdC1mb3JtXCIgKSApO1xuXHRcdFx0dmFyIHZhbGlkYXRlUmVkaXJlY3QgPSBuZXcgVmFsaWRhdGVSZWRpcmVjdCggcmVkaXJlY3RGb3JtLCB0eXBlICk7XG5cdFx0XHRpZiggdmFsaWRhdGVSZWRpcmVjdC52YWxpZGF0ZSgpID09PSBmYWxzZSApIHtcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0fVxuXG5cdFx0XHR2YXIgcmVkaXJlY3RWYWx1ZXMgPSB2YWxpZGF0ZVJlZGlyZWN0LmdldEZvcm1WYWx1ZXMoKTtcblxuXHRcdFx0Ly8gRG8gcG9zdC5cblx0XHRcdHRoYXQucG9zdChcblx0XHRcdFx0e1xuXHRcdFx0XHRcdGFjdGlvbjogXCJ3cHNlb19hZGRfcmVkaXJlY3RfXCIgKyB0eXBlLFxuXHRcdFx0XHRcdGFqYXhfbm9uY2U6ICQoIFwiLndwc2VvX3JlZGlyZWN0c19hamF4X25vbmNlXCIgKS52YWwoKSxcblx0XHRcdFx0XHRyZWRpcmVjdDoge1xuXHRcdFx0XHRcdFx0b3JpZ2luOiBlbmNvZGVVUklDb21wb25lbnQoIHJlZGlyZWN0VmFsdWVzLm9yaWdpbiApLFxuXHRcdFx0XHRcdFx0dGFyZ2V0OiBlbmNvZGVVUklDb21wb25lbnQoIHJlZGlyZWN0VmFsdWVzLnRhcmdldCApLFxuXHRcdFx0XHRcdFx0dHlwZTogcmVkaXJlY3RWYWx1ZXMudHlwZSxcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdGlnbm9yZV93YXJuaW5nOiBpZ25vcmUsXG5cdFx0XHRcdH0sXG5cdFx0XHRcdGZ1bmN0aW9uKCByZXNwb25zZSApIHtcblx0XHRcdFx0XHRpZiAoIHJlc3BvbnNlLmVycm9yICkge1xuXHRcdFx0XHRcdFx0dGhhdC5oYW5kbGVFcnJvciggdmFsaWRhdGVSZWRpcmVjdCwgcmVzcG9uc2UuZXJyb3IgKTtcblxuXHRcdFx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0Ly8gRW1wdHkgdGhlIGZvcm0gZmllbGRzLlxuXHRcdFx0XHRcdHJlZGlyZWN0Rm9ybS5nZXRPcmlnaW5GaWVsZCgpLnZhbCggXCJcIiApO1xuXHRcdFx0XHRcdHJlZGlyZWN0Rm9ybS5nZXRUYXJnZXRGaWVsZCgpLnZhbCggXCJcIiApO1xuXG5cdFx0XHRcdFx0Ly8gUmVtb3ZlIHRoZSBubyBpdGVtcyByb3cuXG5cdFx0XHRcdFx0dGhhdC5maW5kKCBcIi5uby1pdGVtc1wiICkucmVtb3ZlKCk7XG5cblx0XHRcdFx0XHQvLyBDcmVhdGluZyB0ci5cblx0XHRcdFx0XHR2YXIgdHIgPSB0aGF0LmNyZWF0ZVJlZGlyZWN0Um93KCByZXNwb25zZS5vcmlnaW4sIHJlc3BvbnNlLnRhcmdldCwgcmVzcG9uc2UudHlwZSwgcmVzcG9uc2UuaW5mbyApO1xuXG5cdFx0XHRcdFx0Ly8gQWRkIHRoZSBuZXcgcm93LlxuXHRcdFx0XHRcdCQoIFwiZm9ybSNcIiArIHR5cGUgKS5maW5kKCBcIiN0aGUtbGlzdFwiICkucHJlcGVuZCggdHIgKTtcblxuXHRcdFx0XHRcdHRoYXQub3BlbkRpYWxvZyggd3BzZW9QcmVtaXVtU3RyaW5ncy5yZWRpcmVjdF9hZGRlZCApO1xuXHRcdFx0XHR9XG5cdFx0XHQpO1xuXG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9O1xuXG5cdFx0LyoqXG5cdFx0ICogVXBkYXRpbmcgdGhlIHJlZGlyZWN0XG5cdFx0ICpcblx0XHQgKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSB3aGVuIHVwZGF0ZXMgaXMgc3VjY2Vzc2Z1bC5cblx0XHQgKi9cblx0XHR0aGlzLnVwZGF0ZVJlZGlyZWN0ID0gZnVuY3Rpb24oKSB7XG5cdFx0XHQvLyBEbyB0aGUgdmFsaWRhdGlvbi5cblx0XHRcdHZhciByZWRpcmVjdEZvcm0gICAgID0gbmV3IFJlZGlyZWN0Rm9ybSggcmVkaXJlY3RzUXVpY2tFZGl0LmdldEZvcm0oKSApO1xuXHRcdFx0dmFyIHZhbGlkYXRlUmVkaXJlY3QgPSBuZXcgVmFsaWRhdGVSZWRpcmVjdCggcmVkaXJlY3RGb3JtLCB0eXBlICk7XG5cdFx0XHRpZiggdmFsaWRhdGVSZWRpcmVjdC52YWxpZGF0ZSgpID09PSBmYWxzZSApIHtcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0fVxuXG5cdFx0XHR2YXIgcmVkaXJlY3RWYWx1ZXMgPSB2YWxpZGF0ZVJlZGlyZWN0LmdldEZvcm1WYWx1ZXMoKTtcblxuXHRcdFx0Ly8gU2V0dGluZyB0aGUgdmFycyBmb3IgdGhlIHJvdyBhbmQgaXRzIHZhbHVlcy5cblx0XHRcdHZhciByb3cgPSByZWRpcmVjdHNRdWlja0VkaXQuZ2V0Um93KCk7XG5cdFx0XHR2YXIgcm93Q2VsbHMgPSB0aGlzLnJvd0NlbGxzKCByb3cgKTtcblxuXHRcdFx0Ly8gUG9zdCB0aGUgcmVxdWVzdC5cblx0XHRcdHRoYXQucG9zdChcblx0XHRcdFx0e1xuXHRcdFx0XHRcdC8qIGVzbGludC1kaXNhYmxlIGNhbWVsY2FzZSAqL1xuXHRcdFx0XHRcdGFjdGlvbjogXCJ3cHNlb191cGRhdGVfcmVkaXJlY3RfXCIgKyB0eXBlLFxuXHRcdFx0XHRcdGFqYXhfbm9uY2U6ICQoIFwiLndwc2VvX3JlZGlyZWN0c19hamF4X25vbmNlXCIgKS52YWwoKSxcblx0XHRcdFx0XHRvbGRfcmVkaXJlY3Q6IHtcblx0XHRcdFx0XHRcdG9yaWdpbjogZW5jb2RlVVJJQ29tcG9uZW50KCByb3dDZWxscy5vcmlnaW4uaHRtbCgpICksXG5cdFx0XHRcdFx0XHR0YXJnZXQ6IGVuY29kZVVSSUNvbXBvbmVudCggcm93Q2VsbHMudGFyZ2V0Lmh0bWwoKSApLFxuXHRcdFx0XHRcdFx0dHlwZTogZW5jb2RlVVJJQ29tcG9uZW50KCByb3dDZWxscy50eXBlLmh0bWwoKSApLFxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0bmV3X3JlZGlyZWN0OiB7XG5cdFx0XHRcdFx0XHRvcmlnaW46IGVuY29kZVVSSUNvbXBvbmVudCggcmVkaXJlY3RWYWx1ZXMub3JpZ2luICksXG5cdFx0XHRcdFx0XHR0YXJnZXQ6IGVuY29kZVVSSUNvbXBvbmVudCggcmVkaXJlY3RWYWx1ZXMudGFyZ2V0ICksXG5cdFx0XHRcdFx0XHR0eXBlOiBlbmNvZGVVUklDb21wb25lbnQoIHJlZGlyZWN0VmFsdWVzLnR5cGUgKSxcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdGlnbm9yZV93YXJuaW5nOiBpZ25vcmUsXG5cdFx0XHRcdH0sXG5cdFx0XHRcdGZ1bmN0aW9uKCByZXNwb25zZSApIHtcblx0XHRcdFx0XHRpZiAoIHJlc3BvbnNlLmVycm9yICkge1xuXHRcdFx0XHRcdFx0dGhhdC5oYW5kbGVFcnJvciggdmFsaWRhdGVSZWRpcmVjdCwgcmVzcG9uc2UuZXJyb3IgKTtcblxuXHRcdFx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0Ly8gVXBkYXRlcyB0aGUgdGFibGUgY2VsbHMuXG5cdFx0XHRcdFx0cm93Q2VsbHMub3JpZ2luLmh0bWwoIF8uZXNjYXBlKCByZXNwb25zZS5vcmlnaW4gKSApO1xuXHRcdFx0XHRcdHJvd0NlbGxzLnRhcmdldC5odG1sKCBfLmVzY2FwZSggcmVzcG9uc2UudGFyZ2V0ICkgKTtcblx0XHRcdFx0XHRyb3dDZWxscy50eXBlLmh0bWwoIF8uZXNjYXBlKCByZXNwb25zZS50eXBlICkgKTtcblxuXHRcdFx0XHRcdHJlZGlyZWN0c1F1aWNrRWRpdC5yZW1vdmUoKTtcblxuXHRcdFx0XHRcdHRoYXQub3BlbkRpYWxvZyggd3BzZW9QcmVtaXVtU3RyaW5ncy5yZWRpcmVjdF91cGRhdGVkICk7XG5cdFx0XHRcdH1cblx0XHRcdFx0LyogZXNsaW50LWVuYWJsZSBjYW1lbGNhc2UgKi9cblx0XHRcdCk7XG5cblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH07XG5cblx0XHQvKipcblx0XHQgKiBSZW1vdmVzIHRoZSByZWRpcmVjdFxuXHRcdCAqXG5cdFx0ICogQHBhcmFtIHtPYmplY3R9IHJvdyBUaGUgcm93IG9iamVjdC5cblx0XHQgKlxuXHRcdCAqIEByZXR1cm5zIHt2b2lkfVxuXHRcdCAqL1xuXHRcdHRoaXMuZGVsZXRlUmVkaXJlY3QgPSBmdW5jdGlvbiggcm93ICkge1xuXHRcdFx0dmFyIHJvd0NlbGxzID0gdGhpcy5yb3dDZWxscyggcm93ICk7XG5cblx0XHRcdHRoYXQucG9zdChcblx0XHRcdFx0e1xuXHRcdFx0XHRcdGFjdGlvbjogXCJ3cHNlb19kZWxldGVfcmVkaXJlY3RfXCIgKyB0eXBlLFxuXHRcdFx0XHRcdGFqYXhfbm9uY2U6ICQoIFwiLndwc2VvX3JlZGlyZWN0c19hamF4X25vbmNlXCIgKS52YWwoKSxcblx0XHRcdFx0XHRyZWRpcmVjdDoge1xuXHRcdFx0XHRcdFx0b3JpZ2luOiBlbmNvZGVVUklDb21wb25lbnQoIHJvd0NlbGxzLm9yaWdpbi5odG1sKCkgKSxcblx0XHRcdFx0XHRcdHRhcmdldDogZW5jb2RlVVJJQ29tcG9uZW50KCByb3dDZWxscy50YXJnZXQuaHRtbCgpICksXG5cdFx0XHRcdFx0XHR0eXBlOiBlbmNvZGVVUklDb21wb25lbnQoIHJvd0NlbGxzLnR5cGUuaHRtbCgpICksXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0fSxcblx0XHRcdFx0ZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0Ly8gV2hlbiB0aGUgcmVkaXJlY3QgaXMgcmVtb3ZlZCwganVzdCBmYWRlIG91dCB0aGUgcm93IGFuZCByZW1vdmUgaXQgYWZ0ZXIgaXRzIGZhZGVkLlxuXHRcdFx0XHRcdHJvdy5mYWRlVG8oIFwiZmFzdFwiLCAwICkuc2xpZGVVcChcblx0XHRcdFx0XHRcdGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0XHQkKCB0aGlzICkucmVtb3ZlKCk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0KTtcblxuXHRcdFx0XHRcdHRoYXQub3BlbkRpYWxvZyggd3BzZW9QcmVtaXVtU3RyaW5ncy5yZWRpcmVjdF9kZWxldGVkICk7XG5cdFx0XHRcdH1cblx0XHRcdCk7XG5cdFx0fTtcblxuXHRcdC8qKlxuXHRcdCAqIFJ1bm5pbmcgdGhlIHNldHVwIG9mIHRoaXMgZWxlbWVudC5cblx0XHQgKlxuXHRcdCAqIEByZXR1cm5zIHt2b2lkfVxuXHRcdCAqL1xuXHRcdHRoaXMuc2V0dXAgPSBmdW5jdGlvbigpIHtcblx0XHRcdHZhciAkcm93O1xuXHRcdFx0Ly8gQWRkaW5nIGRpYWxvZy5cblx0XHRcdCQoIFwiYm9keVwiICkuYXBwZW5kKCBcIjxkaXYgaWQ9XFxcIllvYXN0UmVkaXJlY3REaWFsb2dcXFwiPjxkaXYgaWQ9XFxcIllvYXN0UmVkaXJlY3REaWFsb2dUZXh0XFxcIj48L2Rpdj48L2Rpdj5cIiApO1xuXG5cdFx0XHQvLyBXaGVuIHRoZSB3aW5kb3cgd2lsbCBiZSBjbG9zZWQvcmVsb2FkZWQgYW5kIHRoZXJlIGlzIGEgaW5saW5lIGVkaXQgb3BlbmVkIHNob3cgYSBtZXNzYWdlLlxuXHRcdFx0JCggd2luZG93ICkub24oIFwiYmVmb3JldW5sb2FkXCIsXG5cdFx0XHRcdGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdGlmKCAkKCBcIiN0aGUtbGlzdFwiICkuZmluZCggXCIjaW5saW5lLWVkaXRcIiApLmxlbmd0aCA+IDAgKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gd3BzZW9QcmVtaXVtU3RyaW5ncy51bnNhdmVkX3JlZGlyZWN0cztcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdCk7XG5cblx0XHRcdC8vIEFkZGluZyB0aGUgb25jaGFuZ2UgZXZlbnQuXG5cdFx0XHQkKCBcIi5yZWRpcmVjdC10YWJsZS10YWJcIiApXG5cdFx0XHRcdC5vbiggXCJjaGFuZ2VcIiwgXCJzZWxlY3RbbmFtZT13cHNlb19yZWRpcmVjdHNfdHlwZV1cIiwgZnVuY3Rpb24oIGV2dCApIHtcblx0XHRcdFx0XHR2YXIgdHlwZSAgICAgICAgICAgID0gcGFyc2VJbnQoICQoIGV2dC50YXJnZXQgKS52YWwoKSwgMTAgKTtcblx0XHRcdFx0XHR2YXIgZmllbGRUb1RvZ2dsZSA9ICQoIGV2dC50YXJnZXQgKS5jbG9zZXN0KCBcIi53cHNlb19yZWRpcmVjdF9mb3JtXCIgKS5maW5kKCBcIi53cHNlb19yZWRpcmVjdF90YXJnZXRfaG9sZGVyXCIgKTtcblxuXHRcdFx0XHRcdC8vIEhpZGUgdGhlIHRhcmdldCBmaWVsZCBpbiBjYXNlIG9mIGEgNDEwIHJlZGlyZWN0LlxuXHRcdFx0XHRcdGlmKCBqUXVlcnkuaW5BcnJheSggdHlwZSwgQUxMT1dfRU1QVFlfVEFSR0VUICkgPiAtMSApIHtcblx0XHRcdFx0XHRcdCQoIGZpZWxkVG9Ub2dnbGUgKS5oaWRlKCk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdCQoIGZpZWxkVG9Ub2dnbGUgKS5zaG93KCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9ICk7XG5cblx0XHRcdC8vIEFkZGluZyBldmVudHMgZm9yIHRoZSBhZGQgZm9ybS5cblx0XHRcdCQoIFwiLndwc2VvLW5ldy1yZWRpcmVjdC1mb3JtXCIgKVxuXHRcdFx0XHQub24oIFwiY2xpY2tcIiwgXCIuYnV0dG9uLXByaW1hcnlcIiwgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0bGFzdEFjdGlvbiA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0dGhhdC5hZGRSZWRpcmVjdCgpO1xuXHRcdFx0XHRcdH07XG5cblx0XHRcdFx0XHR0aGF0LmFkZFJlZGlyZWN0KCk7XG5cdFx0XHRcdFx0cmV0dXJuRm9jdXNUb0VsID0gJCggdGhpcyApO1xuXHRcdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdFx0fSApXG5cdFx0XHRcdC5vbiggXCJrZXlwcmVzc1wiLCBcImlucHV0XCIsIGZ1bmN0aW9uKCBldnQgKSB7XG5cdFx0XHRcdFx0aWYgKCBldnQud2hpY2ggPT09IEtFWVMuRU5URVIgKSB7XG5cdFx0XHRcdFx0XHRsYXN0QWN0aW9uID0gZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHRcdHRoYXQuYWRkUmVkaXJlY3QoKTtcblx0XHRcdFx0XHRcdH07XG5cblx0XHRcdFx0XHRcdGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHRcdFx0dGhhdC5hZGRSZWRpcmVjdCgpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSApO1xuXG5cdFx0XHQkKCBcIi53cC1saXN0LXRhYmxlXCIgKVxuXHRcdFx0XHQub24oIFwiY2xpY2tcIiwgXCIucmVkaXJlY3QtZWRpdFwiLCBmdW5jdGlvbiggZXZ0ICkge1xuXHRcdFx0XHRcdCRyb3cgPSAkKCBldnQudGFyZ2V0ICkuY2xvc2VzdCggXCJ0clwiICk7XG5cblx0XHRcdFx0XHRldnQucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0XHR0aGF0LmVkaXRSb3coICRyb3cgKTtcblx0XHRcdFx0XHRyZXR1cm5Gb2N1c1RvRWwgPSAkKCB0aGlzICk7XG5cdFx0XHRcdH0gKVxuXHRcdFx0XHQub24oIFwiY2xpY2tcIiwgXCIucmVkaXJlY3QtZGVsZXRlXCIsIGZ1bmN0aW9uKCBldnQgKSB7XG5cdFx0XHRcdFx0JHJvdyA9ICQoIGV2dC50YXJnZXQgKS5jbG9zZXN0KCBcInRyXCIgKTtcblxuXHRcdFx0XHRcdGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHRcdHRoYXQuZGVsZXRlUmVkaXJlY3QoICRyb3cgKTtcblx0XHRcdFx0XHQvLyBXaGVuIGEgcm93IGdldHMgZGVsZXRlZCwgd2hlcmUgZm9jdXMgc2hvdWxkIGxhbmQ/XG5cdFx0XHRcdFx0cmV0dXJuRm9jdXNUb0VsID0gJCggXCIjY2Itc2VsZWN0LWFsbC0xXCIgKTtcblx0XHRcdFx0fSApXG5cdFx0XHRcdC5vbiggXCJrZXlwcmVzc1wiLCBcImlucHV0XCIsIGZ1bmN0aW9uKCBldnQgKSB7XG5cdFx0XHRcdFx0aWYgKCBldnQud2hpY2ggPT09IEtFWVMuRU5URVIgKSB7XG5cdFx0XHRcdFx0XHRsYXN0QWN0aW9uID0gZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHRcdHRoYXQudXBkYXRlUmVkaXJlY3QoKTtcblx0XHRcdFx0XHRcdH07XG5cblx0XHRcdFx0XHRcdGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHRcdFx0dGhhdC51cGRhdGVSZWRpcmVjdCgpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSApXG5cdFx0XHRcdC5vbiggXCJjbGlja1wiLCBcIi5zYXZlXCIsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdGxhc3RBY3Rpb24gPSBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRcdHRoYXQudXBkYXRlUmVkaXJlY3QoKTtcblx0XHRcdFx0XHR9O1xuXG5cdFx0XHRcdFx0bGFzdEFjdGlvbigpO1xuXHRcdFx0XHR9IClcblx0XHRcdFx0Lm9uKCBcImNsaWNrXCIsIFwiLmNhbmNlbFwiLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRsYXN0QWN0aW9uID0gbnVsbDtcblx0XHRcdFx0XHRyZWRpcmVjdHNRdWlja0VkaXQucmVtb3ZlKCk7XG5cdFx0XHRcdFx0Ly8gTW92ZSBmb2N1cyBiYWNrIHRvIHRoZSBFZGl0IGxpbmsuXG5cdFx0XHRcdFx0JHJvdy5maW5kKCBcIi5yZWRpcmVjdC1lZGl0XCIgKS5mb2N1cygpO1xuXHRcdFx0XHR9ICk7XG5cdFx0fTtcblxuXHRcdHRoYXQuc2V0dXAoKTtcblx0fTtcblxuXHQvKipcblx0ICogQWRkcyBzZWxlY3QyIGZvciBzZWxlY3RlZCBmaWVsZHNcblx0ICpcblx0ICogQHJldHVybnMge3ZvaWR9XG5cdCAqL1xuXHRmdW5jdGlvbiBpbml0U2VsZWN0MigpIHtcblx0XHQkKCBcIiN3cHNlb19yZWRpcmVjdHNfdHlwZVwiICkuc2VsZWN0Migge1xuXHRcdFx0d2lkdGg6IFwiNDAwcHhcIixcblx0XHRcdGxhbmd1YWdlOiB3cHNlb1NlbGVjdDJMb2NhbGUsXG5cdFx0fSApO1xuXHR9XG5cblx0LyoqXG5cdCAqIEluaXRpYWxpemVzIHRoZSByZWRpcmVjdCBwYWdlLlxuXHQgKlxuXHQgKiBAcmV0dXJucyB7dm9pZH1cblx0ICovXG5cdGZ1bmN0aW9uIGluaXQoKSB7XG5cdFx0dGVtcGxhdGVRdWlja0VkaXQgPSB3cC50ZW1wbGF0ZSggXCJyZWRpcmVjdHMtaW5saW5lLWVkaXRcIiApO1xuXG5cdFx0JC5lYWNoKFxuXHRcdFx0JCggXCIucmVkaXJlY3QtdGFibGUtdGFiXCIgKSxcblx0XHRcdGZ1bmN0aW9uKCBrZXksIGVsZW1lbnQgKSB7XG5cdFx0XHRcdCQoIGVsZW1lbnQgKS53cHNlb1JlZGlyZWN0cyggJCggZWxlbWVudCApLmF0dHIoIFwiaWRcIiApICk7XG5cdFx0XHR9XG5cdFx0KTtcblxuXHRcdGluaXRTZWxlY3QyKCk7XG5cdH1cblxuXHQkKCBpbml0ICk7XG59KCBqUXVlcnkgKSApO1xuIl19
