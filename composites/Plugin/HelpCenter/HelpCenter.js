import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

import { HelpCenterButton } from "../../Plugin/Shared/components/HelpCenterButton";

import YoastTabs from "../Shared/components/YoastTabs";

export const HelpCenterContainer = styled.div`
	width: 100%;
	min-height: 432px;
	text-align: center;
	box-sizing: border-box;
	padding: 0 40px 24px 40px;
`;

/**
 * Returns the HelpCenter component.
 *
 * @param {Object} props The props to use for the component.
 *
 * @returns {ReactElement} The HelpCenter component.
 */
export default function HelpCenter( props ) {
	return (
		<HelpCenterContainer>
				<HelpCenterButton isExpanded={ props.isExpanded }>Need help?</ HelpCenterButton>
				{ props.isExpanded
					? <YoastTabs items={ props.items }/>
					: null
				}
		</HelpCenterContainer>
	);
}

HelpCenter.propTypes = {
	items: PropTypes.array.isRequired,
};
