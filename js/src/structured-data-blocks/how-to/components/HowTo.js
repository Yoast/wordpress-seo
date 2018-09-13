/* External dependencies */
import PropTypes from "prop-types";
import HowToStep from "./HowToStep";
import isUndefined from "lodash/isUndefined";
import styled from "styled-components";
import { __ } from "@wordpress/i18n";
import toString from "lodash/toString";
import get from "lodash/get";

/* Internal dependencies */
import { stripHTML } from "../../../helpers/stringHelpers";
import buildDurationString from "../utils/buildDurationString";
import appendSpace from "../../../components/higherorder/appendSpace";

const { RichText, InspectorControls } = window.wp.editor;
const { IconButton, PanelBody, TextControl, ToggleControl } = window.wp.components;
const { Component, renderToString } = window.wp.element;

const RichTextWithAppendedSpace = appendSpace( RichText.Content );

/**
 * Modified Text Control to provide a better layout experience.
 *
 * @returns {ReactElement} The TextControl with additional spacing below.
 */
const SpacedTextControl = styled( TextControl )`
	&&& {
		margin-bottom: 32px;
	}
`;

/**
 * A How-to block component.
 */
export default class HowTo extends Component {

	/**
	 * Constructs a HowTo editor component.
	 *
	 * @param {Object} props This component's properties.
	 *
	 * @returns {void}
	 */
	constructor( props ) {
		super( props );

		this.state = { focus: "" };

		this.changeStep      = this.changeStep.bind( this );
		this.insertStep      = this.insertStep.bind( this );
		this.removeStep      = this.removeStep.bind( this );
		this.swapSteps       = this.swapSteps.bind( this );
		this.setFocus        = this.setFocus.bind( this );
		this.addCSSClasses   = this.addCSSClasses.bind( this );
		this.getListTypeHelp = this.getListTypeHelp.bind( this );
		this.toggleListType  = this.toggleListType.bind( this );
		this.setDurationText = this.setDurationText.bind( this );

		if ( ! this.props.attributes.durationText ) {
			const defaultDurationText = this.getDefaultDurationText();

			this.setDurationText( defaultDurationText );
		}

		this.editorRefs = {};
	}

	/**
	 * Returns the default duration text.
	 *
	 * @returns {string} The default duration text.
	 */
	getDefaultDurationText() {
		const applyFilters = get( window, "wp.hooks.applyFilters" );
		let defaultDurationText = __( "Time needed:", "wordpress-seo" );

		if ( applyFilters ) {
			defaultDurationText = applyFilters( "wpseo_duration_text", defaultDurationText );
		}

		return defaultDurationText;
	}

	/**
	 * Sets the duration text to describe the time the guide in the how-to block takes.
	 *
	 * @param {string} text The text to describe the duration.
	 *
	 * @returns {void}
	 */
	setDurationText( text ) {
		this.props.setAttributes( { durationText: text } );
	}


	/**
	 * Generates a pseudo-unique id.
	 *
	 * @param {string} [prefix] The prefix to use.
	 *
	 * @returns {string} A pseudo-unique string, consisting of the optional prefix + the curent time in milliseconds.
	 */
	static generateId( prefix ) {
		return `${ prefix }-${ new Date().getTime() }`;
	}

	/**
	 * Replaces the How-to step with the given index.
	 *
	 * @param {array}  newName      The new step-name.
	 * @param {array}  newText      The new step-text.
	 * @param {array}  previousName The previous step-name.
	 * @param {array}  previousText The previous step-text.
	 * @param {number} index        The index of the step that needs to be changed.
	 *
	 * @returns {void}
	 */
	changeStep( newName, newText, previousName, previousText, index ) {
		let steps = this.props.attributes.steps ? this.props.attributes.steps.slice() : [];

		// If the index exceeds the number of steps, don't change anything.
		if ( index >= steps.length ) {
			return;
		}

		/*
		 * Because the DOM re-uses input elements, the changeStep function was triggered when removing/inserting/swapping
		 * input elements. We need to check for such events, and return early if the changeStep was called without any
		 * user changes to the input field, but because the underlying input elements moved around in the DOM.
		 *
		 * In essence, when the name at the current index does not match the name that was in the input field previously,
		 * the changeStep was triggered by input fields moving in the DOM.
		 */
		if ( steps[ index ].name !== previousName || steps[ index ].text !== previousText ) {
			return;
		}

		// Rebuild the step with the newly made changes.
		steps[ index ] = {
			id: steps[ index ].id,
			name: newName,
			text: newText,
			jsonName: stripHTML( renderToString( newName ) ),
			jsonText: stripHTML( renderToString( newText ) ),
		};

		let imageSrc = HowToStep.getImageSrc( newText );

		if ( imageSrc ) {
			steps[ index ].jsonImageSrc = imageSrc;
		}

		this.props.setAttributes( { steps } );
	}

