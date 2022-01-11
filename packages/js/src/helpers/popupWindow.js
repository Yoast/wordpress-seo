/**
 * Creates a new window on top of the current window.
 *
 * @param url
 * @param width
 * @param height
 * @param windowName
 * @param window
 * @returns {Window}
 */
export default function popupWindow(
	window, url, windowName = "", width = 950, height = 800 ) {
	const y = window.top.outerHeight / 2 + window.top.screenY - ( height / 2 );
	const x = window.top.outerWidth / 2 + window.top.screenX - ( width / 2 );
	return window.open( url, windowName,
		`toolbar=no, location=no, directories=no, status=no, menubar=no, resizable=no, copyhistory=no, width=${width}, height=${height}, top=${y}, left=${x}` );
}
