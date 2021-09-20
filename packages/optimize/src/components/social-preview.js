/* eslint-disable complexity */
import { compose } from "@wordpress/compose";
import { withDispatch, withSelect } from "@wordpress/data";
import { Fragment, useCallback, useReducer } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { strings } from "@yoast/helpers";
import { SocialPreviewEditor } from "@yoast/social-metadata-previews";
import { Spinner } from "@yoast/admin-ui-toolkit/components";
import { ASYNC_STATUS, UPLOAD_ACTIONS } from "@yoast/admin-ui-toolkit/constants";
import { createAsyncActionReducer, createInitialImageState, isErrorStatus, isLoadingStatus, withImagePicker } from "@yoast/admin-ui-toolkit/helpers";
import PropTypes from "prop-types";

import { OPTIMIZE_STORE_KEY } from "../constants";
import { applyReplacevars, getReplacevarsForEditor } from "../helpers/apply-replacevars";

/**
 *
 * @param {Object} props The props.
 * @param {Function} props.imagePicker The imagePicker implementation.
 * @param {Function} props.onSelectImageClick The select image handler.
 * @param {string} contentType The content type.
 * @returns {JSX.Element} The SocialPreview component.
 */
const SocialPreview = ( { imagePicker, onSelectImageClick, ...props } ) => {
	const [ state, dispatch ] = useReducer( createAsyncActionReducer( Object.values( UPLOAD_ACTIONS ) ), { status: ASYNC_STATUS.idle } );
	const handleSelectImageClick = useCallback( () => {
		imagePicker( {
			requestCallback: () => {
				dispatch( { type: UPLOAD_ACTIONS.request } );
			},
			successCallback: ( payload ) => {
				dispatch( { type: UPLOAD_ACTIONS.success } );
				onSelectImageClick( payload );
			},
			errorCallback: ( { message } ) => {
				dispatch( {
					type: UPLOAD_ACTIONS.error,
					payload: { error: message },
				} );
			},
		} );
	}, [ imagePicker, onSelectImageClick ] );
	return (
		<Fragment>
			{ isLoadingStatus( state.status ) && (
				<div className="yst-flex yst-items-center">
					<Spinner size="4" color="gray-400" className="yst-mr-2" />
					<span className="yst-text-sm">{ __( "Uploading image...", "admin-ui" ) }</span>
				</div>
			) }
			{ isErrorStatus( state.status ) && <p className="yst-text-sm yst-text-red-600">{ state.error }</p> }
			<SocialPreviewEditor
				{ ...props }
				onSelectImageClick={ handleSelectImageClick }
			/>
		</Fragment>
	);
};

SocialPreview.propTypes = {
	imagePicker: PropTypes.func.isRequired,
	onSelectImageClick: PropTypes.func.isRequired,
	contentType: PropTypes.string.isRequired,
};

export default compose( [
	withImagePicker(),

	withSelect( ( select, { dataPath, contentType, socialMediumName } ) => {
		const {
			getData,
			getOption,
			getSetting,
		} = select( OPTIMIZE_STORE_KEY );

		// Twitter preview falls back to OpenGraph data first.
		const isTwitter = socialMediumName === "Twitter";

		const siteUrl = getOption( "siteUrl", "" );

		const title = getData( `${ dataPath }.title` );
		const titlePreviewFallback =
			( isTwitter && getData( "opengraph.title" ) ) ||
			getData( "seo.title" ) ||
			getSetting( `contentTypes.${ contentType }.templates.seo.single.title` ) ||
			getData( "fallbacks.seo.title" ) ||
			getData( "title" ) ||
			"";

		const description = getData( `${ dataPath }.description`, "" );
		const descriptionPreviewFallback =
			( isTwitter && getData( "opengraph.description" ) ) ||
			getData( "seo.description" ) ||
			getSetting( `contentTypes.${ contentType }.templates.seo.single.description` ) ||
			getData( "fallbacks.seo.description" ) ||
			strings.stripHTMLTags( getData( "description" ) ) ||
			"";

		const imageUrl = getData( `${ dataPath }.image.url` );
		const imageFallbackUrl =
			( isTwitter && getData( "opengraph.image.url" ) ) ||
			getData( "images" )?.[ 0 ]?.url ||
			getSetting( "siteSettings.siteDefaults.siteImage.url" ) ||
			getOption( "siteSocialImage.url" ) ||
			"";

		const authorName = getData( "author", "" );
		const replacementVariables = getReplacevarsForEditor( { scope: contentType } );

		return {
			title,
			titlePreviewFallback,
			description,
			descriptionPreviewFallback,
			imageUrl,
			imageFallbackUrl,
			authorName,
			siteUrl,
			replacementVariables,
			recommendedReplacementVariables: replacementVariables.map( replacevar => replacevar.name ),
		};
	} ),

	withDispatch( ( dispatch, { dataPath, contentType } ) => {
		const {
			setData,
		} = dispatch( OPTIMIZE_STORE_KEY );

		return {
			onTitleChange: ( value ) => setData( `${ dataPath }.title`, value ),
			onDescriptionChange: ( value ) => setData( `${ dataPath }.description`, value ),
			onSelectImageClick: ( value ) => setData( `${ dataPath }.image`, value ),
			onRemoveImageClick: () => setData( `${ dataPath }.image`, createInitialImageState() ),
			applyReplacementVariables: applyReplacevars.bind( null, { scope: contentType } ),
		};
	} ),

] )( SocialPreview );
