import { Fragment, useMemo } from "@wordpress/element";
import { last } from "lodash";

/**
 * @param {Object} props Component props.
 * @param {string[]} props.texts Array of text strings to render in multi-line format.
 * @param {string} props.id An unique identifier id to use in keying.
 * @param {(string|import("react").ElementType)} [props.as="p"] Component to render as.
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

export default MultiLineText;
