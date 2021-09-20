import { __, sprintf } from "@wordpress/i18n";
import PropTypes from "prop-types";
import { useSelect } from "@wordpress/data";
import { Page, ShowMore } from "@yoast/admin-ui-toolkit/components";

import { OPTIMIZE_STORE_KEY } from "../../../constants";
import { useContentListQuery } from "./hooks";
import ContentListTable from "../../content-list-table";
import SearchInput from "../../search-input";
import FilterSelect from "../../filter-select";

/**
 * @param {Object} props The props object.
 * @param {Object} props.contentType The content type options.
 * @param {string} props.detailTarget The route target for detail pages.
 * @returns {JSX.Element} ContentList component.
 */
const ContentList = ( { contentType, detailTarget } ) => {
	const { query, data, handleMoreResultsQuery } = useContentListQuery( contentType );
	const moreItemsAvailable = useSelect( ( select ) => Boolean( select( OPTIMIZE_STORE_KEY ).getListData( "after" ) ) );
	// translators: %s is replaced by the plural content type label.
	const searchInputText = sprintf( __( "Search %s", "admin-ui" ), contentType.label );

	return (
		<Page>
			<Page.Header title={ contentType.label } />

			<div className="yst-flex-grow yst-max-w-full yst-p-8">
				<section className="yst-block 2xl:yst-grid yst-grid-cols-3 yst-gap-4 yst-mb-8">
					{ contentType.hasSearch &&
						<div className="yst-mb-2 2xl:yst-mb-0 yst-max-w-sm 2xl:yst-max-w-full">
							<SearchInput
								id={ `yst-${ contentType.slug }-list-filter__search` }
								// translators: %s is replaced with the content type label.
								placeholder={ searchInputText }
								label={ searchInputText }
							/>
						</div>
					}
					<div className="yst-grid md:yst-grid-cols-3 yst-gap-2 yst-col-span-2">
						{ contentType.filters.map( ( filter ) => (
							<div key={ filter.name } className="yst-flex-grow">
								<FilterSelect
									id={ `yst-${ contentType.slug }-list-filter__search` }
									{ ...filter }
									label={ sprintf( __( "Filter by %s", "admin-ui" ), filter.label ) }
								/>
							</div>
						) ) }
					</div>
				</section>
				<section>
					<ContentListTable
						columns={ contentType.columns }
						data={ data.items }
						sortBy={ query.data.sortBy }
						status={ query.status }
						moreResultsStatus={ query.moreResultsStatus }
						contentType={ contentType }
						detailTarget={ detailTarget }
					/>
					<ShowMore
						requestMore={ handleMoreResultsQuery }
						moreAvailable={ moreItemsAvailable }
						className="yst-mt-8"
					/>
				</section>
			</div>
		</Page>
	);
};

ContentList.propTypes = {
	contentType: PropTypes.object.isRequired,
	detailTarget: PropTypes.string.isRequired,
};

export default ContentList;
