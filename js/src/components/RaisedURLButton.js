import React from "react";
import RaisedDefaultButton from "./RaisedDefaultButton";
import InfoIcon from "material-ui/svg-icons/action/info";

/**
 * Raised Button with a default info icon and a required URL
 *
 * @param {Object} props The list of props for this element.
 * @returns {JSX.Element} A RaisedDefaultButton element with supplied URL and Icon.
 * @constructor
 */
const RaisedURLButton = ( props ) => {
	return (
		<RaisedDefaultButton { ...props }/>
	);
};

RaisedURLButton.propTypes = {
	url: React.PropTypes.string.isRequired,
	icon: React.PropTypes.object,
};

RaisedURLButton.defaultProps = {
	icon: <InfoIcon viewBox="0 0 28 28" />,
};

export default RaisedURLButton;
