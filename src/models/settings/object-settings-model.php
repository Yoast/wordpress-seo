<?php

namespace Yoast\WP\SEO\Models\Settings;

use Yoast\WP\SEO\Models\Settings_Model;

/**
 * Class Object_Settings_Model
 */
abstract class Object_Settings_Model extends Settings_Model {

	/**
	 * Holds the object name, e.g. the post type or taxonomy name.
	 *
	 * @var string
	 */
	protected $object_name;

	/**
	 * Object_Settings_Model constructor.
	 *
	 * @param string $object_name The object name to set.
	 */
	public function __construct( $object_name ) {
		$this->object_name = $object_name;
	}

	/**
	 * Retrieves the object name.
	 *
	 * @return string The object name.
	 */
	public function get_object_name() {
		return $this->object_name;
	}
}
