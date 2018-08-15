import PropTypes from "prop-types";
import { stripHTML } from "../../../helpers/stringHelpers";
import isArray from "lodash/isArray";

const { Component, renderToString } = window.wp.element;
const { __ } = window.wp.i18n;
const { IconButton } = window.wp.components;
const { RichText, MediaUpload } = window.wp.editor;
const { getBlockContent } = window.wp.blocks;

/**
 * A Question and answer pair within a FAQ block.
 */
export default class Question extends Component {

	/**
	 * Constructs a Question editor component.
	 *
	 * @param {Object} props This component's properties.
	 *
	 * @returns {void}
	 */
	constructor( props ) {
		super( props );
	}

	/**
	 * The insert and remove question buttons.
	 *
	 * @returns {Component} The buttons.
	 */
	getButtons() {
		const {
			index,
			focusPart,
			attributes,
			removeQuestion,
			insertQuestion,
		} = this.props;

		return <div className="schema-faq-question-button-container">
			<MediaUpload
				onSelect={ ( media ) => this.onSelectImage( media ) }
				type="image"
				value={ attributes.id }
				render={ ( { open } ) => (
					<IconButton
						className="schema-faq-question-button editor-inserter__toggle faq-question-add-media"
						icon="insert"
						onClick={ open }
					>
						{ __( "Add image", "wordpress-seo" ) }
					</IconButton>
				) }
			/>
			<IconButton
				className="schema-faq-question-button editor-inserter__toggle"
				icon="trash"
				label={ __( "Delete step", "wordpress-seo" ) }
				onClick={ removeQuestion }
			>
			</IconButton>
			<IconButton
				className="schema-faq-question-button editor-inserter__toggle"
				icon="insert"
				label={ __( "Insert step", "wordpress-seo" ) }
				onClick={ () => insertQuestion( index ) }
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
		return <div className="schema-faq-question-mover">
			{ ! this.props.isFirst &&
			<IconButton
				className="editor-block-mover__control"
				onClick={ this.props.onMoveUp }
				icon="arrow-up-alt2"
				label={ __( "Move question up", "wordpress-seo" ) }
			/>
			}
			{ ! this.props.isLast &&
			<IconButton
				className="editor-block-mover__control"
				onClick={ this.props.onMoveDown }
				icon="arrow-down-alt2"
				label={ __( "Move question down", "wordpress-seo" ) }
			/>
			}
		</div>;
	}

	/**
	 * Callback when an image from the media library has been selected.
	 *
	 * @param {Object} media      The selected image.
	 * @param {string} targetPart The target part (question/answer) to push the image to.
	 *
	 * @returns {void}
	 */
	onSelectImage( media ) {
		const { question, answer } = this.props.attributes;

		let newAnswer = answer.slice();
		let image     = <img key={ media.id } alt={ media.alt } src={ media.url } />;

		if ( newAnswer.push ) {
			newAnswer.push( image );
		} else {
			newAnswer = [ newAnswer, image ];
		}

		this.props.onChange( question, newAnswer, question, answer );
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
	 * Generates a JSON-LD representation of the given How-to step.
	 *
	 * @param {object} question          The question.
	 * @param {array}  question.question The array with contents of this question's question.
	 * @param {array}  question.answer   The array with contents of this question's answer.
	 * @param {number} index             The index of the question in the FAQ block (or section).
	 *
	 * @returns {Object} the JSON-LD representation of the given question.
	 */
	static toJSONLD( question, index ) {
		let jsonLD = {
			"@type": "Question",
			name: stripHTML( renderToString( question.question ) ),
			answerCount: "1",
			acceptedAnswer: {
				"@type": "Answer",
				text: stripHTML( renderToString( question.answer ) ),
			},
			position: ( index + 1 ).toString(),
			text: stripHTML( renderToString( question.question ) ),
		};
		let imageSrc = Question.getImageSrc( question.question );

		if ( imageSrc ) {
			jsonLD.associatedMedia = {
				"@type": "ImageObject",
				contentUrl: imageSrc,
			};
		}

		let imageSrcAnswer = Question.getImageSrc( question.answer );

		if ( imageSrcAnswer ) {
			jsonLD.acceptedAnswer.associatedMedia = {
				"@type": "ImageObject",
				contentUrl: imageSrcAnswer,
			};
		}

		return jsonLD;
	}

	/**
	 * Returns the component of the given question and answer to be rendered in a WordPress post
	 * (e.g. not in the editor).
	 *
	 * @param {object} question The question and its answer.
	 *
	 * @returns {Component} the component to be rendered.
	 */
	static getContent( question ) {
		return(
			<div className={ "schema-faq-question" } key={ question.id }>
				<RichText.Content
					tagName="h3"
					className="schema-faq-question-question"
					key={ question.id + "-question" }
					value={ question.question }
				/>
				<RichText.Content
					tagName="p"
					className="schema-faq-question-answer"
					key={ question.id + "-answer" }
					value={ question.answer }
				/>
			</div>
		);
	}

	/**
	 * Renders this component.
	 *
	 * @returns {Component} The how-to step editor.
	 */
	render() {
		let {
			focusElement,
			index,
			attributes,
			onChange,
			onFocus,
			isSelected,
			editorRef,
		} = this.props;

		let { id, question, answer } = attributes;

		return (
			<div className="schema-faq-question" key={ id } >
				<RichText
					className="schema-faq-question-question"
					tagName="h3"
					onSetup={ ( ref ) => editorRef( 'question', ref ) }
					key={ id + "-question" }
					value={ question }
					onChange={ ( value ) => onChange( value, answer, question, answer ) }
					isSelected={ focusElement === `${ index }:question` }
					setFocusedElement={ () => onFocus( 'question' ) }
					placeholder={ __( "Enter a question", "wordpress-seo" ) }
					keepPlaceholderOnFocus={ true }
				/>
				<RichText
					className="schema-faq-question-answer"
					tagName="p"
					onSetup={  ( ref ) => editorRef( 'answer', ref )  }
					key={ id + "-answer" }
					value={ answer }
					onChange={ ( value ) => onChange( question, value, question, answer ) }
					isSelected={ focusElement === `${ index }:answer` }
					setFocusedElement={ () => onFocus( 'answer' ) }
					placeholder={ __( "Enter the answer to the question", "wordpress-seo" ) }
					keepPlaceholderOnFocus={ true }
				/>
				{ isSelected && this.getButtons() }
				{ isSelected && this.getMover() }
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

	focus: PropTypes.string,
	isSelected: PropTypes.bool,
	isFirst: PropTypes.bool,
	isLast: PropTypes.bool,
};
