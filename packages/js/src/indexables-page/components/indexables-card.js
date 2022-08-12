import PropTypes from "prop-types";
import classNames from "classnames";

/**
 * A card for the indexables page.
 *
 * @param {string}   title     The indexable title.
 * @param {boolean}  className A className string to add to a card.
 * @param {JSX.node} children  The React children.
 *
 * @returns {WPElement} A card for the indexables page.
 */
function IndexablesPageCard( { title, className, children } ) {
	return <div className={ classNames( "yst-w-full yst-inline-block", className ) }>
		<div
			className="yst-bg-white yst-rounded-lg yst-p-8 yst-shadow"
		>
			<h3 className="yst-mb-4 yst-text-base yst-text-gray-900 yst-font-medium">
				{ title }
			</h3>
			{ children }
		</div>
	</div>;
}

IndexablesPageCard.propTypes = {
	title: PropTypes.string.isRequired,
	children: PropTypes.node.isRequired,
	className: PropTypes.string,
};

IndexablesPageCard.defaultProps = {
	className: "",
};

export default IndexablesPageCard;
