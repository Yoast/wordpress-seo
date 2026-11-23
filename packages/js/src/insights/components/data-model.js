import { useMemo } from "@wordpress/element";
import { sprintf } from "@wordpress/i18n";
import { maxBy } from "lodash";
import classNames from "classnames";

/**
 * Creates a DataModel.
 *
 * @param {Object} props Component props. Additional props are passed to the list (ul).
 * @param {Object[]} [props.data=[]] The data to represent.
 * @param {string} props.data[].name The item name.
 * @param {number} props.data[].number The item number.
 * @param {string} [props.itemScreenReaderText=""] Optional screen reader text for the items. Expected to contain `%d` for the item number.
 * @param {string} [props.className=""] Extra classname for the list (ul).
 *
 * @returns {React.ReactNode} A <ul> with <li> items.
 */
const DataModel = ( {
	data = [],
	itemScreenReaderText = "",
	className = "",
	...listProps
} ) => {
	const max = useMemo( () => maxBy( data, "number" )?.number ?? 0, [ data ] );

	return (
		<ul
			className={ classNames( "yoast-data-model", className ) }
			{ ...listProps }
		>
			{ data.map( ( { name, number } ) => (
				<li
					key={ `${ name }_dataItem` }
					style={ { "--yoast-width": `${ ( number / max ) * 100 }%` } }
				>
					{ name }
					<span>{ number }</span>
					{ itemScreenReaderText && <span className="screen-reader-text">{ sprintf( itemScreenReaderText, number ) }</span> }
				</li>
			) ) }
		</ul>
	);
};

export default DataModel;
