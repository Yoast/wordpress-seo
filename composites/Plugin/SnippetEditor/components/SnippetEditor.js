// External dependencies.
import React from "react";
import PropTypes from "prop-types";
import { __ } from "@wordpress/i18n";
import MetaDescriptionLengthAssessment from "yoastseo/js/assessments/seo/metaDescriptionLengthAssessment";
import PageTitleWidthAssesment from "yoastseo/js/assessments/seo/pageTitleWidthAssessment";
import { measureTextWidth } from "yoastseo/js/helpers/createMeasurementElement";
import stripSpaces from "yoastseo/js/stringProcessing/stripSpaces";

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

/**
 * Gets the title progress.
 *
 * @param {string} title The title.
 *
 * @returns {Object} The title progress.
 */
function getTitleProgress( title ) {
	const titleWidth = measureTextWidth( title );
	const pageTitleWidthAssessment = new PageTitleWidthAssesment();
	const score = pageTitleWidthAssessment.calculateScore( titleWidth );
	const maximumLength = pageTitleWidthAssessment.getMaximumLength();

	return {
		max: maximumLength,
		actual: titleWidth,
		score: score,
	};
}

/**
 * Gets the description progress.
 *
 * @param {string} description The description.
 *
 * @returns {Object} The description progress.
 */
function getDescriptionProgress( description ) {
	const descriptionLength = description.length;
	const metaDescriptionLengthAssessment = new MetaDescriptionLengthAssessment();
	const score = metaDescriptionLengthAssessment.calculateScore( descriptionLength );
	const maximumLength = metaDescriptionLengthAssessment.getMaximumLength();

	return {
		max: maximumLength,
		actual: descriptionLength,
		score: score,
	};
}

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

		const mappedData = this.mapDataToPreview( props.data );

		this.state = {
			isOpen: false,
			activeField: null,
			hoveredField: null,
			mappedData: mappedData,
			titleLengthProgress: getTitleProgress( mappedData.title ),
			descriptionLengthProgress: getDescriptionProgress( mappedData.description ),
		};

		this.setFieldFocus = this.setFieldFocus.bind( this );
		this.unsetFieldFocus = this.unsetFieldFocus.bind( this );
		this.handleChange = this.handleChange.bind( this );
		this.onMouseUp = this.onMouseUp.bind( this );
		this.onMouseEnter = this.onMouseEnter.bind( this );
		this.onMouseLeave = this.onMouseLeave.bind( this );
		this.open = this.open.bind( this );
		this.close = this.close.bind( this );
		this.setEditButtonRef = this.setEditButtonRef.bind( this );
	}

	/**
	 * Returns whether the old and the new data are the same.
	 *
	 * @param {Object} oldData The old data.
	 * @param {Object} newData The new data.
	 * @returns {boolean} True if any of the data points has changed.
	 */
	shallowCompareData( oldData, newData ) {
		let isDirty = false;
		if (
			oldData.description !== newData.description ||
			oldData.slug !== newData.slug ||
			oldData.title !== newData.title
		) {
			isDirty = true;
		}
		return isDirty;
	}

	/**
	 * Updates the state when the component receives new props.
	 *
	 * @param {Object} nextProps The new props.
	 * @returns {void}
	 */
	componentWillReceiveProps( nextProps ) {
		// Only set a new state when the data is dirty.
		if ( this.shallowCompareData( this.props.data, nextProps.data ) ) {
			const data = this.mapDataToPreview( nextProps.data );
			this.setState(
				{
					titleLengthProgress: getTitleProgress( data.title ),
					descriptionLengthProgress: getDescriptionProgress( data.description ),
				}
			);
		}
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
		let descriptionProgress, titleProgress;
		switch( type ) {
			case "description":
				descriptionProgress = getDescriptionProgress( content );
				this.setState( { descriptionLengthProgress: descriptionProgress } );
				break;
			case "title":
				titleProgress = getTitleProgress( content );
				this.setState( { titleLengthProgress: titleProgress } );
				break;
		}
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
			replacementVariables,
		} = this.props;
		const { activeField, hoveredField, isOpen, titleLengthProgress, descriptionLengthProgress } = this.state;

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
					onBlur={ this.unsetFieldFocus }
					replacementVariables={ replacementVariables }
					titleLengthProgress={ titleLengthProgress }
					descriptionLengthProgress={ descriptionLengthProgress }
				/>
				<CloseEditorButton onClick={ this.close }>
					{ __( "Close snippet editor", "yoast-components" ) }
				</CloseEditorButton>
			</React.Fragment>
		);
	}

	/**
	 * Sets the active field.
	 *
	 * @param {String} field The active field.
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
	 * Unsets the active field.
	 *
	 * @returns {void}
	 */
	unsetFieldFocus() {
		this.setState( {
			activeField: null,
		} );
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
	 * Maps the data from to be suitable for the preview.
	 *
	 * @param {Object} originalData         The data from the form.
	 * @param {string} generatedDescription The description that should be displayed, or an empty string.
	 *
	 * @returns {Object} The data for the preview.
	 */
	mapDataToPreview( originalData, generatedDescription ) {
		const { baseUrl, mapDataToPreview } = this.props;

		let description = this.processReplacementVariables( originalData.description );

		// Strip multiple spaces and spaces at the beginning and end.
		description = stripSpaces( description );

		const mappedData = {
			title: this.processReplacementVariables( originalData.title ),
			url: baseUrl.replace( "https://", "" ) + originalData.slug,
			description: description || generatedDescription,
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
			generatedDescription,
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

		const mappedData = this.mapDataToPreview( data, generatedDescription );

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
					onMouseEnter={ this.onMouseEnter }
					onMouseLeave={ this.onMouseLeave }
					onMouseUp={ this.onMouseUp }
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
	generatedDescription: PropTypes.string,
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
	generatedDescription: "",
	locale: "en",
};

export default SnippetEditor;
