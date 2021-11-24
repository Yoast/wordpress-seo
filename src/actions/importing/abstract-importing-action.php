<?php

namespace Yoast\WP\SEO\Actions\Importing;

use Exception;
use Yoast\WP\SEO\Helpers\Options_Helper;

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
	 * The options helper.
	 *
	 * @var Options_Helper
	 */
	protected $options;

	/**
	 * Abstract_Importing_Action constructor.
	 *
	 * @param Options_Helper $options The options helper.
	 */
	public function __construct( Options_Helper $options ) {
		$this->options = $options;
	}

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
	public function is_compatible_with( $plugin = null, $type = null ) {
		if ( empty( $plugin ) && empty( $type ) ) {
			return true;
		}

		if ( $plugin === $this->get_plugin() && empty( $type ) ) {
			return true;
		}

		if ( empty( $plugin ) && $type === $this->get_type() ) {
			return true;
		}

		if ( $plugin === $this->get_plugin() && $type === $this->get_type() ) {
			return true;
		}

		return false;
	}

	/**
	 * Gets the completed id (to be used as a key for the importing_completed option).
	 *
	 * @return string The completed id.
	 */
	public function get_completed_id() {
		return $this->get_cursor_id();
	}

	/**
	 * Returns the stored state of completedness.
	 *
	 * @return int The stored state of completedness.
	 */
	public function get_completed() {
		$completed_id          = $this->get_completed_id();
		$importers_completions = $this->options->get( 'importing_completed', [] );

		return ( isset( $importers_completions[ $completed_id ] ) ) ? $importers_completions[ $completed_id ] : false;
	}

	/**
	 * Stores the current state of completedness.
	 *
	 * @param bool $completed Whether the importer is completed.
	 *
	 * @return void.
	 */
	public function set_completed( $completed ) {
		$completed_id                  = $this->get_completed_id();
		$current_importers_completions = $this->options->get( 'importing_completed', [] );

		$current_importers_completions[ $completed_id ] = $completed;
		$this->options->set( 'importing_completed', $current_importers_completions );
	}

	/**
	 * Returns whether the importing action is enabled.
	 *
	 * @return bool True by default unless a child class overrides it.
	 */
	public function is_enabled() {
		return true;
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
