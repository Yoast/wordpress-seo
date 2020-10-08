import { __ } from "@wordpress/i18n";
import { Alert, InputField, SimulatedLabel } from "@yoast/components";
import { StandardButton } from "@yoast/replacement-variable-editor";
import PropTypes from "prop-types";
import React, { Fragment } from "react";
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

const UrlInputField = styled( InputField )`
	min-width: 100%;
`;

const ColumnWrapper = styled.div`
	display: flex;
	flex-direction: column;
`;

const RowWrapper = styled.div`
	display: flex;
	margin: 10px 0 0 0;
`;

const DivWithMargin = styled.div`
	margin-top: 24px;
`;

/**
 * Renders the select/replace and remove buttons.
 *
 * @param {object}   props                      The properties passed to this component.
 * @param {bool}     props.imageSelected        Is there already an image selected.
 * @param {function} props.onClick              Callback called when the "Select image" or "Replace image" button is clicked.
 * @param {function} props.onRemoveImageClick   Callback called when the "Remove image" button is clicked.
 * @param {string}   props.selectImageButtonId  The ID for the select image button.
 * @param {string}   props.replaceImageButtonId The ID for the replace image button.
 * @param {string}   props.removeImageButtonId  The ID for the remove image button.
 *
 * @returns {JSX.Element} The buttons to render for the ImageSelect.
 */
const ImageSelectButtons = ( {
	imageSelected,
	onClick,
	onRemoveImageClick,
	selectImageButtonId,
	replaceImageButtonId,
	removeImageButtonId,
} ) => {
	return <Fragment>
		<StandardButton
			id={ imageSelected ? replaceImageButtonId : selectImageButtonId }
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
				id={ removeImageButtonId }
				onClick={ onRemoveImageClick }
			>
				{ __( "Remove image", "yoast-components" ) }
			</UndoButton>
		}
	</Fragment>;
};

ImageSelectButtons.propTypes = {
	imageSelected: PropTypes.bool.isRequired,
	onClick: PropTypes.func.isRequired,
	onRemoveImageClick: PropTypes.func.isRequired,
	selectImageButtonId: PropTypes.string.isRequired,
	replaceImageButtonId: PropTypes.string.isRequired,
	removeImageButtonId: PropTypes.string.isRequired,
};

/**
 * Component for displaying an image selection button with a title.
 *
 * Displays an warning message when the selected image cannot be used.
 *
 * @param {object}   props                      The properties passed to this component.
 * @param {string}   props.title                The title that is displayed above the selection button.
 * @param {string[]} props.warnings             An array of warnings that detail why the image cannot be used.
 * @param {function} props.onClick              Callback called when the "Select image" or "Replace image" button is clicked.
 * @param {function} props.onRemoveImageClick   Callback called when the "Remove image" button is clicked.
 * @param {string}   props.imageUrl             The Url adress of the image
 * @param {bool}     props.isPremium            States if premium is installed.
 * @param {string}   props.imageUrlInputId      The ID for the image URL input.
 * @param {string}   props.selectImageButtonId  The ID for the select image button.
 * @param {string}   props.replaceImageButtonId The ID for the replace image button.
 * @param {string}   props.removeImageButtonId  The ID for the remove image button.
 *
 * @returns {JSX.Element} The ImageSelect component with a title, optional warnings and an image selection button.
 */
const ImageSelect = ( {
	title,
	warnings,
	imageSelected,
	onClick,
	onRemoveImageClick,
	imageUrl,
	isPremium,
	onMouseEnter,
	onMouseLeave,
	imageUrlInputId,
	selectImageButtonId,
	replaceImageButtonId,
	removeImageButtonId,
} ) => {
	const imageSelectButtonsProps = {
		imageSelected,
		onClick,
		onRemoveImageClick,
		selectImageButtonId,
		replaceImageButtonId,
		removeImageButtonId,
	};

	return <DivWithMargin
		onMouseEnter={ onMouseEnter }
		onMouseLeave={ onMouseLeave }
	>
		<SimulatedLabel>
			{ title }
		</SimulatedLabel>
		{
			warnings.length > 0 && imageSelected &&
			warnings.map( ( warning, index ) => <Alert key={ `warning${ index }` } type="warning">
				{ warning }
			</Alert> )
		}
		{
			isPremium ? <ImageSelectButtons { ...imageSelectButtonsProps } />
				: <ColumnWrapper>
					<UrlInputField
						id={ imageUrlInputId }
						value={ imageUrl }
						disabled={ "disabled" }
					/>
					<RowWrapper>
						<ImageSelectButtons { ...imageSelectButtonsProps } />
					</RowWrapper>
				</ColumnWrapper>
		}
	</DivWithMargin>;
};

ImageSelect.propTypes = {
	title: PropTypes.string.isRequired,
	imageSelected: PropTypes.bool.isRequired,
	isPremium: PropTypes.bool.isRequired,
	warnings: PropTypes.arrayOf( PropTypes.string ),
	imageUrl: PropTypes.string,
	onMouseEnter: PropTypes.func,
	onMouseLeave: PropTypes.func,
	imageUrlInputId: PropTypes.string,
	onClick: PropTypes.func,
	onRemoveImageClick: PropTypes.func,
	selectImageButtonId: PropTypes.string,
	replaceImageButtonId: PropTypes.string,
	removeImageButtonId: PropTypes.string,
};

ImageSelect.defaultProps = {
	warnings: [],
	imageUrl: "",
	onMouseEnter: () => {},
	onMouseLeave: () => {},
	onClick: () => {},
	onRemoveImageClick: () => {},
	imageUrlInputId: "",
	selectImageButtonId: "",
	replaceImageButtonId: "",
	removeImageButtonId: "",
};

export default ImageSelect;