	/**
	 * Inserts an empty step into a how-to block at the given index.
	 *
	 * @param {number} [index]      The index of the step after which a new step should be added.
	 * @param {string} [name]       The name of the new step.
	 * @param {string} [text]       The text of the new step.
	 * @param {bool}   [focus=true] Whether or not to focus the new step.
	 *
	 * @returns {void}
	 */
	insertStep( index, name = [], text = [], focus = true ) {
		let steps = this.props.attributes.steps ? this.props.attributes.steps.slice() : [];

		if ( isUndefined( index ) ) {
			index = steps.length - 1;
		}

		let lastIndex = steps.length - 1;
		while ( lastIndex > index ) {
			this.editorRefs[ `${ lastIndex + 1 }:name` ] = this.editorRefs[ `${ lastIndex }:name` ];
			this.editorRefs[ `${ lastIndex + 1 }:text` ] = this.editorRefs[ `${ lastIndex }:text` ];
			lastIndex--;
		}

		steps.splice( index + 1, 0, {
			id: HowTo.generateId( "how-to-step" ),
			name,
			text,
			jsonName: "",
			jsonText: "",
		} );

		this.props.setAttributes( { steps } );

		if ( focus ) {
			setTimeout( this.setFocus.bind( this, `${ index + 1 }:name` ) );
		}
	}

	/**
	 * Swaps two steps in the how-to block.
	 *
	 * @param {number} index1 The index of the first block.
	 * @param {number} index2 The index of the second block.
	 *
	 * @returns {void}
	 */
	swapSteps( index1, index2 ) {
		let steps = this.props.attributes.steps ? this.props.attributes.steps.slice() : [];
		let step  = steps[ index1 ];

		steps[ index1 ] = steps[ index2 ];
		steps[ index2 ] = step;

		const NameEditorRef = this.editorRefs[ `${ index1 }:name` ];
		this.editorRefs[ `${ index1 }:name` ] = this.editorRefs[ `${ index2 }:name` ];
		this.editorRefs[ `${ index2 }:name` ] = NameEditorRef;

		const TextEditorRef = this.editorRefs[ `${ index1 }:text` ];
		this.editorRefs[ `${ index1 }:text` ] = this.editorRefs[ `${ index2 }:text` ];
		this.editorRefs[ `${ index2 }:text` ] = TextEditorRef;

		this.props.setAttributes( { steps } );

		let [ focusIndex, subElement ] = this.state.focus.split( ":" );
		if ( focusIndex === `${ index1 }` ) {
			this.setFocus( `${ index2 }:${ subElement }` );
		}

		if ( focusIndex === `${ index2 }` ) {
			this.setFocus( `${ index1 }:${ subElement }` );
		}
	}

