import React from "react";
import RaisedDefaultButton from "./RaisedDefaultButton";
import InfoIcon from "material-ui/svg-icons/action/info";

/**
 * Creates the Raised URL Button which opens in a new window.
 *
 * @param {Object} props Props passed to this element.
 * @returns {JSX.Element} Rendered RaisedURLNewWindowButton Element.
 * @constructor
 */
const RaisedURLNewWindowButton = ( props ) => {
	// Exclude the url prop from passing to the button.
	const buttonProps = Object.assign( {}, props );
	delete buttonProps.url;

	return (
		<a href={ props.url } target="_blank"><RaisedDefaultButton { ...buttonProps }/></a>
	);
};

RaisedURLNewWindowButton.propTypes = {
	url: React.PropTypes.string.isRequired,
	icon: React.PropTypes.object,
};

RaisedURLNewWindowButton.defaultProps = {
	icon: <InfoIcon viewBox="0 0 28 28"/>,
};

export default RaisedURLNewWindowButton;
