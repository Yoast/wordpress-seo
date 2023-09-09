import { checkForMetaboxWarnings  } from "../../helpers/checkForMetaboxWarnings";
/**
 * Adds a check  for any warnings in the metabox before rendering the component.
 * @param {JSX.ElementClass} Component The component.
 * @returns {JSX.ElementClass} The wrapped component.
 */
export const withMetaboxWarningsCheck = ( Component ) => {
	/**
	 * @param {Object} props The props.
	 * @returns {JSX.Element} The element.
	 */
	const MetaboxWarningsCheck = ( props ) => {
		return (
			! checkForMetaboxWarnings() &&
				<Component
					{ ...props }
				/>
		);
	};

	return MetaboxWarningsCheck;
};
