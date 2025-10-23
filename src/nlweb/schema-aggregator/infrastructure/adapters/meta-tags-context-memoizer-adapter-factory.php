<?php
namespace Yoast\WP\SEO\NLWeb\Schema_Aggregator\Infrastructure\Adapters;

/**
 * Factory for creating Meta_Tags_Context_Memoizer_Adapter instances based on page type.
 */
class Meta_Tags_Context_Memoizer_Adapter_Factory {

	/**
	 * Creates the appropriate adapter for the given page type.
	 *
	 * @param string $page_type The page type.
	 * @return Meta_Tags_Context_Memoizer_Adapter_Interface The appropriate adapter.
	 */
	public function create( string $page_type ): Meta_Tags_Context_Memoizer_Adapter_Interface {
		switch ( $page_type ) {
			case 'Post_Type':
				return new Post_Type_Meta_Tags_Context_Memoizer_Adapter();
			case 'Home_Page':
			case 'Static_Home_Page':
				return new Home_Page_Meta_Tags_Context_Memoizer_Adapter();
			case 'Author_Archive':
				return new Author_Archive_Meta_Tags_Context_Memoizer_Adapter();
			case 'Date_Archive':
			case 'Post_Type_Archive':
			case 'Term':
				return new Archive_Meta_Tags_Context_Memoizer_Adapter();
			case 'Search_Result_Page':
				return new Search_Result_Meta_Tags_Context_Memoizer_Adapter();
			case 'Error_Page':
				return new Error_Page_Meta_Tags_Context_Memoizer_Adapter();
			default:
				return new Default_Meta_Tags_Context_Memoizer_Adapter();
		}
	}
}