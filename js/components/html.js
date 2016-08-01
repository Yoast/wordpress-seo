import React from 'react';
import Field from './field';

/**
 *  Represents a piece of HTML. This can be useful on the opening and closing screen of the wizard, to add some
 *  introduction text, a success message or CTA towards the end.
 */
class HTML extends Field {

	/**
	 * Gets the html as an object.
	 *
	 * @returns {{__html: (string|*|string|null|string|string)}}
	 */
	getHTML() {
		return { __html: this.props.html} ;
	}

	/**
	 * Returns the rendered html
	 *
	 * @returns {XML}
	 */
	render() {
		return (
			<div dangerouslySetInnerHTML={this.getHTML()}></div>
		)
	}
}

HTML.propTypes = {
	html: React.PropTypes.string
};

HTML.defaultProps = {
	html: ''
};

export default HTML;
