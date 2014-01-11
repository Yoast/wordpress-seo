jQuery(document).ready(function () {
	jQuery("#enablexmlsitemap").change(function() {
		var sitemapInfoBlock = jQuery("#sitemapinfo");
		if (jQuery("#enablexmlsitemap").is(':checked')) {
			sitemapInfoBlock.css("display","block");
		} else {
			sitemapInfoBlock.css("display","none");
		}
	}).change();
	jQuery("#cleanpermalinks").change(function() {
		var cleanPermalinksDiv = jQuery("#cleanpermalinksdiv");
		if (jQuery("#cleanpermalinks").is(':checked')) {
			cleanPermalinksDiv.css("display","block");
		} else {
			cleanPermalinksDiv.css("display","none");
		}
	}).change();		
});

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

jQuery(document).ready(function(){	
	var active_tab = window.location.hash.replace('#top#','');
	if ( active_tab == '' )
		active_tab = jQuery('.wpseotab').attr('id');
	jQuery('#'+active_tab).addClass('active');
	jQuery('#'+active_tab+'-tab').addClass('nav-tab-active');
	
	jQuery('#wpseo-tabs a').click(function() {
		jQuery('#wpseo-tabs a').removeClass('nav-tab-active');
		jQuery('.wpseotab').removeClass('active');
	
		var id = jQuery(this).attr('id').replace('-tab','');
		jQuery('#'+id).addClass('active');
		jQuery(this).addClass('nav-tab-active');
	});
});

/*jQuery(document).ready(function(){
	// Collapsible debug information on the settings pages
	jQuery('#wpseo-debug-info').accordion({
		active: false,
		collapsible: true,
		icons: {
			header: 'ui-icon-circle-triangle-e',
			activeHeader: 'ui-icon-circle-triangle-s'
		},
		heightStyle: 'content'
	});
});*/