import { Slot } from "@wordpress/components";
import PropTypes from "prop-types";

/**
 * A slot that has the ability to render its children if no fills are passed.
 *
 * @param {string} name The name of the slot.
 * @param {React.ReactNode} [children] The default content to render if no fills are provided.
 *
 * @returns {JSX.Element} A Slot with default content.
 */
export default function SlotWithDefault( { name, children = null } ) {
	return <Slot name={ name }>
		{
			( fills ) => {
				return fills.length === 0
					? children
					: fills;
			}
		}
	</Slot>;
}

SlotWithDefault.propTypes = {
	name: PropTypes.string.isRequired,
	children: PropTypes.oneOfType( [ PropTypes.node, PropTypes.arrayOf( PropTypes.node ) ] ),
};
