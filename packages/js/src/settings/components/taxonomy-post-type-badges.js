import { Badge } from "@yoast/ui-library";
import PropTypes from "prop-types";
import { useSelectSettings } from "../store";

/**
 * Creates the taxonomy post type badges.
 *
 * Note: no wrapper for flexibility.
 *
 * @param {string} name The taxonomy name.
 * @returns {JSX.Element|null} The element or null.
 */
const TaxonomyPostTypeBadges = ( { name } ) => {
	const taxonomy = useSelectSettings( "selectTaxonomy", [ name ], name );
	const firstPostType = useSelectSettings( "selectTaxonomyFirstPostType", [ name ], name );
	const hasPostTypeBadge = useSelectSettings( "selectTaxonomyHasPostTypeBadge", [ name ], name );

	if ( ! hasPostTypeBadge ) {
		return null;
	}

	return <>
		<Badge variant="plain" size="small" className="yst-border yst-border-slate-300">
			{ firstPostType.label }
		</Badge>
		{ taxonomy.postTypes.length > 1 && <Badge
			variant="plain" size="small"
			className="yst-border yst-border-slate-300"
		>
			+{ taxonomy.postTypes.length - 1 }
		</Badge> }
	</>;
};

TaxonomyPostTypeBadges.propTypes = {
	name: PropTypes.string.isRequired,
};

export default TaxonomyPostTypeBadges;
