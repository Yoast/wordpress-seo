import { __ } from "@wordpress/i18n";
import { AutocompleteField, Paper, Title } from "@yoast/ui-library";
import PropTypes from "prop-types";

/**
 * @returns {JSX.Element} The element.
 */
export const SeoScores = ( { contentTypes } ) => { // eslint-disable-line no-unused-vars
	return (
		<Paper className="yst-@container yst-grow yst-max-w-screen-sm yst-p-8">
			<Title as="h2">{ __( "SEO scores", "wordpress-seo" ) }</Title>
			<div className="yst-grid yst-grid-cols-1 @md:yst-grid-cols-2 yst-gap-6 yst-mt-4">
				<AutocompleteField />
				<AutocompleteField />
			</div>
			<p className="yst-my-6">{ __( "description", "wordpress-seo" ) }</p>
			<div className="yst-grid yst-grid-cols-1 @md:yst-grid-cols-3 yst-gap-6">
				<div className="yst-col-span-2">Scores</div>
				<div>chart</div>
			</div>
		</Paper>
	);
};

SeoScores.propTypes = {
	contentTypes: PropTypes.arrayOf(
		PropTypes.shape( {
			name: PropTypes.string.isRequired,
			label: PropTypes.string.isRequired,
			taxonomy: PropTypes.shape( {
				name: PropTypes.string.isRequired,
				label: PropTypes.string.isRequired,
				links: PropTypes.shape( {
					search: PropTypes.string,
				} ).isRequired,
			} ),
		} )
	).isRequired,
};
