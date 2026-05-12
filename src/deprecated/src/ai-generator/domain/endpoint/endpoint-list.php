<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\AI_Generator\Domain\Endpoint;

/**
 * List of endpoints.
 *
 * @deprecated 27.7
 * @codeCoverageIgnore
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
	 * @deprecated 27.7
	 * @codeCoverageIgnore
	 *
	 * @param Endpoint_Interface $endpoint An endpoint.
	 *
	 * @return void
	 */
	public function add_endpoint( Endpoint_Interface $endpoint ): void {
		\_deprecated_function( __METHOD__, 'Yoast SEO 27.7' );
		$this->endpoints[] = $endpoint;
	}

	/**
	 * Converts the list to an array.
	 *
	 * @deprecated 27.7
	 * @codeCoverageIgnore
	 *
	 * @return array<string, string> The array of endpoints.
	 */
	public function to_array(): array {
		\_deprecated_function( __METHOD__, 'Yoast SEO 27.7' );
		$result = [];
		foreach ( $this->endpoints as $endpoint ) {
			$result[ $endpoint->get_name() ] = $endpoint->get_url();
		}

		return $result;
	}
}
