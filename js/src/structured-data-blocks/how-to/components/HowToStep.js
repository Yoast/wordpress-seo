/* External dependencies */
import PropTypes from "prop-types";
import { __ } from "@wordpress/i18n";

const { Component } = window.wp.element;
const { IconButton } = window.wp.components;
const { RichText, MediaUpload } = window.wp.editor;
const { getBlockContent } = window.wp.blocks;

/**
 * A How-to step within a How-to block.
 */
export default class HowToStep extends Component {

	/**
	 * Constructs a HowToStep editor component.
	 *
	 * @param {Object} props This component's properties.
	 *
	 * @returns {void}
	 */
	constructor( props ) {
		super( props );

		this.onSplit       = this.onSplit.bind( this );
		this.onSelectImage = this.onSelectImage.bind( this );
	}

	/**
	 * The insert and remove step buttons.
	 *
	 * @returns {Component} The buttons.
	 */
	getButtons() {
		const {
			step,
			removeStep,
			insertStep,
		} = this.props;

		return <div className="schema-how-to-step-button-container">
			{ ! HowToStep.getImageSrc( step.contents ) &&
			<MediaUpload
				onSelect={ this.onSelectImage }
				type="image"
				value={ step.id }
				render={ ( { open } ) => (
					<IconButton
						className="schema-how-to-step-button editor-inserter__toggle how-to-step-add-media"
						icon="insert"
						onClick={ open }
					>
						{ __( "Add image", "wordpress-seo" ) }
					</IconButton>
				) }
			/>
			}
			<IconButton
				className="schema-how-to-step-button editor-inserter__toggle"
				icon="trash"
				label={ __( "Delete step", "wordpress-seo" ) }
				onClick={ removeStep }
			>
			</IconButton>
			<IconButton
				className="schema-how-to-step-button editor-inserter__toggle"
				icon="insert"
				label={ __( "Insert step", "wordpress-seo" ) }
				onClick={ insertStep }
			>
			</IconButton>
		</div>;
	}

	/**
	 * The mover buttons.
	 *
	 * @returns {Component} the buttons.
	 */
	getMover() {
		return <div className="schema-how-to-step-mover">
			{ ! this.props.isFirst &&
			<IconButton
				className="editor-block-mover__control"
				onClick={ this.props.onMoveUp }
				icon="arrow-up-alt2"
				label={ __( "Move step up", "wordpress-seo" ) }
			/>
			}
			{ ! this.props.isLast &&
			<IconButton
				className="editor-block-mover__control"
				onClick={ this.props.isLast ? null : this.props.onMoveDown }
				icon="arrow-down-alt2"
				label={ __( "Move step down", "wordpress-seo" ) }
			/>
			}
		</div>;
	}

	/**
	 * Callback when an image from the media library has been selected.
	 *
	 * @param {Object} media The selected image.
	 *
	 * @returns {void}
	 */
	onSelectImage( media ) {
		let contents = this.props.step.contents.slice();
		let image    = <img key={ media.id } alt={ media.alt } src={ media.url } />;

		if ( contents.push ) {
			contents.push( image );
		} else {
			contents = [ contents, image ];
		}

		this.props.onChange( contents );
	}

	/**
	 * Returns the image src from step contents.
	 *
	 * @param {array} contents The step contents.
	 *
	 * @returns {string|boolean} The image src or false if none is found.
	 */
	static getImageSrc( contents ) {
		if ( ! contents || ! contents.filter ) {
			return false;
		}

		let image = contents.filter( ( node ) => node && node.type && node.type === "img" )[ 0 ];

		if ( ! image ) {
			return false;
		}

		return image.props.src;
	}

	/**
	 * Returns the component of the given How-to step to be rendered in a WordPress post
	 * (e.g. not in the editor).
	 *
	 * @param {object} props The props of the how-to step.
	 *
	 * @returns {Component} the component to be rendered.
	 */
	static Content( props ) {
		return <RichText.Content
			tagName="li"
			className="schema-how-to-step"
			key={ props.id }
			value={ props.contents }
		/>;
	}

	/**
	 * Renders this component.
	 *
	 * @returns {Component} The how-to step editor.
	 */
	render() {
		let {
			index,
			step,
			onChange,
			onFocus,
			isSelected,
			focusPart,
			editorRef,
			isUnorderedList,
		} = this.props;

		let { id, name, text } = step;

		return (
			<li className="schema-how-to-step" key={ id } >
				<span className="schema-how-to-step-number">
					{ isUnorderedList
						? "•"
						: ( index + 1 ) + "."
					}
				</span>
				<RichText
					className="schema-how-to-step-name"
					tagName="h3"
					onSetup={ ( ref ) => editorRef( "name", ref ) }
					key={ `${ id }-name` }
					value={ name }
					onChange={ ( value ) => onChange( value, text, name, text ) }
					isSelected={ isSelected && focusPart === "name" }
					placeholder={ __( "Enter a step description", "wordpress-seo" ) }
					setFocusedElement={ () => onFocus( "name" ) }
					keepPlaceholderOnFocus={ true }
				/>
				<RichText
					className="schema-how-to-step-text"
					tagName="p"
					onSetup={ ( ref ) => editorRef( "text", ref ) }
					key={ `${ id }-text` }
					value={ text }
					onChange={ ( value ) => onChange( name, value, name, text ) }
					isSelected={ isSelected && focusPart === "text" }
					placeholder={ __( "Enter a step description", "wordpress-seo" ) }
					setFocusedElement={ () => onFocus( "text" ) }
					keepPlaceholderOnFocus={ true }
				/>
				{ isSelected && this.getMover() }
				{ isSelected && this.getButtons() }
			</li>
		);
	}
}

HowToStep.propTypes = {
	index: PropTypes.number.isRequired,
	step: PropTypes.object.isRequired,
	onChange: PropTypes.func.isRequired,
	insertStep: PropTypes.func.isRequired,
	removeStep: PropTypes.func.isRequired,
	onFocus: PropTypes.func.isRequired,
	editorRef: PropTypes.func.isRequired,
	onMoveUp: PropTypes.func.isRequired,
	onMoveDown: PropTypes.func.isRequired,

	isSelected: PropTypes.bool,
	isFirst: PropTypes.bool,
	isLast: PropTypes.bool,
};
