import { useMemo } from "@wordpress/element";
import { Badge } from "@yoast/ui-library";
import { head, indexOf, lastIndexOf, map } from "lodash";
import { useSelectSettings } from "../store";

/**
 * @param {string} taxonomyName The name of the taxonomy.
 * @returns {JSX.Element|null} The post type badge(s).
 */
const useTaxonomyPostTypeBadges = taxonomyName => {
	const taxonomies = useSelectSettings( "selectTaxonomies" );
	const taxonomy = useSelectSettings( "selectTaxonomy", [ taxonomyName ], taxonomyName );
	const postTypes = useSelectSettings( "selectPostTypes" );
	const firstPostType = useSelectSettings( "selectPostType", [ postTypes, taxonomy ], head( taxonomy.postTypes ), null );

	// Check if taxonomy label is unique.
	const isLabelUnique = useMemo( () => {
		const taxonomyLabels = map( taxonomies, "label" );
		return indexOf( taxonomyLabels, taxonomy.label ) === lastIndexOf( taxonomyLabels, taxonomy.label );
	}, [ taxonomies, taxonomy ] );

	if ( isLabelUnique || ! firstPostType ) {
		return null;
	}

	return <>
		<Badge variant="plain" size="small" className="yst-border yst-border-gray-300">
			{ firstPostType.label }
		</Badge>
		{ taxonomy.postTypes.length > 1 && <Badge
			variant="plain" size="small"
			className="yst-border yst-border-gray-300"
		>
			+{ taxonomy.postTypes.length - 1 }
		</Badge> }
	</>;
};

export default useTaxonomyPostTypeBadges;
