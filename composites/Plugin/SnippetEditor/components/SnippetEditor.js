/* External dependencies */
import React from "react";
import styled from "styled-components";
import { FormattedMessage } from "react-intl";
import PropTypes from "prop-types";

/* Internal dependencies */
import SnippetPreview, { MODE_DESKTOP, MODE_MOBILE, MODES } from "../../SnippetPreview/components/SnippetPreview";
import SnippetEditorFields from "./SnippetEditorFields";
import { Button } from "../../Shared/components/Button";
import SvgIcon from "../../Shared/components/SvgIcon";
import ScreenReaderText from "../../../../a11y/ScreenReaderText";
import colors from "../../../../style-guide/colors.json";
import { lengthAssessmentShape, replacementVariablesShape } from "../constants";

const SwitcherButton = Button.extend`
	border: none;
	border-bottom: 4px solid transparent;
	
	width: 31px;
	height: 31px;
	
	border-color: ${ ( props ) => props.isActive ? colors.$color_snippet_active : "transparent" };
	color: ${ colors.$color_snippet_active };
	
	transition: 0.15s color ease-in-out,0.15s background-color ease-in-out,0.15s border-color ease-in-out;
	transition-property: border-color;
	
	&:hover, &:focus {
		border: none;
		border-bottom: 4px solid transparent;
		border-color: ${ colors.$color_snippet_focus };
		color: ${ colors.$color_snippet_focus };
	}
`;

const MobileButton = SwitcherButton.extend`
	border-radius: 3px 0 0 3px;
`;

const DesktopButton = SwitcherButton.extend`
	border-radius: 0 3px 3px 0;
`;

const ModeSwitcher = styled.div`
	display: inline-block;
	margin-top: 10px;
	margin-left: 20px;
	border: 1px solid #dbdbdb;
	border-radius: 4px;
	background-color: #f7f7f7;
	vertical-align: top;
`;

const SnippetEditorButton = Button.extend`
	border: 1px solid #dbdbdb;
	box-shadow: none;
`;

const EditSnippetButton = SnippetEditorButton.extend`
	margin: 10px 0 0 9px;
	
	& svg {
		margin-right: 7px;
	}
`;

const CloseEditorButton = SnippetEditorButton.extend`
	margin-left: 20px;
`;

class SnippetEditor extends React.Component {
	/**
	 * Constructs the snippet editor.
	 *
	 * @param {Object} props The props for the snippet editor.
	 *
	 * @returns {void}
	 */
	constructor( props ) {
		super( props );

		this.state = {
			isOpen: false,
			activeField: null,
			hoveredField: null,
		};

		this.setFieldFocus = this.setFieldFocus.bind( this );
		this.onClick = this.onClick.bind( this );
		this.onMouseOver = this.onMouseOver.bind( this );
		this.onMouseLeave = this.onMouseLeave.bind( this );
		this.open = this.open.bind( this );
		this.close = this.close.bind( this );
	}

	/**
	 * Renders the editor fields if the editor is open.
	 *
	 * @returns {ReactElement} The rendered react element.
	 */
	renderEditor() {
		const {
			data,
			onChange,
			titleLengthAssessment,
			descriptionLengthAssessment,
			replacementVariables,
		} = this.props;
		const { activeField, hoveredField, isOpen } = this.state;

		if ( ! isOpen ) {
			return null;
		}

		return <React.Fragment>
			<SnippetEditorFields
				data={ data }
				activeField={ activeField === "url" ? "slug" : activeField }
				hoveredField={ hoveredField === "url" ? "slug" : hoveredField }
				onChange={ onChange }
				onFocus={ this.setFieldFocus }
				replacementVariables={ replacementVariables }
				titleLengthAssessment={ titleLengthAssessment }
				descriptionLengthAssessment={ descriptionLengthAssessment }
			/>
			<CloseEditorButton onClick={ this.close }>
				<FormattedMessage
					id="snippet-editor.close-editor"
					defaultMessage="Close snippet editor"
				/>
			</CloseEditorButton>
		</React.Fragment>;
	}

	/**
	 * Focuses the preview on the given field.
	 *
	 * @param {String} field the name of the field to focus
	 *
	 * @returns {void}
	 */
	setFieldFocus( field ) {
		if ( field === "url" ) {
			field = "slug";
		}

		this.setState( {
			activeField: field,
		} );
	}

	/**
	 * Activates a certain field in the editor.
	 *
	 * @param {string} field The field to activate.
	 *
	 * @returns {void}
	 */
	activateField( field ) {
		this.setState( {
			activeField: field,
		} );
	}

	/**
	 * Handles click event on a certain field in the snippet preview.
	 *
	 * @param {string} field The field that was clicked on.
	 *
	 * @returns {void}
	 */
	onClick( field ) {
		/*
		 * We have to wait for the form to be mounted before we can actually focus
		 * the correct input field.
		 */
		this.open()
			.then( this.activateField.bind( this, field ) );
	}

