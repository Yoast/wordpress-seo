import { Fragment } from "@wordpress/element";
import { useRootContext } from "@yoast/ui-library";

/**
 * @returns {JSX.Element} The element.
 */
const RegisteredElements = () => {
	const { elements } = useRootContext();

	return elements.map( ( { key, value } ) => <Fragment key={ key }>{ value }</Fragment> );
};

export default RegisteredElements;
