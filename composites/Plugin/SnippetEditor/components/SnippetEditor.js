// External dependencies.
import React from "react";
import PropTypes from "prop-types";
import { __ } from "@wordpress/i18n";

import MetaDescriptionLengthAssessment from "yoastseo/src/assessments/seo/metaDescriptionLengthAssessment";
import PageTitleWidthAssesment from "yoastseo/src/assessments/seo/pageTitleWidthAssessment";

import { helpers } from "yoastseo";
const { measureTextWidth } = helpers;

import stripSpaces from "yoastseo/src/stringProcessing/stripSpaces";
import noop from "lodash/noop";

// Internal dependencies.
import SnippetPreview from "../../SnippetPreview/components/SnippetPreview";
import {
	DEFAULT_MODE,
	MODES,
} from "../../SnippetPreview/constants";
import SnippetEditorFields from "./SnippetEditorFields";
import { Button } from "../../Shared/components/Button";
import SvgIcon from "../../Shared/components/SvgIcon";
import {
	lengthProgressShape,
	replacementVariablesShape,
	recommendedReplacementVariablesShape,
} from "../constants";
import ModeSwitcher from "./ModeSwitcher";
import colors from "../../../../style-guide/colors";
import ErrorBoundary from "../../../basic/ErrorBoundary";
import { getRtlStyle } from "../../../../utils/helpers/styled-components";

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
		${ getRtlStyle( "margin-right", "margin-left" ) }: 7px;
	}
`;

const CloseEditorButton = SnippetEditorButton.extend`
	margin-top: 24px;
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
 * @param {string} date        The meta description date
 *
 * @returns {Object} The description progress.
 */
