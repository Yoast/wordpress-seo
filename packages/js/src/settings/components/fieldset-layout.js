import { Title } from "@yoast/ui-library";
import PropTypes from "prop-types";

/**
 * @param {string} [id] The ID.
 * @param {JSX.node} children The children nodes.
 * @param {JSX.node} title The title.
 * @param {JSX.node} [description] The description.
 * @returns {JSX.Element} The form layout component.
 */
const FieldsetLayout = ( {
	// eslint-disable-next-line no-undefined
	id = undefined,
	children,
	title,
	description = null,
} ) => (
	/**
	 * Force min-width of 0px on fieldset element to prevent scaling based on min-content-size prop.
	 * @see https://stackoverflow.com/questions/17408815/fieldset-resizes-wrong-appears-to-have-unremovable-min-width-min-content
	 */
	<section id={ id } className="lg:yst-grid lg:yst-grid-cols-3 lg:yst-gap-12">
		<div className="lg:yst-col-span-1">
			<div className="yst-max-w-screen-sm">
				<Title as="h2" size="4">
					{ title }
				</Title>
				{ description && <p className="yst-mt-2">{ description }</p> }
			</div>
		</div>
		<fieldset className="yst-min-w-0 yst-mt-8 lg:yst-mt-0 lg:yst-col-span-2">
			<legend className="yst-sr-only">{ title }</legend>
			<div className="yst-space-y-8">
				{ children }
			</div>
		</fieldset>
	</section>
);

FieldsetLayout.propTypes = {
	id: PropTypes.string,
	children: PropTypes.node.isRequired,
	title: PropTypes.node.isRequired,
	description: PropTypes.node,
};

export default FieldsetLayout;
