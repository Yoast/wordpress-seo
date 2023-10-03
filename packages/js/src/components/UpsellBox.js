/* External dependencies */
import { Component, Fragment } from "@wordpress/element";
import { makeOutboundLink } from "@yoast/helpers";
import interpolateComponents from "interpolate-components";
import PropTypes from "prop-types";
import styled from "styled-components";

const Container = styled.div`
  padding: 4px 32px 32px
`;

const StyledList = styled.ul`
  list-style: none;
  margin: 0;
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
    background-image: var(--yoast-svg-icon-check);
    background-repeat: no-repeat;
    margin-right: 10px;
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
  margin: 0.25rem 0 1rem 0;
  max-width: 420px;
`;

const Divider = styled.hr`
  margin-top: 1.5rem;
  margin-bottom: 1.5rem;
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
	 * Renders a UpsellBox component.
	 *
	 * @returns {wp.Element} The rendered UpsellBox component.
	 */
	render() {
		return (
			<Fragment>
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
