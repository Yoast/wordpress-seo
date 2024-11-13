import PropTypes from "prop-types";
import { PageTitle } from "./page-title";
import { ReadabilityScores } from "./readability-scores";
import { SeoScores } from "./seo-scores";

/**
 * @type {import("../index").ContentType} ContentType
 * @type {import("../index").Taxonomy} Taxonomy
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
				<ReadabilityScores contentTypes={ contentTypes } />
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
