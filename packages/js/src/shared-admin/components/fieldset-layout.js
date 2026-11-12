import { Title } from "@yoast/ui-library";

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
 * @param {Object} props Component props.
 * @param {string} [props.id=undefined] The ID.
 * @param {React.ReactNode} props.children The children nodes.
 * @param {React.ReactNode} props.title The title.
 * @param {React.ReactNode} [props.description=null] The description.
 * @param {("lg"|"xl"|"2xl")} [props.variant="2xl"] The variant that determines the grid breakpoints.
 *
 * @returns {JSX.Element} The FieldsetLayout element.
 */
export const FieldsetLayout = ( {
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
