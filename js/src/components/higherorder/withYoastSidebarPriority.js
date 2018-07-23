/* External dependencies */
import React from "react";
import PropTypes from "prop-types";

const withYoastSidebarPriority = ( WrappedComponent ) => {
	const YoastSidebarPriority = ( props ) => {
		const {
			// eslint-disable-next-line
			sequence,
			...otherProps
		} = props;
		return <WrappedComponent { ...otherProps } />
	};
	YoastSidebarPriority.propTypes = {
		sequence: PropTypes.number,
	};
	return YoastSidebarPriority;
};

export default withYoastSidebarPriority;
