import React from "react";

import YoastSeoIcon from "../basic/YoastSeoIcon";

/**
 * Onboarding wizard header.
 *
 * @returns {ReactElement} The renderer header.
 */
const Header = () => {
	return (
		<div
			role="banner"
			className="yoast-wizard--header">
			<YoastSeoIcon height={ 56 } width={ 56 }/>
			<div className="yoast-wizard--header--page-title">Yoast SEO for WordPress installation wizard</div>
		</div>
	);
};

export default Header;
