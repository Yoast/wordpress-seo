/* External dependencies */
import PropTypes from "prop-types";
import { __ } from "@wordpress/i18n";
import { speak } from "@wordpress/a11y";

/* Internal dependencies */
import Question from "./Question";
import appendSpace from "../../../components/higherorder/appendSpace";

import { IconButton } from "@wordpress/components";
import { Component, renderToString } from "@wordpress/element";

const QuestionContentWithAppendedSpace = appendSpace( Question.Content );

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

		this.changeQuestion           = this.changeQuestion.bind( this );
		this.insertQuestion           = this.insertQuestion.bind( this );
		this.removeQuestion           = this.removeQuestion.bind( this );
		this.swapQuestions            = this.swapQuestions.bind( this );
		this.moveQuestionDown         = this.moveQuestionDown.bind( this );
		this.moveQuestionUp           = this.moveQuestionUp.bind( this );
		this.setFocus                 = this.setFocus.bind( this );
		this.onAddQuestionButtonClick = this.onAddQuestionButtonClick.bind( this );
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
	 * Handles the add question button action.
	 *
	 * This function is necessary because insertQuestion should be called without any arguments to make sure the
	 * question is added in the right position.
	 *
	 * @returns {void}
	 */
	onAddQuestionButtonClick() {
		this.insertQuestion( null, [], [], false );
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
		const questions = this.props.attributes.questions ? this.props.attributes.questions.slice() : [];

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
			jsonQuestion: renderToString( newQuestion ),
			jsonAnswer: renderToString( newAnswer ),
		};

		const imageSrc = Question.getImageSrc( newAnswer );
		if ( imageSrc ) {
			questions[ index ].jsonImageSrc = imageSrc;
		}

		this.props.setAttributes( { questions } );
	}

	/**
	 * Inserts an empty Question into a FAQ block at the given index.
	 *
	 * @param {number}       [index]      Optional. The index of the Question after which a new Question should be added.
	 * @param {array|string} [question]   Optional. The question of the new Question. Default: empty.
	 * @param {array|string} [answer]     Optional. The answer of the new Question. Default: empty.
	 * @param {bool}         [focus=true] Optional. Whether or not to focus the new Question. Default: true.
	 *
	 * @returns {void}
	 */
	insertQuestion( index = null, question = [], answer = [], focus = true ) {
		const questions = this.props.attributes.questions ? this.props.attributes.questions.slice() : [];

		if ( index === null ) {
			index = questions.length - 1;
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
			setTimeout( this.setFocus.bind( this, "question", index ) );
			// When moving focus to a newly created question, return and don't use the speak() message.
			return;
		}

		speak( __( "New question added", "wordpress-seo" ) );
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
		const questions = this.props.attributes.questions ? this.props.attributes.questions.slice() : [];
		const question  = questions[ index1 ];

		questions[ index1 ] = questions[ index2 ];
		questions[ index2 ] = question;

		this.props.setAttributes( { questions } );

		const [ focusIndex, subElement ] = this.state.focus.split( ":" );
		if ( focusIndex === `${ index1 }` ) {
			this.setFocus( subElement, index2 );
		} else if ( focusIndex === `${ index2 }` ) {
			this.setFocus( subElement, index1 );
		}
	}

	/**
	 * Swap the question with the one above it.
	 *
	 * @param {number} index Index of the question to move.
	 *
	 * @returns {void}
	 */
	moveQuestionUp( index ) {
		this.swapQuestions( index, index - 1 );
	}

	/**
	 * Swap the question with the one below it.
	 *
	 * @param {number} index Index of the question to move.
	 *
	 * @returns {void}
	 */
	moveQuestionDown( index ) {
		this.swapQuestions( index, index + 1 );
	}

	/**
	 * Removes a Question from a FAQ block.
	 *
	 * @param {number} index The index of the Question that needs to be removed.
	 *
	 * @returns {void}
	 */
	removeQuestion( index ) {
		const questions = this.props.attributes.questions ? this.props.attributes.questions.slice() : [];

		questions.splice( index, 1 );
		this.props.setAttributes( { questions } );

		let fieldToFocus = 0;
		if ( questions[ index ] ) {
			fieldToFocus = index;
		} else if ( questions[ index - 1 ] ) {
			fieldToFocus = index - 1;
		}

		this.setFocus( "question", fieldToFocus );
	}
	/**
	 * Sets the focus to a specific QA pair in the FAQ block.
	 *
	 * @param {number|string} part  The name of the element to focus.
	 * @param {number}        index The index of the question to focus.
	 *
	 * @returns {void}
	 */
	setFocus( part, index ) {
		const elementToFocus = `${ index }:${ part }`;

		if ( elementToFocus === this.state.focus ) {
			return;
		}

		this.setState( { focus: elementToFocus } );
	}

	/**
	 * Retrieves a button to add a question at the end of the FAQ list.
	 *
	 * @returns {Component} The button to add a question.
	 */
	getAddQuestionButton() {
		return (
			<IconButton
				icon="insert"
				onClick={ this.onAddQuestionButtonClick }
				className="schema-faq-add-question"
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
		const { attributes } = this.props;

		if ( ! attributes.questions ) {
			return null;
		}

		const [ focusIndex ] = this.state.focus.split( ":" );

		return (
			attributes.questions.map(
				( question, index ) => {
					return (
						<Question
							index={ index }
							key={ question.id }
							attributes={ question }
							insertQuestion={ this.insertQuestion }
							removeQuestion={ this.removeQuestion }
							onChange={ this.changeQuestion }
							onFocus={ this.setFocus }
							isSelected={ focusIndex === `${ index }` }
							onMoveUp={ this.moveQuestionUp }
							onMoveDown={ this.moveQuestionDown }
							isFirst={ index === 0 }
							isLast={ index === attributes.questions.length - 1 }
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
		const { questions, className } = attributes;

		const questionList = questions ? questions.map( ( question, index ) =>
			<QuestionContentWithAppendedSpace key={ index } { ...question } />
		) : null;

		const classNames = [ "schema-faq", className ].filter( ( i ) => i ).join( " " );

		return (
			<div className={ classNames }>
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
		const { className } = this.props;

		const classNames = [ "schema-faq", className ].filter( ( i ) => i ).join( " " );

		return (
			<div className={ classNames }>
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

FAQ.defaultProps = {
	className: "",
};
