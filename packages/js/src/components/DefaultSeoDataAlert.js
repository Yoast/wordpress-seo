import PropTypes from "prop-types";
import { ExclamationCircleIcon } from "@heroicons/react/solid";
import { select, useDispatch } from "@wordpress/data";
import { __, sprintf } from "@wordpress/i18n";
import { Fragment, useCallback, useMemo } from "@wordpress/element";
import { applyFilters } from "@wordpress/hooks";
import { Slot } from "@wordpress/components";
import { Button } from "@yoast/components";
import { safeCreateInterpolateElement } from "../helpers/i18n";

const STORE_NAME_EDITOR = "yoast-seo/editor";
const STORE_NAME_CORE_EDITOR = "core/editor";
const STORE_NAME_CORE_EDIT_POST = "core/edit-post";

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
	const postType = select( STORE_NAME_EDITOR ).getPostType();
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

	const customSeoDataNames = useMemo( () => {
		if ( isTitlesDefault && isDescriptionsDefault ) {
			return __( "custom SEO titles and meta descriptions", "wordpress-seo" );
		} else if ( isTitlesDefault ) {
			return __( "custom SEO titles", "wordpress-seo" );
		} else if ( isDescriptionsDefault ) {
			return __( "custom meta descriptions", "wordpress-seo" );
		}
	}, [ isTitlesDefault, isDescriptionsDefault ] );

	const optimizedSeoDataNames = useMemo( () => {
		if ( isTitlesDefault && isDescriptionsDefault ) {
			return __( "quick optimized SEO titles and meta descriptions", "wordpress-seo" );
		} else if ( isTitlesDefault ) {
			return __( "quick optimized SEO titles", "wordpress-seo" );
		} else if ( isDescriptionsDefault ) {
			return __( "quick optimized meta descriptions", "wordpress-seo" );
		}
	}, [ isTitlesDefault, isDescriptionsDefault ] );

	const message = useMemo( () => sprintf(
		/* translators: %1$s expands to "custom SEO titles" or "custom meta descriptions" or both. */
		__( "Stand out in the search results and attract more visitors by adding %1$s.", "wordpress-seo" ),
		customSeoDataNames
	), [ customSeoDataNames ] );

	const proTip = useMemo( () => safeCreateInterpolateElement(
		sprintf(
			/* translators: %1$s, %2$s expands to strong tags. %3$s, %4$s expands to emphasis tags.
				%5$s expands to "quick optimized SEO titles" or "quick optimized meta descriptions" or both */
			__(
				"%1$sPro tip%2$s: Use %3$sAI Generate%4$s for %5$s.",
				"wordpress-seo"
			),
			"<strong>",
			"</strong>",
			"<em>",
			"</em>",
			optimizedSeoDataNames
		),
		{
			strong: <strong />,
			em: <em />,
		}
	), [ optimizedSeoDataNames ] );

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

	const openGeneralSidebar = useDispatch( STORE_NAME_CORE_EDIT_POST )?.openGeneralSidebar;
	const closePublishSidebar = useDispatch( STORE_NAME_CORE_EDITOR )?.closePublishSidebar;
	const { openEditorModal } = useDispatch( STORE_NAME_EDITOR );

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
