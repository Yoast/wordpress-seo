import domReady from "@wordpress/dom-ready";
import { render } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { Badge, Root, Title } from "@yoast/ui-library";

domReady( () => {
	const root = document.getElementById( "yoast-seo-settings" );
	if ( ! root ) {
		return;
	}

	render(
		<Root>
			<Title>
				{ __( "Settings", "wordpress-seo" ) }
				<Badge>{ __( "New", "wordpress-seo" ) }</Badge>
			</Title>
		</Root>,
		root,
	);
} );
