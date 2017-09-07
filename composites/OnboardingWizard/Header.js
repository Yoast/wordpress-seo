import React from "react";
import PropTypes from "prop-types";

import YoastSeoIcon from "../basic/YoastSeoIcon";

/**
 * Onboarding wizard header.
 *
 * @param {Object} props The properties.
 *
 * @returns {ReactElement} The rendered header.
 */
const Header = ( props ) => {
	return (
		<div
			role="banner"
			className="yoast-wizard--header">
			<YoastSeoIcon height={ 56 } width={ 56 }/>
			{ ( props.headerTitle ) ? <p className="yoast-wizard--header--page-title">{ props.headerTitle }</p> : null }
		</div>
	);
};

Header.propTypes = {
	headerTitle: PropTypes.string,
};

export default Header;
