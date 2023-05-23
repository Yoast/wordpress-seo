import domReady from "@wordpress/dom-ready";
import { fixWordPressMenuScrolling } from "../shared-admin/helpers/fix-wordpress-menu-scrolling";

domReady( () => {
	const root = document.getElementById( "yoast-seo-support" );
	if ( ! root ) {
		return;
	}
	fixWordPressMenuScrolling();
} );
