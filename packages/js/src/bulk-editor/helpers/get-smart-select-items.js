import { FIELD_SET_SOCIAL, NEEDS_IMPROVEMENT_DESCRIPTION, NEEDS_IMPROVEMENT_FIELD_PARAMS, NEEDS_IMPROVEMENT_TITLE } from "../constants";
import { BadScoreIcon } from "../components/bad-score-icon";
import { __ } from "@wordpress/i18n";

/**
 * Builds the quality-based Select-menu items for the active tab. Each selects the editable rows whose field needs
 * improvement, and is a no-op while the rows are still loading.
 *
 * @param {Object}   options                The options.
 * @param {string}   options.activeFieldSet The active field set (Search or Social).
 * @param {Object[]} options.items          The loaded rows.
 * @param {boolean}  options.isPending      Whether the rows are still loading; blocks the selection.
 * @param {Function} options.selectAll      Selects the given row ids.
 *
 * @returns {Array<Object>} The smart-select items ({ key, label, ariaLabel, icon, onClick }); empty for an unknown tab.
 */
export const getSmartSelectItems = ( { activeFieldSet, items, isPending, selectAll } ) => {
	const params = NEEDS_IMPROVEMENT_FIELD_PARAMS[ activeFieldSet ];
	if ( ! params ) {
		return [];
	}
	const selectNeedingImprovement = ( fieldParam ) => {
		if ( isPending ) {
			return;
		}
		selectAll( items.filter( ( item ) => item.editable && item.needsImprovement?.[ fieldParam ] ).map( ( item ) => item.id ) );
	};
	const isSocial = activeFieldSet === FIELD_SET_SOCIAL;
	return [
		{
			key: "select-title-needs-improvement",
			label: isSocial ? __( "Social titles", "wordpress-seo" ) : __( "SEO titles", "wordpress-seo" ),
			ariaLabel: isSocial
				? __( "Select pages with social titles that need improvement", "wordpress-seo" )
				: __( "Select pages with SEO titles that need improvement", "wordpress-seo" ),
			icon: <BadScoreIcon />,
			onClick: () => selectNeedingImprovement( params[ NEEDS_IMPROVEMENT_TITLE ] ),
		},
		{
			key: "select-description-needs-improvement",
			label: isSocial ? __( "Social descriptions", "wordpress-seo" ) : __( "Meta descriptions", "wordpress-seo" ),
			ariaLabel: isSocial
				? __( "Select pages with social descriptions that need improvement", "wordpress-seo" )
				: __( "Select pages with meta descriptions that need improvement", "wordpress-seo" ),
			icon: <BadScoreIcon />,
			onClick: () => selectNeedingImprovement( params[ NEEDS_IMPROVEMENT_DESCRIPTION ] ),
		},
	];
};
