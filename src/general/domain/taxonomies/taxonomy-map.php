<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\General\Domain\Taxonomies;

/**
 * This class describes a map of taxonomies.
 */
class Taxonomy_Map {

	/**
	 * The taxonomy.
	 *
	 * @var Taxonomy
	 */
	private $taxonomy = null;

	/**
	 * Adds the taxonomy to the map.
	 *
	 * @param Taxonomy $taxonomy The taxonomy to add.
	 *
	 * @return void
	 */
	public function add_taxonomy( Taxonomy $taxonomy ): void {
		$this->taxonomy = $taxonomy;
	}

	/**
	 * Maps all taxonomy information to the expected key value representation.
	 *
	 * @return array<string,string> The expected key value representation.
	 */
	public function map_to_array(): array {
		if ( $this->taxonomy === null ) {
			return [];
		}

		$array = [
			'name'  => $this->taxonomy->get_name(),
			'label' => $this->taxonomy->get_label(),
		];
		return $array;
	}
}
