/* global wpseoAdminL10n */

import React from "react";
import styled from "styled-components";
import { __ } from "@wordpress/i18n";
import { colors } from "yoast-components";
import HelpLink from "./HelpLink";

const RecalibrationBetaNotificationLink = styled.a`
	font-size: 1em;
	font-weight: normal;
	text-decoration: underline;
	margin: 6px 0px 12px -10px;
	display: block;
	color: ${ colors.$palette_blue_medium };
`;

const RecalibrationBetaNotificationIcon = styled( HelpLink )`
	margin: -8px 4px -4px 4px;
	color: ${ colors.$palette_blue_medium };
	&:hover { color: #00a0d2 };
`;

/**
 * Renders the RecalibrationBetaNotification component.
 *
 * @returns {ReactElement} The rendered RecalibrationBetaNotification component.
 */
const RecalibrationBetaNotification = () => {
	return (
		<RecalibrationBetaNotificationLink
			href={ wpseoAdminL10n[ "shortlinks.recalibration_beta_metabox" ] }
			target={ "_blank" }
			rel={ "noopener noreferrer" }
		>
			<RecalibrationBetaNotificationIcon
				href={ wpseoAdminL10n[ "shortlinks.recalibration_beta_metabox" ] }
				className="dashicons"
			>
				<span className="screen-reader-text">
					{ __( "Learn more about the Recalibration beta", "wordpress-seo" ) }
				</span>
			</RecalibrationBetaNotificationIcon>
			{ __( "Recalibration beta is active", "wordpress-seo" ) }
		</RecalibrationBetaNotificationLink>
	);
};

export default RecalibrationBetaNotification;
