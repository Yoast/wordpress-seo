import React from "react";
import RaisedDefaultButton from "./RaisedDefaultButton";
import InfoIcon from "material-ui/svg-icons/action/info";

const RaisedURLNewWindowButton = ( props ) => {
	const buttonProps = Object.assign({}, props);
	delete buttonProps.url;

	return (
		<a href={ props.url } target="_blank"><RaisedDefaultButton { ...buttonProps } /></a>
	);
};

RaisedURLNewWindowButton.propTypes = {
	icon: React.PropTypes.object,
};

RaisedURLNewWindowButton.defaultProps = {
	icon: <InfoIcon viewBox="0 0 28 28"/>,
};

export default RaisedURLNewWindowButton;