	/**
	 * Removes a step from a how-to block.
	 *
	 * @param {number} index The index of the step that needs to be removed.
	 *
	 * @returns {void}
	 */
	removeStep( index ) {
		let steps = this.props.attributes.steps ? this.props.attributes.steps.slice() : [];

		steps.splice( index, 1 );
		this.props.setAttributes( { steps } );

		delete this.editorRefs[ `${ index }:name` ];
		delete this.editorRefs[ `${ index }:text` ];

		let nextIndex = index + 1;
		while ( this.editorRefs[ `${ nextIndex }:name` ] || this.editorRefs[ `${ nextIndex }:text` ] ) {
			this.editorRefs[ `${ nextIndex - 1 }:name` ] = this.editorRefs[ `${ nextIndex }:name` ];
			this.editorRefs[ `${ nextIndex - 1 }:text` ] = this.editorRefs[ `${ nextIndex }:text` ];
			nextIndex++;
		}

		const indexToRemove = steps.length;
		delete this.editorRefs[ `${ indexToRemove }:name` ];
		delete this.editorRefs[ `${ indexToRemove }:text` ];

		let fieldToFocus = "description";
		if ( this.editorRefs[ `${ index }:name` ] ) {
			fieldToFocus = `${ index }:name`;
		} else if ( this.editorRefs[ `${ index - 1 }:text` ] ) {
			fieldToFocus = `${ index - 1 }:text`;
		}

		this.setFocus( fieldToFocus );
	}

	/**
	 * Sets the focus to a specific step in the How-to block.
	 *
	 * @param {number|string} elementToFocus The element to focus, either the index of the step that should be in focus or name of the input.
	 *
	 * @returns {void}
	 */
	setFocus( elementToFocus ) {
		if ( elementToFocus === this.state.focus ) {
			return;
		}

		this.setState( { focus: elementToFocus } );

		if ( this.editorRefs[ elementToFocus ] ) {
			this.editorRefs[ elementToFocus ].focus();
		}
	}

	/**
	 * Returns an array of How-to step components to be rendered on screen.
	 *
	 * @returns {Component[]} The step components.
	 */
	getSteps() {
		if ( ! this.props.attributes.steps ) {
			return null;
		}

		let [ focusIndex, subElement ] = this.state.focus.split( ":" );

		return this.props.attributes.steps.map( ( step, index ) => {
			return (
				<HowToStep
					key={ step.id }
					step={ step }
					index={ index }
					editorRef={ ( part, ref ) => {
						this.editorRefs[ `${ index }:${ part }` ] = ref;
					} }
					onChange={
						( newName, newText, previousName, previousText ) =>
							this.changeStep( newName, newText, previousName, previousText, index )
					}
					insertStep={ () => this.insertStep( index ) }
					removeStep={ () => this.removeStep( index ) }
					onFocus={ ( elementToFocus ) => this.setFocus( `${ index }:${ elementToFocus }` ) }
					subElement={ subElement }
					onMoveUp={ () => this.swapSteps( index, index - 1 ) }
					onMoveDown={ () => this.swapSteps( index, index + 1 ) }
					isFirst={ index === 0 }
					isLast={ index === this.props.attributes.steps.length - 1 }
					isSelected={ focusIndex === `${ index }` }
					isUnorderedList={ this.props.attributes.unorderedList }
				/>
			);
		} );
	}

	/**
	 * Formats the time in the input fields by removing leading zeros.
	 *
	 * @param {number} duration    The duration as entered by the user.
	 * @param {number} maxDuration Optional. The max duration a field can have.
	 *
	 * @returns {number} The formatted duration.
	 */
	formatDuration( duration, maxDuration = null ) {
		if ( duration === "" ) {
			return "";
		}

		const newDuration = duration.replace( /^[0]+/, "" );
		if ( newDuration === "" ) {
			return 0;
		}

		if ( maxDuration !== null ) {
			return Math.min( Math.max( 0, parseInt( newDuration, 10 ) ), maxDuration );
		}

		return Math.max( 0, parseInt( newDuration, 10 ) );
	}

