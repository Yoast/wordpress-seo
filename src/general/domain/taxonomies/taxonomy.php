<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\General\Domain\Taxonomies;

use WP_Taxonomy;

/**
 * This class describes a Taxonomy.
 */
class Taxonomy {

	/**
	 * The taxonomy.
	 *
	 * @var WP_Taxonomy
	 */
	private $taxonomy;

	/**
	 * The constructor.
	 *
	 * @param WP_Taxonomy $taxonomy The taxonomy.
	 */
	public function __construct( WP_Taxonomy $taxonomy ) {
		$this->taxonomy = $taxonomy;
	}

	/**
	 * Maps all taxonomy information to the expected key value representation.
	 *
	 * @return array<string,string> The expected key value representation.
	 */
	public function map_to_array(): array {
		return [
			'name'  => $this->taxonomy->name,
			'label' => $this->taxonomy->label,
		];
	}
}
