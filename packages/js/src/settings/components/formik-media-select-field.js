/* eslint-disable complexity */
import { PhotographIcon } from "@heroicons/react/outline";
import { useCallback, useEffect, useMemo, useState } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { Button, Label, Link, useDescribedBy } from "@yoast/ui-library";
import classNames from "classnames";
import { Field, useFormikContext } from "formik";
import { get, join, keys, map } from "lodash";
import PropTypes from "prop-types";
import { useDispatchSettings, useSelectSettings } from "../hooks";

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
 * @param {boolean} [isDummy] Wether component should be in dummy state.
 * @param {string} [libraryType] Media type that should show in WP library, ie. "image" or "video".
 * @param {string} [variant] Variant.
 * @param {string} id Id.
 * @param {string} mediaUrlName Name for the hidden media url field.
 * @param {string} mediaIdName Name for the hidden media id field.
 * @param {string} fallbackMediaId ID for the fallback media.
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
	disabled: isDisabled = false,
	isDummy = false,
	libraryType = "image",
	variant = "landscape",
	id,
	mediaUrlName,
	mediaIdName,
	fallbackMediaId = "0",
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
	const media = useSelectSettings( "selectMediaById", [ mediaId ], mediaId );
	const isMediaError = useSelectSettings( "selectIsMediaError" );
	const fallbackMedia = useSelectSettings( "selectMediaById", [ fallbackMediaId ], fallbackMediaId );
	const { fetchMedia, addOneMedia } = useDispatchSettings();
	const error = useMemo( () => get( errors, mediaIdName, "" ), [ errors, mediaIdName ] );
	const disabled = useMemo( () => isDisabled || isDummy, [ isDummy, isDisabled ] );
	const { ids: describedByIds, describedBy } = useDescribedBy( `field-${ id }-id`, { description, error } );
	const previewMedia = useMemo( () => {
		if ( mediaId > 0 ) {
			return media;
		}
		if ( fallbackMediaId > 0 ) {
			return fallbackMedia;
		}
		return null;
	}, [ mediaId, media, fallbackMediaId, fallbackMedia ] );
	const previewSrcSet = useMemo(
		() => join( map( media?.sizes || fallbackMedia?.sizes, size => `${ size?.url } ${ size?.width }w` ), ", " ),
		[ media, fallbackMedia ]
	);

	const handleSelectMediaClick = useCallback( () => {
		if ( isDummy ) {
			return;
		}
		wpMediaLibrary?.open();
	}, [ isDummy, wpMediaLibrary ] );
	const handleRemoveMediaClick = useCallback( () => {
		if ( isDummy ) {
			return;
		}
		// Update Formik state, but only validate on type.
		setFieldTouched( mediaUrlName, true, false );
		setFieldValue( mediaUrlName, "", false );

		setFieldTouched( mediaIdName, true, false );
		setFieldValue( mediaIdName, "" );
	}, [ isDummy, setFieldTouched, setFieldValue, mediaUrlName, mediaIdName ] );
	const handleSelectMedia = useCallback( () => {
		if ( isDummy ) {
			return;
		}
		const selectedMedia = wpMediaLibrary.state()?.get( "selection" )?.first()?.toJSON() || {};

		// Update Formik state, but only validate on type.
		setFieldTouched( mediaUrlName, true, false );
		setFieldValue( mediaUrlName, selectedMedia.url, false );

		setFieldTouched( mediaIdName, true, false );
		setFieldValue( mediaIdName, selectedMedia.id );

		// Update Redux state, note that this entity structure is different from what WP API returns.
		addOneMedia( selectedMedia );
	}, [ isDummy, wpMediaLibrary, setFieldTouched, setFieldValue, mediaUrlName, mediaIdName ] );

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
		if ( fallbackMediaId && ! fallbackMedia ) {
			fetchMedia( [ fallbackMediaId ] );
		}
	}, [] );

	return (
		<fieldset id={ id } className="yst-min-w-0 yst-w-96 yst-max-w-full">
			<Field
				type="hidden"
				name={ mediaIdName }
				id={ `input-${ id }-id` }
				aria-describedby={ describedBy }
				disabled={ disabled }
			/>
			<Field
				type="hidden"
				name={ mediaUrlName }
				id={ `input-${ id }-url` }
				aria-describedby={ describedBy }
				disabled={ disabled }
			/>
			{ label && (
				<Label as="legend" className={ classNames( "yst-mb-2", disabled && "yst-opacity-50 yst-cursor-not-allowed" ) }>
					{ label }
				</Label>
			) }
			<button
				type="button"
				id={ `button-${ id }-preview` }
				onClick={ handleSelectMediaClick }
				className={ classNames(
					"yst-overflow-hidden yst-flex yst-justify-center yst-items-center yst-max-w-full yst-rounded-md yst-mb-4 yst-border-slate-300 focus:yst-outline-none focus:yst-ring-2 focus:yst-ring-offset-2 focus:yst-ring-primary-500",
					! isDummy && previewMedia ? "yst-bg-slate-50 yst-border" : "yst-border-2 yst-border-dashed",
					disabled && "yst-opacity-50 yst-cursor-not-allowed",
					classNameMap.variant[ variant ],
					className
				) }
				disabled={ disabled }
			>
				{ ! isDummy && previewMedia ? (
					<>
						<span className="yst-sr-only">{ replaceLabel }</span>
						<img
							src={ previewMedia?.url } alt={ previewMedia?.alt || "" }
							srcSet={ previewSrcSet }
							sizes={ variant === "landscape" ? "24rem" : "12rem" }
							width={ variant === "landscape" ? "24rem" : "12rem" }
							loading="lazy"
							decoding="async"
							className="yst-object-cover yst-object-center yst-min-h-full yst-min-w-full"
						/>
					</>
				) : (
					<div className="yst-w-48 yst-max-w-full">
						<span className="yst-sr-only">{ selectLabel }</span>
						<Icon className="yst-mx-auto yst-h-12 yst-w-12 yst-text-slate-400 yst-stroke-1" />
						{ previewLabel && (
							<p className="yst-text-xs yst-text-slate-600 yst-text-center yst-mt-1 yst-px-8">
								{ previewLabel }
							</p>
						) }
					</div>
				) }
			</button>
			<div className="yst-flex yst-gap-1">
				{ ! isDummy && ( mediaId > 0 ) ? (
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
				{ ! isDummy && ( mediaId > 0 ) && (
					<Link
						id={ `button-${ id }-remove` }
						as="button"
						type="button"
						variant="error"
						onClick={ handleRemoveMediaClick }
						className={ classNames(
							"yst-px-3 yst-py-2 yst-rounded-md",
							disabled && "yst-opacity-50 yst-cursor-not-allowed"
						) }
						disabled={ disabled }
					>
						{ removeLabel }
					</Link>
				) }
			</div>
			{ error && <p id={ describedByIds.error } className="yst-mt-2 yst-text-sm yst-text-red-600">{ error }</p> }
			{ isMediaError && <p className="yst-mt-2 yst-text-sm yst-text-red-600">{ __( "Failed to retrieve media.", "wordpress-seo" ) }</p> }
			{ description && (
				<p id={ describedByIds.description } className={ classNames( "yst-mt-2", disabled && "yst-opacity-50 yst-cursor-not-allowed" ) }>
					{ description }
				</p>
			) }
		</fieldset>
	);
};

FormikMediaSelectField.propTypes = {
	label: PropTypes.string,
	description: PropTypes.node,
	icon: PropTypes.elementType,
	disabled: PropTypes.bool,
	isDummy: PropTypes.bool,
	libraryType: PropTypes.string,
	variant: PropTypes.oneOf( keys( classNameMap.variant ) ),
	id: PropTypes.string.isRequired,
	mediaUrlName: PropTypes.string.isRequired,
	mediaIdName: PropTypes.string.isRequired,
	fallbackMediaId: PropTypes.string,
	previewLabel: PropTypes.node,
	selectLabel: PropTypes.string,
	replaceLabel: PropTypes.string,
	removeLabel: PropTypes.string,
	className: PropTypes.string,
};

export default FormikMediaSelectField;
