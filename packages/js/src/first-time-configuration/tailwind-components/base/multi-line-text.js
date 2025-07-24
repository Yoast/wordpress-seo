import { Fragment, useMemo } from "@wordpress/element";
import { last } from "lodash";
import PropTypes from "prop-types";

/**
 * @param {string[]} texts Array of text strings to render in multi-line format.
 * @param {string} id An unique identifier id to use in keying.
 * @param {string|React.ReactNode} [as="p"] Component to render as.
 *
 * @returns {JSX.Element} The MultiLineText component.
 */
const MultiLineText = ( { texts, id, as: Component = "p", ...rest } ) => {
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

MultiLineText.propTypes = {
	texts: PropTypes.arrayOf( PropTypes.string ).isRequired,
	id: PropTypes.string.isRequired,
	as: PropTypes.oneOfType( [ PropTypes.string, PropTypes.elementType ] ),
};

export default MultiLineText;
