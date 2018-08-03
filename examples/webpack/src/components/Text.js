import React from "react";
import PropTypes from "prop-types";

class Text extends React.PureComponent {
	/**
	 * Renders the Text component.
	 *
	 * @returns {void}
	 */
	render() {
		const { id } = this.props;

		return (
			<span id={ id }>
                {this.props.text}
            </span>
		);
	}
}

Text.propTypes = {
	id: PropTypes.string,
};

export default Text;