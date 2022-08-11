import PropTypes from "prop-types";

/**
 * Renders a simple card.
 *
 * @param {string} title The card title.
 * @param {Node}   childred The card content.
 *
 * @returns {WPElement} A card component for the indexables page.
 */
const SimpleCard = ( { title, children } ) => {
	return <div className="yst-inline-block yst-w-full">
		<div className="yst-bg-white yst-rounded-lg yst-p-8 yst-shadow">
			<h3 className="yst-mb-4 yst-text-base yst-text-gray-900 yst-font-medium">
				{ title }
			</h3>
			{ children }
		</div>
	</div>;
};

SimpleCard.propTypes = {
	title: PropTypes.string,
	children: PropTypes.node,
};

export default SimpleCard;
