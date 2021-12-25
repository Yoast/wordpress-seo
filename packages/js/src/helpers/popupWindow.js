import PropTypes from "prop-types";

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
	window, url, windowName = '', width = 800, height = 600, ) {
	const y = window.top.outerHeight / 2 + window.top.screenY - ( height / 2 );
	const x = window.top.outerWidth / 2 + window.top.screenX - ( width / 2 );
	return window.open( url, windowName,
		`toolbar=no, location=no, directories=no, status=no, menubar=no, resizable=no, copyhistory=no, width=${width}, height=${height}, top=${y}, left=${x}` );
}

// const popupWindow = ( {...props} ) => {
// 	const y = this.props.window.top.outerHeight / 2 +
// 		this.props.window.top.screenY - ( this.props.height / 2 );
// 	const x = this.props.window.top.outerWidth / 2 +
// 		this.props.window.top.screenX - ( this.props.width / 2 );
// 	return this.props.window.open( this.props.url, this.props.windowName,
// 		`toolbar=no, location=no, directories=no, status=no, menubar=no, resizable=no, copyhistory=no, width=${this.props.width}, height=${this.props.height}, top=${y}, left=${x}` );
// };

popupWindow.propTypes = {
	window: PropTypes.instanceOf(window.constructor).isRequired,
	url: PropTypes.string.isRequired,
	windowName: PropTypes.string,
	width: PropTypes.number,
	height: PropTypes.number,
};

popupWindow.defaultProps = {
	windowName: '',
	width: 700,
	height: 600,
};

// export default popupWindow;
