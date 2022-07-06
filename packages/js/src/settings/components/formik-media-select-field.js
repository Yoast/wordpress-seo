import { __ } from "@wordpress/i18n";
import { useState, useCallback, useEffect } from "@wordpress/element";
import { Field, useFormikContext } from "formik";
import { get } from "lodash";
import PropTypes from "prop-types";
import classNames from "classnames";
import { PhotographIcon } from "@heroicons/react/outline";
import { Button, Label } from "@yoast/ui-library";

/**
 *
 * @param {string} [label] Label.
 * @param {string} [description] Description.
 * @returns {JSX.Element} The Formik compatible media select element.
 */
const FormikMediaSelectField = ( {
	label = "",
	description = "",
	imageUrlName,
	imageIdName,
	className = "",
} ) => {
	const { values, setFieldValue, setFieldTouched } = useFormikContext();
	const [ mediaLibrary, setMediaLibrary ] = useState( null );
	const [ imageMeta, setImageMeta ] = useState( {} );

	const imageUrl = get( values, imageUrlName, "" );

	const handleSelectMediaClick = useCallback( () => mediaLibrary?.open(), [ mediaLibrary ] );

	useEffect( () => {
		const wpMedia = get( window, "wp.media", null );

		if ( wpMedia && ! mediaLibrary ) {
			// Create WordPress media library instance
			const wpMediaLibrary = wpMedia( {
				title: "TEST TITLE",
				button: { text: "TEST BUTTON TEXT" },
				multiple: false,
				library: { type: "image" },
			} );

			// Attach media select event listener.
			wpMediaLibrary.on( "select", () => {
				const media = wpMediaLibrary.state().get( "selection" ).first().toJSON();

				console.warn( "media", media );

				// Update local image meta state.
				setImageMeta( { alt: media.alt } );

				// Update Formik state.
				setFieldTouched( imageUrlName, true, false );
				setFieldValue( imageUrlName, media.url );

				setFieldTouched( imageIdName, true, false );
				setFieldValue( imageIdName, media.id );
			} );

			setMediaLibrary( wpMediaLibrary );
		}
	}, [] );

	return (
		<fieldset className="yst-max-w-sm">
			<Field type="hidden" name={ imageUrlName } id={ `input:${ imageUrlName }` } />
			<Field type="hidden" name={ imageIdName } id={ `input:${ imageIdName }` } />
			{ label && <Label as="legend">{ label }</Label> }
			<button
				type="button"
				id="button:media-select-preview"
				onClick={ handleSelectMediaClick }
				className={ classNames(
					"yst-h-48 yst-mt-2 yst-overflow-hidden yst-flex yst-justify-center yst-items-center yst-rounded-md yst-mb-4",
					imageUrl ? "yst-bg-gray-50" : "yst-border-2 yst-border-gray-300 yst-border-dashed",
					className
				) }
			>
				{ imageUrl ? (
					<img src={ imageUrl } alt={ imageMeta.alt || "" } className="yst-object-cover yst-object-center yst-min-h-full yst-min-w-full" />
				) : (
					<div>
						<PhotographIcon className="yst-mx-auto yst-h-12 yst-w-12 yst-text-gray-400 yst-stroke-1" />
						{ description && (
							<p className="yst-text-xs yst-text-gray-500 yst-text-center yst-mt-1 yst-px-8">
								{ description }
							</p>
						) }
					</div>
				) }
			</button>

		</fieldset>
	);
};

FormikMediaSelectField.propTypes = {
	label: PropTypes.string,
	description: PropTypes.node,
	imageUrlName: PropTypes.string.isRequired,
	imageIdName: PropTypes.string.isRequired,
	className: PropTypes.string,
};

export default FormikMediaSelectField;
