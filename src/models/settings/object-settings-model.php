<?php

namespace Yoast\WP\SEO\Models\Settings;

use Yoast\WP\SEO\Models\Settings_Model;
use Yoast\WP\SEO\Repositories\Settings_Repository;

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
	 * @param Settings_Repository $settings_repository The settings repository.
	 * @param string              $object_name         The object name to set.
	 */
	public function __construct( Settings_Repository $settings_repository, $object_name ) {
		parent::__construct( $settings_repository );

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
