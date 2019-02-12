/* global wpseoAdminL10n */

import React from "react";
import styled from "styled-components";
import { __ } from "@wordpress/i18n";
import { colors, utils } from "yoast-components";

const RecalibrationBetaNotificationLink = utils.makeOutboundLink( styled.a`
	display: inline-block;
	position: relative;
	margin: 6px 0 12px -2px;
	font-size: 1em;
	color: ${ colors.$palette_blue_medium };
` );

const RecalibrationBetaNotificationIcon = styled.span`
	display: inline-block;
	margin-right: 6px;

	&::before {
		position: absolute;
		top: 0;
		left: 0;
		content: "\f223";
	}
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
			rel={ null }
		>
			<RecalibrationBetaNotificationIcon className="dashicons" />
			{ __( "Recalibration beta is active", "wordpress-seo" ) }
		</RecalibrationBetaNotificationLink>
	);
};

export default RecalibrationBetaNotification;
