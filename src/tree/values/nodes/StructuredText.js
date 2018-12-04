/**
 * Represents a piece of structure that is present in the original text, but is not relevant for the further analysis
 * of the text.
 *
 * Talking about HTML, this would encompass thing like <div>, <section>, <aside>, <fieldset> and other HTML block elements.
 */
class StructuredText {
	/**
	 * Represents a piece of structure that is present in the original text, but is not relevant for the further
	 * analysis of the text.
	 *
	 * Talking about HTML, this would encompass thing like <div>, <section>, <aside>, <fieldset> and other HTML block elements.
	 *
	 * @param {Paragraph|List|Heading[]} children	The sub-elements of the structured text.
	 * @param {string}                   startHtml  The opening tag of the structured text.
	 * @param {string}                   endHtml    The closing tag of the structured text.
	 *
	 * @returns {void}
	 */
	constructor( children, startHtml, endHtml ) {
		this.children = children;
		this.startHtml = startHtml;
		this.endHtml = endHtml;
	}
}
export default StructuredText;
