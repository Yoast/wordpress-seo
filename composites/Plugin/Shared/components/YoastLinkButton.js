import PropTypes from "prop-types";
import styled from "styled-components";
import colors from "../../../../style-guide/colors.json";
import { rgba } from "../../../../style-guide/helpers";
import { addButtonStyles } from "./YoastButton";

/**
 * Returns a Button with the Yoast button style.
 *
 * @param {object} props Component props.
 *
 * @returns {ReactElement} Styled button.
 */
export const YoastLinkButton = addButtonStyles(
	styled.a`
		text-decoration: none;
		color: ${ props => props.textColor };
		background: ${ props => props.backgroundColor };
		min-width: 152px;
		${ props => props.withTextShadow ? `text-shadow: 0 0 2px ${ colors.$color_black }` : "" };
	`
);

YoastLinkButton.propTypes = {
	backgroundColor: PropTypes.string,
	textColor: PropTypes.string,
	withTextShadow: PropTypes.bool,
};

YoastLinkButton.defaultProps = {
	backgroundColor: colors.$color_green_medium_light,
	textColor: colors.$color_white,
	withTextShadow: true,
};
