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
	'finders'                    => [
		Finder::create()->files()->in( 'vendor/symfony/polyfill-intl-idn' )->name( [
			'bootstrap.php', 'Idn.php', 'LICENSE', 'composer.json'
		] ),
	],

	/*
	 * When scoping PHP files, there will be scenarios where some of the code being scoped indirectly references the
	 * original namespace. These will include, for example, strings or string manipulations. PHP-Scoper has limited
	 * support for prefixing such strings. To circumvent that, you can define patchers to manipulate the file to your
	 * heart contents.
	 *
	 * For more see: https://github.com/humbug/php-scoper#patchers
	 */
	'patchers'                   => [
		/**
		 * Removes the namespace from the bootstrap file.
		 *
		 * @param string $filePath The path of the current file.
		 * @param string $prefix   The prefix to be used.
		 * @param string $content  The content of the specific file.
		 *
		 * @return string The modified content.
		 */
		function( $file_path, $prefix, $content ) {
			// 13 is the length of the bootstrap.php file name.
			if ( substr( $file_path, -13 ) !== 'bootstrap.php' ) {
				return $content;
			}

			$replaced = str_replace(
				sprintf ('namespace %s;', $prefix ),
				'',
				$content
			);

			return $replaced;
		},
	]

);
