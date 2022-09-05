import PropTypes from "prop-types";

/**
 * @param {JSX.node} children The content.
 * @param {Object} [props] Optional extra props.
 * @returns {JSX.Element} The Code element.
 */
const Code = ( { children, ...props } ) => (
	<code className="yst-code" { ...props }>
		{ children }
	</code>
);

Code.propTypes = {
	children: PropTypes.node.isRequired,
};

export default Code;
