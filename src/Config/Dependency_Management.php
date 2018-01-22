<?php

namespace Yoast\YoastSEO\Config;

use Composer\Script\Event;
use Composer\Installer\PackageEvent;

class Dependency_Management {
	/**
	 * Registers the autoloader to create class aliases when needed.
	 *
	 * @return bool True on success, false on failure.
	 */
	public function initialize() {
		// Prepend the autoloader to the stack, allowing for discovery of prefixed classes.
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

		$base = substr( $class, strlen( YOAST_VENDOR_NS_PREFIX ) + 1 );
		if ( ! $this->class_exists( $base ) ) {
			return;
		}

		$this->class_alias( $base, $class );
	}

	/**
	 * Checks if the prefixes are available.
	 *
	 * @return bool
	 */
	public function prefixed_available() {
		static $available = null;

		if ( $available === null ) {
			// @todo determine if this is the best way to check for existing prefixed dependencies.
			$available = is_file( WPSEO_PATH . YOAST_VENDOR_PREFIX_DIRECTORY . '/dependencies-prefixed.txt' );
		}

		return $available;
	}

	/**
	 * Prefixes dependencies if composer install is ran with dev mode.
	 *
	 * Used in composer in the post-install script hook.
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
	 * @param $base
	 *
	 * @return bool
	 */
	protected function class_exists( $base ) {
		return class_exists( $base );
	}

	/**
	 * @param string $base
	 * @param string $alias
	 *
	 * @return bool
	 */
	protected function class_alias( $base, $alias ) {
		return class_alias( $base, $alias );
	}
}
