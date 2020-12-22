import React from "react";
import ImageSelectButtons from "./ImageSelectButtons";

/**
 * Renders the ImageSelect component.
 *
 * @param {Object} props The props.
 *
 * @returns {Element} The ImageSelect component.
 */
function ImageSelect( props ) {
	const {
		imageUrlInputId,
		imageUrl,
		...imageSelectButtonsProps
	} = props;
	return (
		<div
			style={
				{
					display: "flex",
					flexDirection: "column",
				}
			}
		>
			<div>
				Square goes here
			</div>
			<div
				style={
					{
						display: "flex",
						margin: "10px 0 0 0",
					}
				}
			>
				<ImageSelectButtons { ...imageSelectButtonsProps } />
			</div>
		</div>
	);
};

export default ImageSelect;
