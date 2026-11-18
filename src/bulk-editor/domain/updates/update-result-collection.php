<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Bulk_Editor\Domain\Updates;

/**
 * This class describes a collection of update results.
 */
class Update_Result_Collection {

	/**
	 * The update results.
	 *
	 * @var array<Update_Result>
	 */
	private $results = [];

	/**
	 * Adds an update result to the collection.
	 *
	 * @param Update_Result $result The update result to add.
	 *
	 * @return void
	 */
	public function add( Update_Result $result ): void {
		$this->results[] = $result;
	}

	/**
	 * Returns the update results in the collection.
	 *
	 * @return array<Update_Result> The update results in the collection.
	 */
	public function get(): array {
		return $this->results;
	}

	/**
	 * Parses the collection to the expected key value representation.
	 *
	 * @return array<string, array<array<string, int|bool|string>>> The collection presented as the expected key value representation.
	 */
	public function to_array(): array {
		$results = [];
		foreach ( $this->results as $result ) {
			$results[] = $result->to_array();
		}

		return [ 'results' => $results ];
	}
}
