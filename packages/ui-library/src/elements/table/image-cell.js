import PhotographIcon from "@heroicons/react/outline/PhotographIcon";
import PropTypes from "prop-types";
import React from "react";
import classNames from "classnames";

/**
 * The ImageCell component is a specialized table cell that displays an image or a placeholder.
 *
 * @param {Object} [props] Optional cell props.
 * @param {string} [src] The image source. When empty, fallback to a placeholder.
 * @param {string} [alt] The image alt text. Defaults to empty.
 * @param {string} [className] Optional class name.
 * @param {string} [placeholderAlt] Optional alt text for the placeholder image. Defaults to "No image available".
 * @returns {JSX.Element} The element.
 */
export const ImageCell = ( { src = "", alt = "", className = "", placeholderAlt = "No image available", ...props } ) => {
	return (
		<td className={ classNames( "yst-table-cell", className ) } { ...props }>
			<div className="yst-table-image-cell">
				{ src
					? <img src={ src } alt={ alt } className="yst-table-image-cell-image" />
					: <PhotographIcon className="yst-table-image-cell-placeholder" aria-hidden={ false } aria-label={ placeholderAlt } role="img" />  }
			</div>
		</td>
	);
};

ImageCell.propTypes = {
	src: PropTypes.string,
	alt: PropTypes.string,
	className: PropTypes.string,
	placeholderAlt: PropTypes.string,
};
