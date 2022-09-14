import { Title } from "@yoast/ui-library";
import PropTypes from "prop-types";

/**
 * @param {string} [id] The ID.
 * @param {JSX.ElementClass} [as] The field component.
 * @param {JSX.node} children The children nodes.
 * @param {JSX.node} title The title.
 * @param {JSX.node} [description] The description.
 * @returns {JSX.Element} The form layout component.
 */
const FieldsetLayout = ( {
	// eslint-disable-next-line no-undefined
	id = undefined,
	as: Component = "fieldset",
	children,
	title,
	description = null,
} ) => {
	return (
		/**
		 * Force min-width of 0px on fieldset element to prevent scaling based on min-content-size prop.
		 * @see https://stackoverflow.com/questions/17408815/fieldset-resizes-wrong-appears-to-have-unremovable-min-width-min-content
		 */
		<Component id={ id } className="yst-min-w-0 lg:yst-grid lg:yst-grid-cols-3 lg:yst-gap-12">
			<div className="lg:yst-col-span-1">
				<div className="yst-max-w-screen-sm">
					<Title as={ Component === "fieldset" ? "legend" : "h3" } size="4">
						{ title }
					</Title>
					{ description && <p className="yst-mt-2">{ description }</p> }
				</div>
			</div>
			<div className="yst-mt-8 lg:yst-mt-0 lg:yst-col-span-2 yst-space-y-8">
				{ children }
			</div>
		</Component>
	);
};

FieldsetLayout.propTypes = {
	id: PropTypes.string,
	as: PropTypes.elementType,
	children: PropTypes.node.isRequired,
	title: PropTypes.node.isRequired,
	description: PropTypes.node,
};

export default FieldsetLayout;
