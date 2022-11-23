import { useMemo } from "@wordpress/element";
import { Title } from "@yoast/ui-library";
import PropTypes from "prop-types";
import { useSelectSettings } from "../hooks";

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
} ) => {
	const isPremium = useSelectSettings( "selectPreference", [], "isPremium" );

	const responsiveClassNames = useMemo( () => isPremium ? {
		grid: "yst-grid xl:yst-grid-cols-3 xl:yst-gap-12",
		col1: "yst-col-span-1",
		col2: "xl:yst-mt-0 xl:yst-col-span-2",
	} : {
		grid: "yst-grid 2xl:yst-grid-cols-3 2xl:yst-gap-12",
		col1: "yst-col-span-1",
		col2: "2xl:yst-mt-0 2xl:yst-col-span-2",
	}, [ isPremium ] );

	return (
		/**
		 * Force min-width of 0px on fieldset element to prevent scaling based on min-content-size prop.
		 * @see https://stackoverflow.com/questions/17408815/fieldset-resizes-wrong-appears-to-have-unremovable-min-width-min-content
		 */
		<section id={ id } className={ responsiveClassNames.grid }>
			<div className={ responsiveClassNames.col1 }>
				<div className="yst-max-w-screen-sm">
					<Title as="h2" size="4">
						{ title }
					</Title>
					{ description && <p className="yst-mt-2">{ description }</p> }
				</div>
			</div>
			<fieldset className={ `yst-min-w-0 yst-mt-8 ${ responsiveClassNames.col2 }` }>
				<legend className="yst-sr-only">{ title }</legend>
				<div className="yst-space-y-8">
					{ children }
				</div>
			</fieldset>
		</section>
	);
};

FieldsetLayout.propTypes = {
	id: PropTypes.string,
	children: PropTypes.node.isRequired,
	title: PropTypes.node.isRequired,
	description: PropTypes.node,
};

export default FieldsetLayout;
