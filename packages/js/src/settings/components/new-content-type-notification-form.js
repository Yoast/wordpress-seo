
import { Button, Checkbox } from "@yoast/ui-library";
import { useRef, useCallback, useEffect } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { useDispatchSettings, useSelectSettings } from "../hooks";

/**
 * @returns {JSX.Element} The new content type notification form.
 */
const NewContentTypeNotificationForm = () => {
	const isConfirmed = useRef( false );
	const { removeNotification, removeNewContentNotification } = useDispatchSettings();
	const postTypes = useSelectSettings( "selectPostTypes" );
	const taxonomies = useSelectSettings( "selectTaxonomies" );

	const handleDismiss = useCallback( () => {
		if ( isConfirmed.current.checked ) {
			removeNewContentNotification();
		} else {
			removeNotification( "new-content-type" );
		}
	}, [] );

	useEffect( () => {
		 const newPostTypes = Object.values( postTypes ).filter( ( postType ) => postType.isNew );
		 const newTaxonomies = Object.values( taxonomies ).filter( ( taxonomy ) => taxonomy.isNew );
		if ( ! newPostTypes.length && ! newTaxonomies.length ) {
			removeNotification( "new-content-type" );
		}
	}, [ postTypes, taxonomies ] );

	return (
		<div className="yst-flex yst-justify-between yst-pt-4">
			<Checkbox id="dismiss-new-content" name="dismiss-new-content" value="" label={ __( "Don't notify me again", "wordpress-seo" ) } ref={ isConfirmed } />
			<Button size="small" variant="secondary" onClick={ handleDismiss }>{ __( "Confirm", "wordpress-seo" ) }</Button>
		</div>
	);
};

export default NewContentTypeNotificationForm;
