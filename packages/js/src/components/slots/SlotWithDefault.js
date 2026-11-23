import { Slot } from "@wordpress/components";

/**
 * A slot that has the ability to render its children if no fills are passed.
 *
 * @param {Object} props Component props.
 * @param {string} props.name The name of the slot.
 * @param {React.ReactNode} [props.children=null] The default content to render if no fills are provided.
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
