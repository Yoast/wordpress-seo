import React from 'react';

/**
 *  Represents a piece of HTML. This can be useful on the opening and closing screen of the wizard, to add some
 *  introduction text, a success message or CTA towards the end.
 *
 * @param {Object} props The properties to use.
 * @returns {JSX}
 * @constructor
 */
const HTML = ( props ) => {
	return (
		<div dangerouslySetInnerHTML={{__html: props.properties.html}}></div>
	);
};


HTML.propTypes = {
	properties: React.PropTypes.object.isRequired
};

HTML.defaultProps = {
	properties: {
		html: ''
	}
};

export default HTML;
