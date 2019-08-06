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

		/**
		 * Prefix generally used defines.
		 *
		 * @param string $file_path The path of the current file.
		 * @param string $prefix   The prefix to be used.
		 * @param string $content  The content of the specific file.
		 *
		 * @return string The modified content.
		 */
		function( $file_path, $prefix, $content ) {
			return str_replace(
				array( 'define(\'', 'defined(\'' ),
				array(
					'define(__NAMESPACE__ . \'\\',
					'defined(__NAMESPACE__ . \'\\',
				),
				$content
			);
		},
	),

	/*
	 * By default, PHP-Scoper only prefixes code where the namespace is non-global. In other words, non-namespaced
	 * code is not prefixed. This leaves the majority of classes, functions and constants in PHP - and most extensions,
	 * untouched.
	 *
	 * This is not necessarily a desirable outcome for vendor dependencies which are also not namespaced. To ensure
	 * they are isolated, you can configure the following which can be a list of strings or callables taking a string
	 * (the class name) as an argument and return a boolean (true meaning the class is going to prefixed).
	 *
	 * For more, see https://github.com/humbug/php-scoper#global-namespace-whitelisting
	 */
	'global_namespace_whitelist' => array(
		/**
		 * @param string $class_name The class name that is being parsed.
		 */
		function( $class_name ) {
			return strpos( $class_name, 'Ruckusing' ) === 0;
		},
		/**
		 * @param string $class_name The class name that is being parsed.
		 */
		function( $class_name ) {
			return strpos( $class_name, 'Task_' ) === 0;
		},
	),
);
