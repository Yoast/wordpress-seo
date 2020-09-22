import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { Alert, SimulatedLabel, InputField } from "@yoast/components";
import { StandardButton } from "@yoast/replacement-variable-editor";
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
 * Renders the standard and the undo button.
 *
 * @param {function} onClick            Callback called when the "Select image" or "Replace image" button is clicked.
 * @param {bool}     imageSelected      Is there already an image slected.
 * @param {function} onRemoveImageClick Callback called when the "Remove image" button is clicked.
 * @param {string}   socialMediumName   The name of the Social Medium for which the buttons are rendered.
 * @param {string}   location           The name of the location where this component is rendered.
 *
 * @returns {JSX.Element} The buttons to render for the ImageSelect.
 */
const renderButtons = ( onClick, imageSelected, onRemoveImageClick, socialMediumName, location ) => {
	const buttonId = imageSelected
		? `${ socialMediumName }-replace-button-${ location }`
		: `${ socialMediumName }-select-button-${ location }`;

	return (
		<Fragment>
			<StandardButton
				onClick={ onClick }
				id={ buttonId }
			>
				{
					imageSelected
						? __( "Replace image", "yoast-components" )
						: __( "Select image", "yoast-components" )
				}

			</StandardButton>
			{
				imageSelected && <UndoButton
					onClick={ onRemoveImageClick }
					id={ `${ socialMediumName }-remove-button-${ location }`  }
				>
					{ __( "Remove image", "yoast-components" ) }
				</UndoButton>
			}
		</Fragment>
	);
};

/**
 * Component for displaying an image selection button with a title.
 *
 * Displays an warning message when the selected image cannot be used.
 *
 * @param {object}   props                    The properties passed to this component.
 * @param {string}   props.title              The title that is displayed above the selection button.
 * @param {string[]} props.warnings           An array of warnings that detail why the image cannot be used.
 * @param {function} props.onClick            Callback called when the "Select image" or "Replace image" button is clicked.
 * @param {function} props.onRemoveImageClick Callback called when the "Remove image" button is clicked.
 * @param {string}   props.imageUrl           The Url adress of the image
 * @param {bool}     props.isPremium          States if premium is installed.
 * @param {string}   props.socialMediumName   The name of the social medium for which this component is rendered.
 * @param {string}   props.location           Optional. The name of the location where this component is rendered.
 *
 * @returns {JSX.Element} The ImageSelect component with a title, optional warnings and an image selection button.
 */
const ImageSelect = ( {
	title,
	warnings,
	onClick,
	imageSelected,
	onRemoveImageClick,
	imageUrl,
	isPremium,
	onMouseEnter,
	onMouseLeave,
	socialMediumName,
	location,
} ) =>
	<DivWithMargin
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
			isPremium ? renderButtons( onClick, imageSelected, onRemoveImageClick, socialMediumName, location )
				: <ColumnWrapper>
					<UrlInputField disabled={ "disabled" } value={ imageUrl } id={ `${ socialMediumName }-url-input-${ location }` } />
					<RowWrapper>
						{ renderButtons( onClick, imageSelected, onRemoveImageClick, socialMediumName, location ) }
					</RowWrapper>
				</ColumnWrapper>
		}
	</DivWithMargin>
;

ImageSelect.propTypes = {
	title: PropTypes.string.isRequired,
	imageSelected: PropTypes.bool.isRequired,
	isPremium: PropTypes.bool.isRequired,
	onClick: PropTypes.func,
	onRemoveImageClick: PropTypes.func,
	warnings: PropTypes.arrayOf( PropTypes.string ),
	imageUrl: PropTypes.string,
	onMouseEnter: PropTypes.func,
	onMouseLeave: PropTypes.func,
	socialMediumName: PropTypes.oneOf( [ "twitter", "facebook" ] ).isRequired,
	location: PropTypes.string,
};

ImageSelect.defaultProps = {
	onRemoveImageClick: () => {},
	onClick: () => {},
	warnings: [],
	imageUrl: "",
	onMouseEnter: () => {},
	onMouseLeave: () => {},
	location: "",
};

export default ImageSelect;
