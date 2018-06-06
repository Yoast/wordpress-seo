// External dependencies.
import React from "react";
import PropTypes from "prop-types";

// Internal dependencies.
import SnippetPreview from "../../SnippetPreview/components/SnippetPreview";
import {
	DEFAULT_MODE,
	MODES,
} from "../../SnippetPreview/constants";
import SettingsSnippetEditorFields from "./SettingsSnippetEditorFields";
import { replacementVariablesShape } from "../constants";
import ModeSwitcher from "./ModeSwitcher";

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
			activeField: null,
			hoveredField: null,
		};

		this.setFieldFocus = this.setFieldFocus.bind( this );
		this.handleChange = this.handleChange.bind( this );
		this.onClick = this.onClick.bind( this );
		this.onMouseUp = this.onMouseUp.bind( this );
		this.onMouseEnter = this.onMouseEnter.bind( this );
		this.onMouseLeave = this.onMouseLeave.bind( this );
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
	 * Focuses the preview on the given field.
	 *
	 * @param {String} field the name of the field to focusSnippetEditorFields
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
		this.setFieldFocus( field );
	}

	/**
	 * Handles mouse up event on a certain field in the snippet preview.
	 *
	 * We're using onMouseUp instead of onClick because the SnippetPreview re-renders
	 * when onBlur occurs. Click events fire when both a mousedown *and* a mouseup
	 * events occur. When onBlur occurs, new onClick functions would be passed via
	 * props and bounded, so the SnippetPreview would "see" just a mouseup event
	 * and the click event wouldn't fire at all.
	 *
	 * @param {string} field The field that was moused up.
	 *
	 * @returns {void}
	 */
	onMouseUp( field ) {
		if ( this.state.isOpen ) {
			this.setFieldFocus( field );
			return;
		}
		/*
		 * We have to wait for the form to be mounted before we can actually focus
		 * the correct input field.
		 */
		this.open()
		.then( this.setFieldFocus.bind( this, field ) );
	}

	/**
	 * Sets the hovered field on mouse enter.
	 *
	 * @param {string} field The field that was hovered.
	 *
	 * @returns {void}
	 */
	onMouseEnter( field ) {
		this.setState( {
			hoveredField: this.mapFieldToEditor( field ),
		} );
	}

	/**
	 * Unsets the hovered field on mouse leave.
	 *
	 * @returns {void}
	 */
	onMouseLeave() {
		this.setState( {
			hoveredField: null,
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
	 * Maps a preview field to an editor field.
	 *
	 * @param {?string} field The field to map.
	 * @returns {?string} The mapped field.
	 */
	mapFieldToEditor( field ) {
		if ( field === "url" ) {
			return null;
		}

		return field;
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
	 * Renders the editor fields if the editor is open.
	 *
	 * @returns {ReactElement} The rendered react element.
	 */
	renderEditor() {
		const {
			data,
			replacementVariables,
		} = this.props;

		const { activeField, hoveredField } = this.state;

		return (
			<SettingsSnippetEditorFields
				data={ data }
				activeField={ activeField }
				hoveredField={ hoveredField }
				onChange={ this.handleChange }
				onFocus={ this.setFieldFocus }
				replacementVariables={ replacementVariables } />
		);
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
		} = this.props;

		const {
			activeField,
			hoveredField,
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
					mode={ mode }
					date={ date }
					activeField={ activeField }
					hoveredField={ hoveredField }
					onMouseEnter={ this.onMouseEnter }
					onMouseLeave={ this.onMouseLeave }
					onMouseUp={ this.onMouseUp }
					onClick={ this.onClick }
					descriptionPlaceholder={ descriptionPlaceholder }
					{ ...mappedData }
				/>

				<ModeSwitcher onChange={ ( mode ) => onChange( "mode", mode ) } active={ mode } />

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
		description: PropTypes.string.isRequired,
	} ).isRequired,
	descriptionPlaceholder: PropTypes.string,
	baseUrl: PropTypes.string.isRequired,
	mode: PropTypes.oneOf( MODES ),
	date: PropTypes.string,
	onChange: PropTypes.func.isRequired,
	mapDataToPreview: PropTypes.func,
};

SnippetEditor.defaultProps = {
	mode: DEFAULT_MODE,
	date: "",
	replacementVariables: [],
	mapDataToPreview: null,
	locale: "en",
};

export default SnippetEditor;
