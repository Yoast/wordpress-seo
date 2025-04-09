<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Dashboard\Domain\Data_Provider;

/**
 * The data container.
 */
class Data_Container {

	/**
	 * All the uncacheable data points.
	 *
	 * @var array<Data_Interface>
	 */
	private $uncachable_data_container;

	/**
	 * All the cacheable data points.
	 *
	 * @var array<Data_Interface>
	 */
	private $cacheable_data_container;

	/**
	 * The constructor
	 */
	public function __construct() {
		$this->uncachable_data_container = [];
		$this->cacheable_data_container  = [];
	}

	/**
	 * Method to add uncachable data.
	 *
	 * @param Data_Interface $data The data.
	 *
	 * @return void
	 */
	public function add_uncacheable_data( Data_Interface $data ) {
		$this->uncachable_data_container[] = $data;
	}

	/**
	 * Method to add cacheable data.
	 *
	 * @param Data_Interface $data The cacheable data.
	 *
	 * @return void
	 */
	public function add_cacheable_data( Data_Interface $data ) {
		$this->cacheable_data_container[] = $data;
	}

	/**
	 * Method to get all the uncachable data points.
	 *
	 * @return Data_Interface[] All the data points.
	 */
	public function get_data(): array {
		return $this->uncachable_data_container;
	}

	/**
	 * Method to get all the cacheable data points.
	 *
	 * @return Data_Interface[] All the cacheable data points.
	 */
	public function get_cacheable_data(): array {
		return $this->cacheable_data_container;
	}

	/**
	 * Converts the data points into an array.
	 *
	 * @return array<string, array<string, string>> The array of the data points.
	 */
	public function to_array(): array {
		$result = [];
		foreach ( $this->uncachable_data_container as $data ) {
			$result[] = $data->to_array();
		}
		$uncacheable_data = $result;

		$result = [];
		foreach ( $this->cacheable_data_container as $data ) {
			$result[] = $data->to_array();
		}
		$cacheable_data = $result;

		return [
			'cacheableData'   => $cacheable_data,
			'uncacheableData' => $uncacheable_data,
		];
	}
}
