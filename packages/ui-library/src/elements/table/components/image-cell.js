import PhotographIcon from "@heroicons/react/outline/PhotographIcon";
import React from "react";
import classNames from "classnames";

/**
 * @param {Object} [cellProps]  Extra props for the td element (e.g. colSpan, className).
 * @param {Object} [imageProps] Props spread onto the img element (src, alt, etc.). When src is absent, a placeholder icon is shown.
 * @returns {JSX.Element} The element.
 */
export const ImageCell = ( { cellProps = {}, imageProps = {} } ) => {
	const { className: cellClassName, ...restCellProps } = cellProps;
	const { src, alt = "", className: imageClassName, ...restImageProps } = imageProps;

	return (
		<td className={ classNames( "yst-table-cell yst-table-image-cell", cellClassName ) } { ...restCellProps }>
			<div className="yst-table-image-cell__image-container">
				{ src
					? <img src={ src } alt={ alt } { ...restImageProps } className={ classNames( "yst-table-image-cell__image", imageClassName ) } />
					: <PhotographIcon className="yst-table-image-cell__placeholder" aria-hidden="true" />
				}
			</div>
		</td>
	);
};

ImageCell.displayName = "Table.ImageCell";
