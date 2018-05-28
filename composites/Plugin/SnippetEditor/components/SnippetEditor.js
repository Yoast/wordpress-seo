// External dependencies.
import React from "react";
import PropTypes from "prop-types";
import { __ } from "@wordpress/i18n";

// Internal dependencies.
import SnippetPreview from "../../SnippetPreview/components/SnippetPreview";
import {
	DEFAULT_MODE,
	MODES,
} from "../../SnippetPreview/constants";
import SnippetEditorFields from "./SnippetEditorFields";
import { Button } from "../../Shared/components/Button";
import SvgIcon from "../../Shared/components/SvgIcon";
import { lengthProgressShape, replacementVariablesShape } from "../constants";
import ModeSwitcher from "./ModeSwitcher";
import colors from "../../../../style-guide/colors";
import decodeHTML from "../../../OnboardingWizard/helpers/htmlDecoder";

const SnippetEditorButton = Button.extend`
	height: 33px;
	border: 1px solid #dbdbdb;
	box-shadow: none;
	font-family: Arial, Roboto-Regular, HelveticaNeue, sans-serif;
`;

const EditSnippetButton = SnippetEditorButton.extend`
	margin: 10px 0 0 4px;
	fill: ${ colors.$color_grey_dark };
	padding-left: 8px;
	
	& svg {
		margin-right: 7px;
	}
`;

const CloseEditorButton = SnippetEditorButton.extend`
	margin-left: 20px;
`;

const MetaDescriptionPlaceholder = "Modify your meta description by editing it right here";

class SnippetEditor extends React.Component {
	/**
	 * Constructs the snippet editor.
	 *
	 * @param {Object} props                             The props for the snippet
	 *                                                   editor.
	 * @param {Object} props.replacementVariables        The replacement variables
	 *                                                   for this editor.
	 * @param {Object} props.data                        The initial editor data.
	 * @param {string} props.keyword                     The focus keyword.
	 * @param {string} props.data.title                  The initial title.
	 * @param {string} props.data.slug                   The initial slug.
	 * @param {string} props.data.description            The initial description.
	 * @param {string} props.baseUrl                     The base URL to use for the
	 *                                                   preview.
	 * @param {string} props.mode                        The mode the editor should
	 *                                                   be in.
	 * @param {Function} props.onChange                  Called when the data
	 *                                                   changes.
	 * @param {Object} props.titleLengthProgress       The values for the title
	 *                                                   length assessment.
	 * @param {Object} props.descriptionLengthProgress The values for the
	 *                                                   description length
	 *                                                   assessment.
	 * @param {Function} props.mapDataToPreview          Function to map the editor
	 *                                                   data to data for the preview.
	 * @param {string} props.locale                      The locale of the page.
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
		this.handleChange = this.handleChange.bind( this );
		this.onClick = this.onClick.bind( this );
		this.onMouseOver = this.onMouseOver.bind( this );
		this.onMouseLeave = this.onMouseLeave.bind( this );
		this.open = this.open.bind( this );
		this.close = this.close.bind( this );
		this.setEditButtonRef = this.setEditButtonRef.bind( this );
		this.decodeSeparatorVariable = this.decodeSeparatorVariable.bind( this );
	}

	/**
	 * Handles the onChange event.
	 *
	 * First updates the description progress and title progress.
	 * Then calls the onChange function that is passed through the props.
	 *
	 * @param {string} type The type of change.
	 * @param {string} content The content of the changed field.
	 *
	 * @returns {void}
	 */
	handleChange( type, content ) {
		this.props.onChange( type, content );
	}

	/**
	 * Renders the editor fields if the editor is open.
	 *
	 * @returns {ReactElement} The rendered react element.
	 */
	renderEditor() {
		const {
			data,
			titleLengthProgress,
			descriptionLengthProgress,
		} = this.props;
		const replacementVariables = this.decodeSeparatorVariable( this.props.replacementVariables );
		const { activeField, hoveredField, isOpen } = this.state;

		if ( ! isOpen ) {
			return null;
		}

		return (
			<React.Fragment>
				<SnippetEditorFields
					data={ data }
					activeField={ activeField }
					hoveredField={ hoveredField }
					onChange={ this.handleChange }
					onFocus={ this.setFieldFocus }
					replacementVariables={ replacementVariables }
					titleLengthProgress={ titleLengthProgress }
					descriptionLengthProgress={ descriptionLengthProgress }
					descriptionEditorFieldPlaceholder={ MetaDescriptionPlaceholder }
				/>
				<CloseEditorButton onClick={ this.close }>
					{ __( "Close snippet editor", "yoast-components" ) }
				</CloseEditorButton>
			</React.Fragment>
		);
	}

