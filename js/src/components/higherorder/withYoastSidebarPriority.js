/* External dependencies */
import React from "react";
import PropTypes from "prop-types";

const withYoastSidebarPriority = ( WrappedComponent ) => {
	const YoastSidebarPriority = ( props ) => {
		const {
			// eslint-disable-next-line
			renderPriority,
			...otherProps
		} = props;
		return <WrappedComponent { ...otherProps } />;
	};
	YoastSidebarPriority.propTypes = {
		renderPriority: PropTypes.number,
	};
	return YoastSidebarPriority;
};

export default withYoastSidebarPriority;
