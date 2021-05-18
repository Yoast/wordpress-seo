// External dependencies.
import React, { Component } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import debounce from "lodash/debounce";
import { __ } from "@wordpress/i18n";

const FixedWidth = styled.div`
	overflow: auto;
	width: ${ ( props ) => props.widthValue }px;
	padding: 0 ${ ( props ) => props.paddingValue }px;
	max-width: 100%;
	box-sizing: border-box;
`;

const Inner = styled.div`
	width: ${ ( props ) => props.widthValue }px;
`;

const ScrollHintContainer = styled.div`
	text-align: center;
	margin: 1em 0 5px;
`;

const ScrollHint = styled.div`
	display: inline-block;
	box-sizing: border-box;

	&:before{
		display: inline-block;
		margin-right: 10px;
		font-size: 20px;
		line-height: inherit;
		vertical-align: text-top;
		content: "\\21c4";
		box-sizing: border-box;
	}
`;

/**
 * Component with a fixed width, but still make it viewable on smaller screens.
 *
 * @param {number} width Width of the component.
 * @param {number} padding Padding to add to the left and right sides.
 * @param {React.Element} children The child components.
 * @param {string} className Classname to use for the content container.
 */
export default class FixedWidthContainer extends Component {
	/**
	 * Constructs a fixed width container.
	 *
	 * @param {Object} props The props for this fixed with container.
	 *
	 * @returns {void}
	 */
	constructor( props ) {
		super( props );

		this.state = {
			showScrollHint: false,
		};

		this.setContainerRef = this.setContainerRef.bind( this );
		this.determineSize = debounce( this.determineSize.bind( this ), 100 );
	}

	/**
	 * Sets up the container reference and event handling.
	 *
	 * @param {HTMLElement} container The container reference.
	 *
	 * @returns {void}
	 */
	setContainerRef( container ) {
		if ( ! container ) {
			return null;
		}

		this._container = container;

		this.determineSize();

		window.addEventListener( "resize", this.determineSize );
	}

	/**
	 * Determines the size based on the container element.
	 *
	 * @returns {void}
	 */
	determineSize() {
		const width = this._container.offsetWidth;

		this.setState( {
			showScrollHint: width < this.props.width,
		} );
	}

	/**
	 * Removes event listener for resizing the page.
	 *
	 * @returns {void}
	 */
	componentWillUnmount() {
		window.removeEventListener( "resize", this.determineSize );
	}

	/**
	 * @returns {React.Element} The rendered element.
	 */
	render() {
		const { width, padding, children, className, id } = this.props;

		const innerWidth = width - 2 * padding;

		return <React.Fragment>
			<FixedWidth
				id={ id }
				className={ className }
				widthValue={ width }
				paddingValue={ padding }
				ref={ this.setContainerRef }
			>
				<Inner
					widthValue={ innerWidth }
				>
					{ children }
				</Inner>
			</FixedWidth>
			{ this.state.showScrollHint &&
				<ScrollHintContainer>
					<ScrollHint>
						{ __( "Scroll to see the preview content.", "yoast-components" ) }
					</ScrollHint>
				</ScrollHintContainer>
			}
		</React.Fragment>;
	}
}

FixedWidthContainer.propTypes = {
	id: PropTypes.string,
	width: PropTypes.number.isRequired,
	padding: PropTypes.number,
	children: PropTypes.node.isRequired,
	className: PropTypes.string,
};

FixedWidthContainer.defaultProps = {
	id: "",
	padding: 0,
	className: "",
};
