import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

import YoastTabs from "../Shared/components/YoastTabs";

export const HelpCenterContainer = styled.div`
	box-sizing: border-box;
	padding: 24px 40px;
	min-height: 432px;
	width: 100%;
	background-color: white;
`;

/**
 * Returns the ContentAnalysis component.
 *
 * @returns {ReactElement} The ContentAnalysis component.
 */
export default function HelpCenter( props ) {
	return (
		<HelpCenterContainer>
			<YoastTabs
				items={ props.items } />
		</HelpCenterContainer>
	);
}

HelpCenter.propTypes = {
	items: PropTypes.object.isRequired,
};
