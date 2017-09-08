import styled from "styled-components";
import colors from "../../../../style-guide/colors";

/**
 * Simple divider
 */
const DashboardWidgetDivider = styled.div`
	box-sizing: border-box;
	height: 1px;
	border-top: 1px solid ${ colors.$palette_grey };
`;

export default DashboardWidgetDivider;
