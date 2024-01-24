import PropTypes from "prop-types";
import styled from "styled-components";
import { __, sprintf } from "@wordpress/i18n";
import { getDirectionalStyle as getRtlStyle, makeOutboundLink } from "@yoast/helpers";
import { colors } from "@yoast/style-guide";
import { SvgIcon, UpsellLinkButton } from "@yoast/components";

const TextContainer = styled.p`
	color: ${ colors.$color_upsell_text };
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

const Caret = styled( SvgIcon )`
	margin: ${ getRtlStyle( "0 0 0 4px", "0 4px 0 0" ) };
	transform: ${ getRtlStyle( "rotate(0deg)", "rotate(180deg)" ) };
`;

const OutboundLinkButton = makeOutboundLink( UpsellLinkButton );

/**
 * Renders the AnalysisUpsell component.
 *
 * @param {Object} props The component's props.
 *
 * @returns {wp.Element} The rendered AnalysisUpsell component.
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
					__( "%s looks at more than just your main keyword. It analyzes different word forms, plurals, and past tenses. This helps your website perform even better in searches!", "wordpress-seo" ),
					"Yoast SEO Premium"
				) }
			</TextContainer>
			<div>
				<OutboundLinkButton
					href={ url } className={ "UpsellLinkButton" }
					data-action="load-nfd-ctb"
					data-ctb-id="f6a84663-465f-4cb5-8ba5-f7a6d72224b2"
				>
					{ sprintf(
						/* translators: %s expands to Premium */
						__( "Go %s!", "wordpress-seo" ),
						"Premium"
					) }
					<Caret icon="arrow-right" size="8px" color={ colors.$color_black } />
				</OutboundLinkButton>
			</div>
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
