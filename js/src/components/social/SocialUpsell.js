import { Fragment } from "@wordpress/element";
import styled from "styled-components";
import interpolateComponents from "interpolate-components";
import PropTypes from "prop-types";
import { __, sprintf } from "@wordpress/i18n";
import { Alert } from "@yoast/components";
import { makeOutboundLink } from "@yoast/helpers";

const PremiumInfoText = styled( Alert )`
	p {
		margin: 0;
	}
`;

const YoastShortLink = makeOutboundLink();

const upgradeText = sprintf(
	/* Translators: %s expands to Yoast SEO Premium */
	__(
		"Find out why you should upgrade to %s", "yoast-components"
	), "Yoast SEO Premium"
);

/**
 *
 * @param {Object} props The properties passed to this component.
 * @param {string} props.socialMedium The socialmedium platform.
 *
 * @returns {wp.Element} The FacebookView Component.
 */
const SocialUpsell = ( props ) => {
	const previewText = sprintf(
		/* Translators: %s expands to the social medium name, which is either Twitter or Facebook. %s expands to Yoast SEO Premium */
		__(
			"Do you want to preview what it will look like if people share this post on %s? You can, with %s.", "yoast-components"
		), props.socialMediumName, " {{strong}}Yoast SEO Premium{{/strong}}"
	);

	return (
		<Fragment>
			<PremiumInfoText type={ "info" }>
				{
					interpolateComponents( {
						mixedString: previewText,
						components: { strong: <b /> },
					} )
				}
				<br />
				<YoastShortLink
					href="https://yoast.com/reasons-to-upgrade/"
				>
					<p>{ upgradeText }</p>
				</YoastShortLink>
			</PremiumInfoText>
		</Fragment>
	);
};

SocialUpsell.propTypes = {
	socialMediumName: PropTypes.oneOf( [ "Twitter", "Facebook" ] ).isRequired,
};

export default SocialUpsell;