	/**
	 * Focuses the preview on the given field.
	 *SnippetEditorFields
	 * @param {String} field the name of the field to focuSnippetEditorFieldss
	 *
	 * @returns {void}
	 */
	setFieldFocus( field ) {
		field = this.mapFieldToEditor( field );

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
			.then( this.setFieldFocus.bind( this, field ) );
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
			hoveredField: this.mapFieldToEditor( field ),
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
		field = this.mapFieldToEditor( field );

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
		}, () => {
			this._editButton.focus();
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
	 * Decodes the separator replacement variable to a displayable symbol.
	 *
	 * @param {array} replacementVariables   The array of replacement variable objects.
	 *
	 * @returns {array} replacementVariables The array of replacement variable objects with the updated separator variable.
	 */
	decodeSeparatorVariable( replacementVariables ) {
		let sepIndex = replacementVariables.findIndex( x => x.name === "sep" );
		if( sepIndex !== -1 ) {
			replacementVariables[ sepIndex ].value = decodeHTML( replacementVariables[ sepIndex ].value );
		}
		return replacementVariables;
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
	 * Maps an editor field to a preview field.
	 *
	 * @param {?string} field The field to map.
	 * @returns {?string} The mapped field.
	 */
	mapFieldToPreview( field ) {
		if ( field === "slug" ) {
			field = "url";
		}

		return field;
	}

	/**
	 * Maps a preview field to an editor field.
	 *
	 * @param {?string} field The field to map.
	 * @returns {?string} The mapped field.
	 */
	mapFieldToEditor( field ) {
		if ( field === "url" ) {
			field = "slug";
		}

		return field;
	}

	/**
	 * Sets a reference to the edit button so we can move focus to it.
	 *
	 * @param {Object} ref The edit button element.
	 *
	 * @returns {void}
	 */
	setEditButtonRef( ref ) {
		this._editButton = ref;
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
			descriptionPlaceholder,
			mode,
			date,
			locale,
			keyword,
		} = this.props;

		const {
			activeField,
			hoveredField,
			isOpen,
		} = this.state;

		const mappedData = this.mapDataToPreview( data );

		/*
		 * The SnippetPreview is not a build-in HTML element so this check is not
		 * relevant.
		 */
		/* eslint-disable jsx-a11y/mouse-events-have-key-events */
		return (
			<div>
				<SnippetPreview
					keyword={ keyword }
					mode={ mode }
					date={ date }
					activeField={ this.mapFieldToPreview( activeField ) }
					hoveredField={ this.mapFieldToPreview( hoveredField ) }
					onMouseOver={ this.onMouseOver }
					onMouseLeave={ this.onMouseLeave }
					onClick={ this.onClick }
					locale={ locale }
					descriptionPlaceholder={ descriptionPlaceholder }
					{ ...mappedData }
				/>

				<ModeSwitcher onChange={ ( mode ) => onChange( "mode", mode ) } active={ mode } />

				<EditSnippetButton
					onClick={ isOpen ? this.close : this.open }
					aria-expanded={ isOpen }
					innerRef={ this.setEditButtonRef }
				>
					<SvgIcon icon="edit" />
					{ __( "Edit snippet", "yoast-components" ) }
				</EditSnippetButton>

				{ this.renderEditor() }
			</div>
		);
		/* eslint-enable jsx-a11y/mouse-events-have-key-events */
	}
}

SnippetEditor.propTypes = {
	replacementVariables: replacementVariablesShape,
	data: PropTypes.shape( {
		title: PropTypes.string.isRequired,
		slug: PropTypes.string.isRequired,
		description: PropTypes.string.isRequired,
	} ).isRequired,
	descriptionPlaceholder: PropTypes.string,
	descriptionEditorFieldPlaceholder: PropTypes.string,
	baseUrl: PropTypes.string.isRequired,
	mode: PropTypes.oneOf( MODES ),
	date: PropTypes.string,
	onChange: PropTypes.func.isRequired,
	titleLengthProgress: lengthProgressShape,
	descriptionLengthProgress: lengthProgressShape,
	mapDataToPreview: PropTypes.func,
	keyword: PropTypes.string,
	locale: PropTypes.string,
};

SnippetEditor.defaultProps = {
	mode: DEFAULT_MODE,
	date: "",
	replacementVariables: [],
	titleLengthProgress: {
		max: 600,
		actual: 0,
		score: 0,
	},
	descriptionLengthProgress: {
		max: 156,
		actual: 0,
		score: 0,
	},
	mapDataToPreview: null,
	locale: "en",
};

export default SnippetEditor;
