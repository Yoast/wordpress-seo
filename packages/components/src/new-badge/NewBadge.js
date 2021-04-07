import React from "react";
import { __ } from "@wordpress/i18n";

const NewBadge = () =>  (
	<span className="yoast-badge yoast-new-badge" >
		{ __( "New", "wordpress-seo" ) }
	</span>
);

export default NewBadge;
