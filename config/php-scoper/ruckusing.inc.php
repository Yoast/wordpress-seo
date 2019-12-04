<?php

declare( strict_types=1 );

use Isolated\Symfony\Component\Finder\Finder;

return array(

	/*
	 * By default when running php-scoper add-prefix, it will prefix all relevant code found in the current working
	 * directory. You can however define which files should be scoped by defining a collection of Finders in the
	 * following configuration key.
	 *
	 * For more see: https://github.com/humbug/php-scoper#finders-and-paths
	 */
	'finders'                    => array(
		Finder::create()->files()->in( 'vendor/ruckusing/ruckusing-migrations' )
								 ->exclude( [ 'config', 'tests', 'lib/Task/Hello' ] )
								 ->name( [ '*.php', 'LICENSE', 'composer.json' ] ),
	),

	/*
	 * When scoping PHP files, there will be scenarios where some of the code being scoped indirectly references the
	 * original namespace. These will include, for example, strings or string manipulations. PHP-Scoper has limited
	 * support for prefixing such strings. To circumvent that, you can define patchers to manipulate the file to your
	 * heart contents.
	 *
	 * For more see: https://github.com/humbug/php-scoper#patchers
	 */
	'patchers'                   => array(
		/**
		 * Replaces the Adapter string references with the prefixed versions.
		 *
		 * @param string $filePath The path of the current file.
		 * @param string $prefix   The prefix to be used.
		 * @param string $content  The content of the specific file.
		 *
		 * @return string The modified content.
		 */
		function( $file_path, $prefix, $content ) {
			if ( substr( $file_path, -33 ) !== 'lib/Ruckusing/FrameworkRunner.php' ) {
				return $content;
			}

			$replaced = preg_replace(
				'/\$adapter_class = "Ruckusing_Adapter_(MySQL|PgSQL|Sqlite3)_Base"/',
				sprintf( '$adapter_class = "\%s\Ruckusing_Adapter_\\1_Base"', $prefix ),
				$content
			);

			$replaced = str_replace(
				"\set_error_handler(array('Ruckusing_Exception', 'errorHandler'), \E_ALL);",
				sprintf( '\set_error_handler(array(\'\%s\Ruckusing_Exception\', \'errorHandler\'), \E_ALL);', $prefix ),
				$replaced
			);

			$replaced = str_replace(
				"\set_exception_handler(array('Ruckusing_Exception', 'exceptionHandler'));",
				sprintf( '\set_exception_handler(array(\'\%s\Ruckusing_Exception\', \'exceptionHandler\'));', $prefix ),
				$replaced
			);

			return $replaced;
		},

		/**
		 * Replaces a string reference to a class with the prefixed version.
		 *
		 * @param string $file_path The path of the current file.
		 * @param string $prefix   The prefix to be used.
		 * @param string $content  The content of the specific file.
		 *
		 * @return string The modified content.
		 */
		function( $file_path, $prefix, $content ) {
			if ( substr( $file_path, -27 ) !== 'Ruckusing/Util/Migrator.php' ) {
				return $content;
			}

			$replaced = str_replace(
				'"Ruckusing_Util_Migrator"',
				sprintf( '"\%s\Ruckusing_Util_Migrator"', $prefix ),
				$content
			);

			return $replaced;
		},

		/**
		 * Prefixes the Namespace prefix define.
		 *
		 * @param string $file_path The path of the current file.
		 * @param string $prefix   The prefix to be used.
		 * @param string $content  The content of the specific file.
		 *
		 * @return string The modified content.
		 */
		function( $file_path, $prefix, $content ) {
			if ( substr( $file_path, -25 ) !== 'Ruckusing/Util/Naming.php' ) {
				return $content;
			}

			$replaced = str_replace(
				'const CLASS_NS_PREFIX = \'Task_\'',
				sprintf( 'const CLASS_NS_PREFIX = \'\%s\Task_\'', $prefix ),
				$content
			);

			return $replaced;
		},

		/**
		 * Escapes the namespace for use in a regex match.
		 *
		 * @param string $file_path The path of the current file.
		 * @param string $prefix   The prefix to be used.
		 * @param string $content  The content of the specific file.
		 *
		 * @return string The modified content.
		 */
		function( $file_path, $prefix, $content ) {
			if ( substr( $file_path, -25 ) !== 'Ruckusing/Util/Naming.php' ) {
				return $content;
			}

			$replaced = str_replace(
				'preg_match(\'/\' . self::CLASS_NS_PREFIX . \'/\'',
				'preg_match(\'/\' . preg_quote(self::CLASS_NS_PREFIX) . \'/\'',
				$content
			);

			return $replaced;
		},
	),

	/*
	 * By default, PHP-Scoper will not prefix the user defined constants, classes and functions belonging to the global
	 * namespace. You can however change that setting for them to be prefixed as usual unless explicitly whitelisted.
	 *
	 * https://github.com/humbug/php-scoper#whitelist
	 */
	'whitelist-global-constants' => false,
	'whitelist-global-classes' => false,
	'whitelist' => [ 'FALSE', 'NULL' ],
);
