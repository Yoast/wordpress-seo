<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Schema_Aggregator\Infrastructure\Elements_Context_Map;

/**
 * Repository for the elements-context map.
 */
class Elements_Context_Map_Repository implements Elements_Context_Map_Repository_Interface {

	/**
	 * The elements-context map.
	 *
	 * @var array<array<string, string>>|null
	 */
	private $map = null;

	/**
	 * The map loader strategy.
	 *
	 * @var Map_Loader_Interface
	 */
	private $map_loader;

	/**
	 * Constructor.
	 *
	 * @param Map_Loader_Interface $map_loader The map loader strategy.
	 */
	public function __construct( Map_Loader_Interface $map_loader ) {
		$this->map_loader = $map_loader;
	}

	/**
	 * Retrieves the elements-context map.
	 *
	 * @return array<array<string, string>> The elements context-map.
	 */
	public function get_map(): array {
		if ( $this->map === null ) {
			$this->map = $this->map_loader->load();
		}
		return $this->map;
	}

	/**
	 * Saves the elements-context map.
	 *
	 * @param array<array<string, string>> $map The elements-context map to besaved.
	 *
	 * @return void
	 */
	public function save_map( array $map ): void {
		$this->map = $map;
	}
}
