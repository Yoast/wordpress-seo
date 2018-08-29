/* External dependencies */
import React from "react";
import PropTypes from "prop-types";
import isUndefined from "lodash/isUndefined";
import { __ } from "@wordpress/i18n";

/* Internal dependencies */
import Question from "./Question";
import { stripHTML } from "../../../helpers/stringHelpers";

const { RichText } = window.wp.editor;
const { IconButton } = window.wp.components;
const { Component, renderToString } = window.wp.element;

/**
 * A FAQ block component.
 */
export default class FAQ extends Component {

	/**
	 * Constructs a FAQ editor component.
	 *
	 * @param {Object} props This component's properties.
	 *
	 * @returns {void}
	 */
	constructor( props ) {
		super( props );

		this.state = { focus: "" };

		this.changeQuestion = this.changeQuestion.bind( this );
		this.insertQuestion = this.insertQuestion.bind( this );
		this.removeQuestion = this.removeQuestion.bind( this );
		this.swapQuestions = this.swapQuestions.bind( this );

		this.setFocus = this.setFocus.bind( this );

		this.editorRefs = {};
	}

	/**
	 * Generates a pseudo-unique" id.
	 *
	 * @param {string} prefix An (optional) prefix to use.
	 *
	 * @returns {string} A pseudo-unique string, consisting of the optional prefix + the curent time in milliseconds.
	 */
	static generateId( prefix ) {
		return `${ prefix }-${ new Date().getTime() }`;
	}

	/**
	 * Replaces the FAQ Question with the given index.
	 *
	 * @param {array|string} newQuestion      The new contents of the question.
	 * @param {array|string} newAnswer        The new contents of the answer to this question.
	 * @param {array}        previousQuestion The old question.
	 * @param {array}        previousAnswer   The old answer.
	 * @param {number}       index            The index of the question that needs to be changed.
	 *
	 * @returns {void}
	 */
	changeQuestion( newQuestion, newAnswer, previousQuestion, previousAnswer, index ) {
		let questions = this.props.attributes.questions ? this.props.attributes.questions.slice() : [];

		if ( index >= questions.length ) {
			return;
		}

		if ( questions[ index ].question !== previousQuestion || questions[ index ].answer !== previousAnswer ) {
			return;
		}

		questions[ index ] = {
			id: questions[ index ].id,
			question: newQuestion,
			answer: newAnswer,
			jsonQuestion: stripHTML( renderToString( newQuestion ) ),
			jsonAnswer: stripHTML( renderToString( newAnswer ) ),
		};

		let imageSrc = Question.getImageSrc( newAnswer );
		if ( imageSrc ) {
			questions[ index ].jsonImageSrc = imageSrc;
		}

		this.props.setAttributes( { questions } );
	}

	/**
	 * Inserts an empty Question into a FAQ block at the given index.
	 *
	 * @param {number}       [index]      The index of the Question after which a new Question should be added.
	 * @param {array|string} [question]   The question of the new Question.
	 * @param {array|string} [answer]     The answer of the new Question.
	 * @param {bool}         [focus=true] Whether or not to focus the new Question.
	 *
	 * @returns {void}
	 */
	insertQuestion( index, question = [], answer = [], focus = true ) {
		let questions = this.props.attributes.questions ? this.props.attributes.questions.slice() : [];

		if ( isUndefined( index ) ) {
			index = questions.length - 1;
		}

		let lastIndex = questions.length - 1;
		while ( lastIndex > index ) {
			this.editorRefs[ `${ lastIndex + 1 }:question` ] = this.editorRefs[ `${ lastIndex }:question` ];
			this.editorRefs[ `${ lastIndex + 1}:answer` ]    = this.editorRefs[ `${ lastIndex }:answer` ];
			lastIndex--;
		}

		questions.splice( index + 1, 0, {
			id: FAQ.generateId( "faq-question" ),
			question,
			answer,
			jsonQuestion: "",
			jsonAnswer: "",
		} );

		this.props.setAttributes( { questions } );

		if ( focus ) {
			setTimeout( this.setFocus.bind( this, `${ index + 1 }:question` ) );
		}
	}

	/**
	 * Swaps two questions in the FAQ block.
	 *
	 * @param {number} index1 The index of the first question.
	 * @param {number} index2 The index of the second question.
	 *
	 * @returns {void}
	 */
	swapQuestions( index1, index2 ) {
		let questions = this.props.attributes.questions ? this.props.attributes.questions.slice() : [];
		let question  = questions[ index1 ];

		questions[ index1 ] = questions[ index2 ];
		questions[ index2 ] = question;

		const QuestionEditorRef = this.editorRefs[ `${ index1 }:question` ];
		this.editorRefs[ `${ index1 }:question` ] = this.editorRefs[ `${ index2 }:question` ];
		this.editorRefs[ `${ index2 }:question` ] = QuestionEditorRef;
		const AnswerEditorRef = this.editorRefs[ `${ index1 }:answer` ];
		this.editorRefs[ `${ index1 }:answer` ] = this.editorRefs[ `${ index2 }:answer` ];
		this.editorRefs[ `${ index2 }:answer` ] = AnswerEditorRef;

		this.props.setAttributes( { questions } );

		let [ focusIndex, subElement ] = this.state.focus.split( ":" );
		if ( focusIndex === `${ index1 }` ) {
			this.setFocus( `${ index2 }:${ subElement }` );
		} else if ( focusIndex === `${ index2 }` ) {
			this.setFocus( `${ index1 }:${ subElement }` );
		}
	}

