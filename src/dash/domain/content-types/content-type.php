<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Dash\Domain\Content_Types;

use Yoast\WP\SEO\Dash\Domain\Taxonomies\Taxonomy;

/**
 * This class describes a Content Type.
 */
class Content_Type {

	/**
	 * The name of the content type.
	 *
	 * @var string
	 */
	private $name;

	/**
	 * The label of the content type.
	 *
	 * @var string
	 */
	private $label;

	/**
	 * The taxonomy that filters the content type.
	 *
	 * @var Taxonomy
	 */
	private $taxonomy;

	/**
	 * The constructor.
	 *
	 * @param string   $name     The name of the content type.
	 * @param string   $label    The label of the content type.
	 * @param Taxonomy $taxonomy The taxonomy that filters the content type.
	 */
	public function __construct( string $name, string $label, ?Taxonomy $taxonomy ) {
		$this->name     = $name;
		$this->label    = $label;
		$this->taxonomy = $taxonomy;
	}

	/**
	 * Gets name of the content type.
	 *
	 * @return string The name of the content type.
	 */
	public function get_name(): string {
		return $this->name;
	}

	/**
	 * Gets label of the content type.
	 *
	 * @return string The label of the content type.
	 */
	public function get_label(): string {
		return $this->label;
	}

	/**
	 * Gets the taxonomy that filters the content type.
	 *
	 * @return string The taxonomy that filters the content type.
	 */
	public function get_taxonomy(): ?Taxonomy {
		return $this->taxonomy;
	}
}
