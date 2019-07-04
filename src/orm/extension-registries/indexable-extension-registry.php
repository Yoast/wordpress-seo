<?php
/**
 * Model for the SEO Meta table.
 *
 * @package Yoast\YoastSEO\ORM\Extension_Registries
 */

namespace Yoast\WP\Free\ORM\Extension_Registries;

use Exception;
use Yoast\WP\Free\Models\Indexable_Extension;

class Indexable_Extension_Registry {

	/**
	 * The registered indexable extensions.
	 *
	 * @var Indexable_Extension[]
	 */
	protected $extensions = [];

	/**
	 * Static factory function
	 *
	 * @return Indexable_Extension_Registry
	 */
	public static function get_instance() {
		static $instance;

		if ( ! $instance ) {
			$instance = new self();
		}

		return $instance;
	}

	/**
	 * Registers a new indexable extension.
	 *
	 * @param string $name       The name of the extension.
	 * @param string $class_name The class of the extension, must inherit from Indexable_Extension.
	 *
	 * @throws Exception If $class_name does not inherit from Indexable_Extension.
	 */
	public function register_extension( $name, $class_name ) {
		if ( ! is_subclass_of( $class_name, Indexable_Extension::class ) ) {
			throw new Exception( "$class_name must inherit Indexable_Extension to be registered as an extension." );
		}

		$this->extensions[ $name ] = $class_name;
	}

	/**
	 * Returns whether or not a given extension has been registered.
	 *
	 * @param string $name The name of the extension.
	 *
	 * @return bool Whether or not the named extension has been registered.
	 */
	public function has_extension( $name ) {
		return isset( $this->extensions[ $name ] );
	}

	/**
	 * Returns the class name of a registered extension.
	 *
	 * @param string $name The name of the extension.
	 *
	 * @return string The class name of the extension.
	 */
	public function get_extension( $name ) {
		return $this->extensions[ $name ];
	}
}
