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

	/**
	 * Runs PHPCS on the staged files.
	 *
	 * Used the composer check-staged-cs command.
	 *
	 * @codeCoverageIgnore
	 *
	 * @return void
	 */
	public static function check_staged_cs() {
		self::check_cs_for_changed_files( '--staged' );
	}

	/**
	 * Runs PHPCS on the staged files.
	 *
	 * Used the composer check-staged-cs command.
	 *
	 * @codeCoverageIgnore
	 *
	 * @param \Composer\Script\Event $event Composer event that triggered this script.
	 *
	 * @return void
	 */
	public static function check_branch_cs( Event $event ) {
		$args = $event->getArguments();
		if ( empty( $args ) ) {
			self::check_cs_for_changed_files( 'trunk' );
			return;
		}
		self::check_cs_for_changed_files( $args[0] );
	}

	/**
	 * Runs PHPCS on changed files compared to some git reference.
	 *
	 * @param string $compare The git reference.
	 *
	 * @codeCoverageIgnore
	 *
	 * @return void
	 */
	private static function check_cs_for_changed_files( $compare ) {
		\exec( 'git diff --name-only --diff-filter=d ' . \escapeshellarg( $compare ), $files );
		$files = \array_filter(
			$files,
			function ( $file ) {
				return \substr( $file, -4 ) === '.php';
			}
		);

		if ( empty( $files ) ) {
			echo 'No files to compare! Exiting.';
			return;
		}

		\system( 'composer check-cs -- ' . \implode( ' ', \array_map( 'escapeshellarg', $files ) ) );
	}
}
