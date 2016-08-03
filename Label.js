import React from 'react';

const Label = ( props )=> {
	return (
		<label htmlFor={props.for} onClick={props.onClick}>{props.text}</label>
	);
}

Label.propTypes = {
	for: React.PropTypes.string.isRequired,
	text: React.PropTypes.string.isRequired,
	onClick: React.PropTypes.func
};

export default Label;
