import { __, sprintf } from "@wordpress/i18n";
import { Paper, Title } from "@yoast/ui-library";

/**
 * @param {string} userName The user name.
 * @returns {JSX.Element} The element.
 */
export const PageTitle = ( { userName } ) => (
	<Paper>
		<Paper.Content>
			<Title as="h1">
				{ sprintf(
					__( "Hi %s!", "wordpress-seo" ),
					userName
				) }
			</Title>
			<p className="yst-mt-3 yst-text-tiny">
				{ __( "Welcome to your SEO dashboard!", "wordpress-seo" ) }
			</p>
		</Paper.Content>
	</Paper>
);
