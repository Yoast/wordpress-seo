// External dependencies
import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { CSSTransition } from "react-transition-group";

// Internal dependencies
import { getHeight } from "./dom";

const YoastSlideToggleContainer = styled.div`
	& > :first-child {
		overflow: hidden;
		transition: height ${ props => `${ props.duration }ms` } ease-out;
	}
`;

/**
 * Returns the YoastSlideToggle component.
 *
 * This component wraps a single React child and adds a "slideToggle" animation.
 * It uses http://reactcommunity.org/react-transition-group/css-transition which
 * already provides the callbacks we need. For more details, see
 * https://reactjs.org/docs/animation.html
 *
 * @param {Object}   props          Component props.
 * @param {boolean}  props.isOpen   Whether to show/hide the component and trigger the animation.
 * @param {number}   props.duration Animation duration. Defaults to 300 ms.
 * @param {children} props.children The content of the YoastSlideToggle. Must be
 *                                  a single child, can wrap multiple components.
 *
 * @returns {ReactElement} YoastSlideToggle component.
 */
export class YoastSlideToggle extends React.Component {
	/**
	 * Sets the animated element height to 0.
	 *
	 * We need to set the element height to 0 when it's first rendered and at the
	 * next tick after the closing animation has started, .i.e. onEnter and onExiting.
	 *
	 * @param {HTMLElement} element The element to set the height to.
	 * @returns {void}
	 */
	resetHeight( element ) {
		element.style.height = "0";
	}

	/**
	 * Sets the animated element height to its actual height in pixels.
	 *
	 * We need to set the height in pixels at the next animation tick after the
	 * element is initially rendered and again when the closing animation begins,
	 * i.e. onEntering and onExit.
	 *
	 * @param {HTMLElement} element The element to set the height to.
	 * @returns {void}
	 */
	setHeight( element ) {
		const height = getHeight( element );
		element.style.height = height + "px";
	}

	/**
	 * Removes the animated element height.
	 *
	 * This step occurs at the end of the expanding animation, i.e. onEntered.
	 *
	 * @param {HTMLElement} element The element to set the height to.
	 * @returns {void}
	 */
	removeHeight( element ) {
		element.style.height = null;
	}

	/**
	 * Renders the YoastSlideToggle wrapper.
	 *
	 * @returns {ReactElement} The rendered YoastSlideToggle wrapper.
	 */
	render() {
		return (
			<YoastSlideToggleContainer duration={ this.props.duration }>
				<CSSTransition
					in={ this.props.isOpen }
					timeout={ this.props.duration }
					classNames="slide"
					unmountOnExit={ true }
					onEnter={ this.resetHeight }
					onEntering={ this.setHeight }
					onEntered={ this.removeHeight }
					onExit={ this.setHeight }
					onExiting={ this.resetHeight }
				>
					{ this.props.children }
				</CSSTransition>
			</YoastSlideToggleContainer>
		);
	}
}

YoastSlideToggle.propTypes = {
	isOpen: PropTypes.bool.isRequired,
	duration: PropTypes.number.isRequired,
	children: PropTypes.node,
};

YoastSlideToggle.defaultProps = {
	duration: 300,
};
