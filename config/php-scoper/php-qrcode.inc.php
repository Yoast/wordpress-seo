<?php

declare( strict_types=1 );

use Isolated\Symfony\Component\Finder\Finder;

return [

	/*
	 * By default when running php-scoper add-prefix, it will prefix all relevant code found in the current working
	 * directory. You can however define which files should be scoped by defining a collection of Finders in the
	 * following configuration key.
	 *
	 * For more see: https://github.com/humbug/php-scoper#finders-and-paths
	 */
	'finders' => [
		Finder::create()->files()->in( 'vendor/chillerlan/php-qrcode' )->name(
			[
				'LICENSE',
				'composer.json',
			]
		),
		Finder::create()->files()->in( 'vendor/chillerlan/php-qrcode/src' )->name( [ '*.php' ] ),
	],

	/*
	 * When scoping PHP files, there will be scenarios where some of the code being scoped indirectly references the
	 * original namespace. These will include, for example, strings or string manipulations. PHP-Scoper has limited
	 * support for prefixing such strings. To circumvent that, you can define patchers to manipulate the file to your
	 * heart contents.
	 *
	 * For more see: https://github.com/humbug/php-scoper#patchers
	 */
	'patchers' => [
		/**
		 * Fixes a bug in the SVG QR Code generator.
		 *
		 * The QRMarkup.php file contains a break statement that shouldn't be there in version 1.0.9 on line 96.
		 *
		 * @param string $filePath The path of the current file.
		 * @param string $prefix   The prefix to be used.
		 * @param string $content  The content of the specific file.
		 *
		 * @return string The modified content.
		 */
		function( $file_path, $prefix, $content ) {
			if ( \substr( $file_path, -23 ) !== 'src/Output/QRMarkup.php' ) {
				return $content;
			}

			$lines = explode( "\n", $content );
			if ( \trim( $lines[96] ) === 'break;' ) {
				unset( $lines[96] );
				$content = \implode( "\n", $lines );
			}
			else {
				// If this message is shown the QR output needs to be retested.
				// Remove the exception, run composer install again and test the QR code when printing pages.
				// If the QR code works then this entire function can be removed as the bug has been fixed in the source.
				// If the QR code doesn't work then this patcher must be updated.
				echo 'Unexpected files in the QRMarkup Patcher, please check config/php-scoper/php-qrcode.inc.php';
				exit( 1 );
			}

			return $content;
		},
	],

];
