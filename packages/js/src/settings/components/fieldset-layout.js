import PropTypes from "prop-types";
import { Title } from "@yoast/ui-library";

/**
 * @param {JSX.Element} children The children nodes.
 * @param {JSX.Element} title The title.
 * @param {JSX.Element} description The description.
 * @returns {JSX.Element} The form layout component.
 */
const FieldsetLayout = ( {
	as: Component = "fieldset",
	children,
	title,
	description = null,
} ) => {
	return (
		<Component className="lg:yst-grid lg:yst-grid-cols-3 lg:yst-gap-12">
			<div className="lg:yst-col-span-1">
				<div className="max-w-screen-sm">
					<Title as={ Component === "fieldset" ? "legend" : "h4" } size="4">
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
	as: PropTypes.elementType,
	children: PropTypes.node.isRequired,
	title: PropTypes.node.isRequired,
	description: PropTypes.node,
};

export default FieldsetLayout;
