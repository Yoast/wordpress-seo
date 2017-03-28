import React from "react";
import RaisedDefaultButton from "./RaisedDefaultButton";
import InfoIcon from "material-ui/svg-icons/action/info";

const RaisedURLButton = ( props ) => {
	const buttonProps = Object.assign( {}, props );
	delete buttonProps.url;

	return (
		<RaisedDefaultButton { ...buttonProps } url={ props.url } />
	);
};

RaisedURLButton.propTypes = {
	icon: React.PropTypes.object,
	url: React.PropTypes.string,
};

RaisedURLButton.defaultProps = {
	icon: <InfoIcon viewBox="0 0 28 28" />,
};

export default RaisedURLButton;
