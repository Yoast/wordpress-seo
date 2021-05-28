/* External dependencies */
import { __, sprintf } from "@wordpress/i18n";
import PropTypes from "prop-types";
import styled from "styled-components";
import { makeOutboundLink, getDirectionalStyle as getRtlStyle } from "@yoast/helpers";

/* Internal dependencies */
import { ReactComponent as LocalAssistantImage } from "../../images/local_assistant.svg";

const Container = styled.div`
	display: flex;
	flex-direction: row;
	max-width: 600px;
	margin: 16px 0;
	padding: 20px 28px;
	position: relative;
	z-index: 1;
	&:before {
		content: "";
		background-image: url(${ props => props.backgroundUrl });
		background-size: 100% 100%;
		transform: ${ getRtlStyle( "", "scaleX(-1)" ) };
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: -1;
	}
`;

const StyledLocalAssistantImage = styled( LocalAssistantImage )`
	align-self: center;
	width: 100px;
	margin: ${ getRtlStyle( "0 20px 0 0", "0 0 0 20px" ) };
`;

const TextContainer = styled.div`
	align-self: center;
	font-size: 1em;
`;

const Header = styled.h3`
	&& {
		font-size: 1.15em;
		font-weight: bold;
		margin: 4px 0;
	}
`;

const Paragraph = styled.p`
	margin: 4px 0;
`;

const OutboundLink = styled( makeOutboundLink() )`
	margin: 4px 0;
`;

/**
 * Renders the LocalSEOUpsell component.
 *
 * @param {Object} props               The component's props.
 * @param {string} props.url           The url the outbound link goes to.
 * @param {string} props.backgroundUrl The url for the background image of the container.
 *
 * @returns {wp.Element} The rendered LocalSEOUpsell component.
 */
const LocalSEOUpsell = props => {
	const { url, backgroundUrl } = props;

	return (
		<Container backgroundUrl={ backgroundUrl }>
			<StyledLocalAssistantImage />
			<TextContainer>
				<Header>
					{ __( "Serving local customers?", "wordpress-seo" ) }
				</Header>
				<Paragraph>
					{ sprintf(
						/* translators: %s expands to Local SEO */
						__(
							"Truly optimize your site for a local audience with our %s plugin! Optimized address details, opening hours, " +
							"store locator and pickup option!",
							"wordpress-seo"
						),
						"Local SEO"
					) }
				</Paragraph>
				<OutboundLink href={ url }>
					{ sprintf(
						/* translators: %s expands to Local SEO */
						__( "Get the %s plugin now", "wordpress-seo" ),
						"Local SEO"
					) }
				</OutboundLink>
			</TextContainer>
		</Container>
	);
};

LocalSEOUpsell.propTypes = {
	url: PropTypes.string.isRequired,
	backgroundUrl: PropTypes.string.isRequired,
};

export default LocalSEOUpsell;
