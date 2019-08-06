<?php

declare(strict_types = 1);

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
		Finder::create()->files()->in( 'vendor/j4mie/idiorm' )->name( [ 'idiorm.php', 'LICENSE', 'composer.json' ] ),
	),

	/*
	 * When scoping PHP files, there will be scenarios where some of the code being scoped indirectly references the
	 * original namespace. These will include, for example, strings or string manipulations. PHP-Scoper has limited
	 * support for prefixing such strings. To circumvent that, you can define patchers to manipulate the file to your
	 * heart contents.
	 *
	 * For more see: https://github.com/humbug/php-scoper#patchers
	 */
	'patchers'                   => array(),

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
		'ORM',
		function( $class_name ) {
			return strpos( $class_name, 'Idiorm' ) === 0;
		},
	),
);
