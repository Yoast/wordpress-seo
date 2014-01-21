(function ($) {

	$.fn.wpseo_redirects = function () {

		$wpseo_redirects = this;

		this.edit_row = function (row) {

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
				if( $wpseo_redirects.save_redirect(row) ) {
					$wpseo_redirects.restore_row(row);
				}
				return false;
			});

			$(row).find('td .val input').wrap(wrap_form);

			// Add buttons
			$(row).find('.row-actions').parent().append(
					$('<div>').addClass('edit-actions').append(
									$('<button>').addClass('button-primary').attr('tabindex', 3).html('Save').click(function () {
										if( $wpseo_redirects.save_redirect(row) ) {
											$wpseo_redirects.restore_row(row);
										}
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
				$.post(
						ajaxurl,
						{
							action    : 'wpseo_delete_redirect',
							ajax_nonce: $('.wpseo_redirects_ajax_nonce').val(),
							redirect  : { key: $(row).find('.val').eq(0).html().toString(), value: $(row).find('.val').eq(1).html().toString() }
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
			if( '' == old_url ) {
				alert( wpseo_premium_strings.error_old_url );
				return false;
			}

			// Get and check new URL
			var new_url = $(row).find('.val').eq(1).find('input').val().toString();
			if ("" == new_url) {
				alert( wpseo_premium_strings.error_new_url );
				return false;
			}

			// Post request
			$.post(
					ajaxurl,
					{
						action      : 'wpseo_save_redirect',
						ajax_nonce  : $('.wpseo_redirects_ajax_nonce').val(),
						old_redirect: $(row).data('old_redirect'),
						new_redirect: { key: old_url, value: new_url }
					},
					function (response) {
					}
			);

			return true;
		};

		this.bind_row = function (row) {
			$(row).find('.edit').click(function () {
				$wpseo_redirects.edit_row(row);
			});
			$(row).find('.trash').click(function () {
				$wpseo_redirects.delete_row(row);
			});
		};

		this.create_crawl_issue_redirects = function () {
			if ($('.wpseo_redirects_crawl_issues').length > 0) {
				var new_redirects = JSON.parse( $('.wpseo_redirects_crawl_issues').val() );
				if( new_redirects.length > 0 ) {
					var tbody = $wpseo_redirects.find('#the-list');
					for(var i=0; i<new_redirects.length; i++) {
						var tr = create_redirect_row( new_redirects[i], '' );
						$(tbody).append( tr );
						$wpseo_redirects.edit_row(tr);
					}
				}
			}
		};

		this.setup = function () {
			$.each($wpseo_redirects.find('tr'), function (k, tr) {
				$wpseo_redirects.bind_row(tr);
			});
			$wpseo_redirects.create_crawl_issue_redirects();

			$(window).on('beforeunload',function() {
				if($('.row_edit').length > 0) {
					return wpseo_premium_strings.unsaved_redirects;
				}
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
				alert( wpseo_premium_strings.error_old_url );
				return false;
			}

			if ("" == new_redirect) {
				alert( wpseo_premium_strings.error_new_url );
				return false;
			}

			// Remove the no items row
			$this.remove_no_items_row();

			// Creating tr
			var tr = create_redirect_row( old_redirect, new_redirect );

			// Add the new row
			$('.seo_page_wpseo_redirects').find('#the-list').append(tr);

			// Empty fields
			$this.find('#wpseo_redirects_new_old').val('');
			$this.find('#wpseo_redirects_new_new').val('');

			// Do post
			$.post(
					ajaxurl,
					{
						action      : 'wpseo_create_redirect',
						ajax_nonce  : $('.wpseo_redirects_ajax_nonce').val(),
						old_redirect: old_redirect,
						new_redirect: new_redirect
					},
					function (response) {
					}
			);

			return true;
		};

		this.setup = function () {
			$this.find('a').click(function () {
				$this.add_redirect($this.find('#wpseo_redirects_new_old').val(), $this.find('#wpseo_redirects_new_new').val());
				return false;
			});

			$this.find("input").keypress(function (event) {
				if (event.which == 13) {
					event.preventDefault();
					$this.add_redirect($this.find('#wpseo_redirects_new_old').val(), $this.find('#wpseo_redirects_new_new').val());
				}
			});
		};

		this.setup();
	};

	function create_redirect_row(old_url, new_url) {
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
				);

		$wpseo_redirects.bind_row(tr);

		return tr;
	};

	$(window).load(function () {
		$('#wpseo-redirects-table-form table').wpseo_redirects();
		$('#wpseo-new-redirects-form').wpseo_redirect_handle_new();
	});

})(jQuery);