function getDescriptionProgress( description, date ) {
	let descriptionLength = description.length;
	/* If the meta description is preceded by a date, two spaces and a hyphen (" - ") are added as well. Therefore,
	three needs to be added to the total length. */
	if ( date !== "" && descriptionLength > 0 ) {
		descriptionLength += date.length + 3;
	}
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
	 * @param {Object}   props                                   The props for the snippet editor.
	 * @param {Object[]} props.replacementVariables              The replacement variables for this editor.
	 * @param {Object[]} props.recommendedReplacementVariables   The recommended replacement variables for this editor.
	 * @param {Object}   props.data                              The initial editor data.
	 * @param {string}   props.keyword                           The focus keyword.
	 * @param {string}   props.data.title                        The initial title.
	 * @param {string}   props.data.slug                         The initial slug.
	 * @param {string}   props.data.description                  The initial description.
	 * @param {string}   props.baseUrl                           The base URL to use for the preview.
	 * @param {string}   props.mode                              The mode the editor should be in.
	 * @param {Function} props.onChange                          Called when the data changes.
	 * @param {Object}   props.titleLengthProgress               The values for the title length assessment.
	 * @param {Object}   props.descriptionLengthProgress         The values for the description length assessment.
	 * @param {Function} props.mapEditorDataToPreview            Function to map the editor data to data for the preview.
	 * @param {string}   props.locale                            The locale of the page.
	 * @param {bool}     props.hasPaperStyle                     Whether or not it has paper style.
	 * @param {string}   props.descriptionEditorFieldPlaceholder The placeholder value for the description field.
	 * @param {bool}     props.showCloseButton                   Whether or not users have the option to open and close
	 *                                                           the editor.
	 * @returns {void}
	 */
	constructor( props ) {
		super( props );

		const measurementData = this.mapDataToMeasurements( props.data );
		const previewData = this.mapDataToPreview( measurementData );

		this.state = {
			// Is opened by default when show close button is hidden.
			isOpen: ! props.showCloseButton,
			activeField: null,
			hoveredField: null,
			mappedData: previewData,
			titleLengthProgress: getTitleProgress( measurementData.title ),
			descriptionLengthProgress: getDescriptionProgress( measurementData.description, this.props.date ),
		};

		this.setFieldFocus = this.setFieldFocus.bind( this );
		this.unsetFieldFocus = this.unsetFieldFocus.bind( this );
		this.onMouseUp = this.onMouseUp.bind( this );
		this.onMouseEnter = this.onMouseEnter.bind( this );
		this.onMouseLeave = this.onMouseLeave.bind( this );
		this.open = this.open.bind( this );
		this.close = this.close.bind( this );
		this.setEditButtonRef = this.setEditButtonRef.bind( this );
		this.handleChange = this.handleChange.bind( this );
	}

	/**
	 * Returns whether the old and the new data or replacement variables are different.
	 *
	 * @param {Object} prevProps The old props.
	 * @param {Object} nextProps The new props.
	 * @returns {boolean} True if any of the data points has changed.
	 */
	shallowCompareData( prevProps, nextProps ) {
		let isDirty = false;
		if (
			prevProps.data.description !== nextProps.data.description ||
			prevProps.data.slug !== nextProps.data.slug ||
			prevProps.data.title !== nextProps.data.title
		) {
			isDirty = true;
		}

		/* If any of the replacement variables have changed, the preview progress needs to be reanalysed.
		   The replacement variables are converted from an array of objects to a string for easier and more consistent
		   comparison.
		 */
		if ( JSON.stringify( prevProps.replacementVariables ) !== JSON.stringify( nextProps.replacementVariables ) ) {
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
		if ( this.shallowCompareData( this.props, nextProps ) ) {
			const data = this.mapDataToMeasurements( nextProps.data, nextProps.replacementVariables );
			this.setState(
				{
					titleLengthProgress: getTitleProgress( data.title ),
					descriptionLengthProgress: getDescriptionProgress( data.description, nextProps.date ),
				}
			);
		}
	}

	/**
	 * Calls the onChangeAnalysisData function with the current analysis
	 * data when the component did update.
	 *
	 *  @returns {void}
	 */
	componentDidUpdate() {
		const analysisData = this.mapDataToMeasurements( {
			...this.props.data,
		} );

		this.props.onChangeAnalysisData( analysisData );
	}

	/**
	 * Calls the onChangeAnalysisData function with the current analysis data.
	 *
	 * @param {string} key The key of the changed input.
	 * @param {string} value The value of the new input.
	 *
	 * @returns {void}
	 */
	handleChange( key, value ) {
		this.props.onChange( key, value );

		const analysisData = this.mapDataToMeasurements( {
			...this.props.data,
			[ key ]: value,
		} );

		this.props.onChangeAnalysisData( analysisData );
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
			recommendedReplacementVariables,
			hasPaperStyle,
			showCloseButton,
		} = this.props;

		let {
			descriptionEditorFieldPlaceholder,
		} = this.props;

		const { activeField, hoveredField, isOpen, titleLengthProgress, descriptionLengthProgress } = this.state;

		if ( ! isOpen ) {
			return null;
		}

		if ( descriptionEditorFieldPlaceholder === "" ) {
			descriptionEditorFieldPlaceholder = __( "Modify your meta description by editing it right here", "yoast-components" );
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
					recommendedReplacementVariables={ recommendedReplacementVariables }
					titleLengthProgress={ titleLengthProgress }
					descriptionLengthProgress={ descriptionLengthProgress }
					descriptionEditorFieldPlaceholder={ descriptionEditorFieldPlaceholder }
					containerPadding={ hasPaperStyle ? "0 20px" : "0" }
				/>
				{ showCloseButton &&
					<CloseEditorButton onClick={ this.close }>{ __( "Close snippet editor", "yoast-components" ) }</CloseEditorButton>
				}
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
	 * @param {string} content              The content to process.
	 * @param {array}  replacementVariables The replacement variables to use. Taken from the props by default.
	 *
	 * @returns {string} The processed content.
	 */
	processReplacementVariables( content, replacementVariables = this.props.replacementVariables ) {
		for ( const { name, value } of replacementVariables ) {
			content = content.replace( new RegExp( "%%" + name + "%%", "g" ), value );
		}

		return content;
	}

	/**
	 * Maps the data from to be suitable for measurement.
	 *
	 * The data that is measured is not exactly the same as the data that
	 * is in the preview, because the metadescription placeholder shouldn't
	 * be measured.
	 *
	 * @param {Object} originalData         The data from the form.
	 * @param {array}  replacementVariables The replacement variables to use. Taken from the props by default.
	 *
	 * @returns {Object} The data for the preview.
	 */
	mapDataToMeasurements( originalData, replacementVariables = this.props.replacementVariables ) {
		const { baseUrl, mapEditorDataToPreview } = this.props;

		let description = this.processReplacementVariables( originalData.description, replacementVariables );

		// Strip multiple spaces and spaces at the beginning and end.
		description = stripSpaces( description );

		const shortenedBaseUrl = baseUrl.replace( /^http:\/\//i, "" );

		const mappedData = {
			title: this.processReplacementVariables( originalData.title, replacementVariables ),
			url: shortenedBaseUrl + originalData.slug,
			description: description,
		};

		const context = {
			shortenedBaseUrl,
		};

		// The mapping by the passed mapping function should happen before measuring.
		if ( mapEditorDataToPreview ) {
			return mapEditorDataToPreview( mappedData, context );
		}


		return mappedData;
	}

	/**
	 * Maps the passed data to be suitable for the preview.
	 *
	 * The data that is in the preview is not exactly the same as the data
	 * that is measured (see above), because the metadescription placeholder
	 * shouldn't be measured.
	 *
	 * @param {Object} originalData         The data from the form.
	 *
	 * @returns {Object} The data for the preview.
	 */
	mapDataToPreview( originalData ) {
		return {
			title: originalData.title,
			url: originalData.url,
			description: originalData.description,
		};
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
			mode,
			date,
			locale,
			keyword,
			showCloseButton,
		} = this.props;

		const {
			activeField,
			hoveredField,
			isOpen,
		} = this.state;

		const measurementData = this.mapDataToMeasurements( data );
		const mappedData = this.mapDataToPreview( measurementData );

		/*
		 * The SnippetPreview is not a build-in HTML element so this check is not
		 * relevant.
		 */
		/* eslint-disable jsx-a11y/mouse-events-have-key-events */
		return (
			<ErrorBoundary>
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
						{ ...mappedData }
					/>

					<ModeSwitcher onChange={ ( newMode ) => onChange( "mode", newMode ) } active={ mode } />

					{ showCloseButton && <EditSnippetButton
						onClick={ isOpen ? this.close : this.open }
						aria-expanded={ isOpen }
						innerRef={ this.setEditButtonRef }
					>
						<SvgIcon icon="edit" />
						{ __( "Edit snippet", "yoast-components" ) }
					</EditSnippetButton> }

					{ this.renderEditor() }
				</div>
			</ErrorBoundary>
		);
		/* eslint-enable jsx-a11y/mouse-events-have-key-events */
	}
}

SnippetEditor.propTypes = {
	replacementVariables: replacementVariablesShape,
	recommendedReplacementVariables: recommendedReplacementVariablesShape,
	data: PropTypes.shape( {
		title: PropTypes.string.isRequired,
		slug: PropTypes.string.isRequired,
		description: PropTypes.string.isRequired,
	} ).isRequired,
	descriptionEditorFieldPlaceholder: PropTypes.string,
	baseUrl: PropTypes.string.isRequired,
	mode: PropTypes.oneOf( MODES ),
	date: PropTypes.string,
	onChange: PropTypes.func.isRequired,
	onChangeAnalysisData: PropTypes.func,
	titleLengthProgress: lengthProgressShape,
	descriptionLengthProgress: lengthProgressShape,
	mapEditorDataToPreview: PropTypes.func,
	keyword: PropTypes.string,
	locale: PropTypes.string,
	hasPaperStyle: PropTypes.bool,
	showCloseButton: PropTypes.bool,
};

SnippetEditor.defaultProps = {
	mode: DEFAULT_MODE,
	date: "",
	replacementVariables: [],
	recommendedReplacementVariables: [],
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
	mapEditorDataToPreview: null,
	locale: "en",
	descriptionEditorFieldPlaceholder: "",
	onChangeAnalysisData: noop,
	hasPaperStyle: true,
	showCloseButton: true,
};

export default SnippetEditor;
