import { Slot } from "@wordpress/components";

/**
 * A slot that has the ability to render its children if no fills are passed.
 *
 * @param {Object} props The props object
 *
 * @returns {wp.Element} A SlotWithDefault component.
 */
export default function SlotWithDefault( props ) {
	return <Slot name={ props.name }>
		{
			( fills ) => {
				return fills.length === 0
					? props.children
					: fills;
			}
		}
	</Slot>;
}
