import styled from "styled-components";
import PropTypes from "prop-types";
import colors from "../../../../style-guide/colors";

/**
 * Simple divider.
 */
const DashboardWidgetDivider = styled.div`
	box-sizing: border-box;
	height: 1px;
	border-top: 1px solid ${ colors.$palette_grey };
`;

DashboardWidgetDivider.propTypes = {
	className: PropTypes.string,
};

DashboardWidgetDivider.defaultProps = {
	className: "dashboard-widget-divider",
};

export default DashboardWidgetDivider;
