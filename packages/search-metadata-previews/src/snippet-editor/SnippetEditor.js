// External dependencies.
import styled from "styled-components";
import React from "react";
import PropTypes from "prop-types";
import { __ } from "@wordpress/i18n";
import { escapeRegExp, noop } from "lodash";

/* Yoast dependencies */
import { languageProcessing } from "yoastseo";
import { ErrorBoundary, SvgIcon, Button } from "@yoast/components";
import { colors } from "@yoast/style-guide";
import { getDirectionalStyle, join } from "@yoast/helpers";
import {
	replacementVariablesShape,
	recommendedReplacementVariablesShape,
} from "@yoast/replacement-variable-editor";

// Internal dependencies.
import { getTitleProgress, getDescriptionProgress } from "../helpers/progress";
import { DEFAULT_MODE, MODES } from "../snippet-preview/constants";
import SnippetPreview from "../snippet-preview/SnippetPreview";
import SnippetEditorFields from "./SnippetEditorFields";
import { lengthProgressShape } from "./constants";
import ModeSwitcher from "./ModeSwitcher";

const SearchPreviewDescription = styled.legend`
	margin: 0 0 16px;
	padding: 0;
	color: ${ colors.$color_headings };
	font-size: 12px;
	font-weight: 300;
`;

const SnippetEditorButton = styled( Button )`
	height: 33px;
	border: 1px solid #dbdbdb;
	box-shadow: none;
	font-family: Arial, Roboto-Regular, HelveticaNeue, sans-serif;
`;

const EditSnippetButton = styled( SnippetEditorButton )`
	margin: ${getDirectionalStyle( "10px 0 0 4px", "10px 4px 0 0" )};
	fill: ${colors.$color_grey_dark};
	padding-left: 8px;

	& svg {
		${getDirectionalStyle( "margin-right", "margin-left" )}: 7px;
	}
`;

const CloseEditorButton = styled( SnippetEditorButton )`
	margin-top: 24px;
`;

// The regex for the replacement variables we want to exclude from the SEO title before we measure the width.
const excludedVars = new RegExp( "(%%sep%%|%%sitename%%)", "g" );

/**
 * The snippet editor component.
 */
class SnippetEditor extends React.Component {
	/**
	 * Constructs the snippet editor.
	 *
	 * @param {Object}   props                                   The props for the snippet editor.
	 * @param {Object[]} props.replacementVariables              The replacement variables for this editor.
	 * @param {Object[]} props.recommendedReplacementVariables   The recommended replacement variables for this editor.
	 * @param {Object}   props.data                              The initial editor data.
	 * @param {string}   props.keyword                           The focus keyword.
	 * @param {string}   props.data.title                        The initial SEO title.
	 * @param {string}   props.data.slug                         The initial slug.
	 * @param {string}   props.data.description                  The initial description.
	 * @param {bool}     props.isCornerstone                     Whether the cornerstone content toggle is on or off.
	 * @param {bool}     props.isTaxonomy                        Whether the page is a taxonomy page.
	 * @param {string}   props.baseUrl                           The base URL to use for the preview.
	 * @param {string}   props.mode                              The mode the editor should be in.
	 * @param {Function} props.onChange                          Called when the data changes.
	 * @param {Object}   props.titleLengthProgress               The values for the SEO title length assessment.
	 * @param {Object}   props.descriptionLengthProgress         The values for the description length assessment.
	 * @param {Function} props.mapEditorDataToPreview            Function to map the editor data to data for the preview.
	 * @param {Function} props.applyReplacementVariables         Function that overrides default replacement variables application with a custom one.
	 * @param {string}   props.locale                            The locale of the page.
	 * @param {string}   props.mobileImageSrc                    Mobile Image source for snippet preview.
	 * @param {bool}     props.hasPaperStyle                     Whether or not it has paper style.
	 * @param {string}   props.descriptionEditorFieldPlaceholder The placeholder value for the description field.
	 * @param {bool}     props.showCloseButton                   Whether or not users have the option to open and close
	 *                                                           the editor.
	 * @returns {void}
	 */
	constructor( props ) {
		super( props );
		const measurementData = this.mapDataToMeasurements( props.data );

		this.state = {
			// Is opened by default when show close button is hidden.
			isOpen: ! props.showCloseButton,
			activeField: null,
			hoveredField: null,
			titleLengthProgress: getTitleProgress( measurementData.filteredSEOTitle ),
			descriptionLengthProgress: getDescriptionProgress(
				measurementData.description,
				this.props.date,
				this.props.isCornerstone,
				this.props.isTaxonomy,
				this.props.locale
			),
		};

		this.setFieldFocus = this.setFieldFocus.bind( this );
		this.unsetFieldFocus = this.unsetFieldFocus.bind( this );
		this.onChangeMode = this.onChangeMode.bind( this );
		this.onMouseUp = this.onMouseUp.bind( this );
		this.onMouseEnter = this.onMouseEnter.bind( this );
		this.onMouseLeave = this.onMouseLeave.bind( this );
		this.open = this.open.bind( this );
		this.close = this.close.bind( this );
		this.setEditButtonRef = this.setEditButtonRef.bind( this );
		this.handleChange = this.handleChange.bind( this );
		this.haveReplaceVarsChanged = this.haveReplaceVarsChanged.bind( this );
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
			prevProps.data.title !== nextProps.data.title ||
			prevProps.isCornerstone !== nextProps.isCornerstone ||
			prevProps.isTaxonomy !== nextProps.isTaxonomy ||
			prevProps.locale !== nextProps.locale
		) {
			isDirty = true;
		}

