import { useEffect } from "@wordpress/element";
import { some } from "lodash";
import { useDispatchSettings, useSelectSettings } from "../hooks";

/**
 * Remove new content type notification when all new content types have been reviewed.
 * @returns {void}
 */
const useNewContentTypeNotification = () => {
	const { removeNotification } = useDispatchSettings();
	const notifications = useSelectSettings( "selectNotifications" );
	const postTypes = useSelectSettings( "selectPostTypes" );
	const taxonomies = useSelectSettings( "selectTaxonomies" );

	useEffect( () => {
		const newPostTypes = some( postTypes, [ "isNew", true ] );
		const newTaxonomies = some( taxonomies, [ "isNew", true ] );

		if ( notifications[ "new-content-type" ] && ! newPostTypes && ! newTaxonomies ) {
			removeNotification( "new-content-type" );
		}
	}, [ postTypes, taxonomies ] );
};

export default useNewContentTypeNotification;
