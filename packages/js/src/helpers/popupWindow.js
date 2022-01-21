/**
 * Creates a new window on top of the current window.
 *
 * @param {Window} window Reference to the current window.
 * @param {string} url Url to visit in new window.
 * @param {string} windowName Name of the new window.
 * @param {number} width Width of the new window.
 * @param {number} height Height of the new window.
 * @returns {Window} Reference to the new window.
 */
export default function popupWindow(
	window,
	url,
	windowName = "",
	width = 800,
	height = 600
) {
	const y = window.top.outerHeight / 2 + window.top.screenY - ( height / 2 );
	const x = window.top.outerWidth / 2 + window.top.screenX - ( width / 2 );
	return window.open(
		url,
		windowName,
		`toolbar=no,
		location=no,
		directories=no,
		status=no,
		menubar=no,
		resizable=no,
		copyhistory=no,
		width=${width},
		height=${height},
		top=${y},
		left=${x}`
	);
}
