/* External dependencies */
import React from "react";
import styled from "styled-components";
import { __ } from "@wordpress/i18n";

/* Yoast dependencies */
import { colors, breakpoints } from "@yoast/style-guide";

/* Internal dependencies */
import Paper from "./Paper";
import SvgIcon from "./SvgIcon";

const NotificationContainer = styled.div`
	display: flex;
	align-items: center;
	padding: 24px;

	h1, h2, h3, h4, h5, h6 {
		font-size: 1.4em;
		line-height: 1;
		margin: 0 0 4px 0;

		@media screen and ( max-width: ${ breakpoints.mobile } ) {
			${ props => props.isDismissable ? "margin-right: 30px;" : "" }
		}
	}

	p:last-child {
		margin: 0;
	}

	@media screen and ( max-width: ${ breakpoints.mobile } ) {
		display: block;
		position: relative;
		padding: 16px;
	}
`;

const NotificationImage = styled.img`
	flex: 0 0 ${ props => props.imageWidth ? props.imageWidth : "auto" };
	height: ${ props => props.imageHeight ? props.imageHeight : "auto" };
	margin-right: 24px;

	@media screen and ( max-width: ${ breakpoints.mobile } ) {
		display: none;
	}
`;

const NotificationContent = styled.div`
	flex: 1 1 auto;
`;

const DismissButton = styled.button`
	flex: 0 0 40px;
	height: 40px;
	border: 0;
	margin: 0 0 0 10px;
	padding: 0;
	background: transparent;
	cursor: pointer;

	@media screen and ( max-width: ${ breakpoints.mobile } ) {
		width: 40px;
		position: absolute;
		top: 5px;
		right: 5px;
		margin: 0;
	}
`;

const StyledIcon = styled( SvgIcon )`
	vertical-align: middle;
`;

/**
 * Returns a Notification wrapped in a styled Paper.
 *
 * @param {Object} props Component props.
 * @param {string} [props.imageSrc] The source of the notification image.
 * @param {string} [props.imageWidth] The width of the notification image.
 * @param {string} [props.imageHeight] The height of the notification image.
 * @param {string} [props.title] The title of the notification.
 * @param {string} [props.html] The HTML content of the notification.
 * @param {boolean} [props.isDismissable=false] Whether the notification can be dismissed.
 * @param {Function} [props.onClick] The function to call when the dismiss button is clicked.
 * @param {string} [props.headingLevel="h3"] The heading element to use for the title.
 *
 * @returns {ReactElement} styled notification.
 */
function Notification( { isDismissable = false, headingLevel = "h3", ...props } ) {
	const Heading = `${ headingLevel }`;

	return <Paper>
		<NotificationContainer isDismissable={ isDismissable }>
			{ props.imageSrc && <NotificationImage
				src={ props.imageSrc }
				imageWidth={ props.imageWidth }
				imageHeight={ props.imageHeight }
				alt=""
			/> }
			<NotificationContent>
				<Heading>{ props.title }</Heading>
				<p className="prova" dangerouslySetInnerHTML={ { __html: props.html } } />
			</NotificationContent>
			{ isDismissable && <DismissButton
				onClick={ props.onClick }
				type="button"
				aria-label={
					/* translators: Hidden accessibility text. */
					__( "Dismiss this notice", "wordpress-seo" ) }
			>
				<StyledIcon icon="times" color={ colors.$color_grey_text } size="24px" />
			</DismissButton> }
		</NotificationContainer>
	</Paper>;
}

export default Notification;
