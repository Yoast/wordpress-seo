import React from "react";
import PropTypes from "prop-types";
import isFunction from "lodash/isFunction";

class Button extends React.PureComponent {
	/**
	 * Initializes the Button component
	 *
	 * @param {Object}   props          The component's props.
	 * @param {string}   props.id       The id of the button.
	 * @param {string}   props.children The content of the button.
	 * @param {function} props.onClick  Callback for when the button is clicked.
	 *
	 * @returns {void}
	 */
	constructor( props ) {
		super( props );

		this.handleClick = this.handleClick.bind( this );
	}

	/**
	 * Calls the onClick prop.
	 *
	 * @returns {void}
	 */
	handleClick() {
		const { onClick } = this.props;

		if ( isFunction( onClick ) ) {
			onClick();
		}
	}

	/**
	 * Renders the Button component.
	 *
	 * @returns {void}
	 */
	render() {
		const { id, children } = this.props;

		return (
			<React.Fragment>
				<button id={ id } onClick={ this.handleClick }>
					{ children }
				</button>
			</React.Fragment>
		);
	}
}

Button.propTypes = {
	id: PropTypes.string,
	children: PropTypes.node,
	onClick: PropTypes.func,
};

export default Button;
