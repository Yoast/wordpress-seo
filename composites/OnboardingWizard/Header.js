import React from "react";

import YoastSeoIcon from "../basic/YoastSeoIcon";

const Header = () => {
	return (
		<header className="yoast-wizard--header">
			<YoastSeoIcon height={56} width={56}/>
			<h1>Yoast SEO for WordPress installation wizard</h1>
		</header>
	);
};

export default Header;
