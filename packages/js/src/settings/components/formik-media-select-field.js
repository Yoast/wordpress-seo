/* eslint-disable complexity */
import { PhotographIcon } from "@heroicons/react/outline";
import { useDispatch } from "@wordpress/data";
import { useCallback, useEffect, useMemo, useState } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { Button, Label, Link, useDescribedBy } from "@yoast/ui-library";
import classNames from "classnames";
import { Field, useFormikContext } from "formik";
import { get, keys } from "lodash";
import PropTypes from "prop-types";
import { useSelectSettings } from "../store";
import { STORE_NAME } from "../constants";

const classNameMap = {
	variant: {
		square: "yst-h-48 yst-w-48",
		landscape: "yst-h-48 yst-w-96",
		portrait: "yst-h-96 yst-w-48",
	},
};

/**
 * @param {string} [label] Label.
 * @param {string} [description] Description.
 * @param {JSX.Element} [icon] Icon to show in select.
 * @param {boolean} [disabled] Disabled.
 * @param {string} [libraryType] Media type that should show in WP library, ie. "image" or "video".
 * @param {string} [variant] Variant.
 * @param {string} id Id.
 * @param {string} mediaUrlName Name for the hidden media url field.
 * @param {string} mediaIdName Name for the hidden media id field.
 * @param {string} previewLabel Label for the preview button.
 * @param {string} [selectLabel] Label for the select button.
 * @param {string} [replaceLabel] Label for the replace button.
 * @param {string} [removeLabel] Label for the remove button.
 * @param {string} [className] Classname.
 * @returns {JSX.Element} The Formik compatible media select element.
 */
