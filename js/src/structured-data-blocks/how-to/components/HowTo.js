/* External dependencies */
import PropTypes from "prop-types";
import HowToStep from "./HowToStep";
import isUndefined from "lodash/isUndefined";
import moment from "moment";
import styled from "styled-components";
import { __ } from "@wordpress/i18n";

/* Internal dependencies */
import { stripHTML } from "../../../helpers/stringHelpers";

const { RichText, InspectorControls } = window.wp.editor;
const { IconButton, PanelBody, TextControl, ToggleControl } = window.wp.components;
const { Component, renderToString } = window.wp.element;

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

		this.state = { focus: null };

		this.changeStep      = this.changeStep.bind( this );
		this.insertStep      = this.insertStep.bind( this );
		this.removeStep      = this.removeStep.bind( this );
		this.swapSteps       = this.swapSteps.bind( this );
		this.setFocus        = this.setFocus.bind( this );
		this.addCSSClasses   = this.addCSSClasses.bind( this );
		this.getListTypeHelp = this.getListTypeHelp.bind( this );
		this.toggleListType  = this.toggleListType.bind( this );
		this.updateHeadingID = this.updateHeadingID.bind( this );

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
	 * @param {array|string} newContents  The new contents of the step.
	 * @param {array|string} prevContents The previous contents of the step.
	 * @param {number}       index        The index of the step that needs to be replaced.
	 *
	 * @returns {void}
	 */
	changeStep( newContents, prevContents, index ) {
		let steps = this.props.attributes.steps ? this.props.attributes.steps.slice() : [];

		if ( index >= steps.length ) {
			return;
		}

		if ( prevContents !== steps[ index ].contents ) {
			return;
		}

		steps[ index ].contents     = newContents;
		steps[ index ].jsonContents = stripHTML( renderToString( newContents ) );

		let imageSrc = HowToStep.getImageSrc( newContents );

		if ( imageSrc ) {
			steps[ index ].jsonImageSrc = imageSrc;
		}

		this.props.setAttributes( { steps } );
	}

	/**
	 * Inserts an empty step into a how-to block at the given index.
	 *
	 * @param {number}       [index]      The index of the step after which a new step should be added.
	 * @param {array|string} [contents]   The contents of the new step.
	 * @param {bool}         [focus=true] Whether or not to focus the new step.
	 *
	 * @returns {void}
	 */
	insertStep( index, contents = [], focus = true ) {
		let steps = this.props.attributes.steps ? this.props.attributes.steps.slice() : [];

		if ( isUndefined( index ) ) {
			index = steps.length - 1;
		}

		let lastIndex = steps.length - 1;
		while ( lastIndex > index ) {
			this.editorRefs[ lastIndex + 1 ] = this.editorRefs[ lastIndex ];
			lastIndex--;
		}

		steps.splice(
			index + 1,
			0,
			{
				id: HowTo.generateId( "how-to-step" ),
				contents,
				jsonContents: stripHTML( renderToString( contents ) ),
			}
		);

		this.props.setAttributes( { steps } );

		if ( focus ) {
			setTimeout( this.setFocus.bind( this, index + 1 ) );
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

		let stepEditorRef = this.editorRefs[ index1 ];
		this.editorRefs[ index1 ] = this.editorRefs[ index2 ];
		this.editorRefs[ index2 ] = stepEditorRef;

		this.props.setAttributes( { steps } );

		if ( this.state.focus === index1 ) {
			this.setFocus( index2 );
		} else if ( this.state.focus === index2 ) {
			this.setFocus( index1 );
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

		delete this.editorRefs[ index ];

		let nextIndex = index + 1;
		while ( this.editorRefs[ nextIndex ] ) {
			this.editorRefs[ nextIndex - 1 ] = this.editorRefs[ nextIndex ];
			nextIndex++;
		}

		delete this.editorRefs[ steps.length ];

		if ( index > 0 ) {
			this.setFocus( index - 1 );
		} else {
			this.setFocus( "description" );
		}
	}

	/**
	 * Sets the focus to a specific element in the How-to block.
	 *
	 * @param {number|string} elementToFocus The element to focus: either the index of
	 *                                       a step or a focusable element ref name.
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

		return this.props.attributes.steps.map( ( step, index ) => {
			return (
				<HowToStep
					key={ step.id }
					step={ step }
					index={ index }
					editorRef={ ( ref ) => {
						this.editorRefs[ index ] = ref;
					} }
					onChange={ ( newStepContents ) => this.changeStep( newStepContents, step.contents, index ) }
					insertStep={ ( contents ) => this.insertStep( index, contents ) }
					removeStep={ () => this.removeStep( index ) }
					onFocus={ () => this.setFocus( index ) }
					onMoveUp={ () => this.swapSteps( index, index - 1 ) }
					onMoveDown={ () => this.swapSteps( index, index + 1 ) }
					isFirst={ index === 0 }
					isLast={ index === this.props.attributes.steps.length - 1 }
					isSelected={ this.state.focus === index }
					isUnorderedList={ this.props.attributes.unorderedList }
				/>
			);
		} );
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
		let {
			steps,
			title,
			hasDuration,
			hours,
			minutes,
			description,
			unorderedList,
			additionalListCssClasses,
			className,
			headingID,
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

		const classNames        = [ "schema-how-to", className ].filter( ( item ) => item ).join( " " );
		const listClassNames    = [ "schema-how-to-steps", additionalListCssClasses ].filter( ( item ) => item ).join( " " );
		const contentHeadingID  = headingID ? headingID : stripHTML( renderToString( title ) ).toLowerCase();

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
					id={ contentHeadingID.replace( /\s+/g, "-" ) }
				/>
				{ ( hasDuration && timeString.length > 0 ) &&
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
	 * Changes the heading's ID.
	 *
	 * @param {string} headingID The header's new ID.
	 *
	 * @returns {void}
	 */
	updateHeadingID( headingID ) {
		this.props.setAttributes( { headingID: headingID } );
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
	 *
	 * @param {boolean} unorderedList     Whether to show the list as an unordered list.
	 * @param {string}  additionalClasses The additional CSS classes to add to the list.
	 * @param {string}  headingID         The heading's ID.
	 *
	 * @returns {Component} The controls to add to the sidebar.
	 */
	getSidebar( unorderedList, additionalClasses, headingID ) {
		return <InspectorControls>
			<PanelBody title={ __( "Settings", "wordpress-seo" ) } className="blocks-font-size">
				<SpacedTextControl
					label={ __( "HTML ID to apply to the title", "wordpress-seo" ) }
					value={ headingID }
					onChange={ this.updateHeadingID }
					help={ __( "Optional. This can give you better control over the styling of the heading.", "wordpress-seo" ) }
				/>
				<SpacedTextControl
					label={ __( "CSS class(es) to apply to the steps", "wordpress-seo" ) }
					value={ additionalClasses }
					onChange={ this.addCSSClasses }
					help={ __( "Optional. This can give you better control over the styling of the steps.", "wordpress-seo" ) }
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
				<RichText
					tagName="h2"
					id={ attributes.headingID }
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
				{ this.getSidebar( attributes.unorderedList, attributes.additionalListCssClasses, attributes.headingID ) }
			</div>
		);
	}
}

HowTo.propTypes = {
	attributes: PropTypes.object.isRequired,
	setAttributes: PropTypes.func.isRequired,
	className: PropTypes.string,
};
