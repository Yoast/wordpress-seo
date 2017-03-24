import React from "react";

const IconMailOutline = ( props ) => {
	/* eslint-disable max-len */
	return (
		<svg fill={props.fill} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{ width: props.width, height: props.height }}>
			<path d="M0 0h24v24H0z" fill="none"/>
			<path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V8l8 5 8-5v10zm-8-7L4 6h16l-8 5z"/>
		</svg>
	);
	/* eslint-enable max-len */
};

IconMailOutline.propTypes = {
	width: React.PropTypes.number,
	height: React.PropTypes.number,
	fill: React.PropTypes.string,
};

IconMailOutline.defaultProps = {
	width: 24,
	height: 24,
	fill: '#aaa',
};

export default IconMailOutline;
