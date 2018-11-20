/* global wpseoAdminL10n */

import React from "react";
import styled from "styled-components";
import { __ } from "@wordpress/i18n";
import { colors } from "yoast-components";
import HelpLink from "./HelpLink";

const RecalibrationBetaNotificationText = styled.a`
	font-size: 1em;
	font-weight: normal;
	text-decoration: underline;
	margin: 6px 0px 12px -10px;
	display: block;
	color: ${ colors.$palette_blue_medium };
`;

const StyledRecalibrationLink = styled( HelpLink )`
	margin: -8px 6px -4px 4px;
	color: ${ colors.$palette_blue_medium };
`;

/**
 * Renders the RecalibrationBetaNotification component.
 *
 * @returns {ReactElement} The rendered RecalibrationBetaNotification component.
 */
const RecalibrationBetaNotification = () => {
	return (
		<RecalibrationBetaNotificationText
			href={ wpseoAdminL10n[ "shortlinks.recalibration_beta_metabox" ] }
		>
			<StyledRecalibrationLink
				href={ wpseoAdminL10n[ "shortlinks.recalibration_beta_metabox" ] }
				rel={ null }
				className="dashicons"
			>
				<span className="screen-reader-text">
					{ __( "Learn more about the Recalibration beta", "wordpress-seo" ) }
				</span>
			</StyledRecalibrationLink>
			{ __( "Recalibration beta is active", "wordpress-seo" ) }
		</RecalibrationBetaNotificationText>
	);
};

export default RecalibrationBetaNotification;