	/**
	 * Removes a Question from a FAQ block.
	 *
	 * @param {number} index The index of the Question that needs to be removed.
	 *
	 * @returns {void}
	 */
	removeQuestion( index ) {
		let questions = this.props.attributes.questions ? this.props.attributes.questions.slice() : [];

		questions.splice( index, 1 );
		this.props.setAttributes( { questions } );

		delete this.editorRefs[ `${ index }:question` ];
		delete this.editorRefs[ `${ index }:answer` ];

		let nextIndex = index + 1;
		while ( this.editorRefs[ `${ nextIndex }:question` ] || this.editorRefs[ `${ nextIndex }:answer` ] ) {
			this.editorRefs[ `${ nextIndex - 1 }:question` ] = this.editorRefs[ `${ nextIndex }:question` ];
			this.editorRefs[ `${ nextIndex - 1 }:answer` ] = this.editorRefs[ `${ nextIndex }:answer` ];
			nextIndex++;
		}

		const deletedIndex = questions.length;
		delete this.editorRefs[ `${ deletedIndex }:question` ];
		delete this.editorRefs[ `${ deletedIndex }:answer` ];

		let fieldToFocus = "title";
		if ( this.editorRefs[ `${ index }:question` ] ) {
			fieldToFocus = `${ index }:question`;
		} else if ( this.editorRefs[ `${ index - 1 }:answer` ] ) {
			fieldToFocus = `${ index - 1 }:answer`;
		}

		this.setFocus( fieldToFocus );
	}
	/**
	 * Sets the focus to a specific QA pair in the FAQ block.
	 *
	 * @param {number|string} elementToFocus The element to focus, either the index of the Question that should be in focus or name of the input.
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
	 * Retrieves a button to add a step to the front of the list.
	 *
	 * @returns {Component} The button for adding add a step.
	 */
	getAddQuestionButton() {
		return (
			<IconButton
				icon="insert"
				onClick={ () => this.insertQuestion() }
				className="editor-inserter__toggle"
			>
				{ __( "Add question", "wordpress-seo" ) }
			</IconButton>
		);
	}

	/**
	 * Retrieves a list of questions.
	 *
	 * @returns {array} List of questions.
	 */
	getQuestions() {
		let { attributes } = this.props;

		if ( ! attributes.questions ) {
			return null;
		}

		let [ focusIndex, subElement ] = this.state.focus.split( ":" );

		return(
			attributes.questions.map(
				( question, index ) => {
					return(
						<Question
							key={ question.id }
							attributes={ question }
							insertQuestion={ () => this.insertQuestion( index ) }
							removeQuestion={ () => this.removeQuestion( index ) }
							editorRef={ ( part, ref ) => {
								this.editorRefs[ `${ index }:${ part }` ] = ref;
							} }
							onChange={
								( question, answer, prevQuestion, prevAnswer ) =>
									this.changeQuestion( question, answer, prevQuestion, prevAnswer, index )
							}
							onFocus={ ( part ) => this.setFocus( `${ index }:${ part }` ) }
							isSelected={ focusIndex === `${ index }` }
							subElement={ subElement }
							onMoveUp={ () => this.swapQuestions( index, index - 1 ) }
							onMoveDown={ () => this.swapQuestions( index, index + 1 ) }
							isFirst={ index === 0 }
							isLast={ index === attributes.questions.length-1 }
						/>
					);
				}
			)
		);
	}

	/**
	 * Returns the component to be used to render
	 * the FAQ block on Wordpress (e.g. not in the editor).
	 *
	 * @param {object} attributes The attributes of the FAQ block.
	 *
	 * @returns {Component} The component representing a FAQ block.
	 */
	static Content( attributes ) {
		let { title, questions, className } = attributes;

		let questionList = questions ? questions.map( ( question ) =>
			<Question.Content { ...question } />
		) : null;

		const classNames = [ "schema-faq", className ].filter( ( i ) => i ).join( " " );

		return (
			<div className={ classNames }>
				<RichText.Content
					tagName="strong"
					className="schema-faq-title"
					value={ title }
					id={ stripHTML( renderToString( title ) ).toLowerCase().replace( /\s+/g, "-" ) }
				/>
				{ questionList }
			</div>
		);
	}

	/**
	 * Renders this component.
	 *
	 * @returns {Component} The FAQ block editor.
	 */
	render() {
		let { attributes, setAttributes, className } = this.props;

		const classNames = [ "schema-faq", className ].filter( ( i ) => i ).join( " " );

		return (
			<div className={ classNames }>
				<RichText
					tagName="strong"
					className="schema-faq-title"
					value={ attributes.title }
					isSelected={ this.state.focus === "title" }
					setFocusedElement={ () => this.setFocus( "title" ) }
					onChange={ ( title ) => setAttributes( { title, jsonTitle: stripHTML( renderToString( title ) ) } ) }
					onSetup={ ( ref ) => {
						this.editorRefs.title = ref;
					} }
					placeholder={ __( "Enter a title for your FAQ section", "wordpress-seo" ) }
					keepPlaceholderOnFocus={ true }
				/>
				<div>
					{ this.getQuestions() }
				</div>
				<div className="schema-faq-buttons">{ this.getAddQuestionButton() }</div>
			</div>
		);
	}
}

FAQ.propTypes = {
	attributes: PropTypes.object.isRequired,
	setAttributes: PropTypes.func.isRequired,
	className: PropTypes.string,
};
