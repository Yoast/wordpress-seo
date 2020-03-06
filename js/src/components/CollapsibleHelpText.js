import { Component } from "@wordpress/element";
import PropTypes from "prop-types";
import { IconButton } from "@yoast/components";
import styled from "styled-components";

/**
 * A button with all button styles removed so that only the icon is visible.
 */
const IconButtonWithoutStyle = styled( IconButton )`
	font-family: inherit;
	font-size: "100%";
	border: 0;
	padding: 0;
	background: transparent;
	outline: none;
	box-shadow: none;
	&:focus {
		box-shadow: none;
		border: none;
		background: transparent;
	}
	&:active {
		box-shadow: none;
		border: none;
		background: transparent;
	}
`;

/**
 * A label with a help icon button that collapses a helpText when clicked.
 */
class CollapsibleHelpText extends Component {
	/**
	 * Constructor is used for setting the initial state and binding functions to the class.
	 *
	 * @param {object} props The component properties.
	 *
	 * @returns {void} Nothing.
	 */
	constructor( props ) {
		super( props );
		this.state = {
			displayHelpText: false,
			hovered: false,
		};
		this.toggleHelpText = this.toggleHelpText.bind( this );
		this.iconHover = this.iconHover.bind( this );
		this.iconNotHovered = this.iconNotHovered.bind( this );
	}

	/**
	 * Toggles the helpText.
	 *
	 * If it was visible -> hide it.
	 * If it was hidden  -> show it.
	 *
	 * @returns {void} Nothing.
	 */
	toggleHelpText() {
		this.setState( prevState => ( {
			displayHelpText: ! prevState.displayHelpText,
		} ) );
	}

	/**
	 * Sets hovered to true in the state.
	 *
	 * @returns {void} Nothing.
	 */
	iconHover() {
		this.setState( {
			hovered: true,
		} );
	}

	/**
	 * Sets hovered to false in the state.
	 *
	 * @returns {void} Nothing.
	 */
	iconNotHovered() {
		this.setState( {
			hovered: false,
		} );
	}

	/**
	 * Renders a label with a help button that displays a helpText when clicked.
	 *
	 * @returns {Component} The react components.
	 */
	render() {
		return (
			<div>
				<p>{ this.props.label }</p>
				<IconButtonWithoutStyle
					icon="question-circle"
					iconColor={ this.state.hovered ? this.props.hoverColor : this.props.defaultColor }
					onClick={ this.toggleHelpText }
					onMouseEnter={ this.iconHover }
					onMouseLeave={ this.iconNotHovered }
				/>
				{ this.state.displayHelpText &&
				<p
					dangerouslySetInnerHTML={ { __html: this.props.helpText } }
				/>
				}
			</div>
		);
	}
}

CollapsibleHelpText.propTypes = {
	label: PropTypes.string.isRequired,
	helpText: PropTypes.string.isRequired,
	defaultColor: PropTypes.string,
	hoverColor: PropTypes.string,
};

CollapsibleHelpText.defaultProps = {
	defaultColor: "#707070",
	hoverColor: "#0000FF",
};

export default CollapsibleHelpText;
