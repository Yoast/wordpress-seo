import PropTypes from "prop-types";

/**
 * Renders a simple card.
 *
 * @param {string} title The card title.
 * @param {Node}   childred The card content.
 *
 * @returns {WPElement} A div containing the empty state page.
 */
const SimpleCard = ( { title, children } ) => {
	return <div className="yst-bg-white yst-rounded-lg yst-px-8 yst-py-6 yst-shadow">
		<h3 className="yst-mb-4 yst-text-xl yst-text-gray-900 yst-font-medium">
			{title }
		</h3>
		{ children }
	</div>;
};

SimpleCard.propTypes = {
	title: PropTypes.string,
	children: PropTypes.node,
};

export default SimpleCard;
