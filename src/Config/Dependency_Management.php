<?php

namespace Yoast\YoastSEO\Config;

use Composer\Script\Event;
use Composer\Installer\PackageEvent;

class Dependency_Management {
	/**
	 * Registers the autoloader to create class aliases when needed.
	 *
	 * @return void
	 */
	public function initialize() {
		// Prepend the autoloader to the stack, allowing for discovery of prefixed classes.
		spl_autoload_register( array( $this, 'ensureClassAlias' ), true, true );
	}

	/**
	 * Makes sure a class alias is created when a base class exists.
	 *
	 * @param string $class Class to create alias for.
	 *
	 * @return void
	 */
	public function ensureClassAlias( $class ) {
		// If the namespace beings with the dependency class prefix, make an alias for regular class.
		if ( strpos( $class, YOAST_VENDOR_NS_PREFIX ) !== 0 ) {
			return;
		}

		$base = substr( $class, strlen( YOAST_VENDOR_NS_PREFIX ) + 1 );
		if ( ! class_exists( $base ) ) {
			return;
		}

		class_alias( $base, $class );
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
	public static function prefixDependencies( Event $event ) {
		$io = $event->getIO();

		if ( ! $event->isDevMode() ) {
			$io->write( 'Not prefixing dependencies.' );

			return;
		}

		$io->write( 'Prefixing dependencies...' );

		$event_dispatcher = $event->getComposer()->getEventDispatcher();
		$event_dispatcher->dispatchScript( 'prefix-dependencies', $event->isDevMode() );
	}
}
