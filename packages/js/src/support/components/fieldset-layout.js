import { FieldsetLayout as PureFieldsetLayout } from "../../shared-admin/components/fieldset-layout";
import { useSelectSupport } from "../hooks";

/**
 * @param {Object} props Component props.
 * @param {string} [props.id=undefined] The ID.
 * @param {React.ReactNode} props.children The children nodes.
 * @param {React.ReactNode} props.title The title.
 * @param {React.ReactNode} [props.description=null] The description.
 *
 * @returns {JSX.Element} The FieldsetLayout element.
 */
export const FieldsetLayout = ( {
	id = undefined,
	children,
	title,
	description = null,
} ) => {
	const isPremium = useSelectSupport( "selectPreference", [], "isPremium" );

	return (
		<PureFieldsetLayout
			id={ id }
			title={ title }
			description={ description }
			variant={ isPremium ? "lg" : "xl" }
		>
			{ children }
		</PureFieldsetLayout>
	);
};
