import { PhotographIcon } from "@heroicons/react/outline";
import { useCallback } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import classNames from "classnames";
import { noop } from "lodash";
import PropTypes from "prop-types";
import MultiLineText from "./multi-line-text";
import { getErrorAriaProps, getErrorId } from "../helpers";
import Spinner from "./spinner";

/* eslint-disable complexity */
/**
 * The ImageSelect component.
 *
 * @param {object}   props                    The props for the Imageselect component.
 * @param {string}   props.id                 Id attribute.
 * @param {string}   props.imageAltText       Alternative text for image.
 * @param {string}   props.url                Url for image.
 * @param {string}   props.label              Label.
 * @param {function} props.onSelectImageClick Select image handler.
 * @param {function} props.onRemoveImageClick Remove image handler.
 * @param {string}   props.className          CSS classnames.
 * @param {object}   props.error              Validation error object.
 *
 * @returns {WPElement} The ImageSelect component.
 */
export default function ImageSelect( {
	id,
	imageAltText,
	url,
	label,
	onSelectImageClick,
	onRemoveImageClick,
	className,
	error,
	status,
} ) {
	const imageClassName = classNames(
		"yst-relative yst-w-full yst-h-48 yst-mt-2 yst-flex yst-justify-center yst-items-center yst-rounded-md yst-mb-4 focus:yst-outline-none focus:yst-ring-2 focus:yst-ring-offset-2 focus:yst-ring-primary-500",
		error.isVisible ? "yst-border-red-300" : "yst-border-gray-300",
		// Only add border if no image is selected
		"yst-border-2 yst-border-dashed"
	);

	// Render a preview based on value and upload status
	const renderPreview = useCallback( () => {
		if ( status === "loading" ) {
			return (
				<div className="yst-text-center">
					<Spinner size="10" color="gray-400" className="yst-inline-block" />
					<p className="yst-mt-3">{ __( "Uploading image...", "admin-ui" ) }</p>
				</div>
			);
		} else if ( url ) {
			return <img src={ url } alt={ imageAltText } className="yst-w-full yst-h-full yst-object-contain" />;
		}
		return <PhotographIcon id={ `${ id }-no-image-svg` } className="yst-w-14 yst-h-14 yst-text-gray-500" />;
	}, [ status, id, url, imageAltText ] );

	return (
		<div className={ classNames( "yst-max-w-sm", className ) } { ...getErrorAriaProps( id, error ) }>
			<label htmlFor={ id } className="yst-block yst-mb-2 yst-font-medium yst-text-gray-700">{ label }</label>
			<button
				id={ id }
				className={ imageClassName }
				onClick={ onSelectImageClick }
				type="button"
			>
				{ renderPreview() }
			</button>
			<div>
				<button
					type="button"
					id={ url ? id + "__replace-image" : id + "__select-image" }
					className="yst-button yst-button yst-button--secondary yst-mr-2"
					onClick={ onSelectImageClick }
				>
					{ url ? __( "Replace image", "admin-ui" ) : __( "Select image", "admin-ui" ) }
				</button>
				{ url && (
					<button
						type="button"
						id={ id + "__remove-image" }
						className="yst-button--remove"
						onClick={ onRemoveImageClick }
					>
						{ __( "Remove image", "admin-ui" ) }
					</button>
				) }
			</div>
			{ status === "error" && <p className="yst-mt-2 yst-text-sm yst-text-red-600">{ error }</p> }
			{ error.isVisible && <MultiLineText id={ getErrorId( id ) } className="yst-mt-2 yst-text-sm yst-text-red-600" texts={ error.message } /> }
		</div>
	);
}

ImageSelect.propTypes = {
	label: PropTypes.string,
	id: PropTypes.string.isRequired,
	url: PropTypes.string,
	imageAltText: PropTypes.string,
	onRemoveImageClick: PropTypes.func,
	onSelectImageClick: PropTypes.func,
	className: PropTypes.string,
	error: PropTypes.shape( {
		message: PropTypes.string,
		isVisible: PropTypes.bool,
	} ),
	status: PropTypes.string,
};

ImageSelect.defaultProps = {
	label: "",
	url: "",
	imageAltText: "",
	onRemoveImageClick: noop,
	onSelectImageClick: noop,
	className: "",
	error: {
		message: "",
		isVisible: false,
	},
	status: "idle",
};
/* eslint-enable complexity */
