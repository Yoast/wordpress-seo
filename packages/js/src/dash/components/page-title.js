import { __, sprintf } from "@wordpress/i18n";
import { Paper, Title } from "@yoast/ui-library";
import PropTypes from "prop-types";

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
				{ __( "Welcome to your SEO dashboard! Don't forget to check it regularly to see how your site is performing and if there are any important tasks waiting for you.", "wordpress-seo" ) }
			</p>
		</Paper.Content>
	</Paper>
);

PageTitle.propTypes = {
	userName: PropTypes.string.isRequired,
};
