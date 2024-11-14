import { useState } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { Paper, Title } from "@yoast/ui-library";
import PropTypes from "prop-types";
import { ContentTypeFilter } from "./content-type-filter";
import { ReadabilityScoreContent } from "./readability-score-content";
import { TermFilter } from "./term-filter";

/**
 * @type {import("../index").ContentType} ContentType
 * @type {import("../index").Term} Term
 */

/**
 * @param {ContentType[]} contentTypes The content types. May not be empty.
 * @returns {JSX.Element} The element.
 */
export const ReadabilityScores = ( { contentTypes } ) => {
	const [ selectedContentType, setSelectedContentType ] = useState( contentTypes[ 0 ] );
	const [ selectedTerm, setSelectedTerm ] = useState();

	return (
		<Paper className="yst-@container yst-grow yst-max-w-screen-sm yst-p-8">
			<Title as="h2">{ __( "Readability scores", "wordpress-seo" ) }</Title>
			<div className="yst-grid yst-grid-cols-1 @md:yst-grid-cols-2 yst-gap-6 yst-mt-4">
				<ContentTypeFilter
					idSuffix="readability"
					contentTypes={ contentTypes }
					selected={ selectedContentType }
					onChange={ setSelectedContentType }
				/>
				{ selectedContentType.taxonomy && selectedContentType.taxonomy?.links?.search &&
					<TermFilter
						idSuffix="readability"
						taxonomy={ selectedContentType.taxonomy }
						selected={ selectedTerm }
						onChange={ setSelectedTerm }
					/>
				}
			</div>
			<ReadabilityScoreContent contentType={ selectedContentType } term={ selectedTerm } />
		</Paper>
	);
};

ReadabilityScores.propTypes = {
	contentTypes: PropTypes.arrayOf(
		PropTypes.shape( {
			name: PropTypes.string.isRequired,
			label: PropTypes.string.isRequired,
			taxonomy: PropTypes.shape( {
				name: PropTypes.string.isRequired,
				label: PropTypes.string.isRequired,
				links: PropTypes.shape( {
					search: PropTypes.string,
				} ),
			} ),
		} )
	).isRequired,
};
