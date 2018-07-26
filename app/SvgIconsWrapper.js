import React from "react";
import styled from "styled-components";

import colors from "../style-guide/colors.json";
import SvgIcon, { icons } from "../composites/Plugin/Shared/components/SvgIcon";

export const SvgIconsContainer = styled.div`
	width: 1024px;
	margin: 0 auto;
	padding: 16px;
	box-sizing: border-box;
	background-color: ${ colors.$color_white };

	svg {
		margin: 0 auto;
		background:  ${ colors.$color_white };
	}
`;

const SingleSvgContainer = styled.span`
	display: inline-flex;
	flex-direction: column;
	justify-content: center;
	margin: 8px;
	padding: 8px;
	background: lightblue;
	text-align: center;
	background:  ${ colors.$color_grey };

	span {
		white-space: nowrap;
		font-size: 12px;
	}
`;

/**
 * Returns the SvgIconsWrapper component.
 *
 * @returns {ReactElement} The HelpCenterWrapper component.
 */
export default function SvgIconsWrapper() {
	const getIcons = () => {
		return icons.map( icon => {
			return (
				<SingleSvgContainer>
					<SvgIcon icon={ icon } key={ icon } size="40px" />
					<span title={ icon }>{ icon }</span>
				</SingleSvgContainer>
			);
		});
	};

	return (
		<SvgIconsContainer>
			{ getIcons() }
		</SvgIconsContainer>
	);
}
