import { Badge } from "@yoast/ui-library";
import { useDisabledMessage } from "../hooks";

/**
 * Adds disabled message support around a component.
 * @param {JSX.ElementClass} Component The component.
 * @returns {JSX.ElementClass} The wrapped component.
 */
const withDisabledMessageSupport = ( Component ) => {
	/**
	 * @param {Object} props The props.
	 * @param {string} props.name The field name.
	 *
	 * @returns {JSX.Element} The element.
	 */
	const WithDisabledMessageSupport = ( { name, ...props } ) => {
		const { isDisabled, message } = useDisabledMessage( { name } );

		if ( isDisabled ) {
			return (
				<div>
					<Badge variant="plain" size="small" className="yst-mb-2">{ message }</Badge>
					<Component
						name={ name }
						{ ...props }
						disabled={ true }
					/>
				</div>

			);
		}
		return <Component name={ name } { ...props } />;
	};

	return WithDisabledMessageSupport;
};

export default withDisabledMessageSupport;