		/* If any of the replacement variables have changed, the preview progress needs to be reanalysed.
		   The replacement variables are converted from an array of objects to a string for easier and more consistent
		   comparison.
		 */
		if ( this.haveReplaceVarsChanged( prevProps.replacementVariables, nextProps.replacementVariables ) ) {
			isDirty = true;
		}

		return isDirty;
	}

	/**
	 * Checks if the replacement variables have changed.
	 *
	 * @param {ReplaceVar[]} oldReplaceVars The old replacement variables.
	 * @param {ReplaceVar[]} newReplaceVars The new replacement variables.
	 *
	 * @returns {boolean} If there is a difference between the old replacement variables and the new ones.
	 */
	haveReplaceVarsChanged( oldReplaceVars, newReplaceVars ) {
		return JSON.stringify( oldReplaceVars ) !== JSON.stringify( newReplaceVars );
	}

	/**
	 * Updates the state when the component receives new props.
	 *
	 * @param {Object} prevProps The previous props.
	 * @returns {void}
	 */
	componentDidUpdate( prevProps ) {
		// Only set a new state when the data is dirty.
		if ( this.shallowCompareData( this.props, prevProps ) ) {
			const data = this.mapDataToMeasurements( this.props.data, this.props.replacementVariables );
			this.setState(
				{
					// Here we use the filtered SEO title for the SEO title progress calculation.
					titleLengthProgress: getTitleProgress( data.filteredSEOTitle ),
					descriptionLengthProgress: getDescriptionProgress(
						data.description,
						this.props.date,
						this.props.isCornerstone,
						this.props.isTaxonomy,
						this.props.locale ),
				}
			);

			/*
	 * Make sure that any changes get reflected on the analysis data on the store (used in, among other things, the SEO analysis).
	 * Including changes to the replacement vars (e.g. title, category, tags).
	 */
			this.props.onChangeAnalysisData( data );
		}
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
			descriptionEditorFieldPlaceholder,
			onReplacementVariableSearchChange,
			replacementVariables,
			recommendedReplacementVariables,
			hasPaperStyle,
			showCloseButton,
			idSuffix,
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
					onReplacementVariableSearchChange={ onReplacementVariableSearchChange }
					replacementVariables={ replacementVariables }
					recommendedReplacementVariables={ recommendedReplacementVariables }
					titleLengthProgress={ titleLengthProgress }
					descriptionLengthProgress={ descriptionLengthProgress }
					descriptionEditorFieldPlaceholder={ descriptionEditorFieldPlaceholder }
					containerPadding={ hasPaperStyle ? "0 20px" : "0" }
					titleInputId={ join( [ "yoast-google-preview-title", idSuffix ] ) }
					slugInputId={ join( [ "yoast-google-preview-slug", idSuffix ] ) }
					descriptionInputId={ join( [ "yoast-google-preview-description", idSuffix ] ) }
				/>
				{ showCloseButton &&
					<CloseEditorButton onClick={ this.close }>{ __( "Close snippet editor", "wordpress-seo" ) }</CloseEditorButton>
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
	 * Calls the onChange handler with the new mode.
	 *
	 * @param {string} newMode The new mode.
	 *
	 * @returns {void}
	 */
	onChangeMode( newMode ) {
		this.props.onChange( "mode", newMode );
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
		if ( this.props.applyReplacementVariables ) {
			return this.props.applyReplacementVariables( content );
		}

		for ( const { name, value } of replacementVariables ) {
			content = content.replace( new RegExp( "%%" + escapeRegExp( name ) + "%%", "g" ), value );
		}

		return content;
	}

	/**
	 * Maps the data from to be suitable for measurement.
	 *
	 * The data that is measured is not exactly the same as the data that
	 * is in the preview, because the meta description placeholder shouldn't
	 * be measured. Additionally, the separator and site title should also be filtered out of the SEO title
	 * before the width is measured.
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
		description = languageProcessing.stripSpaces( description );

		const shortenedBaseUrl = baseUrl.replace( /^https?:\/\//i, "" );

		// The filtered title is the SEO title without separator and site title.
		// This data will be used in calculating the SEO title width.
		const filteredTitle = originalData.title.replace( excludedVars, "" );

		const mappedData = {
			title: this.processReplacementVariables( originalData.title, replacementVariables ),
			url: baseUrl + originalData.slug,
			description: description,
			filteredSEOTitle: this.processReplacementVariables( filteredTitle, replacementVariables ),
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
	 * that is measured (see above), because the meta description placeholder
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
	 * Sets a reference to the edit button, so we can move focus to it.
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
			data,
			mode,
			date,
			locale,
			keyword,
			wordsToHighlight,
			showCloseButton,
			faviconSrc,
			mobileImageSrc,
			idSuffix,
			shoppingData,
			siteName,
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
		return (
			<ErrorBoundary>
				<div>
					<SearchPreviewDescription>{ __( "Determine how your post should look in the search results.",
						"wordpress-seo" ) }</SearchPreviewDescription>
					<ModeSwitcher
						onChange={ this.onChangeMode }
						active={ mode }
						mobileModeInputId={ join( [ "yoast-google-preview-mode-mobile", idSuffix ] ) }
						desktopModeInputId={ join( [ "yoast-google-preview-mode-desktop", idSuffix ] ) }
					/>
					<SnippetPreview
						keyword={ keyword }
						wordsToHighlight={ wordsToHighlight }
						mode={ mode }
						date={ date }
						siteName={ siteName }
						activeField={ this.mapFieldToPreview( activeField ) }
						hoveredField={ this.mapFieldToPreview( hoveredField ) }
						onMouseEnter={ this.onMouseEnter }
						onMouseLeave={ this.onMouseLeave }
						onMouseUp={ this.onMouseUp }
						locale={ locale }
						faviconSrc={ faviconSrc }
						mobileImageSrc={ mobileImageSrc }
						shoppingData={ shoppingData }
						{ ...mappedData }
					/>

					{ showCloseButton && <EditSnippetButton
						onClick={ isOpen ? this.close : this.open }
						aria-expanded={ isOpen }
						ref={ this.setEditButtonRef }
					>
						<SvgIcon icon="edit" />
						{ __( "Edit snippet", "wordpress-seo" ) }
					</EditSnippetButton> }

					{ this.renderEditor() }
				</div>
			</ErrorBoundary>
		);
	}
}

SnippetEditor.propTypes = {
	onReplacementVariableSearchChange: PropTypes.func,
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
	applyReplacementVariables: PropTypes.func,
	mapEditorDataToPreview: PropTypes.func,
	keyword: PropTypes.string,
	wordsToHighlight: PropTypes.array,
	locale: PropTypes.string,
	hasPaperStyle: PropTypes.bool,
	showCloseButton: PropTypes.bool,
	faviconSrc: PropTypes.string,
	mobileImageSrc: PropTypes.string,
	idSuffix: PropTypes.string,
	shoppingData: PropTypes.object,
	isCornerstone: PropTypes.bool,
	isTaxonomy: PropTypes.bool,
	siteName: PropTypes.string.isRequired,
};

SnippetEditor.defaultProps = {
	mode: DEFAULT_MODE,
	date: "",
	wordsToHighlight: [],
	onReplacementVariableSearchChange: null,
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
	applyReplacementVariables: null,
	mapEditorDataToPreview: null,
	keyword: "",
	locale: "en",
	descriptionEditorFieldPlaceholder: "",
	onChangeAnalysisData: noop,
	hasPaperStyle: true,
	showCloseButton: true,
	faviconSrc: "",
	mobileImageSrc: "",
	idSuffix: "",
	shoppingData: {},
	isCornerstone: false,
	isTaxonomy: false,
};

export default SnippetEditor;
