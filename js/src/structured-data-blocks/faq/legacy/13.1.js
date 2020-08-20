/* External dependencies */
import PropTypes from "prop-types";

const { RichText } = window.wp.editor;

/* Internal dependencies */
import appendSpace from "../../../components/higherorder/appendSpace";

/**
 * This migration is necessary because the HTML markup changed, because in 13.1
 *  an id attribute was added to the FAQ section.
 *
 * See https://github.com/Yoast/wordpress-seo/issues/13166.
 */

/**
 * Returns the component of the given question and answer to be rendered in a WordPress post
 * (e.g. not in the editor).
 *
 * @param {object} question The question and its answer.
 *
 * @returns {Component} The component to be rendered.
 */
function LegacyQuestion( question ) {
	const RichTextWithAppendedSpace = appendSpace( RichText.Content );

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
 * Returns the component to be used to render
 * the FAQ block on Wordpress (e.g. not in the editor).
 *
 * @param {object} props The props with attributes of the FAQ block.
 *
 * @returns {Component} The component representing a FAQ block.
 */
export default function LegacyFaq( props ) {
	const { questions, className } = props.attributes;

	const QuestionContentWithAppendedSpace = appendSpace( LegacyQuestion );

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

LegacyFaq.propTypes = {
	attributes: PropTypes.object.isRequired,
};
