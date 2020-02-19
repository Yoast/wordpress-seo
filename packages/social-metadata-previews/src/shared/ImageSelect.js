import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { Alert } from "@yoast/components";
import {
	SimulatedLabel, StandardButton,
} from "@yoast/search-metadata-previews/src/shared";
import { __ } from "@wordpress/i18n";
import styled from "styled-components";

const UndoButton = styled( StandardButton )`
	background: none!important;
	border: none;
	padding: 0!important;
	color: #a00;
	text-decoration: underline;
	cursor: pointer;
	box-shadow: none;

	&:hover {
		color: #F00;
	}

	&:focus {
		color: #F00;
	}
`;

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
const ImageSelect = ( { title, warnings, onClick, imageSelected, onRemoveButtonClick } ) =>
	<Fragment>
		<SimulatedLabel>
			{ title }
		</SimulatedLabel>
		{
			warnings.length > 0 && imageSelected &&
			warnings.map( ( warning, index ) => <Alert key={ `warning${ index }` } type="warning">
				{ warning }
			</Alert> )
		}
		<StandardButton
			onClick={ onClick }
		>
			{
				imageSelected
					? __( "Replace image", "yoast-components" )
					: __( "Select image", "yoast-components" )
			}
		</StandardButton>
		{
			imageSelected && <UndoButton
				onClick={ onRemoveButtonClick }
			>
				{ __( "Remove image", "yoast-components" ) }
			</UndoButton>
		}
	</Fragment>
;

ImageSelect.propTypes = {
	title: PropTypes.string.isRequired,
	onClick: PropTypes.func,
	onRemoveButtonClick: PropTypes.func,
	warnings: PropTypes.arrayOf( PropTypes.string ),
	imageSelected: PropTypes.bool.isRequired,
};

ImageSelect.defaultProps = {
	onRemoveButtonClick: () => {},
	onClick: () => {},
	warnings: [],
};

export default ImageSelect;
