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
			'links' => [
				'search' => $this->build_rest_url(),
			],
		];
	}

	/**
	 * Builds the REST API URL for the taxonomy.
	 *
	 * @return string The REST API URL for the taxonomy.
	 */
	protected function build_rest_url(): string {
		$rest_base = ( $this->taxonomy->rest_base ) ? $this->taxonomy->rest_base : $this->taxonomy->name;

		$rest_namespace = ( $this->taxonomy->rest_namespace ) ? $this->taxonomy->rest_namespace : 'wp/v2';

		return \rest_url( "{$rest_namespace}/{$rest_base}" );
	}
}
