import { Title } from "@yoast/ui-library";
import PropTypes from "prop-types";

const classNameMap = {
	variant: {
		lg: {
			grid: "yst-grid lg:yst-grid-cols-3 lg:yst-gap-12",
			col1: "yst-col-span-1",
			col2: "lg:yst-mt-0 lg:yst-col-span-2",
		},
		xl: {
			grid: "yst-grid xl:yst-grid-cols-3 xl:yst-gap-12",
			col1: "yst-col-span-1",
			col2: "xl:yst-mt-0 xl:yst-col-span-2",
		},
		"2xl": {
			grid: "yst-grid 2xl:yst-grid-cols-3 2xl:yst-gap-12",
			col1: "yst-col-span-1",
			col2: "2xl:yst-mt-0 2xl:yst-col-span-2",
		},
	},
};

/**
 * @param {string} [id] The ID.
 * @param {React.ReactNode} children The children nodes.
 * @param {React.ReactNode} title The title.
 * @param {React.ReactNode} [description] The description.
 * @param {string} variant The variant that determines the grid breakpoints.
 * @returns {JSX.Element} The FieldsetLayout element.
 */
export const FieldsetLayout = ( {
	// eslint-disable-next-line no-undefined
	id = undefined,
	children,
	title,
	description = null,
	variant = "2xl",
} ) => {
	return (
		/**
		 * Force min-width of 0px on fieldset element to prevent scaling based on min-content-size prop.
		 * @see https://stackoverflow.com/questions/17408815/fieldset-resizes-wrong-appears-to-have-unremovable-min-width-min-content
		 */
		<section id={ id } className={ classNameMap.variant[ variant ].grid }>
			<div className={ classNameMap.variant[ variant ].col1 }>
				<div className="yst-max-w-screen-sm">
					<Title as="h2" size="4">
						{ title }
					</Title>
					{ description && <p className="yst-mt-2">{ description }</p> }
				</div>
			</div>
			<fieldset className={ `yst-min-w-0 yst-mt-8 ${ classNameMap.variant[ variant ].col2 }` }>
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
	variant: PropTypes.oneOf( Object.keys( classNameMap.variant ) ),
};
