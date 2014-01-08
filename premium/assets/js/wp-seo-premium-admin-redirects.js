(function ($) {

	$.fn.wpseo_redirects = function () {
		var $this = this;

		this.edit_row = function(row) {

			$.each( $(row).find('.val'), function(k,v) {
				var current_val = $(v).html().toString();
				$(v).empty().append(
					$('<input>').val(current_val)
				);
			});
			$(row).find('.row-actions').hide();
			$(row).find('.row-actions').parent().append(
				$('<button>').addClass('button').addClass('button-primary').html('Save').click(function() {

					$.each( $(row).find('.val'), function(k,v) {
						var new_val = $(v).find('input').val().toString();
						$(v).empty().html(new_val);
					});

					$(row).find('.row-actions').parent().find('.button-primary').remove();
					$(row).find('.row-actions').show();
					$this.save_redirects();

					return false;
				})
			);
		};

		this.delete_row = function (row) {
			$(row).fadeTo('fast', 0).slideUp(function () {
				$(this).remove();
				$this.save_redirects();
			});
		};

		this.save_redirects = function () {

			// Build the json string
			var redirects = {};
			$.each($this.find('tr'), function (k, tr) {
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
					function( response ) {
					}
			);

		};

		this.setup = function () {
			$.each($this.find('tr'), function (k, tr) {
				$(tr).find('.edit').click(function () {
					$this.edit_row(tr);
				});
				$(tr).find('.trash').click(function () {
					$this.delete_row(tr);
				});
			});
		};

		$this.setup();

	}

	$(window).load(function () {
		$('.seo_page_wpseo_redirects').wpseo_redirects();
	});

})(jQuery);