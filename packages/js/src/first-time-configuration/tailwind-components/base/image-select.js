import { PhotographIcon } from "@heroicons/react/outline";
import { useCallback } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { Button, Link } from "@yoast/ui-library";
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
 * @param {string}   props.fallbackUrl        Fallback url for image.
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
	fallbackUrl,
	label,
	onSelectImageClick,
	onRemoveImageClick,
	className,
	error,
	status,
} ) {
	const imageClassName = classNames(
		"yst-relative yst-w-full yst-h-48 yst-mt-2 yst-flex yst-justify-center yst-items-center yst-rounded-md yst-mb-4 focus:yst-outline-none focus:yst-ring-2 focus:yst-ring-offset-2 focus:yst-ring-primary-500",
		error.isVisible ? "yst-border-red-300" : "yst-border-slate-300",
		// Only add border if no image is selected
		"yst-border-2 yst-border-dashed"
	);

	// Render a preview based on value and upload status
	const renderPreview = useCallback( () => {
		if ( status === "loading" ) {
			return (
				<div className="yst-text-center">
					<Spinner size="10" color="gray-400" className="yst-inline-block" />
					<p className="yst-mt-3">{ __( "Uploading image...", "wordpress-seo" ) }</p>
				</div>
			);
		} else if ( url ) {
			return <img src={ url } alt={ imageAltText } className="yst-w-full yst-h-full yst-object-contain" />;
		} else if ( fallbackUrl ) {
			return <img src={ fallbackUrl } alt={ imageAltText } className="yst-w-full yst-h-full yst-object-contain" />;
		}

		return <PhotographIcon id={ `${ id }-no-image-svg` } className="yst-w-14 yst-h-14 yst-text-slate-500" />;
	}, [ status, id, url, imageAltText ] );

	return (
		<div className={ classNames( "yst-max-w-sm", className ) } { ...getErrorAriaProps( id, error ) }>
			<label htmlFor={ id } className="yst-block yst-mb-2 yst-font-medium yst-text-slate-700">{ label }</label>
			<button
				id={ id }
				className={ imageClassName }
				onClick={ onSelectImageClick }
				type="button"
				data-hiive-event-name="clicked_select_image"
			>
				{ renderPreview() }
			</button>
			<div>
				<Button
					id={ url ? id + "__replace-image" : id + "__select-image" }
					variant="secondary"
					className="yst-me-2"
					onClick={ onSelectImageClick }
					data-hiive-event-name={ url ? "clicked_replace_image" : "clicked_select_image" }
				>
					{ url ? __( "Replace image", "wordpress-seo" ) : __( "Select image", "wordpress-seo" ) }
				</Button>
				{ url && (
					<Link
						id={ `${ id }__remove-image` }
						as="button"
						type="button"
						variant="error"
						onClick={ onRemoveImageClick }
						className="yst-px-3 yst-py-2 yst-rounded-md"
						data-hiive-event-name="clicked_remove_image"
					>
						{ __( "Remove image", "wordpress-seo" ) }
					</Link>
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
	fallbackUrl: PropTypes.string,
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
	fallbackUrl: "",
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
