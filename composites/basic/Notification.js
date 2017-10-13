import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import Paper from "./Paper";
import colors from "../../style-guide/colors.json";
import { Icon } from "../../composites/Plugin/Shared/components/Icon";
import { times } from "../../style-guide/svg";

const NotificationContainer = styled.div`
	display: flex;
	align-items: center;
	padding: 20px;

	h1, h2, h3, h4, h5, h6 {
		font-size: 1.4em;
		line-height: 1;
		margin: 0 0 4px 0;
	}

	p:last-child {
		margin: 0;
	}
`;

const NotificationImage = styled.img`
	flex: 0 0 ${ props => props.imageWidth ? props.imageWidth : "auto" };
	height: ${ props => props.imageHeight ? props.imageHeight : "auto" };
	margin-right: 18px;
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
`;

const StyledIcon = styled( Icon )`
	vertical-align: middle;
`;

/**
 * Returns a Notification wrapped in a styled Paper.
 *
 * @param {object} props Component props.
 *
 * @returns {ReactElement} Styled notification.
 */
export default function Notification( props ) {
	const Heading = `${ props.headingLevel }`;

	return <Paper>
		<NotificationContainer>
			{ props.imageSrc && <NotificationImage
				src={ props.imageSrc }
				imageWidth={ props.imageWidth }
				imageHeight={ props.imageHeight }
				alt=""
			/> }
			<NotificationContent>
				<Heading>{ props.title }</Heading>
				{ props.children }
			</NotificationContent>
			{ props.isDismissable && <DismissButton
				onClick={ props.onClick }
				type="button"
			>
				<StyledIcon icon={ times } color={ colors.$color_grey_text } size="24px" />
			</DismissButton> }
		</NotificationContainer>
	</Paper>;
}

Notification.propTypes = {
	imageSrc: PropTypes.string,
	imageWidth: PropTypes.string,
	imageHeight: PropTypes.string,
	title: PropTypes.string,
	children: PropTypes.oneOfType( [
		PropTypes.arrayOf( PropTypes.node ),
		PropTypes.node,
	] ),
	isDismissable: PropTypes.bool,
	onClick: PropTypes.func,
	headingLevel: PropTypes.string,
};

Notification.defaultProps = {
	isDismissable: false,
	headingLevel: "h3",
};
