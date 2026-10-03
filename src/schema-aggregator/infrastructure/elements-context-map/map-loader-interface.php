<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Schema_Aggregator\Infrastructure\Elements_Context_Map;

/**
 * Interface for map loader strategies.
 */
interface Map_Loader_Interface {

	/**
	 * Loads the elements-context map.
	 *
	 * @return array<array<string, string>> The elements context map.
	 */
	public function load(): array;
}
