import { PhotographIcon } from "@heroicons/react/outline";
import { compose } from "@wordpress/compose";
import { withDispatch, withSelect } from "@wordpress/data";
import { useCallback, useReducer } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { getErrorAriaProps, getErrorId, isLoadingStatus, isErrorStatus, withImagePicker, createAsyncActionReducer, createInitialImageState } from "@yoast/admin-ui-toolkit/helpers";
import { validationErrorPropType } from "@yoast/admin-ui-toolkit/prop-types";
import { MultiLineText, Spinner } from "@yoast/admin-ui-toolkit/components";
import { ASYNC_STATUS, UPLOAD_ACTIONS } from "@yoast/admin-ui-toolkit/constants";
import classNames from "classnames";
import { noop } from "lodash";
import PropTypes from "prop-types";

import { REDUX_STORE_KEY } from "../constants";

/**
 * The ImageSelect component.
 *
 * @param {object} props The props for the Imageselect component.
 * @param {string} props.id Id attribute.
 * @param {string} props.imageAltText Alternative text for image.
 * @param {string} props.url Url for image.
 * @param {string} props.label Label.
 * @param {function} props.dispatchImageData Dispatch handler.
 * @param {function} props.onRemoveImageClick Remove image handler.
 * @param {function} props.imagePicker Image Picker instance.
 * @param {string} props.className CSS classnames.
 * @param {ValidationError} props.error Validation error object.
 *
 * @returns {JSX.Element} The ImageSelect component.
 */
function ImageSelect( {
	id,
	imageAltText,
	url,
	label,
	dispatchImageData,
	onRemoveImageClick,
	imagePicker,
	className,
	error,
} ) {
	const [ state, dispatch ] = useReducer( createAsyncActionReducer( Object.values( UPLOAD_ACTIONS ) ), { status: ASYNC_STATUS.idle } );

	const imageClassName = classNames(
		"yst-relative yst-w-full yst-h-48 yst-mt-2 yst-flex yst-justify-center yst-items-center yst-rounded-md yst-mb-4 focus:yst-outline-none focus:yst-ring-2 focus:yst-ring-offset-2 focus:yst-ring-indigo-500",
		error.isVisible ? "yst-border-red-300" : "yst-border-gray-300", {
			// Only add border if no image is selected
			"yst-border-2 yst-border-dashed": ! url || isLoadingStatus( state.status ),
		},
	);

	const handleSelectFileClick = useCallback( () => {
		imagePicker( {
			requestCallback: () => {
				dispatch( { type: UPLOAD_ACTIONS.request } );
			},
			successCallback: ( payload ) => {
				dispatch( { type: UPLOAD_ACTIONS.success } );
				dispatchImageData( payload );
			},
			errorCallback: ( { message } ) => {
				dispatch( {
					type: UPLOAD_ACTIONS.error,
					payload: { error: message },
				} );
			},
		} );
	}, [ imagePicker ] );

	// Render a preview based on value and upload status
	const renderPreview = useCallback( () => {
		if ( isLoadingStatus( state.status ) ) {
			return (
				<div className="yst-text-center">
					<Spinner size="10" color="gray-400" className="yst-inline-block" />
					<p className="yst-mt-3">{ __( "Uploading image...", "admin-ui" ) }</p>
				</div>
			);
		} else if ( url ) {
			return <img src={ url } alt={ imageAltText } className="yst-w-full yst-h-full yst-object-contain" />;
		}
		return <PhotographIcon id={ `${ id }-no-image-svg` } className="yst-h-12 yst-w-12 yst-text-gray-400" />;
	}, [ state.status, id, url, imageAltText ] );

	return (
		<div className={ classNames( "yst-max-w-sm", className ) } { ...getErrorAriaProps( id, error ) }>
			<label htmlFor={ id } className="yst-block yst-mb-2">{ label }</label>
			<button
				id={ id }
				className={ imageClassName }
				onClick={ handleSelectFileClick }
				type="button"
			>
				{ renderPreview() }
			</button>
			<div>
				<button
					id={ url ? id + "__replace-image" : id + "__select-image" }
					className="yst-button--secondary yst-mr-2"
					onClick={ handleSelectFileClick }
				>
					{ url ? __( "Replace image", "admin-ui" ) : __( "Select image", "admin-ui" ) }
				</button>
				{ url && (
					<button
						id={ id + "__remove-image" }
						className="yst-button--remove"
						onClick={ onRemoveImageClick }
					>
						{ __( "Remove image", "admin-ui" ) }
					</button>
				) }
			</div>
			{ isErrorStatus( state.status ) && <p className="yst-mt-2 yst-text-sm yst-text-red-600">{ state.error }</p> }
			{ error.isVisible && <MultiLineText id={ getErrorId( id ) } className="yst-mt-2 yst-text-sm yst-text-red-600" texts={ error.messages } /> }
		</div>
	);
}

ImageSelect.propTypes = {
	label: PropTypes.string,
	id: PropTypes.string.isRequired,
	imagePicker: PropTypes.func,
	url: PropTypes.string,
	imageAltText: PropTypes.string,
	dispatchImageData: PropTypes.func,
	onRemoveImageClick: PropTypes.func,
	className: PropTypes.string,
	error: validationErrorPropType.propType,
};

ImageSelect.defaultProps = {
	label: "",
	url: "",
	imagePicker: () => console.warn( "Please provide an imagePicker function in the initialisation config." ),
	imageAltText: "",
	dispatchImageData: noop,
	onRemoveImageClick: noop,
	className: "",
	error: validationErrorPropType.defaultProp,
};

export default compose( [
	withImagePicker(),

	withSelect( ( select, { dataPath } ) => {
		const {
			getData,
			getValidationErrorProp,
		} = select( REDUX_STORE_KEY );

		return {
			url: getData( `${ dataPath }.url`, "" ),
			error: getValidationErrorProp( `${ dataPath }.url` ),
		};
	} ),
	withDispatch( ( dispatch, { dataPath } ) => {
		const {
			setData,
		} = dispatch( REDUX_STORE_KEY );

		return {
			dispatchImageData: ( imageData ) => {
				setData( dataPath, imageData );
			},
			onRemoveImageClick: () => {
				setData( dataPath, createInitialImageState() );
			},
		};
	} ),
] )( ImageSelect );

