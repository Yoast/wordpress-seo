<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Routes\Endpoint;

/**
 * List of endpoints.
 */
class Endpoint_List {

	/**
	 * Holds the endpoints.
	 *
	 * @var array<Endpoint_Interface>
	 */
	private $endpoints = [];

	/**
	 * Adds an endpoint to the list.
	 *
	 * @param Endpoint_Interface $endpoint An endpoint.
	 *
	 * @return void
	 */
	public function add_endpoint( Endpoint_Interface $endpoint ): void {
		$this->endpoints[] = $endpoint;
	}

	/**
	 * Converts the list to an array.
	 *
	 * @return array<string, string> The array of endpoints.
	 */
	public function to_array(): array {
		$result = [];
		foreach ( $this->endpoints as $endpoint ) {
			$result[ $endpoint->get_name() ] = $endpoint->get_url();
		}

		return $result;
	}

	/**
	 * Merges two Endpoint_List objects together.
	 * Returns the current instance for method chaining.
	 *
	 * @param Endpoint_List $other_list The other Endpoint_List to merge with.
	 *
	 * @return $this
	 */
	public function merge_with( Endpoint_List $other_list ): Endpoint_List {
		foreach ( $other_list->endpoints as $endpoint ) {
			$this->add_endpoint( $endpoint );
		}

		return $this;
	}
}
