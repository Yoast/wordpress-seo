import PropTypes from "prop-types";
import { Button } from "@yoast/ui-library";
import { EyeOffIcon, EyeIcon } from "@heroicons/react/outline";
import classNames from "classnames";

/**
 *
 * @param {string} bulletColor The color of the bullet.
 * @param {Array} items The list of items.
 * @param {boolean} hidden Whether the items are hidden or not.
 *
 * @returns {JSX.Element} The list component.
 */
export const List = ( { bulletColor = "red", items = [], hidden = false } ) => {
	const colors = {
		red: "yst-fill-red-500",
		blue: "yst-fill-blue-500",
	};
	const Eye = hidden ? EyeIcon : EyeOffIcon;
	return (
		<ul className="yst-mt-2">
			{ items.map( ( item, index ) => (
				<li key={ index } className="yst-border-b yst-border-slate-200 last:yst-border-b-0">
					<div className="yst-flex yst-justify-between yst-gap-5 yst-items-start yst-py-6">
						<div className={ classNames( "yst-mt-1",  hidden && "yst-opacity-50" ) }>
							<svg width="11" height="11" className={ colors[ bulletColor ] }>
								<circle cx="5.5" cy="5.5" r="5.5" />
							</svg>
						</div>
						<p
							className={ classNames(
								"yst-text-sm yst-text-slate-600 yst-grow"
								, hidden && "yst-opacity-50" ) }
						>{ item.message }</p>
						<Button variant="secondary" size="small" className="yst-self-center yst-h-8">
							<Eye className="yst-w-4 yst-h-4 yst-text-neutral-700" />
						</Button>
					</div>
				</li>
			) ) }
		</ul>
	);
};

List.propTypes = {
	bulletColor: PropTypes.string,
	items: PropTypes.arrayOf( PropTypes.shape( {
		message: PropTypes.string,
	} ) ),
	hidden: PropTypes.bool,
};
