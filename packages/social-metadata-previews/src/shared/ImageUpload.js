import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { Alert, Button } from "@yoast/components";

/**
 * Component for displaying an image selection button with a title.
 *
 * Displays an warning message when the selected image cannot be used.
 *
 * @param {string} props.title The title that is displayed above the selection button.
 * @param {function} props.verifyImage Function that verifies if the selected image adheres to criteria.
 * @param {string[]} props.warnings An array of warnings that detail why the image cannot be used.
 */
const ImageSelect = ( props ) => {
	return (
		<Fragment>
			<p>
				{ props.title }
			</p>
			{
				props.warnings.length > 0 &&
				<Alert type="warning">
					{ props.warnings.join( "\n" ) }
				</Alert>
			}
			<Button
				onClick={ props.onClick }
			>
				Select image
			</Button>
		</Fragment>
	);
};

ImageSelect.propTypes = {
	title: PropTypes.string.isRequired,
	onClick: PropTypes.func,
	warnings: PropTypes.arrayOf( PropTypes.string ),
};

ImageSelect.defaultProps = {
	onClick: () => {},
	warnings: [],
};

export default ImageSelect;
