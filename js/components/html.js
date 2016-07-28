import React from 'react';
import Field from './field';

/**
 * Represents the component for HTML.
 */
class HTML extends Field {

	/**
	 * Gets the html as an object.
	 *
	 * @returns {{__html: (string|*|string|null|string|string)}}
	 */
	getHTML() {
		return { __html: this.state.html} ;
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
