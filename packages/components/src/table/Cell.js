import PropTypes from "prop-types";
import styled from "styled-components";

/* Yoast dependencies */
import { colors } from "@yoast/style-guide";

/**
 * Separatifies an element.
 *
 * @returns {String} CSS
 */
export function separatify() {
	return `
		&::after {
			position:relative;
			display: inline-block;
			border-right: 2px solid ${ colors.$color_grey };
			padding-right: 40px;
			height: 60px;
			content: "";
		}

		@media screen and ( max-width: 1355px ) {
			&::after {
				padding-right: 24px;
			}
		}

		@media screen and ( max-width: 800px ) {
			&::after {
				height: 48px;
				padding-right: 16px;
			}
		}
	`;
}

/**
 * Make an element text nowrap and add ellipsis.
 *
 * @returns {String} CSS
 */
export function ellipsify() {
	return `
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	`;
}

/*
 * The "Cells" are flex-items, their "flex" property is the initial `0 1 auto`
 * that translates to: cannot grow, can shrink, initial width based on the content.
 * A cell can be changed on a case by case basis wrapping the cells in a
 * styled component.
 */
const CellBase = styled.span`
	font-size: 14px;
	padding-left: 40px;

	&:first-child {
		padding-left: 0;
	}

	&::before {
 		position: absolute;
 		left: -9999em;
 		top: -30px;
 		font-size: 1.286em;
 		line-height: 0;
 		${ props => props.headerLabel ? `content: "${ props.headerLabel }";` : "content: none;" }
 	}

 	${ props => props.separator ? separatify() : "" }
	${ props => props.ellipsis ? ellipsify() : "" }

	@media screen and ( max-width: 1355px ) {
		padding-left: 20px;
		${ props => props.hideOnTablet ? "display: none;" : "" }
	}

	@media screen and ( max-width: 800px ) {
		${ props => props.hideOnMobile ? "display: none;" : "" }
	}
`;

CellBase.propTypes = {
	children: PropTypes.any,
	hideOnMobile: PropTypes.bool,
	hideOnTablet: PropTypes.bool,
	separator: PropTypes.bool,
	headerLabel: PropTypes.string,
	ellipsis: PropTypes.bool,
};

CellBase.defaultProps = {
	hideOnMobile: false,
	hideOnTable: false,
	separator: false,
	ellipsis: false,
};

/*
 * Primary cell, the largest one in a row: can grow, cannot shrink, and the
 * initial width is 200 pixels. In the responsive view, can shrink.
 */
export const CellPrimary = styled( CellBase )`
	flex: 1 0 200px;

	@media screen and ( max-width: 800px ) {
		flex-shrink: 1;
	}
`;

/*
 * Cell with fixed width: cannot grow, cannot shrink, and the width based on
 * its content.
 */
export const CellFixedWidth = styled( CellBase )`
	flex: 0 0 auto;
`;

/*
 * Cell with a minimum width: can grow, cannot shrink, and the initial width
 * is 100 pixels.
 */
export const CellMinWidth = styled( CellBase )`
	flex: 1 0 100px;
`;

/*
 * Cell with icon: cannot grow, cannot shrink, and the width is fixed based on
 * its content. The height is smaller in the responsive view because icons are
 * smaller.
 */
export const CellIcon = styled( CellFixedWidth )`
	height: 60px;

	@media screen and ( max-width: 800px ) {
		height: 48px;
	}
`;

/**
 * Makes cells use headers as bold labels with a colon in the mobile responsive view.
 *
 * @param {ReactElement} cell The original cell.
 *
 * @returns {ReactElement} The cell with transformed headers.
 */
export function responsiveHeaders( cell ) {
	return styled( cell )`
		@media screen and ( max-width: 800px ) {
			&::before {
				float: left;
				min-width: 60px;
				line-height: inherit;
				font-weight: 700;
				${ props => props.headerLabel ? `content: "${ props.headerLabel }:";` : "content: none;" }
			}

			> span {
				line-height: inherit;
			}
		}
	`;
}
