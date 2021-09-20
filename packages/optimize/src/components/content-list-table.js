import { dispatch } from "@wordpress/data";
import { Fragment } from "@wordpress/element";
import { ListTable } from "@yoast/admin-ui-toolkit/components";
import { ASYNC_STATUS } from "@yoast/admin-ui-toolkit/constants";
import { get, pick, replace } from "lodash";
import PropTypes from "prop-types";
import { useHistory } from "react-router-dom";
import { OPTIMIZE_STORE_KEY } from "../constants";
import ScoreIndicator from "./score-indicator";

/**
 * A function to pick the correct props for the TableHeading component.
 * @param {array} columns An array containing objects with the column configuration for each column.
 * @param {object} sortBy Object containing the key and sorting direction of the column that the content is currently sorted by.
 * @returns {array} An array with the correct props-object for each Table Heading cell.
 */
function composeTableHeadingProps( columns, sortBy ) {
	return columns.map( ( column ) => {
		const headingCellProps = pick( column, [ "key", "icon", "label", "sortable", "type" ] );

		if ( sortBy.column === column.key ) {
			headingCellProps.sortDirection = sortBy.direction;
		}
		const nextSortDirection = ( headingCellProps.sortDirection === "asc" ) ? "desc" : "asc";

		headingCellProps.sortBy = () => {
			dispatch( OPTIMIZE_STORE_KEY ).setQueryData( "sortBy", { column: column.key, direction: nextSortDirection } );
		};

		return headingCellProps;
	} );
}

/**
 * A function that for each cell in a row composes cell content dependent on the type of column.
 * @param {array} columns An array containing objects with the column configuration for each column.
 * @param {array} rowData An object that contains the data for every cell in the current row.
 * @returns {array} An array with the content for each cell in the certain row.
 */
function composeRow( columns, rowData ) {
	return columns.map( ( { type, key } ) => {
		switch ( type ) {
			case "date":
				return <Fragment key={ key }>{ get( rowData, key ) }</Fragment>;
			case "score":
				return <ScoreIndicator
					entity={ key }
					key={ key }
					score={ get( rowData, key ) }
				/>;
			case "thumbnail":
				return <ListTable.Thumbnail
					imageUrl={ get( rowData, key )?.url || "" }
					key={ key }
				/>;
			default:
				return <Fragment key={ key }>{ get( rowData, key ) }</Fragment>;
		}
	} );
}

/**
 * The ContentListTable component.
 * @param {array} columns An array containing objects with the column configuration for each column.
 * @param {array} data An array of objects that contain the targetPath and data for every cell in every row.
 * @param {string} sortBy Object containing the key and sorting direction of the column that the content is currently sorted by.
 * @param {string} status The query status.
 * @param {string} label The contentType label.
 * @returns {JSX.Element} The ContentListTable component.
 */
const ContentListTable = ( { columns, data, sortBy, status, moreResultsStatus, contentType, detailTarget } ) => {
	const history = useHistory();

	/**
	 * A function that ports you to a new target.
	 * @param {string} id The path that needs to be navigated to.
	 * @returns {void}
	 */
	function onRowClick( id ) {
		// Add id to detail target prop.
		const target = replace( detailTarget, ":id", id );
		history.push( target );
	}

	const isLoadingMoreResults = moreResultsStatus === ASYNC_STATUS.loading;

	return (
		<ListTable
			header={ <ListTable.Heading heading={ composeTableHeadingProps( columns, sortBy ) } /> }
			status={ status }
			label={ contentType.label }
			columns={ columns }
		>
			{
				data.length > 0 && data.map( ( rowData, index ) => {
					const rowContent = composeRow( columns, rowData );
					return <ListTable.Row
						key={ index }
						onClick={ onRowClick }
						onClickData={ rowData.id }
					>
						{ rowContent }
					</ListTable.Row>;
				} )
			}
			{
				data.length === 0 && <ListTable.EmptyRow label={ contentType.label } />
			}
			{ isLoadingMoreResults && <ListTable.PlaceholderRows columnCount={ columns.length - 1 } /> }
		</ListTable>
	);
};

ContentListTable.propTypes = {
	columns: PropTypes.arrayOf( PropTypes.object ).isRequired,
	contentType: PropTypes.shape( {
		label: PropTypes.string.isRequired,
	} ).isRequired,
	detailTarget: PropTypes.string.isRequired,
	data: PropTypes.array.isRequired,
	sortBy: PropTypes.shape( {
		column: PropTypes.string,
		direction: PropTypes.oneOf( [ "asc", "desc" ] ),
	} ).isRequired,
	status: PropTypes.string,
	moreResultsStatus: PropTypes.string,
};

ContentListTable.defaultProps = {
	status: ASYNC_STATUS.loading,
	moreResultsStatus: ASYNC_STATUS.idle,
};

export default ContentListTable;
