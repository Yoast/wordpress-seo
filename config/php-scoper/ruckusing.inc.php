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
		/**
		 * Replaces the Adapter string references with the prefixed versions.
		 */
		function( $filePath, $prefix, $content ) {
			if ( substr( $filePath, -33 ) !== 'lib/Ruckusing/FrameworkRunner.php' ) {
				return $content;
			}

			$replaced = preg_replace(
				'/\$adapter_class = "Ruckusing_Adapter_(MySQL|PgSQL|Sqlite3)_Base"/',
				sprintf( '$adapter_class = "\%s\Ruckusing_Adapter_\\1_Base"', $prefix ),
				$content
			);

			return $replaced;
		},

		/**
		 * Replaces a string reference to a class with the prefixed version.
		 */
		function( $filePath, $prefix, $content ) {
			if ( substr( $filePath, -27 ) !== 'Ruckusing/Util/Migrator.php' ) {
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
		 */
		function( $filePath, $prefix, $content ) {
			if ( substr( $filePath, -25 ) !== 'Ruckusing/Util/Naming.php' ) {
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
		 */
		function( $filePath, $prefix, $content ) {
			if ( substr( $filePath, -25 ) !== 'Ruckusing/Util/Naming.php' ) {
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
		 * Prefix specific RUCKUSING_TASK_DIR only found in one specific file.
		 */
		function( $filePath, $prefix, $content ) {
			if ( substr( $filePath, -26 ) !== 'Ruckusing/Task/Manager.php' ) {
				return $content;
			}

			$prefix = str_replace( '\\', '_', $prefix );
			$prefix = strtoupper( $prefix );
			$prefix .= '__';

			$replaced = str_replace(
				'RUCKUSING_TASK_DIR',
				$prefix . 'RUCKUSING_TASK_DIR',
				$content
			);

			return $replaced;
		},

		/**
		 * Prefix generally used defines.
		 */
		function( $filePath, $prefix, $content ) {
			$prefix = str_replace( '\\', '_', $prefix );
			$prefix = strtoupper( $prefix );
			$prefix .= '__';

			$content = str_replace(
				array(
					'RUCKUSING_BASE',
					'RUCKUSING_TS_SCHEMA_TBL_NAME',
					'RUCKUSING_SCHEMA_TBL_NAME',
					'RUCKUSING_VERSION',
					'RUCKUSING_WORKING_BASE'
				),
				array(
					$prefix . 'RUCKUSING_BASE',
					$prefix . 'RUCKUSING_TS_SCHEMA_TBL_NAME',
					$prefix . 'RUCKUSING_SCHEMA_TBL_NAME',
					$prefix . 'RUCKUSING_VERSION',
					$prefix . 'RUCKUSING_WORKING_BASE'
				),
				$content
			);

			return $content;
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
);