const FormikMediaSelectField = ( {
	label = "",
	description = "",
	icon: Icon = PhotographIcon,
	disabled = false,
	libraryType = "image",
	variant = "landscape",
	id,
	mediaUrlName,
	mediaIdName,
	previewLabel = "",
	selectLabel = __( "Select image", "wordpress-seo" ),
	replaceLabel = __( "Replace image", "wordpress-seo" ),
	removeLabel = __( "Remove image", "wordpress-seo" ),
	className = "",
} ) => {
	const { values, setFieldValue, setFieldTouched, errors } = useFormikContext();
	const [ wpMediaLibrary, setWpMediaLibrary ] = useState( null );
	const wpMedia = useMemo( () => get( window, "wp.media", null ), [] );
	const mediaId = useMemo( () => get( values, mediaIdName, "" ), [ values, mediaIdName ] );
	const mediaUrl = useMemo( () => get( values, mediaUrlName, "" ), [ values, mediaUrlName ] );
	const media = useSelectSettings( "selectMediaById", [ mediaId ], mediaId );
	const { fetchMedia, addOneMedia } = useDispatch( STORE_NAME );
	const error = useMemo( () => get( errors, mediaIdName, "" ), [ errors, mediaIdName ] );
	const { ids: describedByIds, describedBy } = useDescribedBy( `field-${ id }-id`, { description, error } );

	const handleSelectMediaClick = useCallback( () => wpMediaLibrary?.open(), [ wpMediaLibrary ] );
	const handleRemoveMediaClick = useCallback( () => {
		// Update Formik state, but only validate on type.
		setFieldTouched( mediaUrlName, true, false );
		setFieldValue( mediaUrlName, "", false );

		setFieldTouched( mediaIdName, true, false );
		setFieldValue( mediaIdName, "" );
	}, [ setFieldTouched, setFieldValue, mediaUrlName, mediaIdName ] );
	const handleSelectMedia = useCallback( () => {
		const selectedMedia = wpMediaLibrary.state()?.get( "selection" )?.first()?.toJSON() || {};

		// Update Formik state, but only validate on type.
		setFieldTouched( mediaUrlName, true, false );
		setFieldValue( mediaUrlName, selectedMedia.url, false );

		setFieldTouched( mediaIdName, true, false );
		setFieldValue( mediaIdName, selectedMedia.id );

		// Update Redux state, note that this entity structure is different from what WP API returns.
		addOneMedia( selectedMedia );
	}, [ wpMediaLibrary, setFieldTouched, setFieldValue, mediaUrlName, mediaIdName ] );

	useEffect( () => {
		if ( wpMedia ) {
			setWpMediaLibrary( wpMedia( {
				title: label,
				multiple: false,
				library: { type: libraryType },
			} ) );
		}
	}, [ wpMedia, label, libraryType, setWpMediaLibrary ] );

	useEffect( () => {
		wpMediaLibrary?.on( "select", handleSelectMedia );
		return () => wpMediaLibrary?.off( "select", handleSelectMedia );
	}, [ wpMediaLibrary, handleSelectMedia ] );

	useEffect( () => {
		// Fetch media on mount if missing. No dependencies by design.
		if ( mediaId && ! media ) {
			fetchMedia( [ mediaId ] );
		}
	}, [] );

	return (
		<fieldset id={ id } className={ classNames( "yst-w-96", disabled && "yst-opacity-50" ) }>
			<Field
				type="hidden"
				name={ mediaIdName }
				id={ `field-${ id }-id` }
				aria-describedby={ describedBy }
			/>
			<Field
				type="hidden"
				name={ mediaUrlName }
				id={ `field-${ id }-url` }
				aria-describedby={ describedBy }
			/>
			{ label && <Label as="legend" className="yst-mb-2">{ label }</Label> }
			<button
				type="button"
				id={ `button-${ id }-preview` }
				onClick={ handleSelectMediaClick }
				className={ classNames(
					"yst-overflow-hidden yst-flex yst-justify-center yst-items-center yst-rounded-md yst-mb-4 yst-border-gray-300 focus:yst-outline-none focus:yst-ring-2 focus:yst-ring-offset-2 focus:yst-ring-primary-500",
					mediaUrl ? "yst-bg-gray-50 yst-border" : "yst-border-2 yst-border-dashed",
					disabled && "yst-cursor-not-allowed",
					classNameMap.variant[ variant ],
					className
				) }
				disabled={ disabled }
			>
				{ mediaUrl ? (
					<>
						<span className="yst-sr-only">{ replaceLabel }</span>
						<img
							src={ mediaUrl } alt={ media?.alt || "" }
							className="yst-object-cover yst-object-center yst-min-h-full yst-min-w-full"
						/>
					</>
				) : (
					<div className="yst-w-48">
						<span className="yst-sr-only">{ selectLabel }</span>
						<Icon className="yst-mx-auto yst-h-12 yst-w-12 yst-text-gray-400 yst-stroke-1" />
						{ previewLabel && (
							<p className="yst-text-xs yst-text-gray-500 yst-text-center yst-mt-1 yst-px-8">
								{ previewLabel }
							</p>
						) }
					</div>
				) }
			</button>
			<div className="yst-flex yst-gap-4">
				{ mediaUrl ? (
					<Button
						id={ `button-${ id }-replace` }
						variant="secondary" onClick={ handleSelectMediaClick }
						disabled={ disabled }
					>
						{ replaceLabel }
					</Button>
				) : (
					<Button
						id={ `button-${ id }-select` }
						variant="secondary" onClick={ handleSelectMediaClick }
						disabled={ disabled }
					>
						{ selectLabel }
					</Button>
				) }
				{ mediaUrl && (
					<Link
						id={ `button-${ id }-remove` }
						as="button"
						type="button"
						variant="error"
						onClick={ handleRemoveMediaClick }
						className={ disabled ? "yst-cursor-not-allowed" : "" }
						disabled={ disabled }
					>
						{ removeLabel }
					</Link>
				) }
			</div>
			{ error && <p id={ describedByIds.error } className="yst-mt-2 yst-text-sm yst-text-red-600">{ error }</p> }
			{ description && <p id={ describedByIds.description } className="yst-mt-2">{ description }</p> }
		</fieldset>
	);
};

FormikMediaSelectField.propTypes = {
	label: PropTypes.string,
	description: PropTypes.node,
	icon: PropTypes.elementType,
	disabled: PropTypes.bool,
	libraryType: PropTypes.string,
	variant: PropTypes.oneOf( keys( classNameMap.variant ) ),
	id: PropTypes.string.isRequired,
	mediaUrlName: PropTypes.string.isRequired,
	mediaIdName: PropTypes.string.isRequired,
	previewLabel: PropTypes.node,
	selectLabel: PropTypes.string,
	replaceLabel: PropTypes.string,
	removeLabel: PropTypes.string,
	className: PropTypes.string,
};

export default FormikMediaSelectField;