	/**
	 * Returns the component to be used to render
	 * the How-to block on Wordpress (e.g. not in the editor).
	 *
	 * @param {object} props the attributes of the How-to block.
	 *
	 * @returns {Component} The component representing a How-to block.
	 */
	static Content( props ) {
		let {
			steps,
			hasDuration,
			days,
			hours,
			minutes,
			description,
			unorderedList,
			additionalListCssClasses,
			className,
			durationText,
		} = props;

		steps = steps
			? steps.map( ( step ) => {
				return(
					<HowToStep.Content
						{ ...step }
						key={ step.id }
					/>
				);
			} )
			: null;

		const classNames       = [ "schema-how-to", className ].filter( ( item ) => item ).join( " " );
		const listClassNames   = [ "schema-how-to-steps", additionalListCssClasses ].filter( ( item ) => item ).join( " " );

		const timeString = buildDurationString( { days, hours, minutes } );

		return (
			<div className={ classNames }>
				{ ( hasDuration && typeof timeString === "string" && timeString.length > 0 ) &&
					<p className="schema-how-to-total-time">
						<span className="schema-how-to-duration-time-text">
							{ durationText }
							&nbsp;
						</span>
						{ timeString + ". " }
					</p>
				}
				<RichTextWithAppendedSpace
					tagName="p"
					className="schema-how-to-description"
					value={ description }
				/>
				{ unorderedList
					? <ul className={ listClassNames }>{ steps }</ul>
					: <ol className={ listClassNames }>{ steps }</ol>
				}
			</div>
		);
	}

	/**
	 * A button to add a step to the front of the list.
	 *
	 * @returns {Component} a button to add a step
	 */
	getAddStepButton() {
		return (
			<IconButton
				icon="insert"
				onClick={ () => this.insertStep() }
				className="editor-inserter__toggle"
			>
				{ __( "Add step", "wordpress-seo" ) }
			</IconButton>
		);
	}

	/**
	 * Adds CSS classes to this how-to block"s list.
	 *
	 * @param {string} value The additional css classes.
	 *
	 * @returns {void}
	 */
	addCSSClasses( value ) {
		this.props.setAttributes( { additionalListCssClasses: value } );
	}

	/**
	 * Toggles the list type of this how-to block.
	 *
	 * @param {boolean} checked Whether or not the list is unordered.
	 *
	 * @returns {void}
	 */
	toggleListType( checked ) {
		this.props.setAttributes( { unorderedList: checked } );
	}

	/**
	 * Returns the help text for this how-to block"s list type.
	 *
	 * @param {boolean} checked Whether or not the list is unordered.
	 *
	 * @returns {string} The list type help string.
	 */
	getListTypeHelp( checked ) {
		return checked
			? __( "Showing step items as an unordered list", "wordpress-seo" )
			: __( "Showing step items as an ordered list.", "wordpress-seo" );
	}

	/**
	 * Returns a component to manage this how-to block's duration.
	 *
	 * @returns {Component} The duration editor component.
	 */
	getDuration() {
		const { attributes, setAttributes } = this.props;

		if ( ! attributes.hasDuration ) {
			return (
				<IconButton
					focus={ true }
					icon="insert"
					onClick={ () => setAttributes( { hasDuration: true } ) }
					className="schema-how-to-duration-button editor-inserter__toggle"
				>
					{ __( "Add total time", "wordpress-seo" ) }
				</IconButton>
			);
		}

		return (
			<fieldset className="schema-how-to-duration">
				<legend
					className="schema-how-to-duration-legend"
				>
					{ attributes.durationText || this.getDefaultDurationText() }
				</legend>
				<span className="schema-how-to-duration-time-input">
					<label
						htmlFor="schema-how-to-duration-days"
						className="screen-reader-text"
					>
						{ __( "days", "wordpress-seo" ) }
					</label>
					<input
						id="schema-how-to-duration-days"
						className="schema-how-to-duration-input"
						type="number"
						value={ attributes.days }
						onFocus={ () => this.setFocus( "days" ) }
						onChange={ ( event ) => {
							const newValue = this.formatDuration( event.target.value );
							setAttributes( { days: toString( newValue ) } );
						} }
						placeholder="DD"
					/>
					<label
						htmlFor="schema-how-to-duration-hours"
						className="screen-reader-text"
					>
						{ __( "hours", "wordpress-seo" ) }
					</label>
					<input
						id="schema-how-to-duration-hours"
						className="schema-how-to-duration-input"
						type="number"
						value={ attributes.hours }
						onFocus={ () => this.setFocus( "hours" ) }
						placeholder="HH"
						onChange={ ( event ) => {
							const newValue = this.formatDuration( event.target.value, 23 );
							setAttributes( { hours: toString( newValue ) } );
						} }
					/>
					<span aria-hidden="true">:</span>
					<label
						htmlFor="schema-how-to-duration-minutes"
						className="screen-reader-text"
					>
						{ __( "minutes", "wordpress-seo" ) }
					</label>
					<input
						id="schema-how-to-duration-minutes"
						className="schema-how-to-duration-input"
						type="number"
						value={ attributes.minutes }
						onFocus={ () => this.setFocus( "minutes" ) }
						onChange={ ( event ) => {
							const newValue = this.formatDuration( event.target.value, 59 );
							setAttributes( { minutes: toString( newValue ) } );
						} }
						placeholder="MM"
					/>
					<IconButton
						className="schema-how-to-duration-button editor-inserter__toggle"
						icon="trash"
						label={ __( "Delete total time", "wordpress-seo" ) }
						onClick={ () => setAttributes( { hasDuration: false } ) }
					/>
				</span>
			</fieldset>
		);
	}

