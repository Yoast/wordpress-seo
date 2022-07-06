import { PhotographIcon } from "@heroicons/react/outline";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/solid";
import { useCallback } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
import classNames from "classnames";
import { noop } from "lodash";
import PropTypes from "prop-types";

/**
 * The basic table structure with thead and tbody that's used by the ListTable component.
 * @param {*} children Either the content or a state message.
 * @param {*} header The headings for the thead.
 *
 * @returns {JSX.Element} The table and thead.
 */
const Table = ( { children, header } ) => {
	return (
		<div className="yst-relative yst-overflow-x-scroll yst-border yst-border-gray-200 yst-shadow-sm yst-rounded-lg">
			<table className="yst-min-w-full yst-divide-y yst-divide-gray-200">
				{ header && <thead className="yst-bg-gray-50">
					{ header }
				</thead> }
				<tbody className="yst-divide-y yst-divide-gray-200">
					{ children }
				</tbody>
			</table>
		</div>
	);
};

Table.propTypes = {
	children: PropTypes.node.isRequired,
	header: PropTypes.element,
};

Table.defaultProps = {
	header: "",
};

/**
 * @param {number} columnCount Amount of columns that need to be created.
 * @returns {JSX.Element} Three rows with the amount of columns needed.
 */
const PlaceholderRows = ( { columnCount } ) => {
	const thumbnail = <td key="placeholder-thumbnail" className="yst-px-6 yst-py-4"><Thumbnail /></td>;
	const columns = Array( columnCount ).fill( "" )
		.map( ( _, columnIndex ) => <td key={ `placeholder-column-${ columnIndex }` } className="yst-px-6 yst-py-4 yst-animate-pulse">
			<div className="yst-w-full yst-bg-gray-200 yst-h-3 yst-rounded" />
		</td> );

	return <>
		<tr>{ thumbnail }{ columns }</tr>
		<tr>{ thumbnail }{ columns }</tr>
		<tr>{ thumbnail }{ columns }</tr>
	</>;
};

PlaceholderRows.propTypes = {
	columnCount: PropTypes.number.isRequired,
};

/**
 * The ListTable component.
 * @param {*} children Either the content or a state message.
 * @param {*} header The headings for the thead.
 * @param {string} status The query status.
 * @param {string} label The label for the content type, displayed in the error message.
 * @param {array} columns. Amount of columns only used to determine how many columns the loading state should have.
 * @returns {JSX.Element} The ListTable component.
 */
const ListTable = ( { children, header, status, label, columns } ) => {
	const contentTypeLabel = label ? label.toLowerCase() : "items";

	if ( status === "loading" ) {
		return (
			<Table header={ header }>
				<PlaceholderRows columnCount={ columns.length > 0 ? columns.length - 1 : 1 } />
			</Table>
		);
	} else if ( status === "error" ) {
		return (
			<Table header={ header }>
				<tr>
					<td colSpan={ 100 } className="yst-w-full yst-h-60 yst-text-center yst-text-red-600">
						{ sprintf(
							// translators: %s is replaced by the content type label (plural).
							__( "Oops, something went wrong while retrieving your %s. Please refresh the page.", "admin-ui" ),
							contentTypeLabel,
						) }
					</td>
				</tr>
			</Table>
		);
	} else if ( status === "idle" ) {
		return (
			<Table header={ header }>
				<EmptyRow label={ contentTypeLabel } />
			</Table>
		);
	}

	return (
		<Table header={ header }>
			{ children }
		</Table>
	);
};

ListTable.propTypes = {
	children: PropTypes.node.isRequired,
	header: PropTypes.element,
	status: PropTypes.string,
	label: PropTypes.string,
	columns: PropTypes.array,
};

ListTable.defaultProps = {
	header: null,
	status: "loading",
	label: "",
	columns: [ "1", "2", "3" ],
};

/**
 * The ListTable Row component.
 * @param {Object} props Props object.
 * @param {array} props.children An array with the content for each cell of the row.
 * @param {function} props.onClick Callback that gets called when a user clicks on the table row.
 * @returns {JSX.Element} A styled table row with styled and occupied table cells.
 */
const Row = ( { children, onClick, onClickData } ) => {
	const handleClick = useCallback( () => onClick( onClickData ), [ onClick, onClickData ] );
	const handleKeyDown = useCallback( ( event ) => {
		if ( event.key === "Enter" || event.key === " " ) {
			handleClick();
		}
	}, [ handleClick ] );

	return (
		<tr className="yst-cursor-pointer hover:yst-bg-gray-50" onClick={ handleClick } onKeyDown={ handleKeyDown } role="link" tabIndex="0">
			{ children.map( ( value, index ) => {
				return <td key={ index } className="yst-px-6 yst-py-4">{ value }</td>;
			} ) }
		</tr>
	);
};

Row.propTypes = {
	onClick: PropTypes.func,
	onClickData: PropTypes.oneOfType( [ PropTypes.string, PropTypes.number ] ),
	children: PropTypes.node.isRequired,
};

Row.defaultProps = {
	onClick: noop,
	onClickData: "",
};
/**
 * An empty row to render when there is nothing to show.
 * @param {string} label The label for the content type, displayed in the error message.
 * @returns {JSX.Element} A styled empty table row.
 */