	/**
	 * Sets the hovered field on mouse over.
	 *
	 * @param {string} field The field that was moused over.
	 *
	 * @returns {void}
	 */
	onMouseOver( field ) {
		this.setState( {
			hoveredField: field,
		} );
	}

	/**
	 * Sets the hovered field on mouse leave.
	 *
	 * @param {string} field The field that was the mouse left.
	 *
	 * @returns {void}
	 */
	onMouseLeave( field ) {
		if ( field && this.state.hoveredField !== field ) {
			return;
		}

		this.setState( {
			hoveredField: null,
		} );
	}

	/**
	 * Opens the snippet editor form.
	 *
	 * @returns {Promise} Resolves when the form is opened and rendered.
	 */
	open() {
		return new Promise( ( resolve ) => {
			this.setState( {
				isOpen: true,
			}, resolve );
		} );
	}

	/**
	 * Closes the snippet editor form.
	 *
	 * @returns {void}
	 */
	close() {
		this.setState( {
			isOpen: false,
			activeField: null,
		} );
	}

	/**
	 * Processes replacement variables in the content.
	 *
	 * @param {string} content The content to process.
	 *
	 * @returns {string} The processed content.
	 */
	processReplacementVariables( content ) {
		const { replacementVariables } = this.props;

		for ( const { name, value } of replacementVariables ) {
			content = content.replace( new RegExp( "%%" + name + "%%", "g" ), value );
		}

		return content;
	}

	/**
	 * Maps the data from to be suitable for the preview.
	 *
	 * @param {Object} originalData The data from the form.
	 *
	 * @returns {Object} The data for the preview.
	 */
	mapDataToPreview( originalData ) {
		const { baseUrl, mapDataToPreview } = this.props;

		const mappedData = {
			title: this.processReplacementVariables( originalData.title ),
			url: baseUrl.replace( "https://", "" ) + originalData.slug,
			description: this.processReplacementVariables( originalData.description ),
		};

		if ( mapDataToPreview ) {
			return mapDataToPreview( mappedData, originalData );
		}

		return mappedData;
	}

	/**
	 * Renders the snippet editor.
	 *
	 * @returns {ReactElement} The snippet editor element.
	 */
	render() {
		const {
			onChange,
			data,
			mode,
		} = this.props;

		const {
			activeField,
			hoveredField,
			isOpen,
		} = this.state;

		const mappedData = this.mapDataToPreview( data );

		const props = {
			mode: this.props.mode,
			activeField,
			hoveredField,
			onMouseOver: this.onMouseOver,
			onMouseLeave: this.onMouseLeave,
			onClick: this.onClick,
			...mappedData,
		};

		return (
			<div>
				<SnippetPreview { ...props } />

				<ModeSwitcher>
					<MobileButton onClick={ () => onChange( "mode", MODE_MOBILE ) } isActive={ mode === MODE_MOBILE }>
						<SvgIcon icon="mobile" size="22px" color="currentColor" />
						<ScreenReaderText>
							<FormattedMessage
								id="snippetEditor.desktopPreview"
								defaultMessage="Mobile preview"
							/>
						</ScreenReaderText>
					</MobileButton>

					<DesktopButton onClick={ () => onChange( "mode", MODE_DESKTOP ) } isActive={ mode === MODE_DESKTOP }>
						<SvgIcon icon="desktop" size="18px" color="currentColor" />
						<ScreenReaderText>
							<FormattedMessage
								id="snippetEditor.desktopPreview"
								defaultMessage="Desktop preview"
							/>
						</ScreenReaderText>
					</DesktopButton>
				</ModeSwitcher>

				<EditSnippetButton onClick={ isOpen ? this.close : this.open }>
					<SvgIcon icon="edit" />
					<FormattedMessage
						id="snippetEditor.editSnippet"
						defaultMessage="Edit snippet"
					/>
				</EditSnippetButton>

				{ this.renderEditor() }
			</div>
		);
	}
}

SnippetEditor.propTypes = {
	replacementVariables: replacementVariablesShape,
	data: PropTypes.shape( {
		title: PropTypes.string.isRequired,
		slug: PropTypes.string.isRequired,
		description: PropTypes.string.isRequired,
	} ),
	baseUrl: PropTypes.string.isRequired,
	mode: PropTypes.oneOf( MODES ),
	onChange: PropTypes.func,
	titleLengthAssessment: lengthAssessmentShape,
	descriptionLengthAssessment: lengthAssessmentShape,
	mapDataToPreview: PropTypes.func,
};

SnippetEditor.defaultProps = {
	onChange: () => {},
	isEditorOpen: false,
	mode: MODE_MOBILE,
	titleLengthAssessment: {
		max: 600,
		actual: 0,
		score: 0,
	},
	descriptionLengthAssessment: {
		max: 320,
		actual: 0,
		score: 0,
	},
	mapDataToPreview: null,
};

export default SnippetEditor;
