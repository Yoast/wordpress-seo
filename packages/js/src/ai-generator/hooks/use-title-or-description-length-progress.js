import { useSelect } from "@wordpress/data";
import { useMemo } from "@wordpress/element";
import { getDescriptionProgress, getTitleProgress } from "@yoast/search-metadata-previews";
import { EDIT_TYPE, STORE_NAME_EDITOR } from "../constants";

/**
 * @param {string} editType The type to get the progress for: title or description.
 * @param {string} title The title.
 * @param {string} description The description.
 * @returns {{actual: number, score: number, max: number}} The progress.
 */
export const useTitleOrDescriptionLengthProgress = ( { editType, title, description } ) => {
	const date = useSelect( select => select( STORE_NAME_EDITOR ).getDateFromSettings(), [] );
	const locale = useSelect( select => select( STORE_NAME_EDITOR ).getContentLocale(), [] );
	const isCornerstone = useSelect( select => select( STORE_NAME_EDITOR ).isCornerstoneContent(), [] );
	const isTaxonomy = useSelect( select => select( STORE_NAME_EDITOR ).getIsTerm(), [] );

	return useMemo(
		() => editType === EDIT_TYPE.description
			? getDescriptionProgress( description, date, isCornerstone, isTaxonomy, locale )
			: getTitleProgress( title ),
		[ editType, title, description, date, isCornerstone, isTaxonomy, locale ]
	);
};
