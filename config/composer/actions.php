<?php

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
		Container_Compiler::compile( true );

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
	 * Used the composer check-staged-cs command.
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
			echo 'No files to compare! Exiting.' . PHP_EOL;

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
			echo 'No files to compare! Exiting.' . PHP_EOL;

			return 0;
		}

		\system( 'composer check-cs-warnings -- ' . \implode( ' ', \array_map( 'escapeshellarg', $php_files ) ), $exit_code );

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
			function( $file ) use ( $extension ) {
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
	 * Extract the number of errors, warnings and affected files from the phpcs summary
	 *
	 * Thanks for the inspiration from https://github.com/OXID-eSales/coding_standards_wrapper
	 *
	 * @param array $output Raw console output of the PHPCS command.
	 *
	 * @return array ['error_count' = (int), 'warning_count' = (int)] Errors and warnings found by PHPCS.
	 */
	private static function extract_cs_statistics( $output ) {
		$result  = false;
		$matches = [];

		/**
		 * The only key of the filtered array already holds the summary.
		 * $summary is NULL, if the summary was not present in the output
		 */
		$summary = array_filter(
			$output,
			static function( $value ) {
				return strpos( $value, 'A TOTAL OF' ) !== false;
			}
		);

		// Extract the stats for the summary.
		if ( $summary ) {
			preg_match(
				'/A TOTAL OF (?P<error_count>\d+) ERRORS AND (?P<warning_count>\d+) WARNINGS WERE FOUND IN \d+ FILES/',
				end( $summary ),
				$matches
			);
		}

		// Validate the result of extraction.
		if ( isset( $matches['error_count'] ) && isset( $matches['warning_count'] ) ) {
			// We need integers for the further processing.
			$result = array_map( 'intval', $matches );
		}

		return $result;
	}

	/**
	 * Checks if the CS errors and warnings are below or at thresholds.
	 *
	 * Thanks for the inspiration from https://github.com/OXID-eSales/coding_standards_wrapper
	 */
	public static function check_cs_thresholds() {
		$error_threshold   = (int) getenv( 'YOASTCS_THRESHOLD_ERRORS' );
		$warning_threshold = (int) getenv( 'YOASTCS_THRESHOLD_WARNINGS' );

		echo "Running coding standards checks, this may take some time.\n";
		$command = 'composer check-cs-summary';
		// phpcs:ignore WordPress.PHP.NoSilencedErrors.Discouraged -- Non-WP context, this is fine.
		@exec( $command, $phpcs_output, $return );

		$statistics = self::extract_cs_statistics( $phpcs_output );
		if ( ! $statistics ) {
			echo 'Error occurred when parsing the coding standards results.' . PHP_EOL;
			exit( 1 );
		}

		echo PHP_EOL;
		echo 'CODE SNIFFER RESULTS' . PHP_EOL;
		echo '--------------------' . PHP_EOL;

		$error_count   = $statistics['error_count'];
		$warning_count = $statistics['warning_count'];

		self::color_line_success(
			"Coding standards errors: $error_count/$error_threshold.",
			( $error_count <= $error_threshold )
		);

		self::color_line_success(
			"Coding standards warnings: $warning_count/$warning_threshold.",
			( $warning_count <= $warning_threshold )
		);

		$above_threshold = false;

		if ( $error_count > $error_threshold ) {
			echo "Please fix any errors introduced in your code and run composer check-cs-warnings to verify.\n";
			$above_threshold = true;
		}

		if ( $error_count < $error_threshold ) {
			echo PHP_EOL;
			echo "Found less errors than the threshold, great job!\n";
			echo "Please update the error threshold in the composer.json file to $error_count.\n";
		}

		if ( $warning_count > $warning_threshold ) {
			echo "Please fix any warnings introduced in your code and run check-cs-thresholds to verify.\n";
			$above_threshold = true;
		}

		if ( $warning_count < $warning_threshold ) {
			echo PHP_EOL;
			echo "Found less warnings than the threshold, great job!\n";
			echo "Please update the warning threshold in the composer.json file to $warning_count.\n";
		}

		if ( ! $above_threshold ) {
			echo PHP_EOL;
			echo "Coding standards checks have passed!\n";
		}

		if ( $above_threshold ) {
			echo "\n";
			echo "Running check-branch-cs.\n";
			echo "This might show problems on untouched lines. Focus on the lines you've changed first.\n";
			echo "\n";

			// phpcs:ignore WordPress.PHP.NoSilencedErrors.Discouraged -- Non-WP context, this is fine.
			@passthru( 'composer check-branch-cs' );
		}

		exit( ( $above_threshold ) ? 1 : 0 );
	}

	/**
	 * Color the output of the line.
	 *
	 * @param string $line  Line to output.
	 * @param string $color Color to give the line.
	 *
	 * @returns void
	 */
	private static function color_line( $line, $color ) {
		echo $color . $line . "\e[0m\n";
	}

	/**
	 * Color the line based on success status.
	 *
	 * @param string $line    Line to output.
	 * @param bool   $success Success status.
	 *
	 * @returns void
	 */
	private static function color_line_success( $line, $success ) {
		self::color_line( $line, ( $success ) ? "\e[32m" : "\e[31m" );
	}

	/**
	 * Generates a unit test template for a class with the
	 * fully qualified class name given as the command line argument.
	 *
	 * @param Event $event Composer event.
	 *
	 * @throws \ReflectionException When the class to generate the unit test for cannot be found.
	 * @throws \RuntimeException    When the required command line argument is missing.
	 */
	public static function generate_unit_test( Event $event ) {
		$args = $event->getArguments();

		if ( empty( $args[0] ) ) {
			throw new \RuntimeException(
				'You must provide an argument with the fully qualified class name' .
				'for which you want a unit test to be generated.'
			);
		}

		$fqn = $args[0];

		echo 'Generating unit test for ', $fqn;

		\Unit_Test_Generator::generate( $fqn );
	}
}
