/* global wpseoAdminL10n */
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
			"Want to see how your content will look when it’s shared on %s?", "wordpress-seo"
		), props.socialMediumName
	);
	const upgradeText = sprintf(
		/* Translators: %s expands to Yoast SEO Premium */
		__(
			"Get %s to unlock social previews!", "wordpress-seo"
		), "Yoast SEO Premium"
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
					href={ wpseoAdminL10n[ "shortlinks.upsell.social_previews" ] }
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
