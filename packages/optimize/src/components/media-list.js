import { PhotographIcon } from "@heroicons/react/outline/";
import { useSelect } from "@wordpress/data";
import { __, sprintf } from "@wordpress/i18n";
import PropTypes from "prop-types";
import { OPTIMIZE_STORE_KEY } from "../constants";

/**
 * The wrapper div that accepts the images as children.
 * @param {Object} props The props.
 * @returns {*} The wrapper div and featured image or placeholder.
 */
export const MediaWrapper = ( { title, featuredImageSrc, featuredImageAlt, children, className, editText } ) => {
	const editUrl = useSelect( ( select ) => select( OPTIMIZE_STORE_KEY ).getMetadata( "editUrl" ), [] );

	return (
		<div className={ className }>
			<p className="yst-text-gray-700 yst-font-semibold">{ title }</p>
			{ editText && <a href={ editUrl } target="_blank" rel="noopener noreferrer" className="yst-block yst-mb-3">{ editText }</a> }
			<div className="yst-grid yst-grid-cols-media yst-grid-rows-media yst-gap-2 yst-mt-2">
				<div
					className="yst-col-span-2 yst-row-span-2 yst-border yst-border-gray-300 yst-rounded-md yst-overflow-hidden yst-flex yst-items-center yst-justify-center yst-h-200 yst-w-200"
				>
					{
						featuredImageSrc
							? <img src={ featuredImageSrc } alt={ featuredImageAlt } />
							: <a href={ editUrl } target="_blank" rel="noopener noreferrer" className="yst-flex yst-items-center yst-justify-center yst-h-full yst-w-full">
								<PhotographIcon className="yst-h-12 yst-w-12 yst-text-gray-400" />
							</a>
					}
				</div>
				{ children }
			</div>
		</div>
	);
};

MediaWrapper.propTypes = {
	featuredImageSrc: PropTypes.string,
	featuredImageAlt: PropTypes.string,
	children: PropTypes.oneOfType( [
		PropTypes.arrayOf( PropTypes.node ),
		PropTypes.node,
	] ),
	className: PropTypes.string,
	editText: PropTypes.string,
	title: PropTypes.string.isRequired,
};

MediaWrapper.defaultProps = {
	featuredImageSrc: "",
	featuredImageAlt: "",
	children: "",
	className: "",
	editText: "",
};

/**
 * The media with a list of images.
 *
 * @param {Object} props The props object.
 * @param {string} props.contentType The content type slug.
 * @param {boolean} props.isLoading Wether or not the component should be in loading state.
 * @returns {JSX.Element} The Media component.
 */
export default function MediaList( { contentType, isLoading } ) {
	const cmsName = useSelect( select => select( OPTIMIZE_STORE_KEY ).getOption( "cmsName" ) );
	const mediaListTitle = useSelect(
		select => select( OPTIMIZE_STORE_KEY ).getOption( `contentTypes.${ contentType }.mediaListTitle` ),
		[ contentType ],
	);
	const hasMediaList = useSelect(
		select => select( OPTIMIZE_STORE_KEY ).getOption( `contentTypes.${ contentType }.hasMediaList` ),
	);
	if ( ! hasMediaList ) {
		return null;
	}

	const images = useSelect( ( select ) => select( OPTIMIZE_STORE_KEY ).getData( "images" ), [] );

	const [ featuredImage, ...remainingImages ] = images;

	return (
		<MediaWrapper
			title={ mediaListTitle || __( "Media", "admin-ui" ) }
			featuredImageAlt={ featuredImage?.alt }
			featuredImageSrc={ featuredImage?.url }
			editText={ sprintf(
				( images.length > 0
					// translators: %1$s expands to the CMS name.
					? __( "Edit with %1$s", "admin-ui" )
					// translators: %1$s expands to the CMS name.
					: __( "Add with %1$s", "admin-ui" ) ),
				cmsName,
			) }
			className={ isLoading ? "yst-animate-pulse" : "" }
		>
			{
				remainingImages.map( ( image ) => {
					return <div
						className="yst-border yst-border-gray-300 yst-rounded-md yst-overflow-hidden yst-max-h-100 yst-flex yst-items-center yst-justify-center"
						key={ image.id }
					>
						<img src={ image.url } alt={ image.alt } className="yst-max-h-full" />
					</div>;
				} )
			}
		</MediaWrapper>
	);
}

MediaList.propTypes = {
	contentType: PropTypes.string.isRequired,
	isLoading: PropTypes.bool,
};

MediaList.defaultProps = {
	isLoading: false,
};
