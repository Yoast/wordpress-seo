/* global wpseoAdminL10n */
import { __ } from "@wordpress/i18n";
import styled from "styled-components";

import HelpLink from "../HelpLink";

/*
 * Both headers center their items, so HelpLink's nudge for inline text would push the icon off center.
 * The gap to the title lives here, so the collapsible and the modal keep the same spacing.
 */
const StyledHelpLink = styled( HelpLink )`
	margin-block: 0;
	margin-inline: 8px 0;
`;

/**
 * The help link for the social appearance sections, pointing at the social previews feature page.
 *
 * Rendered in the "Social media appearance" collapsible header and in the modal header. Always a
 * sibling of the toggle button, never a child: a link in a button is invalid HTML.
 *
 * @returns {JSX.Element} The help link.
 */
const SocialPreviewsHelpLink = () => (
	<StyledHelpLink
		href={ wpseoAdminL10n[ "shortlinks.social_previews_info" ] }
		className="dashicons"
	>
		<span className="screen-reader-text">
			{
				/* translators: Hidden accessibility text. */
				__( "Learn more about social previews", "wordpress-seo" )
			}
		</span>
	</StyledHelpLink>
);

export default SocialPreviewsHelpLink;
