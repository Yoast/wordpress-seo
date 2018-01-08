<?php

declare( strict_types=1 );

use Isolated\Symfony\Component\Finder\Finder;

return array(
	// By default when running php-scoper add-prefix, it will prefix all relevant code found in the current working
	// directory. You can however define which files should be scoped by defining a collection of Finders in the
	// following configuration key.
	//
	// For more see: https://github.com/humbug/php-scoper#finders-and-paths
	'finders'                    => array(
		Finder::create()->files()->in( 'vendor/ruckusing/ruckusing-migrations' ),
	),

	// When scoping PHP files, there will be scenarios where some of the code being scoped indirectly references the
	// original namespace. These will include, for example, strings or string manipulations. PHP-Scoper has limited
	// support for prefixing such strings. To circumvent that, you can define patchers to manipulate the file to your
	// heart contents.
	//
	// For more see: https://github.com/humbug/php-scoper#patchers
	'patchers'                   => array(
		function( string $filePath, string $prefix, string $content ): string {
			if ( substr( $filePath, -33) !== 'lib/Ruckusing/FrameworkRunner.php' ) {
				return $content;
			}

			$replaced = preg_replace(
				'/\$adapter_class = "Ruckusing_Adapter_(MySQL|PgSQL|Sqlite3)_Base"/',
				sprintf( '$adapter_class = "\%s\Ruckusing_Adapter_\\1_Base"', $prefix ),
				$content
			);

			return $replaced;
		},
		function( string $filePath, string $prefix, string $content ): string {
			if ( substr( $filePath, -27) !== 'Ruckusing/Util/Migrator.php' ) {
				return $content;
			}

			$replaced = str_replace(
				'"Ruckusing_Util_Migrator"',
				sprintf( '"\%s\Ruckusing_Util_Migrator"', $prefix ),
				$content
			);

			return $replaced;
		},
		function( string $filePath, string $prefix, string $content ): string {
			if ( substr( $filePath, -25) !== 'Ruckusing/Util/Naming.php' ) {
				return $content;
			}

			$replaced = str_replace(
				'const CLASS_NS_PREFIX = \'Task_\'',
				sprintf( 'const CLASS_NS_PREFIX = \'\%s\Task_\'', $prefix ),
				$content
			);

			return $replaced;
		},

		function( string $filePath, string $prefix, string $content ): string {
			if ( substr( $filePath, -25) !== 'Ruckusing/Util/Naming.php' ) {
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

	// By default, PHP-Scoper only prefixes code where the namespace is non-global. In other words, non-namespaced
	// code is not prefixed. This leaves the majority of classes, functions and constants in PHP - and most extensions,
	// untouched.
	//
	// This is not necessarily a desirable outcome for vendor dependencies which are also not namespaced. To ensure
	// they are isolated, you can configure the following which can be a list of strings or callables taking a string
	// (the class name) as an argument and return a boolean (true meaning the class is going to prefixed).
	//
	// For more, see https://github.com/humbug/php-scoper#global-namespace-whitelisting
	'global_namespace_whitelist' => array(
		function( $className ) {
			return 0 === strpos( $className, 'Ruckusing' );
		},
		function( $className ) {
			return 0 === strpos( $className, 'Task_' );
		},
	),

	// PHP-Scoper's goal is to make sure that all code for a project lies in a distinct PHP namespace. However, you
	// may want to share a common API between the bundled code of your PHAR and the consumer code. For example if
	// you have a PHPUnit PHAR with isolated code, you still want the PHAR to be able to understand the
	// PHPUnit\Framework\TestCase class.
	//
	// A way to achieve this is by specifying a list of classes to not prefix with the following configuration key. Note
	// that this does not work with functions or constants neither with classes belonging to the global namespace.
	//
	// Fore more see https://github.com/humbug/php-scoper#whitelist
	'whitelist'                  => array(
		'PHPUnit\Framework\TestCase',
	),
);
