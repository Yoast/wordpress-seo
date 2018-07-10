import React from "react";
import PropTypes from "prop-types";

class Input extends React.PureComponent {
	render() {
		const { id, type, label, placeholder } = this.props;

		return (
			<React.Fragment>
				<label htmlFor={ id }>{ label }</label>
				<input
					type={ type }
					id={ id }
					name={ id }
					placeholder={ placeholder }
				/>
			</React.Fragment>
		);
	}
}

Input.propTypes = {
	id: PropTypes.string.isRequired,
	type: PropTypes.string,
	placeholder: PropTypes.string,
	label: PropTypes.string,
};

Input.defaultProps = {
	type: "text",
	label: "",
	placeholder: "",
};

export default Input;
