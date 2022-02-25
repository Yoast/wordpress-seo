import PropTypes from "prop-types";
import { Fragment, useMemo } from "@wordpress/element";
import { last } from "lodash";

/**
 * @param {Object} props The props object.
 * @param {string[]} props.texts Array of text strings to render in multi-line format.
 * @param {string} props.id An unique identifier id to use in keying.
 * @param {string|WPElement} props.as Component to render as.
 * @returns {WPElement} The MultiLineText component.
 */
const MultiLineText  = ( { texts, id, as: Component, ...rest } ) => {
	const lastText = useMemo( () => last( texts ), [ texts ] );
	return (
		<Component id={ id } { ...rest }>
			{ texts.map( ( text, index ) => (
				<Fragment key={ `${ id }-text-${ index }` }>
					{ text }
					{ lastText !== text && <br /> }
				</Fragment>
			) ) }
		</Component>
	);
};

MultiLineText.defaultProps = {
	as: "p",
};

MultiLineText.propTypes = {
	texts: PropTypes.arrayOf( PropTypes.string ).isRequired,
	id: PropTypes.string.isRequired,
	as: PropTypes.oneOfType( [ PropTypes.string, PropTypes.elementType ] ),
};

export default MultiLineText;
