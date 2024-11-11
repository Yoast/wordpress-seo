<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\General\Domain\Taxonomies;

/**
 * This class describes a single Taxonomy.
 */
class Taxonomy {

	/**
	 * The name of the taxonomy.
	 *
	 * @var bool
	 */
	private $name;

	/**
	 * The label of the taxonomy.
	 *
	 * @var string
	 */
	private $label;

	/**
	 * The constructor.
	 *
	 * @param string $name  The name of the taxonomy.
	 * @param string $label The label of the taxonomy.
	 */
	public function __construct( string $name, string $label ) {
		$this->name  = $name;
		$this->label = $label;
	}

	/**
	 * Gets the taxonomy name.
	 *
	 * @return string The taxonomy name.
	 */
	public function get_name(): string {
		return $this->name;
	}

	/**
	 * Gets the taxonomy label.
	 *
	 * @return string The taxonomy label.
	 */
	public function get_label(): string {
		return $this->label;
	}
}