	/**
	 * Adds controls to the editor sidebar to control the given parameters.
	 *
	 * @param {boolean} unorderedList     Whether to show the list as an unordered list.
	 * @param {string}  additionalClasses The additional CSS classes to add to the list.
	 * @param {string}  durationText      The text to describe the duration.
	 *
	 * @returns {Component} The controls to add to the sidebar.
	 */
	getSidebar( unorderedList, additionalClasses, durationText ) {
		if ( durationText === this.getDefaultDurationText() ) {
			durationText = "";
		}

		return <InspectorControls>
			<PanelBody title={ __( "Settings", "wordpress-seo" ) } className="blocks-font-size">
				<SpacedTextControl
					label={ __( "CSS class(es) to apply to the steps", "wordpress-seo" ) }
					value={ additionalClasses }
					onChange={ this.addCSSClasses }
					help={ __( "Optional. This can give you better control over the styling of the steps.", "wordpress-seo" ) }
				/>
				<SpacedTextControl
					label={ __( "Describe the duration of the instruction:", "wordpress-seo" ) }
					value={ durationText }
					onChange={ this.setDurationText }
					help={ __( "Optional. Customize how you want to describe the duration of the instruction", "wordpress-seo" ) }
					placeholder={ this.getDefaultDurationText() }
				/>
				<ToggleControl
					label={ __( "Unordered list", "wordpress-seo" ) }
					checked={ unorderedList }
					onChange={ this.toggleListType }
					help={ this.getListTypeHelp }
				/>
			</PanelBody>
		</InspectorControls>;
	}

	/**
	 * Renders this component.
	 *
	 * @returns {Component} The how-to block editor.
	 */
	render() {
		let { attributes, setAttributes, className } = this.props;

		const classNames     = [ "schema-how-to", className ].filter( ( item ) => item ).join( " " );
		const listClassNames = [ "schema-how-to-steps", attributes.additionalListCssClasses ].filter( ( item ) => item ).join( " " );

		return (
			<div className={ classNames }>
				{ this.getDuration() }
				<RichText
					tagName="p"
					className="schema-how-to-description"
					value={ attributes.description }
					isSelected={ this.state.focus === "description" }
					setFocusedElement={ () => this.setFocus( "description" ) }
					onChange={ ( description ) => setAttributes( { description, jsonDescription: stripHTML( renderToString( description ) ) } ) }
					unstableOnSetup={ ( ref ) => {
						this.editorRefs.description = ref;
					} }
					placeholder={ __( "Enter a description", "wordpress-seo" ) }
					keepPlaceholderOnFocus={ true }
				/>
				<ul className={ listClassNames }>
					{ this.getSteps() }
				</ul>
				<div className="schema-how-to-buttons">{ this.getAddStepButton() }</div>
				{ this.getSidebar( attributes.unorderedList, attributes.additionalListCssClasses, attributes.durationText ) }
			</div>
		);
	}
}

HowTo.propTypes = {
	attributes: PropTypes.object.isRequired,
	setAttributes: PropTypes.func.isRequired,
	className: PropTypes.string,
};
