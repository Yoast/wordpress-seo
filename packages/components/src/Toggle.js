// External dependencies.
import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";
import { __ } from "@wordpress/i18n";

/* Yoast dependencies */
import { getDirectionalStyle } from "@yoast/helpers";
import { colors } from "@yoast/style-guide";

const ToggleDiv = styled.div`
	display: flex;
	width: 100%;
	justify-content: space-between;
	align-items: center;
`;

const ToggleLabel = styled.span`
	${ getDirectionalStyle( "margin-right", "margin-left" ) }: 16px;
	flex: 1;
	cursor: pointer;
`;

const ToggleBar = styled.div`
	background-color: ${ props => props.isEnabled ? "#a5d6a7" : colors.$color_button_border };
	border-radius: 7px;
	height: 14px;
	width: 30px;
	cursor: pointer;
	margin: 0;
	outline: 0;
	&:focus > span {
		box-shadow: inset 0 0 0 1px ${colors.$color_white}, 0 0 0 1px #5b9dd9, 0 0 2px 1px rgba(30, 140, 190, .8);
	}
`;

const ToggleBullet = styled.span`
	background-color: ${ props => props.isEnabled ? colors.$color_green_medium_light : colors.$color_grey_medium_dark };
	${ props => props.isEnabled
		? getDirectionalStyle( "margin-left: 12px;", "margin-right: 12px;" )
		: getDirectionalStyle( "margin-left: -2px;", "margin-right: -2px;" ) };
	box-shadow: 0 2px 2px 2px rgba(0, 0, 0, 0.1);
	border-radius: 100%;
	height: 20px;
	width: 20px;
	position: absolute;
	margin-top: -3px;
`;

const ToggleVisualLabel = styled.span`
	font-size: 14px;
	line-height: 20px;
	${ getDirectionalStyle( "margin-left", "margin-right" ) }: 8px;
	font-style: italic;
`;

/**
 * The Toggle object.
 */
class Toggle extends React.Component {
	/**
	 * Sets the toggle object.
	 *
	 * @param {Object} props The props to use.
	 *
	 * @returns {void}
	 */
	constructor( props ) {
		super( props );

		this.onClick = this.props.onToggleDisabled;
		this.onKeyUp = this.props.onToggleDisabled;

		this.setToggleState = this.setToggleState.bind( this );
		this.handleOnKeyDown = this.handleOnKeyDown.bind( this );

		if ( props.disable !== true ) {
			this.onClick = this.setToggleState.bind( this );
			this.onKeyUp = this.setToggleState.bind( this );
		}
	}

	/**
	 * Sets the state to the opposite of the current state.
	 *
	 * @param {Object} event React SyntheticEvent.
	 *
	 * @returns {void}
	 */
	setToggleState( event ) {
		/*
		 * Makes the toggle actionable with the Space bar key. Use keyup to
		 * emulate native checkboxes.
		 */
		if ( event.type === "keyup" && event.keyCode !== 32 ) {
			return;
		}

		this.props.onSetToggleState( ! this.props.isEnabled );
	}

	/**
	 * Prevents the page from scrolling when using the space bar key.
	 *
	 * @param {Object} event React SyntheticEvent.
	 *
	 * @returns {void}
	 */
	handleOnKeyDown( event ) {
		if ( event.keyCode !== 32 ) {
			return;
		}

		event.preventDefault();
	}

	/**
	 * Returns the rendered HTML.
	 *
	 * @returns {ReactElement} The rendered HTML.
	 */
	render() {
		return (
			<ToggleDiv>
				{ /* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions */ }
				<ToggleLabel
					id={ this.props.id }
					onClick={ this.onClick }
				>
					{ this.props.labelText }
				</ToggleLabel>
				<ToggleBar
					isEnabled={ this.props.isEnabled }
					onKeyDown={ this.handleOnKeyDown }
					onClick={ this.onClick }
					onKeyUp={ this.onKeyUp }
					tabIndex="0"
					role="checkbox"
					aria-labelledby={ this.props.id }
					aria-checked={ this.props.isEnabled }
					aria-disabled={ this.props.disable }
				>
					<ToggleBullet isEnabled={ this.props.isEnabled } />
				</ToggleBar>
				<ToggleVisualLabel aria-hidden="true">
					{ this.props.isEnabled ? __( "On", "wordpress-seo" ) : __( "Off", "wordpress-seo" ) }
				</ToggleVisualLabel>
			</ToggleDiv>
		);
	}
}

Toggle.propTypes = {
	isEnabled: PropTypes.bool,
	onSetToggleState: PropTypes.func,
	disable: PropTypes.bool,
	onToggleDisabled: PropTypes.func,
	id: PropTypes.string.isRequired,
	labelText: PropTypes.string.isRequired,
};

Toggle.defaultProps = {
	isEnabled: false,
	onSetToggleState: () => {},
	labelText: "",
	disable: false,
	onToggleDisabled: () => {},
};

export default Toggle;
