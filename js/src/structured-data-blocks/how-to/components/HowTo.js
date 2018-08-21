/* External dependencies */
import PropTypes from "prop-types";
import HowToStep from "./HowToStep";
import isUndefined from "lodash/isUndefined";
import moment from "moment";
import { __ } from "@wordpress/i18n";

/* Internal dependencies */
import { stripHTML } from "../../../helpers/stringHelpers";

const { RichText, InspectorControls } = window.wp.editor;
const { IconButton, PanelBody, TextControl, ToggleControl } = window.wp.components;
const { Component, renderToString } = window.wp.element;

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

		this.changeStep = this.changeStep.bind( this );
		this.insertStep = this.insertStep.bind( this );
		this.removeStep = this.removeStep.bind( this );
		this.swapSteps = this.swapSteps.bind( this );
		this.setFocus = this.setFocus.bind( this );
		this.addCSSClasses = this.addCSSClasses.bind( this );
		this.getListTypeHelp = this.getListTypeHelp.bind( this );
		this.toggleListType = this.toggleListType.bind( this );

		this.editorRefs = {};
	}

	/**
	 * Generates a pseudo-unique" id.
	 *
	 * @param {string} prefix an (optional) prefix to use.
	 *
	 * @returns {string} a pseudo-unique string, consisting of the optional prefix + the curent time in milliseconds.
	 */
	static generateId( prefix ) {
		return `${ prefix }-${ new Date().getTime() }`;
	}

	/**
	 * Replaces the How-to step with the given index.
	 *
	 * @param {array|string} newName      The new contents of the step-name.
	 * @param {array|string} newText      The new contents of the step-text.
	 * @param {array|string} previousName The previous contents of the step-name.
	 * @param {array|string} previousText The previous contents of the step-text.
	 * @param {number}       index        The index of the step that needs to be changed.
	 *
	 * @returns {void}
	 */
	changeStep( newName, newText, previousName, previousText, index ) {
		let steps = this.props.attributes.steps ? this.props.attributes.steps.slice() : [];

		if ( index >= steps.length ) {
			return;
		}

		if ( steps[ index ].name !== previousName || steps[ index ].text !== previousText ) {
			return;
		}

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
	 * @param {number}       [index]      The index of the step after which a new step should be added.
	 * @param {array|string} [name]       The name of the new step.
	 * @param {array|string} [text]       The text of the new step.
	 * @param {bool}         [focus=true] Whether or not to focus the new step.
	 *
	 * @returns {void}
	 */
	insertStep( index, name = [], text=[], focus = true ) {
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

		let [ focusIndex, focusPart ] = this.state.focus.split( ":" );
		if ( focusIndex === `${ index1 }` ) {
			this.setFocus( `${ index2 }:${ focusPart }` );
		} else if ( focusIndex === `${ index2 }` ) {
			this.setFocus( `${ index1 }:${ focusPart }` );
		}
	}

	/**
	 * Removes a step from a how-to block.
	 *
	 * @param {number} index the index of the step that needs to be removed.
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

		const deletedIndex = steps.length;
		delete this.editorRefs[ `${ deletedIndex }:name` ];
		delete this.editorRefs[ `${ deletedIndex }:text` ];

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
	 * @param {number|string} elementToFocus the element to focus, either the index of the step that should be in focus or name of the input.
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
	 * Returns an array of How-to step components, to be rendered on screen.
	 *
	 * @returns {Component[]} The step components.
	 */
	getSteps() {
		if ( ! this.props.attributes.steps ) {
			return null;
		}

		let [ focusIndex, focusPart ] = this.state.focus.split( ":" );

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
						( name, text, prevName, prevText ) =>
							this.changeStep( name, text, prevName, prevText, index )
					}
					insertStep={ () => this.insertStep( index ) }
					removeStep={ () => this.removeStep( index ) }
					onFocus={ ( part ) => this.setFocus( `${ index }:${ part }` ) }
					focusPart={ focusPart }
					onMoveUp={ () => this.swapSteps( index, index - 1 ) }
					onMoveDown={ () => this.swapSteps( index, index + 1 ) }
					isFirst={ index === 0 }
					isLast={ index === this.props.attributes.steps.length - 1 }
					isSelected={ focusIndex === `${ index }` }
					isUnorderedList={ this.props.attributes.unorderedList }
				/>
			); }
		);
	}

	/**
	 * Returns a component to manage this how-to block"s duration.
	 *
	 * @returns {Component} The duration editor component.
	 */
	getDuration() {
		const { attributes, setAttributes } = this.props;

		if ( ! attributes.hasDuration ) {
			return (
				<IconButton
					icon="insert"
					onClick={ () => setAttributes( { hasDuration: true } ) }
					className="schema-how-to-duration-button editor-inserter__toggle"
				>
					{ __( "Add total time", "wordpress-seo" ) }
				</IconButton>
			);
		}

		return (
			<div className="schema-how-to-duration">
				<span>{ __( "Time needed:", "wordpress-seo" ) }&nbsp;</span>
				<input
					className="schema-how-to-duration-input"
					type="number"
					value={ attributes.hours }
					onFocus={ () => this.setFocus( "hours" ) }
					onChange={ ( event ) => setAttributes( { hours: Math.max( 0, event.target.value ) } ) }
					placeholder="HH"/>
				<span>:</span>
				<input
					className="schema-how-to-duration-input"
					type="number"
					value={ attributes.minutes }
					onFocus={ () => this.setFocus( "minutes" ) }
					onChange={ ( event ) => setAttributes( { minutes: Math.min( Math.max( 0, event.target.value ), 60 ) } ) }
					placeholder="MM" />
				<IconButton
					className="schema-how-to-duration-button editor-inserter__toggle"
					icon="trash"
					label={ __( "Delete total time", "wordpress-seo" ) }
					onClick={ () => setAttributes( { hasDuration: false } ) }
				/>
			</div>
		);
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
		let { steps, title, hasDuration, hours, minutes, description, unorderedList, additionalListCssClasses, className } = props;

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

		const classNames = [ "schema-how-to", className ].filter( ( item ) => item ).join( " " );
		const listClassNames = [ "schema-how-to-steps", additionalListCssClasses ].filter( ( item ) => item ).join( " " );

		const timeString = [
			hours && moment.duration( hours, "hours" ).humanize(),
			minutes && moment.duration( minutes, "minutes" ).humanize(),
		].filter( ( item ) => item ).join( " and " );

		return (
			<div className={ classNames }>
				<RichText.Content
					tagName="h2"
					className="schema-how-to-title"
					value={ title }
					id={ stripHTML( renderToString( title ) ).toLowerCase().replace( /\s+/g, "-" ) }
				/>
				{ ( hasDuration ) &&
					<p className="schema-how-to-total-time">
						{ __( "Time needed:", "wordpress-seo" ) }
						&nbsp;
						{ timeString }.
					</p>
				}
				<RichText.Content
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
	 * @param  {boolean} checked Whether or not the list is unordered.
	 *
	 * @returns {string} The list type help string.
	 */
	getListTypeHelp( checked ) {
		return checked
			? __( "Showing step items as an unordered list", "wordpress-seo" )
			: __( "Showing step items as an ordered list.", "wordpress-seo" );
	}

	/**
	 * Adds controls to the editor sidebar to control the given parameters.
	 * @param {boolean} unorderedList whether to show the list as an unordered list.
	 * @param {string} additionalClasses the additional CSS classes to add to the list.
	 * @returns {Component} the controls to add to the sidebar.
	 */
	getSidebar( unorderedList, additionalClasses ) {
		return <InspectorControls>
			<PanelBody title={ __( "Settings", "wordpress-seo" ) } className="blocks-font-size">
				<TextControl
					label={ __( "Additional CSS Classes for list", "wordpress-seo" ) }
					value={ additionalClasses }
					onChange={ this.addCSSClasses }
					help={ __( "CSS classes to add to the list of steps (excluding the how-to header)", "wordpress-seo" ) }
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

		const classNames = [ "schema-how-to", className ].filter( ( item ) => item ).join( " " );
		const listClassNames = [ "schema-how-to-steps", attributes.additionalListCssClasses ].filter( ( item ) => item ).join( " " );

		return (
			<div className={ classNames }>
				<RichText
					tagName="h2"
					className="schema-how-to-title"
					value={ attributes.title }
					isSelected={ this.state.focus === "title" }
					setFocusedElement={ () => this.setFocus( "title" ) }
					onChange={ ( title ) => setAttributes( { title, jsonTitle: stripHTML( renderToString( title ) ) } ) }
					onSetup={ ( ref ) => {
						this.editorRefs.title = ref;
					} }
					placeholder={ __( "Enter a title for your instructions", "wordpress-seo" ) }
					keepPlaceholderOnFocus={ true }
				/>
				{ this.getDuration() }
				<RichText
					tagName="p"
					className="schema-how-to-description"
					value={ attributes.description }
					isSelected={ this.state.focus === "description" }
					setFocusedElement={ () => this.setFocus( "description" ) }
					onChange={ ( description ) => setAttributes( { description, jsonDescription: stripHTML( renderToString( description ) ) } ) }
					onSetup={ ( ref ) => {
						this.editorRefs.description = ref;
					} }
					placeholder={ __( "Enter a description", "wordpress-seo" ) }
					keepPlaceholderOnFocus={ true }
				/>
				<ul className={ listClassNames }>
					{ this.getSteps() }
				</ul>
				<div className="schema-how-to-buttons">{ this.getAddStepButton() }</div>
				{ this.getSidebar( attributes.unorderedList, attributes.additionalListCssClasses ) }
			</div>
		);
	}
}

HowTo.propTypes = {
	attributes: PropTypes.object.isRequired,
	setAttributes: PropTypes.func.isRequired,
	className: PropTypes.string,
};
