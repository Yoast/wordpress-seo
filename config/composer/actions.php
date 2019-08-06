<?php
/**
 * Yoast SEO Plugin File.
 *
 * @package Yoast\YoastSEO\Composer
 */

namespace Yoast\WP\Free\Composer;

use Composer\Script\Event;
use Yoast\WP\Free\Dependency_Injection\Container_Compiler;

/**
 * Class to handle Composer actions and events.
 */
class Actions {

	/**
	 * Prefixes dependencies if composer install is ran with dev mode.
	 *
	 * Used in composer in the post-install script hook.
	 *
	 * @codeCoverageIgnore
	 *
	 * @param \Composer\Script\Event $event Composer event that triggered this script.
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
	 * Compiles the dependency injection container.
	 *
	 * Used the composer compile-dependency-injection-container command.
	 *
	 * @codeCoverageIgnore
	 *
	 * @param \Composer\Script\Event $event Composer event that triggered this script.
	 *
	 * @return void
	 */
	public static function compile_dependency_injection_container( Event $event ) {
		$io = $event->getIO();

		$io->write( 'Compiling the dependency injection container...' );

		// Pas true as debug to force a recheck of the container.
		Container_Compiler::compile( true );

		$io->write( 'The dependency injection container has been compiled.' );
	}
}
