import { Component } from "@wordpress/element";
import { PropTypes } from "prop-types";

export default class Input extends Component {
	changeHiddenInput( event ) {
		document.querySelector( this.props.hiddenInputId ).value = event.target.value;
	}

	render() {
		const value = document.querySelector( this.props.hiddenInputId ).value || this.props.value;
		return (
			<input
				type="text"
				className="large-text"
				id={ this.props.componentId }
				onChange={ e => this.changeHiddenInput( e ) }
				defaultValue={ value }
			/>
		)
	}
}

Input.propTypes = {
	componentId: PropTypes.string.isRequired,
	hiddenInputId: PropTypes.string.isRequired,
	value: PropTypes.string,
};

Input.defaultProps = {
	value: "",
};
