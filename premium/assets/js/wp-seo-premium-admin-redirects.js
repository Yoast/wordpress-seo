(function ($) {

	$.fn.wpseo_redirects = function () {

		$wpseo_redirects = this;

		this.edit_row = function (row) {

			$wpseo_redirects.bind_submit(row);

			var ti = 1;
			$.each($(row).find('.val'), function (k, v) {
				var current_val = $(v).html().toString();
				$(v).empty().append(
						$('<input>').val(current_val).attr('tabindex', ti)
				);
				ti++;
			});
			$(row).find('.row-actions').hide();

			$(row).find('.row-actions').parent().append(
					$('<div>').addClass('edit-actions').append(
									$('<button>').addClass('button').addClass('button-primary').attr('tabindex', 3).html('Save').click(function () {
										$wpseo_redirects.restore_row(row);
										$wpseo_redirects.save_redirects();
										return false;
									})
							).append(
									$('<button>').addClass('button').attr('tabindex', 4).html('Cancel').click(function () {
										$wpseo_redirects.restore_row(row);
										return false;
									})
							)
			);
		};

		this.delete_row = function (row) {
			$(row).fadeTo('fast', 0).slideUp(function () {
				$(this).remove();
				$wpseo_redirects.save_redirects();
			});
		};

		this.restore_row = function (row) {
			$.each($(row).find('.val'), function (k, v) {
				var new_val = $(v).find('input').val().toString();
				$(v).empty().html(new_val);
			});

			$(row).find('.edit-actions').remove();
			$(row).find('.row-actions').show();
			$wpseo_redirects.unbind_submit();
		};

		this.bind_submit = function (row) {
			$wpseo_redirects.closest('form').submit(function (e) {
				e.preventDefault();
				$wpseo_redirects.restore_row(row);
				$wpseo_redirects.save_redirects();
				return false;
			})
		};

		this.unbind_submit = function(row) {
			$wpseo_redirects.closest('form').unbind('submit');
		};

		this.save_redirects = function () {

			// Build the json string
			var redirects = {};
			$.each($wpseo_redirects.find('tr'), function (k, tr) {
				if (undefined != $(tr).find('.val').eq(0).html()) {
					redirects[ $(tr).find('.val').eq(0).html() ] = $(tr).find('.val').eq(1).html();
				}

			});

			$.post(
					ajaxurl,
					{
						action    : 'wpseo_save_redirects',
						ajax_nonce: $('.wpseo_redirects_ajax_nonce').val(),
						redirects : redirects
					},
					function (response) {
					}
			);

		};

		this.bind_row = function (row) {
			$(row).find('.edit').click(function () {
				$wpseo_redirects.edit_row(row);
			});
			$(row).find('.trash').click(function () {
				$wpseo_redirects.delete_row(row);
			});
		};

		this.setup = function () {
			$.each($wpseo_redirects.find('tr'), function (k, tr) {
				$wpseo_redirects.bind_row(tr);
			});
		};

		$wpseo_redirects.setup();

	};

	$.fn.wpseo_redirect_handle_new = function () {
		var $this = this;

		this.remove_no_items_row = function () {
			$('.seo_page_wpseo_redirects').find('.no-items').remove();
		};

		this.add_redirect = function (old_redirect, new_redirect) {

			if ("" == old_redirect) {
				alert("Old URL can't be empty.");
				return false;
			}

			if ("" == new_redirect) {
				alert("New URL can't be empty.");
				return false;
			}

			// Remove the no items row
			$this.remove_no_items_row();

			// Creating tr
			var tr = $('<tr>').append(
							$('<td>').append(
									$('<input>').attr('type', 'checkbox').val(old_redirect)
							)
					).append(
							$('<td>').append(
											$('<div>').addClass('val').html(old_redirect)
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
									$('<div>').addClass('val').html(new_redirect)
							)
					);

			// Add the new row
			$('.seo_page_wpseo_redirects').find('#the-list').append(tr);

			// Bind action to row
			$wpseo_redirects.bind_row(tr);

			return true;
		};

		this.setup = function () {
			$this.find('a').click(function () {
				if ($this.add_redirect($this.find('#wpseo_redirects_new_old').val(), $this.find('#wpseo_redirects_new_new').val())) {
					$this.find('#wpseo_redirects_new_old').val('');
					$this.find('#wpseo_redirects_new_new').val('');
					$wpseo_redirects.save_redirects();
				}
				return false;
			});
		};

		this.setup();
	};

	$(window).load(function () {
		$('.seo_page_wpseo_redirects').wpseo_redirects();
		$('#wpseo-new-redirects-form').wpseo_redirect_handle_new();
	});

})(jQuery);