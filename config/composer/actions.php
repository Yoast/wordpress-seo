<?php

namespace Yoast\WP\SEO\Composer;

use Composer\Script\Event;
use Exception;
use ReflectionException;
use RuntimeException;
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
			'1' => [
				'label'   => 'Check staged files for coding standard warnings & errors.',
				'command' => 'check-staged-cs',
			],
			'2' => [
				'label'   => 'Check current branch\'s changed files for coding standard warnings & errors.',
				'command' => 'check-branch-cs',
			],
			'3' => [
				'label'   => 'Check for all coding standard errors.',
				'command' => 'check-cs',
			],
			'4' => [
				'label'   => 'Check for all coding standard warnings & errors.',
				'command' => 'check-cs-warnings',
			],
			'5' => [
				'label'   => 'Fix auto-fixable coding standards.',
				'command' => 'fix-cs',
			],
			'6' => [
				'label'   => 'Verify coding standard violations are below thresholds.',
				'command' => 'check-cs-thresholds',
			],
		];

		$args = $event->getArguments();
		if ( empty( $args ) ) {
			foreach ( $choices as $choice => $data ) {
				$io->write( \sprintf( '%d. %s', $choice, $data['label'] ) );
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
		Container_Compiler::compile(
			true,
			__DIR__ . '/../../src/generated/container.php',
			__DIR__ . '/../dependency-injection/services.php',
			__DIR__ . '/../../vendor/composer/autoload_classmap.php',
			'Yoast\WP\SEO\Generated'
		);

		$io->write( 'The dependency injection container has been compiled.' );
	}

	/**
	 * Runs lint on the staged files.
	 *
	 * Used the composer lint-files command.
	 *
	 * @param Event $event Composer event that triggered this script.
	 *
	 * @return void
	 */
	public static function lint_branch( Event $event ) {
		$branch = 'trunk';

		$args = $event->getArguments();
		if ( ! empty( $args ) ) {
			$branch = $args[0];
		}

		exit( self::lint_changed_files( $branch ) );
	}

	/**
	 * Runs lint on the staged files.
	 *
	 * Used the composer lint-files command.
	 *
	 * @return void
	 */
	public static function lint_staged() {
		exit( self::lint_changed_files( '--staged' ) );
	}

	/**
	 * Runs PHPCS on the staged files.
	 *
	 * Used by the composer check-branch-cs command.
	 *
	 * @param Event $event Composer event that triggered this script.
	 *
	 * @return void
	 */
	public static function check_branch_cs( Event $event ) {
		$branch = 'trunk';

		$args = $event->getArguments();
		if ( ! empty( $args ) ) {
			$branch = $args[0];
		}

		exit( self::check_cs_for_changed_files( $branch ) );
	}

	/**
	 * Runs lint on changed files compared to some git reference.
	 *
	 * @param string $compare The git reference.
	 *
	 * @return int Exit code from the lint command.
	 */
	private static function lint_changed_files( $compare ) {
		\exec( 'git diff --name-only --diff-filter=d ' . \escapeshellarg( $compare ), $files );

		$php_files = self::filter_files( $files, '.php' );
		if ( empty( $php_files ) ) {
			echo 'No files to compare! Exiting.' . \PHP_EOL;

			return 0;
		}

		\system( 'composer lint-files -- ' . \implode( ' ', \array_map( 'escapeshellarg', $php_files ) ), $exit_code );

		return $exit_code;
	}

	/**
	 * Runs PHPCS on changed files compared to some git reference.
	 *
	 * @param string $compare The git reference.
	 *
	 * @return int Exit code passed from the coding standards check.
	 */
	private static function check_cs_for_changed_files( $compare ) {
		\exec( 'git diff --name-only --diff-filter=d ' . \escapeshellarg( $compare ), $files );

		$php_files = self::filter_files( $files, '.php' );
		if ( empty( $php_files ) ) {
			echo 'No files to compare! Exiting.' . \PHP_EOL;

			return 0;
		}

		/*
		 * In CI, generate both the normal report as well as the checkstyle report.
		 * The normal report will be shown in the actions output and ensures human readable (and colorized!) results there.
		 * The checkstyle report is used to show the results inline in the GitHub code view.
		 */
		$extra_args = ( \getenv( 'CI' ) === false ) ? '' : ' --colors --report-full --report-checkstyle=./phpcs-report.xml';
		$command    = \sprintf(
			'composer check-cs-warnings -- %s %s',
			\implode( ' ', \array_map( 'escapeshellarg', $php_files ) ),
			$extra_args
		);
		\system( $command, $exit_code );

		return $exit_code;
	}

	/**
	 * Filter files on extension.
	 *
	 * @param array  $files     List of files.
	 * @param string $extension Extension to filter on.
	 *
	 * @return array Filtered list of files.
	 */
	private static function filter_files( $files, $extension ) {
		return \array_filter(
			$files,
			static function( $file ) use ( $extension ) {
				return \substr( $file, ( 0 - \strlen( $extension ) ) ) === $extension;
			}
		);
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

	/**
	 * Checks if the CS errors and warnings are below or at thresholds.
	 *
	 * @return void
	 */
	public static function check_cs_thresholds() {
		$in_ci = \getenv( 'CI' );

		echo 'Running coding standards checks, this may take some time.', \PHP_EOL;

		$command = 'composer check-cs-warnings -- -mq --report="YoastCS\\Yoast\\Reports\\Threshold"';
		if ( $in_ci !== false ) {
			// Always show the results in CI in color.
			$command .= ' --colors';
		}
		// phpcs:ignore WordPress.PHP.NoSilencedErrors.Discouraged -- Non-WP context, this is fine.
		@\exec( $command, $phpcs_output, $return );

		$phpcs_output = \implode( \PHP_EOL, $phpcs_output );
		echo $phpcs_output;

		$above_threshold = true;
		if ( \strpos( $phpcs_output, 'Coding standards checks have passed!' ) !== false ) {
			$above_threshold = false;
		}

		/*
		 * Don't run the branch check in CI/GH Actions as it prevents the errors from being show inline.
		 * The GH Actions script will run this via a separate script step.
		 */
		if ( $above_threshold === true && $in_ci === false ) {
			echo \PHP_EOL;
			echo 'Running check-branch-cs.', \PHP_EOL;
			echo 'This might show problems on untouched lines. Focus on the lines you\'ve changed first.', \PHP_EOL;
			echo \PHP_EOL;

			// phpcs:ignore WordPress.PHP.NoSilencedErrors.Discouraged -- Non-WP context, this is fine.
			@\passthru( 'composer check-branch-cs' );
		}

		exit( ( $above_threshold === true || $return > 2 ) ? $return : 0 );
	}

	/**
	 * Generates a unit test template for a class with the
	 * fully qualified class name given as the command line argument.
	 *
	 * @param Event $event Composer event.
	 *
	 * @throws ReflectionException When the class to generate the unit test for cannot be found.
	 * @throws RuntimeException    When the required command line argument is missing.
	 */
	public static function generate_unit_test( Event $event ) {
		$args = $event->getArguments();

		if ( empty( $args[0] ) ) {
			throw new RuntimeException(
				'You must provide an argument with the fully qualified class name' .
				'for which you want a unit test to be generated.'
			);
		}

		$fqn = $args[0];

		echo 'Generating unit test for ', $fqn, \PHP_EOL;

		$generator = new Unit_Test_Generator();
		try {
			$path = $generator->generate( $fqn );
			\printf( 'Unit test generated at \'%s\'' . \PHP_EOL, $path );
		}
		catch ( Exception $exception ) {
			throw $exception;
		}
	}
}
