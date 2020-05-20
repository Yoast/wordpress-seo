import { __ } from "@wordpress/i18n";
import loadHelpScout from "../help-scout-beacon";
import styled from "styled-components";

const ButtonLink = styled.button`
	background: none;
	border: none;
	padding: 0!important;
	color: #069;
	text-decoration: underline;
	cursor: pointer;
`;

/**
 * Loads the HelpScout language beacon.
 *
 * @returns {void}
 */
function onClick() {
	loadHelpScout( window.wpseoPostScraperL10n.languageBeaconId );
	// eslint-disable-next-line new-cap
	window.Beacon( "open" );
}

/**
 * Triggers a HelpScout language feedback form.
 *
 * @returns {wp.Element} Feedbacklink component.
 * @constructor
 */
export default function LanguageFeedbackLink() {
	return (
		<ButtonLink onClick={ onClick }>
			{ __( "Yoast didn't recognize my keyphrase.", "wordpress-seo" ) }
		</ButtonLink>
	);
}
