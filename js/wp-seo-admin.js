(function($) {

	$(document).ready(function() {

		// events
		$("#enablexmlsitemap").change(function() {
			$("#sitemapinfo").toggle($(this).is(':checked'));
		}).change();

		$("#cleanpermalinks").change(function() {
			$("#cleanpermalinksdiv").toggle($(this).is(':checked'));
		}).change();

		$('#wpseo-tabs a').click(function() {
			$('#wpseo-tabs a').removeClass('nav-tab-active');
			$('.wpseotab').removeClass('active');
		
			var id = $(this).attr('id').replace('-tab','');
			$('#' + id).addClass('active');
			$(this).addClass('nav-tab-active');
		});

		// init
		var active_tab = window.location.hash.replace('#top#','');

		if ( active_tab == '' || active_tab == '#_=_') {
			active_tab = $('.wpseotab').attr('id');
		}

		$('#' + active_tab).addClass('active');
		$('#' + active_tab + '-tab').addClass('nav-tab-active');
		
	});

})(jQuery);

// global functions
function setWPOption( option, newval, hide, nonce ) {
	jQuery.post(ajaxurl, { 
			action: 'wpseo_set_option', 
			option: option,
			newval: newval,
			_wpnonce: nonce 
		}, function(data) {
			if (data)
				jQuery('#'+hide).hide();
		}
	);
}

function wpseo_killBlockingFiles( nonce ) {
	jQuery.post( ajaxurl, {
		action: 'wpseo_kill_blocking_files',
		_ajax_nonce: nonce
	}, function(data) {
		if (data == 'success')
			jQuery('#blocking_files').hide();
		else
			jQuery('#block_files').html(data);
	});
}