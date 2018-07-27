/* External dependencies */
import React from "react";
import interpolateComponents from "interpolate-components";
import PropTypes from "prop-types";
import styled from "styled-components";
import { utils } from "yoast-components";

const { makeOutboundLink } = utils;

const StyledList = styled.ul`
	list-style: none;
	margin: 0 0 16px;
	padding: 0;

	li {
		margin: 5px 0 0 0;
		padding-left: 16px;
	}

	span[aria-hidden="true"]:before {
		margin: 0 8px 0 -16px;
		font-weight: bold;
		content: "+";
	}
`;

const ButtonLabel = styled.small`
	display: block;
`;

const UpsellButton = makeOutboundLink();

/**
 * Returns the UpsellBox component.
 *
 * @returns {ReactElement} The UpsellBox component.
 */
class UpsellBox extends React.Component {
	/**
	 * The constructor.
	 *
	 * @param {object} props The component props.
	 *
	 * @returns {void}
	 */
	constructor( props ) {
		super( props );
	}

	/**
	 * Creates the HTML for the benefits list.
	 *
	 * @param {array} benefits The list of benefits to be rendered.
	 *
	 * @returns {*} HTML for the list of benefits.
	 */
	createBenefitsList( benefits ) {
		return (
			benefits.length > 0 &&
			<StyledList role="list">
				{ benefits.map( ( benefit, index ) => {
					return <li key={ index }>
						<span aria-hidden="true"></span>
						{ interpolateComponents( {
							mixedString: benefit.replace( "<strong>", "{{strong}}" ).replace( "</strong>", "{{/strong}}" ),
							components: { strong: <strong /> },
						} ) }
					</li>;
				} ) }
			</StyledList>
		);
	}

	/**
	 * Creates the HTML for the info paragraphs.
	 *
	 * @param {array} paragraphs The paragraphs to be rendered.
	 *
	 * @returns {*} The HTML for the info paragraphs.
	 */
	createInfoParagraphs( paragraphs ) {
		return(
			paragraphs.map( ( paragraph, index ) => {
				return <p key={ index } >{ paragraph }</p>;
			} )
		);
	}

	/**
	 * Renders a UpsellBox component.
	 *
	 * @returns {ReactElement} The rendered UpsellBox component.
	 */
	render() {
		return (
			<div>
				{ this.createInfoParagraphs( this.props.infoParagraphs ) }
				{ this.createBenefitsList( this.props.benefits ) }
				<UpsellButton
					{ ...this.props.upsellButton }
				>
					{ this.props.upsellButtonText }
				</UpsellButton>
				<ButtonLabel id={ this.props.upsellButton[ "aria-describedby" ] }>
					{ this.props.upsellButtonLabel }
				</ButtonLabel>
			</div>
		);
	}
}

UpsellBox.propTypes = {
	benefits: PropTypes.array,
	infoParagraphs: PropTypes.array,
	upsellButton: PropTypes.object,
	upsellButtonText: PropTypes.string.isRequired,
	upsellButtonLabel: PropTypes.string,
};

UpsellBox.defaultProps = {
	infoParagraphs: [],
	benefits: [],
	upsellButton: {
		href: "",
		className: "button button-primary",
	},
	upsellButtonLabel: ""
};

export default UpsellBox;
