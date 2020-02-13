import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { Alert, Button } from "@yoast/components";

/**
 * Component for displaying an image selection button with a title.
 *
 * Displays an warning message when the selected image cannot be used.
 *
 * @param {object} props The properties passed to this component.
 * @param {string} props.title The title that is displayed above the selection button.
 * @param {string[]} props.warnings An array of warnings that detail why the image cannot be used.
 * @param {function} props.onClick Function that specifies what happens when the button is clicked.
 *
 * @returns {React.Component} A fragment with a title, optional warnings and an image selection button.
 */
const ImageSelect = ( { title, warnings, onClick } ) =>
	<Fragment>
		<p>
			{ title }
		</p>
		{
			warnings.length > 0 &&
			warnings.map( ( warning, index ) => <Alert key={ `warning${ index }` } type="warning">
				{ warning }
			</Alert> )
		}
		<Button
			onClick={ onClick }
		>
			Select image
		</Button>
	</Fragment>
;

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
