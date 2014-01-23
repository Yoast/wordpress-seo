function wpseo_gwt_open_authorize_code_window(url) {
	var w = 600,
			h = 500,
			left = (screen.width / 2) - (w / 2),
			top = (screen.height / 2) - (h / 2);
	return window.open(url, 'wpseogwtauthcode', 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=yes, resizable=no, copyhistory=no, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left);
}