import PropTypes from "prop-types";
import { ExclamationCircleIcon } from "@heroicons/react/solid";
import { select, useDispatch } from "@wordpress/data";
import { __, sprintf } from "@wordpress/i18n";
import { Fragment, useCallback, useMemo } from "@wordpress/element";
import { applyFilters } from "@wordpress/hooks";
import { Slot } from "@wordpress/components";
import { Button } from "@yoast/components";
import { safeCreateInterpolateElement } from "../helpers/i18n";

/**
 * Renders the Default SEO Data Alert.
 *
 * @param {Object} isSeoDataDefault Whether SEO titles and meta descriptions are default.
 *
 * @returns {wp.Element} The Default SEO Data Alert.
 */
export default function DefaultSeoDataAlert( {
	isSeoDataDefault,
} ) {
	const postType = select( "yoast-seo/editor" ).getPostType();
	const isTitlesDefault = useMemo( () => {
		return isSeoDataDefault?.isAllTitlesDefault || false;
	}, [ isSeoDataDefault ] );

	const isDescriptionsDefault = useMemo( () => {
		return isSeoDataDefault?.isAllDescriptionsDefault || false;
	}, [ isSeoDataDefault ] );

	const showAlert = useMemo( () => {
		if ( postType !== "post" ) {
			return false;
		}

		return isTitlesDefault || isDescriptionsDefault;
	}, [ postType, isTitlesDefault, isDescriptionsDefault ] );


	const seoDataNames = useMemo( () => {
		if ( isTitlesDefault && isDescriptionsDefault ) {
			return __( "SEO titles and meta descriptions", "wordpress-seo" );
		} else if ( isTitlesDefault ) {
			return __( "SEO titles", "wordpress-seo" );
		} else if ( isDescriptionsDefault ) {
			return __( "meta descriptions", "wordpress-seo" );
		}
	}, [ isTitlesDefault, isDescriptionsDefault ] );

	const message = useMemo( () => sprintf(
		/* translators: %1$s expand to "SEO title" or "meta description" or both. */
		__( "Stand out in the search results and attract more visitors by adding custom %1$s.", "wordpress-seo" ),
		seoDataNames
	), [ seoDataNames ] );

	const proTip = useMemo( () => safeCreateInterpolateElement(
		sprintf(
			/* translators: %1$s, %2$s expand to strong tags. %3$s, %4$s expand to emphasis tags. %5$s expands to "SEO title" or "meta description" */
			__(
				"%1$sPro tip%2$s: Use %3$sAI Generate%4$s for quick optimized %5$s.",
				"wordpress-seo"
			),
			"<strong>",
			"</strong>",
			"<em>",
			"</em>",
			seoDataNames
		),
		{
			strong: <strong />,
			em: <em />,
		}
	), [ seoDataNames ] );

	const titleButtons = useMemo( () => {
		if ( ! isTitlesDefault ) {
			return [];
		}

		if ( isDescriptionsDefault ) {
			return [];
		}

		return applyFilters( "yoast.replacementVariableEditor.additionalButtons", [], { fieldId: "yoast-google-preview-pre-publish", type: "title" } );
	}, [ isTitlesDefault, isDescriptionsDefault ] );

	const descButtons = useMemo( () => {
		if ( ! isDescriptionsDefault ) {
			return [];
		}

		return applyFilters( "yoast.replacementVariableEditor.additionalButtons", [], { fieldId: "yoast-google-preview-pre-publish", type: "description" } );
	}, [ isTitlesDefault, isDescriptionsDefault ] );

	const { closePublishSidebar, openGeneralSidebar } = useDispatch( "core/edit-post" );
	const { openEditorModal } = useDispatch( "yoast-seo/editor" );

	const onClick = useCallback( () => {
		closePublishSidebar();
		openGeneralSidebar( "yoast-seo/seo-sidebar" );

		openEditorModal( "yoast-search-appearance-modal" );
	}, [ closePublishSidebar, openGeneralSidebar ] );

	return showAlert && <Fragment>
		<div className="yst-flex yst-items-center yst-gap-1 yst-mb-[-25px]">
			<ExclamationCircleIcon className="yst-w-4 yst-h-4 yst-text-amber-500" />
			<h4>{ __( "Default SEO data detected", "wordpress-seo" ) }</h4>
		</div>
		<p>{ message }</p>
		{ titleButtons.length + descButtons.length > 0 && <p>
			{ proTip }
		</p> }
		<Slot name={ "yoast.replacementVariableEditor.additionalButtons.yoast-google-preview-pre-publish" } />
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
		<Button className="yst-mt-2" onClick={ onClick }>{ __( "Write custom SEO data", "wordpress-seo" ) }</Button>
	</Fragment>;
}

DefaultSeoDataAlert.propTypes = {
	isSeoDataDefault: PropTypes.object.isRequired,
};
