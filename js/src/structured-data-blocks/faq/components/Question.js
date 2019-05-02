/* External dependencies */
import React from "react";
import PropTypes from "prop-types";
import { __ } from "@wordpress/i18n";
import isShallowEqual from "@wordpress/is-shallow-equal/objects";

const { Component } = window.wp.element;
const { IconButton } = window.wp.components;
const { RichText, MediaUpload } = window.wp.editor;

/* Internal dependencies */
import appendSpace from "../../../components/higherorder/appendSpace";

const RichTextWithAppendedSpace = appendSpace( RichText.Content );

/**
 * A Question and answer pair within a FAQ block.
 */
export default class Question extends Component {
	/**
	 * Constructs a Question editor component.
	 *
	 * @param {Object} props This component's props.
	 *
	 * @returns {void}
	 */
	constructor( props ) {
		super( props );

		this.onSelectImage    = this.onSelectImage.bind( this );
		this.onFocusAnswer    = this.onFocusAnswer.bind( this );
		this.onFocusQuestion  = this.onFocusQuestion.bind( this );
		this.onChangeAnswer   = this.onChangeAnswer.bind( this );
		this.onChangeQuestion = this.onChangeQuestion.bind( this );
		this.onInsertQuestion = this.onInsertQuestion.bind( this );
		this.onRemoveQuestion = this.onRemoveQuestion.bind( this );
		this.onMoveDown       = this.onMoveDown.bind( this );
		this.onMoveUp         = this.onMoveUp.bind( this );
	}

	/**
	 * Renders the media upload button.
	 *
	 * @param {Object}   props      The received props.
	 * @param {function} props.open Opens the media upload dialog.
	 *
	 * @returns {ReactElement} The media upload button.
	 */
	getMediaUploadButton( props ) {
		return (
			<IconButton
				className="schema-faq-section-button faq-section-add-media"
				icon="insert"
				onClick={ props.open }
			>
				{ __( "Add image", "wordpress-seo" ) }
			</IconButton>
		);
	}

	/**
	 * Pass the question editor reference down to the parent component.
	 *
	 * @param {object} ref Reference to the question editor.
	 *
	 * @returns {void}
	 */
	setQuestionRef( ref ) {
		this.props.editorRef( "question", ref, this.props.index );
	}

	/**
	 * Pass the answer editor reference down to the parent component.
	 *
	 * @param {object} ref Reference to the question editor.
	 *
	 * @returns {void}
	 */
	setAnswerRef( ref ) {
		this.props.editorRef( "answer", ref, this.props.index );
	}

	/**
	 * Handle the focus event on the question editor.
	 *
	 * @returns {void}
	 */
	onFocusQuestion() {
		this.props.onFocus( "question", this.props.index );
	}

	/**
	 * Handle the focus event on the answer editor.
	 *
	 * @returns {void}
	 */
	onFocusAnswer() {
		this.props.onFocus( "answer", this.props.index );
	}

	/**
	 * Handles the on change event on the question editor.
	 *
	 * @param {string} value The new question.
	 *
	 * @returns {void}
	 */
	onChangeQuestion( value ) {
		const {
			index,
			onChange,
			attributes: {
				answer,
				question,
			},
		} = this.props;

		onChange(
			value,
			answer,
			question,
			answer,
			index,
		);
	}

	/**
	 * Handles the on change event on the answer editor.
	 *
	 * @param {string} value The new answer.
	 *
	 * @returns {void}
	 */
	onChangeAnswer( value ) {
		const {
			index,
			onChange,
			attributes: {
				answer,
				question,
			},
		} = this.props;

		onChange(
			question,
			value,
			question,
			answer,
			index,
		);
	}

	/**
	 * Handles the insert question button action.
	 *
	 * @returns {void}
	 */
	onInsertQuestion() {
		this.props.insertQuestion( this.props.index );
	}

	/**
	 * Handles the remove question button action.
	 *
	 * @returns {void}
	 */
	onRemoveQuestion() {
		this.props.removeQuestion( this.props.index );
	}

	/**
	 * Handle the move up button action.
	 *
	 * @returns {void}
	 */
	onMoveUp() {
		if ( this.props.isFirst ) {
			return;
		}

		this.props.onMoveUp( this.props.index );
	}
	/**
	 * Handle the move down button action.
	 *
	 * @returns {void}
	 */
	onMoveDown() {
		if ( this.props.isLast ) {
			return;
		}

		this.props.onMoveDown( this.props.index );
	}

