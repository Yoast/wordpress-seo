import { useContext } from "@wordpress/element";
import PropTypes from "prop-types";
import { Button } from "@yoast/ui-library";
import { EyeOffIcon, EyeIcon } from "@heroicons/react/outline";
import classNames from "classnames";
import { AlertsContext } from "../contexts/alerts-context";

/**
 *
 * @param {Object[]} items The list of items.
 * @param {boolean} hidden Whether the items are hidden or not.
 *
 * @returns {JSX.Element} The list component.
 */
export const AlertsList = ( { items = [], hidden = false } ) => {
	const { bulletClass = "" } = useContext( AlertsContext );

	const Eye = hidden ? EyeIcon : EyeOffIcon;
	return (
		<ul>
			{ items.map( ( item, index ) => (
				<li key={ index } className="yst-border-b yst-border-slate-200 last:yst-border-b-0">
					<div className="yst-flex yst-justify-between yst-gap-5 yst-items-start yst-py-6">
						<div className={ classNames( "yst-mt-1",  hidden && "yst-opacity-50" ) }>
							<svg width="11" height="11" className={ bulletClass }>
								<circle cx="5.5" cy="5.5" r="5.5" />
							</svg>
						</div>
						<p
							className={ classNames(
								"yst-text-sm yst-text-slate-600 yst-grow",
								hidden && "yst-opacity-50" ) }
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

AlertsList.propTypes = {
	items: PropTypes.arrayOf( PropTypes.shape( {
		message: PropTypes.string,
	} ) ),
	hidden: PropTypes.bool,
};
