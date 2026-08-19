/* global wpseoAdminL10n */
import { __ } from "@wordpress/i18n";
import styled from "styled-components";

import HelpLink from "../HelpLink";

/*
 * The header row centres its items, so the vertical nudge HelpLink applies for inline text would
 * push the icon off-centre here. The gap to the title lives here rather than on either header,
 * so the collapsible and the modal keep the same spacing.
 */
const StyledHelpLink = styled( HelpLink )`
	margin-block: 0;
	margin-inline: 8px 0;
`;

/**
 * The help link for the social appearance sections, pointing at the social previews feature page.
 *
 * Rendered in the header of the "Social media appearance" collapsible and in the header of the
 * social appearance modal. It is always a sibling of the collapsible's toggle button, never a child
 * of it: a link inside a button is invalid HTML, and clicking it would toggle the panel as well.
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
