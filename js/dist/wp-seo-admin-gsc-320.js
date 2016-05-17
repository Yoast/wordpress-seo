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

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9zcmMvd3Atc2VvLWFkbWluLWdzYy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qIGpzaGludCB1bnVzZWQ6ZmFsc2UgKi9cbi8qIGdsb2JhbCBhamF4dXJsICovXG4vKiBnbG9iYWwgdGJfcmVtb3ZlICovXG5qUXVlcnkoIGZ1bmN0aW9uKCkge1xuXHQndXNlIHN0cmljdCc7XG5cblx0alF1ZXJ5KCcjZ3NjX2F1dGhfY29kZScpLmNsaWNrKFxuXHRcdGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIGF1dGhfdXJsID0galF1ZXJ5KCcjZ3NjX2F1dGhfdXJsJykudmFsKCksXG5cdFx0XHQgICAgdyA9IDYwMCxcblx0XHRcdFx0aCA9IDUwMCxcblx0XHRcdFx0bGVmdCA9IChzY3JlZW4ud2lkdGggLyAyKSAtICh3IC8gMiksXG5cdFx0XHRcdHRvcCA9IChzY3JlZW4uaGVpZ2h0IC8gMikgLSAoaCAvIDIpO1xuXHRcdFx0cmV0dXJuIHdpbmRvdy5vcGVuKGF1dGhfdXJsLCAnd3BzZW9nc2NhdXRoY29kZScsICd0b29sYmFyPW5vLCBsb2NhdGlvbj1ubywgZGlyZWN0b3JpZXM9bm8sIHN0YXR1cz1ubywgbWVudWJhcj1ubywgc2Nyb2xsYmFycz15ZXMsIHJlc2l6YWJsZT1ubywgY29weWhpc3Rvcnk9bm8sIHdpZHRoPScgKyB3ICsgJywgaGVpZ2h0PScgKyBoICsgJywgdG9wPScgKyB0b3AgKyAnLCBsZWZ0PScgKyBsZWZ0KTtcblx0XHR9XG5cdCk7XG59KTtcblxuZnVuY3Rpb24gd3BzZW9fZ3NjX3Bvc3RfcmVkaXJlY3QoKSB7XG5cdCd1c2Ugc3RyaWN0JztcblxuXHR2YXIgdGFyZ2V0X2Zvcm0gPSBqUXVlcnkoICcjVEJfYWpheENvbnRlbnQnICk7XG5cdHZhciBvbGRfdXJsICAgICA9IGpRdWVyeSggdGFyZ2V0X2Zvcm0gKS5maW5kKCdpbnB1dFtuYW1lPWN1cnJlbnRfdXJsXScpLnZhbCgpO1xuXHR2YXIgaXNfY2hlY2tlZCAgPSBqUXVlcnkoIHRhcmdldF9mb3JtICkuZmluZCgnaW5wdXRbbmFtZT1tYXJrX2FzX2ZpeGVkXScpLnByb3AoJ2NoZWNrZWQnKTtcblxuXHRqUXVlcnkucG9zdChcblx0XHRhamF4dXJsLFxuXHRcdHtcblx0XHRcdGFjdGlvbjogJ3dwc2VvX2dzY19jcmVhdGVfcmVkaXJlY3RfdXJsJyxcblx0XHRcdGFqYXhfbm9uY2U6IGpRdWVyeSgnLndwc2VvLWdzYy1hamF4LXNlY3VyaXR5JykudmFsKCksXG5cdFx0XHRvbGRfdXJsOiBvbGRfdXJsLFxuXHRcdFx0bmV3X3VybDogalF1ZXJ5KCB0YXJnZXRfZm9ybSApLmZpbmQoJ2lucHV0W25hbWU9bmV3X3VybF0nKS52YWwoKSxcblx0XHRcdG1hcmtfYXNfZml4ZWQ6IGlzX2NoZWNrZWQsXG5cdFx0XHRwbGF0Zm9ybTogalF1ZXJ5KCcjZmllbGRfcGxhdGZvcm0nKS52YWwoKSxcblx0XHRcdGNhdGVnb3J5OiBqUXVlcnkoJyNmaWVsZF9jYXRlZ29yeScpLnZhbCgpLFxuXHRcdFx0dHlwZTogJzMwMSdcblx0XHR9LFxuXHRcdGZ1bmN0aW9uKCkge1xuXHRcdFx0aWYoIGlzX2NoZWNrZWQgPT09IHRydWUgKSB7XG5cdFx0XHRcdC8vIFJlbW92ZSB0aGUgcm93IHdpdGggb2xkIHVybFxuXHRcdFx0XHRqUXVlcnkoJ3NwYW46Y29udGFpbnMoXCInICsgb2xkX3VybCArICdcIiknKS5jbG9zZXN0KCd0cicpLnJlbW92ZSgpO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBSZW1vdmUgdGhlIHRoaWNrYm94XG5cdFx0XHR0Yl9yZW1vdmUoKTtcblx0XHR9XG5cdCk7XG5cblx0cmV0dXJuIGZhbHNlO1xufVxuXG5mdW5jdGlvbiB3cHNlb191cGRhdGVfY2F0ZWdvcnlfY291bnQoY2F0ZWdvcnkpIHtcblx0J3VzZSBzdHJpY3QnO1xuXG5cdHZhciBjb3VudF9lbGVtZW50ID0galF1ZXJ5KCcjZ3NjX2NvdW50XycgKyBjYXRlZ29yeSArICcnKTtcblx0dmFyIG5ld19jb3VudCAgICAgPSBwYXJzZUludCggY291bnRfZWxlbWVudC50ZXh0KCkgLCAxMCkgLSAxO1xuXHRpZihuZXdfY291bnQgPCAwKSB7XG5cdFx0bmV3X2NvdW50ID0gMDtcblx0fVxuXG5cdGNvdW50X2VsZW1lbnQudGV4dChuZXdfY291bnQpO1xufVxuXG5mdW5jdGlvbiB3cHNlb19tYXJrX2FzX2ZpeGVkKHVybCkge1xuXHQndXNlIHN0cmljdCc7XG5cblx0alF1ZXJ5LnBvc3QoXG5cdFx0YWpheHVybCxcblx0XHR7XG5cdFx0XHRhY3Rpb246ICd3cHNlb19tYXJrX2ZpeGVkX2NyYXdsX2lzc3VlJyxcblx0XHRcdGFqYXhfbm9uY2U6IGpRdWVyeSgnLndwc2VvLWdzYy1hamF4LXNlY3VyaXR5JykudmFsKCksXG5cdFx0XHRwbGF0Zm9ybTogalF1ZXJ5KCcjZmllbGRfcGxhdGZvcm0nKS52YWwoKSxcblx0XHRcdGNhdGVnb3J5OiBqUXVlcnkoJyNmaWVsZF9jYXRlZ29yeScpLnZhbCgpLFxuXHRcdFx0dXJsOiB1cmxcblx0XHR9LFxuXHRcdGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG5cdFx0XHRpZiAoJ3RydWUnID09PSByZXNwb25zZSkge1xuXHRcdFx0XHR3cHNlb191cGRhdGVfY2F0ZWdvcnlfY291bnQoalF1ZXJ5KCcjZmllbGRfY2F0ZWdvcnknKS52YWwoKSk7XG5cdFx0XHRcdGpRdWVyeSgnc3Bhbjpjb250YWlucyhcIicgKyB1cmwgKyAnXCIpJykuY2xvc2VzdCgndHInKS5yZW1vdmUoKTtcblx0XHRcdH1cblx0XHR9XG5cdCk7XG59XG5cbndpbmRvdy53cHNlb19nc2NfcG9zdF9yZWRpcmVjdCA9IHdwc2VvX2dzY19wb3N0X3JlZGlyZWN0O1xud2luZG93Lndwc2VvX3VwZGF0ZV9jYXRlZ29yeV9jb3VudCA9IHdwc2VvX3VwZGF0ZV9jYXRlZ29yeV9jb3VudDtcbndpbmRvdy53cHNlb19tYXJrX2FzX2ZpeGVkID0gd3BzZW9fbWFya19hc19maXhlZDtcbiJdfQ==
