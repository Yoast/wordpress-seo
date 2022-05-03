/* External dependencies */
import React from "react";
import PropTypes from "prop-types";
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
 * @param {object} props Component props.
 *
 * @returns {ReactElement} styled notification.
 */
function Notification( props ) {
	const Heading = `${ props.headingLevel }`;

	return <Paper>
		<NotificationContainer isDismissable={ props.isDismissable }>
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
			{ props.isDismissable && <DismissButton
				onClick={ props.onClick }
				type="button"
				aria-label={ __( "Dismiss this notice", "wordpress-seo" ) }
			>
				<StyledIcon icon="times" color={ colors.$color_grey_text } size="24px" />
			</DismissButton> }
		</NotificationContainer>
	</Paper>;
}

Notification.propTypes = {
	imageSrc: PropTypes.string,
	imageWidth: PropTypes.string,
	imageHeight: PropTypes.string,
	title: PropTypes.string,
	html: PropTypes.string,
	isDismissable: PropTypes.bool,
	onClick: PropTypes.func,
	headingLevel: PropTypes.string,
};

Notification.defaultProps = {
	isDismissable: false,
	headingLevel: "h3",
};

export default Notification;
