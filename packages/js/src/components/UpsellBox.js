/* External dependencies */
import { select } from "@wordpress/data";
import { Component, Fragment } from "@wordpress/element";
import { safeCreateInterpolateElement } from "../helpers/i18n";
import { makeOutboundLink } from "@yoast/helpers";
import PropTypes from "prop-types";
import styled from "styled-components";
import { __ } from "@wordpress/i18n";

const Container = styled.div`
  padding: 25px 32px 32px;
  color: #303030;
`;

const StyledList = styled.ul`
  margin: 0;
  padding: 0;

  li {
    list-style-image: var(--yoast-svg-icon-check);
    margin: 0.5rem 0 0 1.5rem;
    line-height: 1.4em;

    &::marker {
      font-size: 1.5rem;
    }
  }
`;

const ButtonLabel = styled.span`
  display: block;
  margin-top: 4px;
`;

const Heading = styled.h2`
  margin-top: 0;
  margin-bottom: 0.25rem;
  color: #303030;
  font-size: 0.8125rem;
  font-weight: 600;
`;

const Description = styled.p`
  display: block;
  margin: 0.25rem 0 1rem 0 !important;
  max-width: 420px;
`;

const Divider = styled.hr`
  margin-top: 1.5rem;
  margin-bottom: 1rem;
  border-top: 0;
  border-bottom: 1px solid #E2E8F0;
`;

const ButtonContainer = styled.div`
  text-align: center;
`;

const Anchor = styled.a`
  width: 100%;
`;

const UpsellButton = makeOutboundLink( Anchor );

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
					return <li key={ `upsell-benefit-${ index }` }>
						{ safeCreateInterpolateElement( benefit, { strong: <strong /> } ) }
					</li>;
				} ) }
			</StyledList>
		);
	}

	/**
	 * Renders a UpsellBox component.
	 *
	 * @returns {wp.Element} The rendered UpsellBox component.
	 */
	render() {
		const isBlackFriday = select( "yoast-seo/editor" ).isPromotionActive( "black-friday-2024-promotion" );
		return (
			<Fragment>
				{ isBlackFriday &&
				<div className="yst-flex  yst-items-center yst-text-lg yst-content-between yst-bg-black yst-text-amber-300 yst-h-9 yst-border-amber-300 yst-border-y yst-border-x-0 yst-border-solid yst-px-6">
					<div className="yst-mx-auto">{ __( "30% OFF - BLACK FRIDAY", "wordpress-seo" ) }</div>
				</div> }
				<Container>
					<Heading>{ this.props.title }</Heading>
					<Description>{ this.props.description }</Description>
					<ButtonContainer>
						<UpsellButton
							{ ...this.props.upsellButton }
						>
							{ this.props.upsellButtonText }
							{ this.props.upsellButtonHasCaret && <span aria-hidden="true" className="yoast-button-upsell__caret" /> }
						</UpsellButton>
						<ButtonLabel id={ this.props.upsellButton[ "aria-describedby" ] }>
							{ this.props.upsellButtonLabel }
						</ButtonLabel>
					</ButtonContainer>
					<Divider />
					<Heading>{ this.props.benefitsTitle }</Heading>
					{ this.createBenefitsList( this.props.benefits ) }
				</Container>
			</Fragment>
		);
	}
}

UpsellBox.propTypes = {
	title: PropTypes.node,
	benefits: PropTypes.array,
	benefitsTitle: PropTypes.node,
	description: PropTypes.node,
	upsellButton: PropTypes.object,
	upsellButtonText: PropTypes.string.isRequired,
	upsellButtonLabel: PropTypes.string,
	upsellButtonHasCaret: PropTypes.bool,
};

UpsellBox.defaultProps = {
	title: null,
	description: null,
	benefits: [],
	benefitsTitle: null,
	upsellButton: {
		href: "",
		className: "button button-primary",
	},
	upsellButtonLabel: "",
	upsellButtonHasCaret: true,
};

export default UpsellBox;
