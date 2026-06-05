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
	 * The constructor.
	 *
	 * @param string $name  The name of the content type.
	 * @param string $label The label of the content type.
	 */
	public function __construct( string $name, string $label ) {
		$this->name  = $name;
		$this->label = $label;
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
}
