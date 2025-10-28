import PropTypes from "prop-types";

import { PREMIUM_CONTENT_BLOCKS as BENEFITS } from "./ContentBlocks";

/**
 * BenefitItems component to render the list of benefits.
 * @param {string} id The id for the benefit items.
 * @returns {JSX.Element} The BenefitItems component.
 */
export const BenefitItems = ( { id } ) => {
	return (
		<ul className="yst-my-2">
			{ BENEFITS.map( ( benefit, index ) => {
				const { icon: Icon, title } = benefit;
				return <li key={ `${id}-upsell-benefit-${ index }` } className="yst-flex yst-gap-2 yst-mb-2 yst-items-center">
					<Icon className="yst-w-4 yst-h-4 yst-shrink-0 yst-inline yst-stroke-slate-400" />
					<p className="yst-text-slate-800 yst-font-medium">{ title }</p>
				</li>;
			} ) }
		</ul>
	);
};


BenefitItems.propTypes = {
	id: PropTypes.string.isRequired,
};
