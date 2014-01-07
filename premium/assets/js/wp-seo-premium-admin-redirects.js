(function ($) {

	$.fn.wpseo_redirects = function () {
		var $this = this;

		this.edit_row = function (row) {
			$this.save_redirects();
		};

		this.delete_row = function (row) {
			$(row).fadeTo('fast', 0).slideUp(function () {
				$(this).remove();
			});
			$this.save_redirects();
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
						console.log( response );
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