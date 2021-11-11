<?php

namespace Yoast\WP\SEO\Actions\Importing;

use Exception;

/**
 * Importing action interface.
 */
abstract class Abstract_Importing_Action implements Importing_Action_Interface {

	/**
	 * The plugin the class deals with.
	 *
	 * @var string
	 */
	const PLUGIN = null;

	/**
	 * The type the class deals with.
	 *
	 * @var string
	 */
	const TYPE = null;

	/**
	 * The name of the plugin we import from.
	 *
	 * @return string The plugin we import from.
	 *
	 * @throws Exception If the PLUGIN constant is not set in the child class.
	 */
	public function get_plugin() {
		$class  = get_class( $this );
		$plugin = $class::PLUGIN;

		if ( $plugin === null ) {
			throw new Exception( 'Importing action without explicit plugin' );
		}

		return $plugin;
	}

	/**
	 * The data type we import from the plugin.
	 *
	 * @return string The data type we import from the plugin.
	 *
	 * @throws Exception If the TYPE constant is not set in the child class.
	 */
	public function get_type() {
		$class = get_class( $this );
		$type  = $class::TYPE;

		if ( $type === null ) {
			throw new Exception( 'Importing action without explicit type' );
		}

		return $type;
	}

	/**
	 * Can the current action import the data from plugin $plugin of type $type?
	 *
	 * @param string $plugin The plugin to import from.
	 * @param string $type   The type of data to import.
	 *
	 * @return bool True if this action can handle the combination of Plugin and Type.
	 *
	 * @throws Exception If the TYPE constant is not set in the child class.
	 */
	public function can_import( $plugin = null, $type = null ) {
		// Either value must be set, and match the current action.
		return ( $plugin || $type ) &&
			( $plugin && $plugin === $this->get_plugin() ) &&
			( $type && $type === $this->get_type() );
	}

	/**
	 * Gets the cursor id.
	 *
	 * @return string The cursor id.
	 */
	protected function get_cursor_id() {
		return $this->get_plugin() . '_' . $this->get_type();
	}
}
