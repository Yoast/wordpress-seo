import PropTypes from "prop-types";
import { useDispatch } from "@wordpress/data";
import { __, sprintf } from "@wordpress/i18n";
import { Fragment, useCallback, useMemo } from "@wordpress/element";
import { applyFilters } from "@wordpress/hooks";
import { Slot } from "@wordpress/components";
import { safeCreateInterpolateElement } from "../helpers/i18n";
import { Button } from "@yoast/components";

/**
 * Renders the Default SEO Data checklist.
 *
 * @param {Object} isSeoDataDefault A list of current SEO data with their default status.
 *
 * @returns {wp.Element} The Default SEO Data checklist.
 */
export default function DefaultSeoDataChecklist( {
    isSeoDataDefault,
} ) {

	const isSeoTitlesDefault = useMemo( () => {
		return isSeoDataDefault?.isAllSeoTitlesDefault || false;
	}, [ isSeoDataDefault ] );

	const isSeoDescriptionsDefault = useMemo( () => {
		return isSeoDataDefault?.isAllSeoDescriptionsDefault || false;
	}, [ isSeoDataDefault ] );

	const showDefaultSeoDataChecklist = useMemo( () => {
		return isSeoTitlesDefault || isSeoDescriptionsDefault;
	}, [ isSeoTitlesDefault, isSeoDescriptionsDefault ] );


	const seoData = useMemo( () => {
		if ( isSeoTitlesDefault && isSeoDescriptionsDefault ) {
			return __( "SEO titles and meta descriptions", "wordpress-seo" );
		} else if ( isSeoTitlesDefault ) {
			return __( "SEO titles", "wordpress-seo" );
		} else if ( isSeoDescriptionsDefault ) {
			return __( "meta descriptions", "wordpress-seo" );
		}
	}, [ isSeoTitlesDefault, isSeoDescriptionsDefault ] );

	const message = useMemo( () => sprintf(
		/* translators: %1$s expand to "SEO title" or "meta description" or both. */
		__( "Stand out in the search results and attract more visitors by adding custom %1$s.", "wordpress-seo" ),
		seoData
	), [ seoData ] );

	const proTip = useMemo( () => safeCreateInterpolateElement(
		sprintf(
			/* translators: %1$s and %2$s expand to an opening and closing a strong tag. %3$s and %4$s expand to an opening and closing an emphasis tag. %5$s expands to "SEO title" or "meta description" or both */
			__(
				"%1$sPro tip%2$s: Use %3$sAI Generate%4$s for quick optimized %5$s.",
				"wordpress-seo"
			),
			"<strong>",
			"</strong>",
			"<em>",
			"</em>",
			seoData
		),
		{
			strong: <strong />,
			em: <em />,
		}
	), [ seoData ] );

	const titleButtons = useMemo( () => {
		if ( ! isSeoTitlesDefault ) {
			return [];
		}

		if ( isSeoDescriptionsDefault ) {
			return [];
		}

		return applyFilters( "yoast.replacementVariableEditor.additionalButtons", [], { fieldId: 'yoast-google-preview-pre-publish', type: 'title' } );
	}, [ isSeoTitlesDefault, isSeoDescriptionsDefault ] );

	const descButtons = useMemo( () => {
		if ( ! isSeoDescriptionsDefault ) {
			return [];
		}

		return applyFilters( "yoast.replacementVariableEditor.additionalButtons", [], { fieldId: 'yoast-google-preview-pre-publish', type: 'description' } );
	}, [ isSeoTitlesDefault, isSeoDescriptionsDefault ] );

	const { closePublishSidebar, openGeneralSidebar } = useDispatch( "core/edit-post" );
	const { openEditorModal } = useDispatch("yoast-seo/editor");

	const onClick = useCallback( () => {
		closePublishSidebar();
		openGeneralSidebar( "yoast-seo/seo-sidebar" );

		openEditorModal( "yoast-search-appearance-modal" );
	}, [ closePublishSidebar, openGeneralSidebar ] );

    return showDefaultSeoDataChecklist && <Fragment>
        <h4>{ __( "Default SEO data detected", "wordpress-seo" ) }</h4>
        <p>{ message }</p>
        <p>{ proTip }</p>
		<Slot name={ `yoast.replacementVariableEditor.additionalButtons.yoast-google-preview-pre-publish` } />
		{ titleButtons.map( ( button, index ) => (
			<Fragment key={ `additional-button-pre-publish-sidebar-title-${ index }` }>
				{ button }
			</Fragment>
		) ) }
		{ descButtons.map( ( button, index ) => (
			<Fragment key={ `additional-button-pre-publish-sidebar-description-${ index }` }>
				{ button }
			</Fragment>
		) ) }
		<Button onClick={ onClick }>{ __( "Write custom SEO data", "wordpress-seo" ) }</Button>
    </Fragment>;
}

DefaultSeoDataChecklist.propTypes = {
    isSeoDataDefault: PropTypes.object.isRequired,
};