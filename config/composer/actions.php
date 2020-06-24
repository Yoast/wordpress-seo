<?php
/**
 * Yoast SEO Plugin File.
 *
 * @package Yoast\YoastSEO\Composer
 */

namespace Yoast\WP\SEO\Composer;

use Composer\Script\Event;
use Exception;
use Symfony\Component\DependencyInjection\ContainerBuilder;
use Yoast\WP\SEO\Dependency_Injection\Container_Compiler;

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
	 * @param Event $event Composer event that triggered this script.
	 *
	 * @return void
	 */
	public static function prefix_dependencies( Event $event ) {
		$io = $event->getIO();

		if ( ! $event->isDevMode() ) {
			$io->write( 'Not prefixing dependencies, due to not being in dev move.' );

			return;
		}

		if ( ! \file_exists( __DIR__ . '/../../vendor/bin/php-scoper' ) ) {
			$io->write( 'Not prefixing dependencies, due to PHP scoper not being installed' );

			return;
		}

		$io->write( 'Prefixing dependencies...' );

		$event_dispatcher = $event->getComposer()->getEventDispatcher();
		$event_dispatcher->dispatchScript( 'prefix-dependencies', $event->isDevMode() );
	}

	/**
	 * Provides a coding standards option choice.
	 *
	 * @param Event $event Composer event.
	 */
	public static function check_coding_standards( Event $event ) {
		$io = $event->getIO();

		$choices = [
			'1' => [ 'label' => 'Check staged files for coding standard warnings & errors.', 'command' => 'check-staged-cs' ],
			'2' => [ 'label' => 'Check current branch\'s changed files for coding standard warnings & errors.', 'command' => 'check-branch-cs' ],
			'3' => [ 'label' => 'Check for all coding standard errors.', 'command' => 'check-cs' ],
			'4' => [ 'label' => 'Check for all coding standard warnings & errors.', 'command' => 'check-cs-warnings' ],
			'5' => [ 'label' => 'Fix auto-fixable coding standards.', 'command' => 'fix-cs' ],
			'6' => [ 'label' => '[Premium] Check for coding standard warnings and errors.', 'command' => 'premium-check-cs' ],
			'7' => [ 'label' => '[Premium] Fix auto-fixable coding standards.', 'command' => 'premium-fix-cs' ],
			'8' => [ 'label' => 'Load coding standards configuration.', 'command' => 'config-yoastcs' ],
		];

		$args = $event->getArguments();
		if ( empty( $args ) ) {
			foreach ( $choices as $choice => $data ) {
				$io->write( sprintf( '%d. %s', $choice, $data['label'] ) );
			}

			$choice = $io->ask( 'What do you want to do? ' );
		}
		else {
			$choice = $args[0];
		}

		if ( isset( $choices[ $choice ] ) ) {
			$event_dispatcher = $event->getComposer()->getEventDispatcher();
			$event_dispatcher->dispatchScript( $choices[ $choice ]['command'] );
		}
		else {
			$io->write( 'Unknown choice.' );
		}
	}

	/**
	 * Compiles the dependency injection container.
	 *
	 * Used the composer compile-dependency-injection-container command.
	 *
	 * @codeCoverageIgnore
	 *
	 * @param Event $event Composer event that triggered this script.
	 *
	 * @return void
	 */
	public static function compile_dependency_injection_container( Event $event ) {
		$io = $event->getIO();

		if ( ! \class_exists( ContainerBuilder::class ) ) {
			$io->write( 'Not compiling dependency injection container, due to the container builder not being installed' );

			return;
		}

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
	 * @param Event $event Composer event that triggered this script.
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
			function( $file ) {
				return \substr( $file, -4 ) === '.php';
			}
		);

		if ( empty( $files ) ) {
			echo 'No files to compare! Exiting.' . PHP_EOL;

			return;
		}

		\system( 'composer check-cs -- ' . \implode( ' ', \array_map( 'escapeshellarg', $files ) ) );
	}

	/**
	 * Generates a migration.
	 *
	 * @param Event $event Composer event that triggered this script.
	 *
	 * @return void
	 *
	 * @throws Exception If no migration name is provided.
	 */
	public static function generate_migration( Event $event ) {
		$args = $event->getArguments();
		if ( empty( $args[0] ) ) {
			throw new Exception( 'You must provide an argument with the migration name.' );
		}
		$name      = $args[0];
		$timestamp = \gmdate( 'YmdHis', \time() );

		// Camelcase the name.
		$name  = \preg_replace( '/\\s+/', '_', $name );
		$parts = \explode( '_', $name );
		$name  = '';
		foreach ( $parts as $word ) {
			$name .= \ucfirst( $word );
		}

		$correct_class_name_regex = '/^[a-zA-Z_\\x7f-\\xff][a-zA-Z0-9_\\x7f-\\xff]*$/';
		if ( ! \preg_match( $correct_class_name_regex, $name ) ) {
			throw new Exception( "$name is not a valid migration name." );
		}
		if ( \class_exists( $name ) ) {
			throw new Exception( "A class with the name $name already exists." );
		}

		$file_name = $timestamp . '_' . $name . '.php';

		$template = <<<TPL
<?php
/**
 * Yoast SEO Plugin File.
 *
 * @package Yoast\WP\SEO\Config\Migrations
 */

namespace Yoast\WP\SEO\Config\Migrations;

use Yoast\WP\Lib\Migrations\Migration;

/**
 * {$name} class.
 */
class {$name} extends Migration {

	/**
	 * The plugin this migration belongs to.
	 *
	 * @var string
	 */
	public static \$plugin = 'free';

	/**
	 * Migration up.
	 *
	 * @return void
	 */
	public function up() {

	}

	/**
	 * Migration down.
	 *
	 * @return void
	 */
	public function down() {

	}
}

TPL;

		\file_put_contents( __DIR__ . '/../../src/config/migrations/' . $file_name, $template );
	}
}
