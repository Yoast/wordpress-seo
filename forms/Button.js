import React from "react";

const Button = ( props ) => {
	if ( ! props.onClick ) {
		return null;
	}

	return (
		<button className={props.className} type="button" onClick={props.onClick}  {...props.optionalAttributes}>{props.text}</button>
	)
};

Button.propTypes = {
	text: React.PropTypes.string.isRequired,
	className: React.PropTypes.string,
	onClick: React.PropTypes.func,

	optionalAttributes: React.PropTypes.object,
};

Button.defaultProps = {
};

export default Button;
