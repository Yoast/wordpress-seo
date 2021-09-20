import PropTypes from "prop-types";

/**
 * A placeholder to show when the app is loading.
 * @returns {*} The placeholder.
 */
export const Placeholder = () => {
	return (
		<div className="yst-animate-pulse yst-w-full yst-bg-gray-200 yst-h-21 yst-rounded yst-min-w-full" />
	);
};

/**
 * A placeholder for a textinput to show when the app is loading.
 * @param {String} label The label to show in the placeholder.
 * @returns {*} The placeholder for a textinput.
 */
export const PlaceholderInput = ( { label } ) => {
	return (
		<div>
			<p className="yst-text-gray-700 yst-font-medium yst-mb-2 yst-animate-pulse">{ label }</p>
			<div className="yst-border yst-border-gray-300 yst-bg-white yst-rounded-md yst-py-2 yst-px-3">
				<div className="yst-animate-pulse yst-w-full yst-bg-gray-200 yst-h-24 yst-rounded" />
			</div>
		</div>
	);
};

PlaceholderInput.propTypes = {
	label: PropTypes.string,
};

PlaceholderInput.defaultProps = {
	label: "",
};

/**
 * A placeholder for a textarea to show when the app is loading.
 * @param {String} label The label to show in the placeholder.
 * @returns {*} The placeholder for a textarea.
 */
export const PlaceholderTextArea = ( { label } ) => {
	return (
		<div>
			<p className="yst-text-gray-700 yst-font-medium yst-mb-2 yst-animate-pulse">{ label }</p>
			<div className="yst-border yst-border-gray-300 yst-bg-white yst-rounded-md yst-py-2 yst-px-3 yst-h-500">
				<div className="yst-animate-pulse yst-w-full yst-bg-gray-200 yst-h-24 yst-rounded yst-my-3" />
				<div className="yst-animate-pulse yst-w-full yst-bg-gray-200 yst-h-24 yst-rounded yst-my-3" />
				<div className="yst-animate-pulse yst-w-full yst-bg-gray-200 yst-h-24 yst-rounded yst-my-3" />
				<div className="yst-animate-pulse yst-w-full yst-bg-gray-200 yst-h-24 yst-rounded yst-my-3" />
				<div className="yst-animate-pulse yst-w-full yst-bg-gray-200 yst-h-24 yst-rounded yst-my-3" />
			</div>
		</div>
	);
};

PlaceholderTextArea.propTypes = {
	label: PropTypes.string,
};

PlaceholderTextArea.defaultProps = {
	label: "",
};
