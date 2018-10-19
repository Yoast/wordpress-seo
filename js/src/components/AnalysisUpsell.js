import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { __, sprintf } from "@wordpress/i18n";
import { getRtlStyle } from "yoast-components";

import { colors, SvgIcon, UpsellLinkButton, utils } from "yoast-components";

const TextContainer = styled.p`
	color: ${ colors.$color_upsell_text };
	flex: 1;
	margin: 0;
	padding-right: 8px;
`;

const Container = styled.div`
	font-size: 1em;
	display: flex;
	flex-direction: ${ props => props.alignment === "horizontal" ? "row" : "column" };
	${ getRtlStyle( "border-left", "border-right" ) }: 4px solid ${ colors.$color_pink_dark };
	margin: 16px 0;
	padding: 0 0 0 8px;
	max-width: 600px;

	> ${ TextContainer } {
		margin-bottom: ${ props => props.alignment === "vertical" && "16px" };
	}
`;

const ButtonContainer = styled.div`
	flex: 0;
`;

const Caret = styled( SvgIcon )`
	margin: ${ getRtlStyle( "0 0 0 4px", "0 4px 0 0" ) };
	transform: ${ getRtlStyle( "rotate(0deg)", "rotate(180deg)" ) };
`;

const OutboundLinkButton = utils.makeOutboundLink( UpsellLinkButton );

/**
 * Renders the AnalysisUpsell component.
 *
 * @param {Object} props The component's props.
 *
 * @returns {ReactElement} The rendered AnalysisUpsell component.
 */
const AnalysisUpsell = ( props ) => {
	const {
		alignment,
		url,
	} = props;

	return (
		<Container alignment={ alignment }>
			<TextContainer>
				{ sprintf(
					/* translators: %s expands to Yoast SEO Premium */
					__( "Did you know %s also analyzes the different word forms of your keyphrase, like plurals and past tenses?", "wordpress-seo" ),
					"Yoast SEO Premium"
				) }
			</TextContainer>
			<ButtonContainer>
				<OutboundLinkButton href={ url }>
					{ sprintf(
						/* translators: %s expands to Premium */
						__( "Go %s!", "wordpress-seo" ),
						"Premium"
					) }
					<Caret icon="arrow-right" size="8px" color={ colors.$color_black } />
				</OutboundLinkButton>
			</ButtonContainer>
		</Container>
	);
};

AnalysisUpsell.propTypes = {
	alignment: PropTypes.oneOf( [ "horizontal", "vertical" ] ),
	url: PropTypes.string.isRequired,
};

AnalysisUpsell.defaultProps = {
	alignment: "vertical",
};

export default AnalysisUpsell;