	/**
	 * The insert and remove question buttons.
	 *
	 * @returns {Component} The buttons.
	 */
	getButtons() {
		const {
			attributes,
		} = this.props;

		return <div className="schema-faq-section-button-container">
			<MediaUpload
				onSelect={ this.onSelectImage }
				type="image"
				value={ attributes.id }
				render={ this.getMediaUploadButton }
			/>
			<IconButton
				className="schema-faq-section-button"
				icon="trash"
				label={ __( "Delete question", "wordpress-seo" ) }
				onClick={ this.onRemoveQuestion }
			/>
			<IconButton
				className="schema-faq-section-button"
				icon="insert"
				label={ __( "Insert question", "wordpress-seo" ) }
				onClick={ this.onInsertQuestion }
			/>
		</div>;
	}

	/**
	 * The mover buttons.
	 *
	 * @returns {Component} The buttons.
	 */
	getMover() {
		return <div className="schema-faq-section-mover">
			<IconButton
				className="editor-block-mover__control"
				onClick={ this.onMoveUp }
				icon="arrow-up-alt2"
				label={ __( "Move question up", "wordpress-seo" ) }
				aria-disabled={ this.props.isFirst }
			/>
			<IconButton
				className="editor-block-mover__control"
				onClick={ this.onMoveDown }
				icon="arrow-down-alt2"
				label={ __( "Move question down", "wordpress-seo" ) }
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
			attributes: {
				answer,
				question,
			},
			index,
		} = this.props;

		let newAnswer = answer.slice();
		const image   = <img key={ media.id } alt={ media.alt } src={ media.url } />;

		if ( newAnswer.push ) {
			newAnswer.push( image );
		} else {
			newAnswer = [ newAnswer, image ];
		}

		this.props.onChange( question, newAnswer, question, answer, index );
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
	 * Returns the component of the given question and answer to be rendered in a WordPress post
	 * (e.g. not in the editor).
	 *
	 * @param {object} question The question and its answer.
	 *
	 * @returns {Component} The component to be rendered.
	 */
	static Content( question ) {
		return (
			<div className={ "schema-faq-section" } key={ question.id }>
				<RichTextWithAppendedSpace
					tagName="strong"
					className="schema-faq-question"
					key={ question.id + "-question" }
					value={ question.question }
				/>
				<RichTextWithAppendedSpace
					tagName="p"
					className="schema-faq-answer"
					key={ question.id + "-answer" }
					value={ question.answer }
				/>
			</div>
		);
	}

	/**
	 * Perform a shallow equal to prevent every step from being rerendered.
	 *
	 * @param {object} nextProps The next props the component will receive.
	 *
	 * @returns {boolean} Whether or not the component should perform an update.
	 */
	shouldComponentUpdate( nextProps ) {
		if ( ! isShallowEqual( nextProps, this.props ) ) {
			return true;
		}
		return false;
	}

	/**
	 * Renders this component.
	 *
	 * @returns {Component} The how-to step editor.
	 */
	render() {
		const {
			subElement,
			attributes,
			isSelected,
		} = this.props;

		const {
			id,
			question,
			answer,
		} = attributes;

		return (
			<div className="schema-faq-section" key={ id }>
				<RichText
					className="schema-faq-question"
					tagName="p"
					unstableOnSetup={ this.setQuestionRef }
					key={ id + "-question" }
					value={ question }
					onChange={ this.onChangeQuestion }
					isSelected={ isSelected && subElement === "question" }
					setFocusedElement={ this.onFocusQuestion }
					placeholder={ __( "Enter a question", "wordpress-seo" ) }
					keepPlaceholderOnFocus={ true }
					formattingControls={ [ "italic", "strikethrough", "link" ] }
				/>
				<RichText
					className="schema-faq-answer"
					tagName="p"
					unstableOnSetup={ this.setAnswerRef }
					key={ id + "-answer" }
					value={ answer }
					onChange={ this.onChangeAnswer }
					isSelected={ isSelected && subElement === "answer" }
					setFocusedElement={ this.onFocusAnswer }
					placeholder={ __( "Enter the answer to the question", "wordpress-seo" ) }
					keepPlaceholderOnFocus={ true }
				/>
				{ isSelected &&
					<div className="schema-faq-section-controls-container">
						{ this.getMover() }
						{ this.getButtons() }
					</div>
				}
			</div>
		);
	}
}

Question.propTypes = {
	index: PropTypes.number.isRequired,
	attributes: PropTypes.object.isRequired,
	onChange: PropTypes.func.isRequired,
	insertQuestion: PropTypes.func.isRequired,
	removeQuestion: PropTypes.func.isRequired,
	onFocus: PropTypes.func.isRequired,
	editorRef: PropTypes.func.isRequired,
	onMoveUp: PropTypes.func.isRequired,
	onMoveDown: PropTypes.func.isRequired,
	subElement: PropTypes.string.isRequired,
	isSelected: PropTypes.bool.isRequired,
	isFirst: PropTypes.bool.isRequired,
	isLast: PropTypes.bool.isRequired,
};
