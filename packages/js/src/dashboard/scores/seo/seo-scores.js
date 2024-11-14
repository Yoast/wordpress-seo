import { useState } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { Paper, Title } from "@yoast/ui-library";
import { ContentTypeFilter } from "../components/content-type-filter";
import { TermFilter } from "../components/term-filter";
import { SeoScoreContent } from "./seo-score-content";

/**
 * @type {import("../index").ContentType} ContentType
 * @type {import("../index").Taxonomy} Taxonomy
 * @type {import("../index").Term} Term
 */

/**
 * @param {ContentType[]} contentTypes The content types. May not be empty.
 * @returns {JSX.Element} The element.
 */
export const SeoScores = ( { contentTypes } ) => {
	const [ selectedContentType, setSelectedContentType ] = useState( contentTypes[ 0 ] );
	const [ selectedTerm, setSelectedTerm ] = useState();

	return (
		<Paper className="yst-@container yst-grow yst-max-w-screen-sm yst-p-8">
			<Title as="h2">{ __( "SEO scores", "wordpress-seo" ) }</Title>
			<div className="yst-grid yst-grid-cols-1 @md:yst-grid-cols-2 yst-gap-6 yst-mt-4">
				<ContentTypeFilter
					idSuffix="seo"
					contentTypes={ contentTypes }
					selected={ selectedContentType }
					onChange={ setSelectedContentType }
				/>
				{ selectedContentType.taxonomy && selectedContentType.taxonomy?.links?.search &&
					<TermFilter
						idSuffix="seo"
						taxonomy={ selectedContentType.taxonomy }
						selected={ selectedTerm }
						onChange={ setSelectedTerm }
					/>
				}
			</div>
			<SeoScoreContent contentType={ selectedContentType } term={ selectedTerm } />
		</Paper>
	);
};
