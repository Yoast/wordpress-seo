import React from "react";
import PropTypes from "prop-types";

class TextArea extends React.PureComponent {
	render() {
		const { id, label, placeholder } = this.props;

		return (
			<React.Fragment>
				<label htmlFor={ id }>{ label }</label>
				<textarea id={ id } name={ id } placeholder={ placeholder }/>
			</React.Fragment>
		);
	}
}

TextArea.propTypes = {
	id: PropTypes.string.isRequired,
	placeholder: PropTypes.string,
	label: PropTypes.string,
};

TextArea.defaultProps = {
	label: "",
	placeholder: "",
};

export default TextArea;
