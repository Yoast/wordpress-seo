<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Dashboard\Domain\Data_Provider;

/**
 * The data container.
 */
class Data_Container {

	/**
	 * All the search data points.
	 *
	 * @var array<Data_Interface> $data_container
	 */
	private $data_container;

	/**
	 * The constructor
	 */
	public function __construct() {
		$this->data_container = [];
	}

	/**
	 * Method to add data.
	 *
	 * @param Data_Interface $data The data.
	 *
	 * @return void
	 */
	public function add_data( Data_Interface $data ) {
		$this->data_container[] = $data;
	}

	/**
	 * Converts the list to an array.
	 *
	 * @return array<string,string> The array of endpoints.
	 */
	public function to_array(): array {
		$result = [];
		foreach ( $this->data_container as $data ) {
			$result[] = $data->to_array();
		}

		return $result;
	}
}
