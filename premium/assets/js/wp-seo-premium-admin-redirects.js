(function ($) {

	function yoast_overlay(title, text) {
		alert(text);
	}

	$.fn.wpseo_redirects = function (arg_type) {

		var object = this;

		var type = arg_type.replace('tab-', '');

		var table = object.find('table');

		this.encode = function (str) {
			return encodeURIComponent(str);
		};

		this.edit_row = function (row, cancellable) {

			// Add row edit class
			$(row).addClass('row_edit');

			// Add current redirect as data to the row
			$(row).data('old_redirect', { key: $(row).find('.val').eq(0).html().toString(), value: $(row).find('.val').eq(1).html().toString() });

			// Add input fields
			var ti = 1;
			$.each($(row).find('.val'), function (k, v) {
				var current_val = $(v).html().toString();
				$(v).empty().append(
						$('<input>').val(current_val).attr('tabindex', ti)
				);
				ti++;
			});

			// Hide default row actions
			$(row).find('.row-actions').hide();

			// Wrap inputs in form elements
			var wrap_form = $("<form>").submit(function (e) {
				e.preventDefault();
				if (object.save_redirect(row)) {
					object.restore_row(row);
				}
				return false;
			});

			$(row).find('td .val input').wrap(wrap_form);

			// Add Save Button
			$(row).find('.row-actions').parent().append(
					$('<div>').addClass('edit-actions').append(
							$('<button>').addClass('button-primary').attr('tabindex', 3).html('Save').click(function () {
								if (object.save_redirect(row)) {
									object.restore_row(row);
								}
								return false;
							})
					)
			);

			// Add Cancel button
			if (cancellable) {
				$(row).find('.edit-actions').append(
						$('<button>').addClass('button').attr('tabindex', 4).html('Cancel').click(function () {
							object.restore_row(row);
							return false;
						})
				);
			}

		};

		this.delete_row = function (row) {
			$(row).fadeTo('fast', 0).slideUp(function () {
				$(this).remove();
				$.post(
						ajaxurl,
						{
							action    : 'wpseo_delete_redirect_' + type,
							ajax_nonce: $('.wpseo_redirects_ajax_nonce').val(),
							redirect  : { key: object.encode($(row).find('.val').eq(0).html().toString()) }
						},
						function (response) {
						}
				);
			});
		};

		this.restore_row = function (row) {

			$(row).removeClass('row_edit');

			$.each($(row).find('.val'), function (k, v) {
				var new_val = $(v).find('input').val().toString();
				$(v).empty().html(new_val);
			});

			$(row).find('.edit-actions').remove();
			$(row).find('.row-actions').show();
		};

		this.save_redirect = function (row) {

			// Get and check old URL
			var old_url = $(row).find('.val').eq(0).find('input').val().toString();
			if ('' == old_url) {
				alert(wpseo_premium_strings.error_old_url);
				return false;
			}

			// Get and check new URL
			var new_url = $(row).find('.val').eq(1).find('input').val().toString();
			if ("" == new_url) {
				alert(wpseo_premium_strings.error_new_url);
				return false;
			}

			// Add prepending slash if not exists
			if ('url' == type && old_url.indexOf('/') !== 0) {
				old_url = '/' + old_url;
				$(row).find('.val').eq(0).find('input').val(old_url);
			}

			// Encode old URL's
			var data_old_url = object.encode($(row).data('old_redirect').key);
			var data_new_url = object.encode($(row).data('old_redirect').value);

			// Encode new URL's
			old_url = object.encode(old_url);
			new_url = object.encode(new_url);

			// Post request
			$.post(
					ajaxurl,
					{
						action      : 'wpseo_save_redirect_' + type,
						ajax_nonce  : $('.wpseo_redirects_ajax_nonce').val(),
						old_redirect: { key: data_old_url, value: data_new_url },
						new_redirect: { key: old_url, value: new_url }
					},
					function (response) {
					}
			);

			return true;
		};

		this.bind_row = function (row) {
			$(row).find('.edit').click(function () {
				object.edit_row(row, true);
			});
			$(row).find('.trash').click(function () {
				object.delete_row(row);
			});
		};

		this.remove_no_items_row = function () {
			object.find('.no-items').remove();
		};

		this.add_redirect = function (old_redirect, new_redirect, redirect_type) {

			if ("" == old_redirect) {
				if ('url' == type) {
					alert(wpseo_premium_strings.error_old_url);
				} else {
					alert(wpseo_premium_strings.error_regex);
				}

				return false;
			}

			if ("" == new_redirect) {
				alert(wpseo_premium_strings.error_new_url);
				return false;
			}

			// Prepend a / to the old url and if there is none and the type is url
			if ('url' == type && old_redirect.indexOf('/') !== 0) {
				old_redirect = '/' + old_redirect;
			}

			// Remove the no items row
			object.remove_no_items_row();

			// Creating tr
			var tr = object.create_redirect_row(old_redirect, new_redirect, redirect_type);

			// Add the new row
			$('form#' + type).find('#the-list').prepend(tr);

			// Empty fields
			object.find('#wpseo_redirects_new_old').val('');
			object.find('#wpseo_redirects_new_new').val('');

			// Encode strings
			old_redirect = object.encode(old_redirect);
			new_redirect = object.encode(new_redirect);

			// Check the destination URL
			object.check_url_status(new_redirect);

			// Do post
			$.post(
					ajaxurl,
					{
						action    : 'wpseo_create_redirect_' + type,
						ajax_nonce: $('.wpseo_redirects_ajax_nonce').val(),
						old_url   : old_redirect,
						new_url   : new_redirect,
						type      : redirect_type
					},
					function (response) {
					}
			);

			return true;
		};

		this.check_url_status = function (url) {

			// Add the domain
			if (0 == url.indexOf(object.encode('/'))) {
				url = object.encode(window.location.protocol + '//' + window.location.host) + url;
			}

			// Do the AJAX call
			$.post(
					ajaxurl,
					{
						action    : 'wpseo_check_url',
						ajax_nonce: $('.wpseo_redirects_ajax_nonce').val(),
						url       : url
					},
					function (response) {
						var response_obj = $.parseJSON(response);
						if ('200' != response_obj.reponse_code) {
							yoast_overlay('Incorrect URL', 'The URL you entered returns an HTTP code different than 200(OK) : ' + response_obj.reponse_code);
						}
					}
			);

		};


		this.create_redirect_row = function (old_url, new_url, redirect_type) {
			var tr = $('<tr>').append(
					$('<td>').append(
							$('<input>').attr('type', 'checkbox').val(old_url)
					)
			).append(
					$('<td>').append(
							$('<div>').addClass('val').html(old_url)
					).append(
							$('<div>').addClass('row-actions').append(
									$('<span>').addClass('edit').append(
											$('<a>').attr('href', 'javascript:;').html('Edit')
									).append(' | ')
							).append(
									$('<span>').addClass('trash').append(
											$('<a>').attr('href', 'javascript:;').html('Delete')
									)
							)
					)
			).append(
					$('<td>').append(
							$('<div>').addClass('val').html(new_url)
					)
			).append(
					$('<td>').append(
							$('<div>').addClass('val').html(redirect_type)
					)
			);

			// bind the tr

			object.bind_row(tr);

			return tr;
		};

		this.setup = function () {
			$.each(object.find('table tr'), function (k, tr) {
				object.bind_row(tr);
			});

			object.find('.wpseo-new-redirect-form a').click(function () {
				object.add_redirect(object.find('#wpseo_redirects_new_old').val(), object.find('#wpseo_redirects_new_new').val(), object.find('#wpseo_redirects_new_type').val());
				return false;
			});

			object.find(".wpseo-new-redirect-form input").keypress(function (event) {
				if (event.which == 13) {
					event.preventDefault();
					object.add_redirect(object.find('#wpseo_redirects_new_old').val(), object.find('#wpseo_redirects_new_new').val(), object.find('#wpseo_redirects_new_type').val());
				}
			});

			$(window).on('beforeunload', function () {
				if ($('.row_edit').length > 0) {
					return wpseo_premium_strings.unsaved_redirects;
				}
			});

		};

		object.setup();

	};

	$(window).load(function () {

		$.each($('.redirect-table-tab'), function (k, v) {
			$(v).wpseo_redirects($(v).attr('id'));
		});

	});

})(jQuery);