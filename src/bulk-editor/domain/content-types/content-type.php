<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Bulk_Editor\Domain\Content_Types;

/**
 * This class describes a content type for the bulk editor.
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
	 * The singular label of the content type.
	 *
	 * @var string
	 */
	private $singular_label;

	/**
	 * The constructor.
	 *
	 * @param string $name           The name of the content type.
	 * @param string $label          The label of the content type.
	 * @param string $singular_label The singular label of the content type.
	 */
	public function __construct( string $name, string $label, string $singular_label ) {
		$this->name           = $name;
		$this->label          = $label;
		$this->singular_label = $singular_label;
	}

	/**
	 * Gets the name of the content type.
	 *
	 * @return string The name of the content type.
	 */
	public function get_name(): string {
		return $this->name;
	}

	/**
	 * Gets the label of the content type.
	 *
	 * @return string The label of the content type.
	 */
	public function get_label(): string {
		return $this->label;
	}

	/**
	 * Gets the singular label of the content type.
	 *
	 * @return string The singular label of the content type.
	 */
	public function get_singular_label(): string {
		return $this->singular_label;
	}
}
