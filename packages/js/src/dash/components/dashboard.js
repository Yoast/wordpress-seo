import PropTypes from "prop-types";
import { PageTitle } from "./page-title";
import { SeoScores } from "./seo-scores";

/**
 * @typedef {Object} Taxonomy A taxonomy.
 * @property {string} name The unique identifier.
 * @property {string} label The user-facing label.
 * @property {Object} links The links.
 * @property {string} [links.search] The search link, might not exist.
 */

/**
 * @typedef {Object} ContentType A content type.
 * @property {string} name The unique identifier.
 * @property {string} label The user-facing label.
 * @property {Taxonomy|null} taxonomy The (main) taxonomy or null.
 */

/**
 * @param {ContentType[]} contentTypes The content types.
 * @param {string} userName The user name.
 * @returns {JSX.Element} The element.
 */
export const Dashboard = ( { contentTypes, userName } ) => {
	return (
		<div className="yst-@container">
			<PageTitle userName={ userName } />
			<div className="yst-flex yst-flex-col @7xl:yst-flex-row yst-gap-6 yst-mt-6">
				<SeoScores contentTypes={ contentTypes } />
				<SeoScores contentTypes={ contentTypes } />
			</div>
		</div>
	);
};

Dashboard.propTypes = {
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
	userName: PropTypes.string.isRequired,
};
