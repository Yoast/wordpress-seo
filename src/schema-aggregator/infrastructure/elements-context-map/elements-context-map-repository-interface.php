<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Schema_Aggregator\Infrastructure\Elements_Context_Map;

/**
 * Interface for the elements-context map repository.
 */
interface Elements_Context_Map_Repository_Interface {

	/**
	 * Retrieves the elements-context map.
	 *
	 * @return array<array<string, string>> The elements context map.
	 */
	public function get_map(): array;

	/**
	 * Saves the elements-context map.
	 *
	 * @param array<array<string, string>> $map The elements-context map to be saved.
	 *
	 * @return void
	 */
	public function save_map( array $map ): void;
}
