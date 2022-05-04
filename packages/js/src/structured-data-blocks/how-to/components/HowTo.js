/* External dependencies */
import PropTypes from "prop-types";
import styled from "styled-components";
import { __ } from "@wordpress/i18n";
import { speak } from "@wordpress/a11y";
import { get, toString } from "lodash-es";

/* Internal dependencies */
import HowToStep from "./HowToStep";
import buildDurationString from "../utils/buildDurationString";
import appendSpace from "../../../components/higherorder/appendSpace";

import { RichText, InspectorControls } from "@wordpress/block-editor";
import { IconButton, PanelBody, TextControl, ToggleControl } from "@wordpress/components";
import { Component, renderToString, createRef } from "@wordpress/element";

const RichTextWithAppendedSpace = appendSpace( RichText.Content );

/**
 * Modified Text Control to provide a better layout experience.
 *
 * @returns {wp.Element} The TextControl with additional spacing below.
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

		this.changeStep           = this.changeStep.bind( this );
		this.insertStep           = this.insertStep.bind( this );
		this.removeStep           = this.removeStep.bind( this );
		this.swapSteps            = this.swapSteps.bind( this );
		this.setFocus             = this.setFocus.bind( this );
		this.addCSSClasses        = this.addCSSClasses.bind( this );
		this.getListTypeHelp      = this.getListTypeHelp.bind( this );
		this.toggleListType       = this.toggleListType.bind( this );
		this.setDurationText      = this.setDurationText.bind( this );
		this.setFocusToStep       = this.setFocusToStep.bind( this );
		this.moveStepUp           = this.moveStepUp.bind( this );
		this.moveStepDown         = this.moveStepDown.bind( this );
		this.focusDescription     = this.focusDescription.bind( this );
		this.addDuration          = this.addDuration.bind( this );
		this.removeDuration       = this.removeDuration.bind( this );
		this.onChangeDescription  = this.onChangeDescription.bind( this );
		this.onChangeDays         = this.onChangeDays.bind( this );
		this.onChangeHours        = this.onChangeHours.bind( this );
		this.onChangeMinutes      = this.onChangeMinutes.bind( this );
		this.onAddStepButtonClick = this.onAddStepButtonClick.bind( this );
		this.daysInput            = createRef();
		this.addDurationButton    = createRef();

		const defaultDurationText = this.getDefaultDurationText();
		this.setDefaultDurationText( defaultDurationText );
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
	 * Sets the default duration text to describe the time the instructions in the how-to block take, when no duration text
	 * was provided.
	 *
	 * @param {string} text The text to describe the duration.
	 *
	 * @returns {void}
	 */
	setDefaultDurationText( text ) {
		this.props.setAttributes( { defaultDurationText: text } );
	}

	/**
	 * Handles the Add Step Button click event.
	 *
	 * Necessary because insertStep needs to be called without arguments, to assure the step is added properly.
	 *
	 * @returns {void}
	 */
	onAddStepButtonClick() {
		this.insertStep( null, [], [], false );
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
		const steps = this.props.attributes.steps ? this.props.attributes.steps.slice() : [];

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
			jsonName: renderToString( newName ),
			jsonText: renderToString( newText ),
		};

		const imageSrc = HowToStep.getImageSrc( newText );

		if ( imageSrc ) {
			steps[ index ].jsonImageSrc = imageSrc;
		}

		this.props.setAttributes( { steps } );
	}

	/**
	 * Inserts an empty Step into a how-to block at the given index.
	 *
	 * @param {number}       [index]      Optional. The index of the Step after which a new Step should be added.
	 * @param {array|string} [name]       Optional. The title of the new Step. Default: empty.
	 * @param {array|string} [text]       Optional. The description of the new Step. Default: empty.
	 * @param {bool}         [focus=true] Optional. Whether or not to focus the new Step. Default: true.
	 *
	 * @returns {void}
	 */
	insertStep( index = null, name = [], text = [], focus = true ) {
		const steps = this.props.attributes.steps ? this.props.attributes.steps.slice() : [];

		if ( index === null ) {
			index = steps.length - 1;
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
			// When moving focus to a newly created step, return and don't use the speak() messaage.
			return;
		}

		speak( __( "New step added", "wordpress-seo" ) );
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
		const steps = this.props.attributes.steps ? this.props.attributes.steps.slice() : [];
		const step  = steps[ index1 ];

		steps[ index1 ] = steps[ index2 ];
		steps[ index2 ] = step;

		this.props.setAttributes( { steps } );

		const [ focusIndex, subElement ] = this.state.focus.split( ":" );
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
		const steps = this.props.attributes.steps ? this.props.attributes.steps.slice() : [];

		steps.splice( index, 1 );
		this.props.setAttributes( { steps } );

		let fieldToFocus = "description";
		if ( steps[ index ] ) {
			fieldToFocus = `${ index }:name`;
		} else if ( steps[ index - 1 ] ) {
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
	}

	/**
	 * Sets the focus to an element within teh specified step.
	 *
	 * @param {number} stepIndex      Index of the step to focus.
	 * @param {string} elementToFocus Name of the element to focus.
	 *
	 * @returns {void}
	 */
	setFocusToStep( stepIndex, elementToFocus ) {
		this.setFocus( `${ stepIndex }:${ elementToFocus }` );
	}

	/**
	 * Move the step at the specified index one step up.
	 *
	 * @param {number} stepIndex Index of the step that should be moved.
	 *
	 * @returns {void}
	 */
	moveStepUp( stepIndex ) {
		this.swapSteps( stepIndex, stepIndex - 1 );
	}

	/**
	 * Move the step at the specified index one step down.
	 *
	 * @param {number} stepIndex Index of the step that should be moved.
	 *
	 * @returns {void}
	 */
	moveStepDown( stepIndex ) {
		this.swapSteps( stepIndex, stepIndex + 1 );
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

		const [ focusIndex, subElement ] = this.state.focus.split( ":" );

		return this.props.attributes.steps.map( ( step, index ) => {
			return (
				<HowToStep
					key={ step.id }
					step={ step }
					index={ index }
					onChange={ this.changeStep }
					insertStep={ this.insertStep }
					removeStep={ this.removeStep }
					onFocus={ this.setFocusToStep }
					subElement={ subElement }
					onMoveUp={ this.moveStepUp }
					onMoveDown={ this.moveStepDown }
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
	 * Renders the how to steps.
	 *
	 * @param {array} steps The steps data.
	 *
	 * @returns {array} The HowToStep elements.
	 */
	static getStepsContent( steps ) {
		if ( ! steps ) {
			return null;
		}

		return steps.map( step => (
			<HowToStep.Content
				{ ...step }
				key={ step.id }
			/>
		) );
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
		const {
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
			defaultDurationText,
		} = props;

		const classNames       = [ "schema-how-to", className ].filter( ( item ) => item ).join( " " );
		const listClassNames   = [ "schema-how-to-steps", additionalListCssClasses ].filter( ( item ) => item ).join( " " );

		const timeString = buildDurationString( { days, hours, minutes } );

		return (
			<div className={ classNames }>
				{ ( hasDuration && typeof timeString === "string" && timeString.length > 0 ) &&
					<p className="schema-how-to-total-time">
						<span className="schema-how-to-duration-time-text">
							{ durationText || defaultDurationText }
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
					? <ul className={ listClassNames }>{ HowTo.getStepsContent( steps ) }</ul>
					: <ol className={ listClassNames }>{ HowTo.getStepsContent( steps ) }</ol>
				}
			</div>
		);
	}

	/**
	 * Retrieves a button to add a step at the end of the How-to list.
	 *
	 * @returns {Component} The button to add a step.
	 */
	getAddStepButton() {
		return (
			<IconButton
				icon="insert"
				onClick={ this.onAddStepButtonClick }
				className="schema-how-to-add-step"
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
	 * Set focus to the description field.
	 *
	 * @returns {void}
	 */
	focusDescription() {
		this.setFocus( "description" );
	}

	/**
	 * Handles the on change event for the how to description field.
	 *
	 * @param {string} value The new description.
	 *
	 * @returns {void}
	 */
	onChangeDescription( value ) {
		this.props.setAttributes( {
			description: value,
			jsonDescription: renderToString( value ),
		} );
	}

	/**
	 * Enables the duration fields and manages focus.
	 *
	 * @returns {void}
	 */
	addDuration() {
		this.props.setAttributes( { hasDuration: true } );
		setTimeout( () => this.daysInput.current.focus() );
	}

	/**
	 * Disables the duration fields and manages focus.
	 *
	 * @returns {void}
	 */
	removeDuration() {
		this.props.setAttributes( { hasDuration: false } );
		// Wait for the Add Duration button to mount.
		setTimeout( () => {
			/*
			 * Prior to Gutenberg 5.3 the IconButton doesn't support refs. The ref
			 * returns the Component instance and attempting to set focus on it
			 * triggers a TypeError. To keep it simple, we accept a focus loss.
			 * Starting from WordPress 5.2, Iconbutton does support refs so this
			 * check can be removed in the future.
			 */
			if ( this.addDurationButton.current instanceof Component ) {
				return;
			}

			this.addDurationButton.current.focus();
		} );
	}

	/**
	 * Handles the days input on change event.
	 *
	 * @param {SyntheticInputEvent} event The input event.
	 *
	 * @returns {void}
	 */
	onChangeDays( event ) {
		const newValue = this.formatDuration( event.target.value );
		this.props.setAttributes( { days: toString( newValue ) } );
	}

	/**
	 * Handles the hours input on change event.
	 *
	 * @param {SyntheticInputEvent} event The input event.
	 *
	 * @returns {void}
	 */
	onChangeHours( event ) {
		const newValue = this.formatDuration( event.target.value, 23 );
		this.props.setAttributes( { hours: toString( newValue ) } );
	}

	/**
	 * Handles the minutes input on change event.
	 *
	 * @param {SyntheticInputEvent} event The input event.
	 *
	 * @returns {void}
	 */
	onChangeMinutes( event ) {
		const newValue = this.formatDuration( event.target.value, 59 );
		this.props.setAttributes( { minutes: toString( newValue ) } );
	}

	/**
	 * Returns a component to manage this how-to block's duration.
	 *
	 * @returns {Component} The duration editor component.
	 */
	getDuration() {
		const { attributes } = this.props;

		if ( ! attributes.hasDuration ) {
			return (
				<IconButton
					onClick={ this.addDuration }
					className="schema-how-to-duration-button"
					ref={ this.addDurationButton }
					icon="insert"
				>
					{ __( "Add total time", "wordpress-seo" ) }
				</IconButton>
			);
		}

		return (
			<fieldset className="schema-how-to-duration">
				<span className="schema-how-to-duration-flex-container" role="presentation">
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
							onChange={ this.onChangeDays }
							placeholder="DD"
							ref={ this.daysInput }
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
							onChange={ this.onChangeHours }
							placeholder="HH"
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
							onChange={ this.onChangeMinutes }
							placeholder="MM"
						/>
						<IconButton
							className="schema-how-to-duration-delete-button"
							icon="trash"
							label={ __( "Delete total time", "wordpress-seo" ) }
							onClick={ this.removeDuration }
						/>
					</span>
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
					checked={ unorderedList || false }
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
		const { attributes, className } = this.props;

		const classNames     = [ "schema-how-to", className ].filter( ( item ) => item ).join( " " );
		const listClassNames = [ "schema-how-to-steps", attributes.additionalListCssClasses ].filter( ( item ) => item ).join( " " );

		return (
			<div className={ classNames }>
				{ this.getDuration() }
				<RichText
					tagName="p"
					className="schema-how-to-description"
					value={ attributes.description }
					unstableOnFocus={ this.focusDescription }
					onChange={ this.onChangeDescription }
					placeholder={ __( "Enter a description", "wordpress-seo" ) }
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

HowTo.defaultProps = {
	className: "",
};
