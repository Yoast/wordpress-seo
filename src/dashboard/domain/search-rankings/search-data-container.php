<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Dashboard\Domain\Search_Rankings;

/**
 * The search data container.
 */
class Search_Data_Container {

	/**
	 * All the search data points.
	 *
	 * @var array<Search_Data> $search_data_container
	 */
	private $search_data_container;

	/**
	 * The constructor
	 */
	public function __construct() {
		$this->search_data_container = [];
	}

	/**
	 * Method to add search data.
	 *
	 * @param Search_Data $search_data The data.
	 *
	 * @return void
	 */
	public function add_search_data( Search_Data $search_data ) {
		$this->search_data_container[] = $search_data;
	}

	/**
	 * Converts the list to an array.
	 *
	 * @return array<string,string> The array of endpoints.
	 */
	public function to_array(): array {
		$result = [];
		foreach ( $this->search_data_container as $search_data ) {
			$result[] = $search_data->to_array();
		}

		return $result;
	}
}
