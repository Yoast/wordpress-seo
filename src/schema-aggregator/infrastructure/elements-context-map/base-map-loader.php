<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Schema_Aggregator\Infrastructure\Elements_Context_Map;

/**
 * Map loader default implementation..
 */
class Base_Map_Loader implements Map_Loader_Interface {

	/**
	 * Loads the elements-context map.
	 *
	 * @return array<array<string, string>> The elements context map.
	 */
	public function load(): array {
		return include __DIR__ . '/default-elements-context-map.php';
	}
}
