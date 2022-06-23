/* External dependencies */
import { Component } from "@wordpress/element";
import interpolateComponents from "interpolate-components";
import PropTypes from "prop-types";
import styled from "styled-components";
import { makeOutboundLink } from "@yoast/helpers";

const StyledList = styled.ul`
	list-style: none;
	margin: 0 0 24px;
	padding: 0;

	li {
		margin: 10px 0 0 0;
	}

	span[aria-hidden="true"]:before {
		content: "";
		display: inline-block;
		height: 13px;
		width: 13px;
		background-size: 13px 13px;
		background-image: var( --yoast-svg-icon-check );
		background-repeat: no-repeat;
		margin-right: 10px;
	}
`;

const ButtonLabel = styled.small`
	display: block;
	margin-top: 4px;
`;

const UpsellButton = makeOutboundLink();

/**
 * Returns the UpsellBox component.
 *
 * @returns {wp.Element} The UpsellBox component.
 */
class UpsellBox extends Component {
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
						<span aria-hidden="true" />
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
		return (
			paragraphs.map( ( paragraph, index ) => {
				return <p key={ index }>{ paragraph }</p>;
			} )
		);
	}

	/**
	 * Renders a UpsellBox component.
	 *
	 * @returns {wp.Element} The rendered UpsellBox component.
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
					{ this.props.upsellButtonHasCaret && <span aria-hidden="true" className="yoast-button-upsell__caret" /> }
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
	upsellButtonHasCaret: PropTypes.bool,
};

UpsellBox.defaultProps = {
	infoParagraphs: [],
	benefits: [],
	upsellButton: {
		href: "",
		className: "button button-primary",
	},
	upsellButtonLabel: "",
	upsellButtonHasCaret: true,
};

export default UpsellBox;
