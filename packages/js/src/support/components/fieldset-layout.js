import PropTypes from "prop-types";
import { FieldsetLayout as PureFieldsetLayout } from "../../shared-admin/components/fieldset-layout";
import { useSelectSupport } from "../hooks";

/**
 * @param {string} [id] The ID.
 * @param {React.ReactNode} children The children nodes.
 * @param {React.ReactNode} title The title.
 * @param {React.ReactNode} [description] The description.
 * @returns {JSX.Element} The FieldsetLayout element.
 */
export const FieldsetLayout = ( {
	// eslint-disable-next-line no-undefined
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

FieldsetLayout.propTypes = {
	id: PropTypes.string,
	children: PropTypes.node.isRequired,
	title: PropTypes.node.isRequired,
	description: PropTypes.node,
};