const EmptyRow = ( { label } ) => {
	const contentTypeLabel = label ? label.toLowerCase() : "items";
	return <tr>
		<td colSpan={ 100 } className="yst-w-full yst-h-56 yst-text-center">
			{ sprintf(
				// translators: %s is replaced by the content type label (plural).
				__( "There are no %s to show.", "admin-ui" ),
				contentTypeLabel,
			) }
		</td>
	</tr>;
};

EmptyRow.propTypes = {
	label: PropTypes.string,
};

EmptyRow.defaultProps = {
	label: "",
};

/**
 * The ListTable Thumbnail component.
 * @param {Object} props Props object.
 * @param {string} props.imageUrl A string with the url of the image that should be shown.
 * @returns {JSX.Element} A styled thumbnail image for in the ListTable.
 */
const Thumbnail = ( { imageUrl } ) => {
	return (
		<span className="yst-flex yst-justify-center yst-items-center yst-h-12 yst-w-12 yst-rounded yst-overflow-hidden yst-bg-gray-100">
			{ ( imageUrl === "" )
				? <PhotographIcon className="yst-w-5 yst-h-5 yst-text-gray-400" />
				: <img src={ imageUrl } alt="" />
			}
		</span>
	);
};

Thumbnail.propTypes = {
	imageUrl: PropTypes.string,
};

Thumbnail.defaultProps = {
	imageUrl: "",
};

/**
 * Shows the label or icon with or without a button which arranges the sorting.
 *
 * @param {string} contentType The type of content.
 * @param {JSXElement} icon The icon to show.
 * @param {string} label The label, either showing as label or as screen reader text.
 * @param {Boolean} sortable If a column should be sortable.
 * @param {Function} sortBy The function to sort the column by.
 * @param {string} sortDirection The direction to point the ChevronIcon. Use only for the actively sorted column.
 * @returns {JSX.Element} An icon or label, either with or without a button for sorting.
 */
const ShowIconOrLabel = ( { contentType, icon, label, sortable, sortBy, sortDirection } ) => {
	/**
	 * @returns {JSXElement} Returns ascending or descending arrow or both, depending on which column is actively sorted.
	 */
	const AscendingOrDescending = () => {
		switch ( sortDirection ) {
			case "asc":
				return <ChevronDownIcon className="flex-shrink-0 yst-w-4 yst-h-4 yst-text-gray-500 group-hover:yst-text-gray-500" />;
			case "desc":
				return <ChevronUpIcon className="flex-shrink-0 yst-w-4 yst-h-4 yst-text-gray-500 group-hover:yst-text-gray-500" />;
			case "":
				return (
					<>
						<ChevronUpIcon className="flex-shrink-0 yst-w-4 yst-h-4 yst-text-gray-500 group-hover:yst-text-gray-500" />
						<ChevronDownIcon className="flex-shrink-0 yst-w-4 yst-h-4 yst-text-gray-500 group-hover:yst-text-gray-500" />
					</>
				);
		}
	};

	const iconOrLabel = icon ? <>{ icon }<span className="yst-sr-only">{ label }</span></> : label;

	if ( ! sortable ) {
		return iconOrLabel;
	}

	return (
		<button
			onClick={ sortBy }
			className={ classNames(
				( contentType === "score" ) ? "yst-mx-auto" : "",
				"yst-flex yst-justify-between yst-items-center yst-rounded-md focus:yst-outline-none focus:yst-ring-2 focus:yst-ring-offset-2 focus:yst-ring-indigo-500",
			) }
		>
			<span className="yst-text-xs yst-font-medium yst-text-gray-500 yst-uppercase yst-tracking-wider yst-mr-3">
				{ iconOrLabel }
			</span>
			<AscendingOrDescending />
		</button>
	);
};

ShowIconOrLabel.propTypes = {
	contentType: PropTypes.string,
	icon: PropTypes.element,
	label: PropTypes.string.isRequired,
	sortable: PropTypes.bool,
	sortBy: PropTypes.func,
	sortDirection: PropTypes.oneOf( [ "asc", "desc", "" ] ),
};

ShowIconOrLabel.defaultProps = {
	contentType: "",
	icon: null,
	sortable: false,
	sortBy: () => {},
	sortDirection: "",
};

/**
 * The Table Heading component.
 *
 * @param {Array} heading The content for the heading.
 *
 * @returns {JSX.Element} The Table Heading component.
 */
const Heading = ( { heading } ) => {
	return (
		<tr>
			{ heading.map( ( item ) => (
				<th
					key={ item.key }
					className="yst-px-6 yst-py-3 yst-text-left yst-text-xs yst-font-medium yst-text-gray-500 yst-uppercase yst-tracking-wider"
				>
					<ShowIconOrLabel
						contentType={ item.type }
						icon={ item.icon }
						label={ item.label }
						sortable={ item.sortable }
						sortBy={ item.sortBy }
						sortDirection={ item.sortDirection }
					/>
				</th>
			) ) }
		</tr>
	);
};

Heading.propTypes = {
	heading: PropTypes.arrayOf( PropTypes.shape( {
		key: PropTypes.string.isRequired,
		type: PropTypes.string,
		icon: PropTypes.element,
		label: PropTypes.string.isRequired,
		sortable: PropTypes.bool,
		sortBy: PropTypes.func,
		sortDirection: PropTypes.oneOf( [ "asc", "desc", "" ] ),
	} ) ).isRequired,
};

ListTable.EmptyRow = EmptyRow;
ListTable.Row = Row;
ListTable.PlaceholderRows = PlaceholderRows;
ListTable.Thumbnail = Thumbnail;
ListTable.Heading = Heading;

export default ListTable;
