(function ($) {

	$.fn.wpseo_redirects = function () {
		var $this = this;

		this.edit_row = function (row) {
			console.info('edit');
			console.info(row);
		};

		this.delete_row = function (row) {
			$(row).fadeTo('fast', 0).slideUp(function () {
				$(this).remove();
			});
			$this.save_redirects();
		};

		this.save_redirects = function () {

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
	})
})(jQuery);