import PropTypes from "prop-types";
import classNames from "classnames";
import DotsMenu from "./indexables-card-options";

/**
 * A card for the indexables page.
 *
 * @param {string}   title     The indexable title.
 * @param {boolean}  className A className string to add to a card.
 * @param {array}    options   An array with options for the dots menu.
 * @param {JSX.node} children  The React children.
 *
 * @returns {WPElement} A card for the indexables page.
 */
function IndexablesPageCard( { title, className, options, children } ) {
	return <div className={ classNames( "yst-w-full yst-inline-block", className ) }>
		<div className="yst-bg-white yst-rounded-lg yst-shadow">
			<div className="yst-w-full yst-flex yst-justify-between yst-p-8 yst-pb-0">
				<h3 className="yst-mb-4 yst-text-base yst-text-slate-900 yst-font-medium yst-w-full">
					{ title }
				</h3>
				{ options.length > 0 && <DotsMenu options={ options } /> }
			</div>
			<div className="yst-p-8 yst-pt-0 yst-overflow-x-hidden">
				{ children }
			</div>
		</div>
	</div>;
}

IndexablesPageCard.propTypes = {
	title: PropTypes.oneOfType( [ PropTypes.string, PropTypes.object ] ).isRequired,
	children: PropTypes.node.isRequired,
	className: PropTypes.string,
	options: PropTypes.arrayOf( PropTypes.shape( {
		title: PropTypes.string,
		action: PropTypes.function,
	} ) ),
};

IndexablesPageCard.defaultProps = {
	className: "",
	options: [],
};

export default IndexablesPageCard;
