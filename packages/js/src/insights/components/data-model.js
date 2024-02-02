import { useMemo } from "@wordpress/element";
import { sprintf } from "@wordpress/i18n";
import { maxBy } from "lodash";
import PropTypes from "prop-types";
import classNames from "classnames";

/**
 * Creates a DataModel.
 *
 * @param {Object} data The data to represent.
 * @param {string} itemScreenReaderText Optional screen reader text for the items. Expected to contain `%d` to be replaced by the item number.
 * @param {string} className Extra classname for the list (ul).
 * @param {Object} listProps Any extra properties are for the list (ul).
 *
 * @returns {JSX.Element} A <ul> with <li> items.
 */
const DataModel = ( { data, itemScreenReaderText, className, ...listProps } ) => {
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

DataModel.propTypes = {
	data: PropTypes.arrayOf( PropTypes.shape( {
		name: PropTypes.string.isRequired,
		number: PropTypes.number.isRequired,
	} ) ),
	itemScreenReaderText: PropTypes.string,
	className: PropTypes.string,
};

DataModel.defaultProps = {
	data: [],
	itemScreenReaderText: "",
	className: "",
};

export default DataModel;
