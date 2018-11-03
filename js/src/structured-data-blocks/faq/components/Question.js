/* External dependencies */
import React from "react";
import PropTypes from "prop-types";
import { __ } from "@wordpress/i18n";

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
	 * The insert and remove question buttons.
	 *
	 * @returns {Component} The buttons.
	 */
	getButtons() {
		const {
			attributes,
			removeQuestion,
			insertQuestion,
		} = this.props;

		return <div className="schema-faq-section-button-container">
			<MediaUpload
				onSelect={ ( media ) => this.onSelectImage( media ) }
				type="image"
				value={ attributes.id }
				render={ ( { open } ) => (
					<IconButton
						className="schema-faq-section-button editor-inserter__toggle faq-section-add-media"
						icon="insert"
						onClick={ open }
					>
						{ __( "Add image", "wordpress-seo" ) }
					</IconButton>
				) }
			/>
			<IconButton
				className="schema-faq-section-button editor-inserter__toggle"
				icon="trash"
				label={ __( "Delete question", "wordpress-seo" ) }
				onClick={ removeQuestion }
			/>
			<IconButton
				className="schema-faq-section-button editor-inserter__toggle"
				icon="insert"
				label={ __( "Insert question", "wordpress-seo" ) }
				onClick={ insertQuestion }
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
				onClick={ this.props.isFirst ? null : this.props.onMoveUp }
				icon="arrow-up-alt2"
				label={ __( "Move question up", "wordpress-seo" ) }
				aria-disabled={ this.props.isFirst }
			/>
			<IconButton
				className="editor-block-mover__control"
				onClick={ this.props.isLast ? null : this.props.onMoveDown }
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
		const { question, answer } = this.props.attributes;

		let newAnswer = answer.slice();
		const image   = <img key={ media.id } alt={ media.alt } src={ media.url } />;

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
	 * Renders this component.
	 *
	 * @returns {Component} The how-to step editor.
	 */
	render() {
		const {
			subElement,
			attributes,
			onChange,
			onFocus,
			isSelected,
			editorRef,
		} = this.props;

		const { id, question, answer } = attributes;

		return (
			<div className="schema-faq-section" key={ id }>
				<RichText
					className="schema-faq-question"
					tagName="p"
					unstableOnSetup={ ( ref ) => editorRef( "question", ref ) }
					key={ id + "-question" }
					value={ question }
					onChange={ ( value ) => onChange( value, answer, question, answer ) }
					isSelected={ isSelected && subElement === "question" }
					setFocusedElement={ () => onFocus( "question" ) }
					placeholder={ __( "Enter a question", "wordpress-seo" ) }
					keepPlaceholderOnFocus={ true }
					formattingControls={ [ "italic", "strikethrough", "link" ] }
				/>
				<RichText
					className="schema-faq-answer"
					tagName="p"
					unstableOnSetup={  ( ref ) => editorRef( "answer", ref )  }
					key={ id + "-answer" }
					value={ answer }
					onChange={ ( value ) => onChange( question, value, question, answer ) }
					isSelected={ isSelected && subElement === "answer" }
					setFocusedElement={ () => onFocus( "answer" ) }
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
	attributes: PropTypes.object.isRequired,
	onChange: PropTypes.func.isRequired,
	insertQuestion: PropTypes.func.isRequired,
	removeQuestion: PropTypes.func.isRequired,
	onFocus: PropTypes.func.isRequired,
	editorRef: PropTypes.func.isRequired,
	onMoveUp: PropTypes.func.isRequired,
	onMoveDown: PropTypes.func.isRequired,
	subElement: PropTypes.string,
	focus: PropTypes.string,
	isSelected: PropTypes.bool,
	isFirst: PropTypes.bool,
	isLast: PropTypes.bool,
};
