import { useSelect } from "@wordpress/data";
import { useMemo } from "@wordpress/element";
import { STORE_NAME_INTRODUCTIONS } from "../constants";
import { useIntroductionsContext } from "./provider";

/**
 * @returns {JSX.Element} The element.
 */
export const Introduction = () => {
	const introduction = useSelect( select => select( STORE_NAME_INTRODUCTIONS ).selectCurrentIntroduction(), [] );
	const components = useIntroductionsContext();

	const Component = useMemo( () => components?.[ introduction?.id ], [ introduction, components ] );

	if ( ! Component ) {
		return null;
	}

	return <Component />;
};
