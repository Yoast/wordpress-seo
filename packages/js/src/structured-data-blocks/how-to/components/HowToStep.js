/* External dependencies */
import PropTypes from "prop-types";
import { __ } from "@wordpress/i18n";
import appendSpace from "../../../components/higherorder/appendSpace";
import { isShallowEqualObjects } from "@wordpress/is-shallow-equal";

import { Component } from "@wordpress/element";
import { IconButton } from "@wordpress/components";
import { RichText, MediaUpload } from "@wordpress/block-editor";

const RichTextWithAppendedSpace = appendSpace( RichText );
const RichTextContentWithAppendedSpace = appendSpace( RichText.Content );

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

		this.onSelectImage  = this.onSelectImage.bind( this );
		this.onInsertStep   = this.onInsertStep.bind( this );
		this.onRemoveStep   = this.onRemoveStep.bind( this );
		this.onMoveStepUp   = this.onMoveStepUp.bind( this );
		this.onMoveStepDown = this.onMoveStepDown.bind( this );
		this.onFocusText    = this.onFocusText.bind( this );
		this.onFocusTitle   = this.onFocusTitle.bind( this );
		this.onChangeTitle  = this.onChangeTitle.bind( this );
		this.onChangeText   = this.onChangeText.bind( this );
	}

	/**
	 * Handles the insert step button action.
	 *
	 * @returns {void}
	 */
	onInsertStep() {
		this.props.insertStep( this.props.index );
	}

	/**
	 * Handles the remove step button action.
	 *
	 * @returns {void}
	 */
	onRemoveStep() {
		this.props.removeStep( this.props.index );
	}

	/**
	 * Handles the move step up button action.
	 *
	 * @returns {void}
	 */
	onMoveStepUp() {
		if ( this.props.isFirst ) {
			return;
		}
		this.props.onMoveUp( this.props.index );
	}

	/**
	 * Handles the move step down button action.
	 *
	 * @returns {void}
	 */
	onMoveStepDown() {
		if ( this.props.isLast ) {
			return;
		}
		this.props.onMoveDown( this.props.index );
	}

	/**
	 * Handles the focus event on the title editor.
	 *
	 * @returns {void}
	 */
	onFocusTitle() {
		this.props.onFocus( this.props.index, "name" );
	}

	/**
	 * Handles the focus event on the text editor.
	 *
	 * @returns {void}
	 */
	onFocusText() {
		this.props.onFocus( this.props.index, "text" );
	}

	/**
	 * Handles the on change event on the title editor.
	 *
	 * @param {string} value The new title.
	 *
	 * @returns {void}
	 */
	onChangeTitle( value ) {
		const {
			onChange,
			index,
			step: {
				text,
				name,
			},
		} = this.props;

		onChange( value, text, name, text, index );
	}

	/**
	 * Handles the on change event on the text editor.
	 *
	 * @param {string} value The new text.
	 *
	 * @returns {void}
	 */
	onChangeText( value ) {
		const {
			onChange,
			index,
			step: {
				text,
				name,
			},
		} = this.props;

		onChange( name, value, name, text, index );
	}

	/**
	 * Renders the media upload button.
	 *
	 * @param {object} props      The receive props.
	 * @param {func}   props.open Opens the media upload dialog.
	 *
	 * @returns {wp.Element} The media upload button.
	 */
	getMediaUploadButton( props ) {
		return (
			<IconButton
				className="schema-how-to-step-button how-to-step-add-media"
				icon="insert"
				onClick={ props.open }
			>
				{ __( "Add image", "wordpress-seo" ) }
			</IconButton>
		);
	}

	/**
	 * The insert and remove step buttons.
	 *
	 * @returns {wp.Element} The buttons.
	 */
	getButtons() {
		const {
			step,
		} = this.props;

		return <div className="schema-how-to-step-button-container">
			{ ! HowToStep.getImageSrc( step.text ) &&
			<MediaUpload
				onSelect={ this.onSelectImage }
				allowedTypes={ [ "image" ] }
				value={ step.id }
				render={ this.getMediaUploadButton }
			/>
			}
			<IconButton
				className="schema-how-to-step-button"
				icon="trash"
				label={ __( "Delete step", "wordpress-seo" ) }
				onClick={ this.onRemoveStep }
			/>
			<IconButton
				className="schema-how-to-step-button"
				icon="insert"
				label={ __( "Insert step", "wordpress-seo" ) }
				onClick={ this.onInsertStep }
			/>
		</div>;
	}

	/**
	 * The mover buttons.
	 *
	 * @returns {Component} the buttons.
	 */
	getMover() {
		return <div className="schema-how-to-step-mover">
			<IconButton
				className="editor-block-mover__control"
				onClick={ this.onMoveStepUp }
				icon="arrow-up-alt2"
				label={ __( "Move step up", "wordpress-seo" ) }
				aria-disabled={ this.props.isFirst }
			/>
			<IconButton
				className="editor-block-mover__control"
				onClick={ this.onMoveStepDown }
				icon="arrow-down-alt2"
				label={ __( "Move step down", "wordpress-seo" ) }
				aria-disabled={ this.props.isLast }
			/>
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
		const {
			index,
			step: {
				name,
				text,
			},
		} = this.props;

		let newText = text.slice();
		const image = <img className={ `wp-image-${ media.id }` } alt={ media.alt } src={ media.url } style="max-width:100%;" />;

		if ( newText.push ) {
			newText.push( image );
		} else {
			newText = [ newText, image ];
		}

		this.props.onChange( name, newText, name, text, index );
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

		const image = contents.filter( ( node ) => node && node.type && node.type === "img" )[ 0 ];

		if ( ! image ) {
			return false;
		}

		return image.props.src;
	}

	/**
	 * Perform a shallow equal to prevent every step from being rerendered.
	 *
	 * @param {object} nextProps The next props the component will receive.
	 *
	 * @returns {boolean} Whether or not the component should perform an update.
	 */
	shouldComponentUpdate( nextProps ) {
		return ! isShallowEqualObjects( nextProps, this.props );
	}

	/**
	 * Returns the component of the given How-to step to be rendered in a WordPress post
	 * (e.g. not in the editor).
	 *
	 * @param {object} step The how-to step.
	 *
	 * @returns {wp.Element} The component to be rendered.
	 */
	static Content( step ) {
		return (
			<li className={ "schema-how-to-step" } id={ step.id } key={ step.id }>
				<RichTextContentWithAppendedSpace
					tagName="strong"
					className="schema-how-to-step-name"
					key={ step.id + "-name" }
					value={ step.name }
				/>
				<RichTextContentWithAppendedSpace
					tagName="p"
					className="schema-how-to-step-text"
					key={ step.id + "-text" }
					value={ step.text }
				/>
			</li>
		);
	}

	/**
	 * Renders this component.
	 *
	 * @returns {wp.Element} The how-to step editor.
	 */
	render() {
		const {
			index,
			step,
			isSelected,
			subElement,
			isUnorderedList,
		} = this.props;

		const { id, name, text } = step;

		return (
			<li className="schema-how-to-step" key={ id }>
				<span className="schema-how-to-step-number">
					{ isUnorderedList
						? "•"
						: ( index + 1 ) + "."
					}
				</span>
				<RichTextWithAppendedSpace
					className="schema-how-to-step-name"
					tagName="p"
					key={ `${ id }-name` }
					value={ name }
					onChange={ this.onChangeTitle }
					isSelected={ isSelected && subElement === "name" }
					placeholder={ __( "Enter a step title", "wordpress-seo" ) }
					unstableOnFocus={ this.onFocusTitle }
					keepPlaceholderOnFocus={ true }
					formattingControls={ [ "italic", "strikethrough", "link" ] }
				/>
				<RichTextWithAppendedSpace
					className="schema-how-to-step-text"
					tagName="p"
					key={ `${ id }-text` }
					value={ text }
					onChange={ this.onChangeText }
					isSelected={ isSelected && subElement === "text" }
					placeholder={ __( "Enter a step description", "wordpress-seo" ) }
					unstableOnFocus={ this.onFocusText }
					keepPlaceholderOnFocus={ true }
				/>
				{ isSelected &&
					<div className="schema-how-to-step-controls-container">
						{ this.getMover() }
						{ this.getButtons() }
					</div>
				}
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
	onMoveUp: PropTypes.func.isRequired,
	onMoveDown: PropTypes.func.isRequired,
	subElement: PropTypes.string,
	isSelected: PropTypes.bool.isRequired,
	isFirst: PropTypes.bool.isRequired,
	isLast: PropTypes.bool.isRequired,
	isUnorderedList: PropTypes.bool,
};

HowToStep.defaultProps = {
	isUnorderedList: false,
	subElement: "",
};
