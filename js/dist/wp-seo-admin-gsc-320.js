(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/* jshint unused:false */
/* global ajaxurl */
/* global tb_remove */
jQuery( function() {
	'use strict';

	jQuery('#gsc_auth_code').click(
		function() {
			var auth_url = jQuery('#gsc_auth_url').val(),
			    w = 600,
				h = 500,
				left = (screen.width / 2) - (w / 2),
				top = (screen.height / 2) - (h / 2);
			return window.open(auth_url, 'wpseogscauthcode', 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=yes, resizable=no, copyhistory=no, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left);
		}
	);
});

function wpseo_gsc_post_redirect() {
	'use strict';

	var target_form = jQuery( '#TB_ajaxContent' );
	var old_url     = jQuery( target_form ).find('input[name=current_url]').val();
	var is_checked  = jQuery( target_form ).find('input[name=mark_as_fixed]').prop('checked');

	jQuery.post(
		ajaxurl,
		{
			action: 'wpseo_gsc_create_redirect_url',
			ajax_nonce: jQuery('.wpseo-gsc-ajax-security').val(),
			old_url: old_url,
			new_url: jQuery( target_form ).find('input[name=new_url]').val(),
			mark_as_fixed: is_checked,
			platform: jQuery('#field_platform').val(),
			category: jQuery('#field_category').val(),
			type: '301'
		},
		function() {
			if( is_checked === true ) {
				// Remove the row with old url
				jQuery('span:contains("' + old_url + '")').closest('tr').remove();
			}

			// Remove the thickbox
			tb_remove();
		}
	);

	return false;
}

function wpseo_update_category_count(category) {
	'use strict';

	var count_element = jQuery('#gsc_count_' + category + '');
	var new_count     = parseInt( count_element.text() , 10) - 1;
	if(new_count < 0) {
		new_count = 0;
	}

	count_element.text(new_count);
}

function wpseo_mark_as_fixed(url) {
	'use strict';

	jQuery.post(
		ajaxurl,
		{
			action: 'wpseo_mark_fixed_crawl_issue',
			ajax_nonce: jQuery('.wpseo-gsc-ajax-security').val(),
			platform: jQuery('#field_platform').val(),
			category: jQuery('#field_category').val(),
			url: url
		},
		function(response) {
			if ('true' === response) {
				wpseo_update_category_count(jQuery('#field_category').val());
				jQuery('span:contains("' + url + '")').closest('tr').remove();
			}
		}
	);
}

window.wpseo_gsc_post_redirect = wpseo_gsc_post_redirect;
window.wpseo_update_category_count = wpseo_update_category_count;
window.wpseo_mark_as_fixed = wpseo_mark_as_fixed;

},{}]},{},[1]);
