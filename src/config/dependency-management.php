<?php
/**
 * Makes sure the dependencies are loaded and the environment is prepared to use them.
 *
 * @package Yoast\YoastSEO\Config
 */

namespace Yoast\WP\Free\Config;

use Composer\Script\Event;
use Composer\Installer\PackageEvent;

/**
 * Sets up class aliases and defines required constants.
 */
class Dependency_Management {

	/**
	 * Registers the autoloader to create class aliases when needed.
	 *
	 * @return bool True on success, false on failure.
	 */
	public function initialize() {
		// Prepend the autoloader to the stack, allowing for discovery of prefixed classes.
		// @codingStandardsIgnoreLine PHPCompatibility.PHP.NewFunctions.class_aliasFound -- PHP >= 5.3 only.
		return \spl_autoload_register( array( $this, 'ensure_class_alias' ), true, true );
	}

	/**
	 * Makes sure a class alias is created when a base class exists.
	 *
	 * @param string $class Class to create alias for.
	 *
	 * @return void
	 */
	public function ensure_class_alias( $class ) {
		// If the namespace beings with the dependency class prefix, make an alias for regular class.
		if ( strpos( $class, YOAST_VENDOR_NS_PREFIX ) !== 0 || $this->prefixed_available() ) {
			return;
		}

		$base = substr( $class, ( strlen( YOAST_VENDOR_NS_PREFIX ) + 1 ) );
		if ( ! $this->class_exists( $base ) ) {
			return;
		}

		$this->class_alias( $base, $class );
	}

	/**
	 * Checks if the prefixes are available.
	 *
	 * @codeCoverageIgnore
	 *
	 * @return bool True if prefixes are available.
	 */
	public function prefixed_available() {
		static $available = null;

		if ( $available === null ) {
			$available = is_file( WPSEO_PATH . YOAST_VENDOR_PREFIX_DIRECTORY . '/dependencies-prefixed.txt' );
		}

		return $available;
	}

	/**
	 * Prefixes dependencies if composer install is ran with dev mode.
	 *
	 * Used in composer in the post-install script hook.
	 *
	 * @codeCoverageIgnore
	 *
	 * @param Event $event Composer event that triggered this script.
	 *
	 * @return void
	 */
	public static function prefix_dependencies( Event $event ) {
		$io = $event->getIO();

		if ( ! $event->isDevMode() ) {
			$io->write( 'Not prefixing dependencies.' );

			return;
		}

		$io->write( 'Prefixing dependencies...' );

		$event_dispatcher = $event->getComposer()->getEventDispatcher();
		$event_dispatcher->dispatchScript( 'prefix-dependencies', $event->isDevMode() );
	}

	/**
	 * Wraps class_exists to make this better testable.
	 *
	 * @codeCoverageIgnore
	 *
	 * @param string $class Class to test for existence.
	 *
	 * @return bool True if the class exists.
	 */
	protected function class_exists( $class ) {
		return class_exists( $class ) || interface_exists( $class );
	}

	/**
	 * Wraps class alias to make it better testable.
	 *
	 * @codeCoverageIgnore
	 *
	 * @param string $base  Base class to use for the alias.
	 * @param string $alias Class to create an alias for.
	 *
	 * @return bool True on successful alias.
	 */
	protected function class_alias( $base, $alias ) {
		// @codingStandardsIgnoreLine PHPCompatibility.PHP.NewFunctions.class_aliasFound -- PHP >= 5.3 only.
		return class_alias( $base, $alias );
	}
}
