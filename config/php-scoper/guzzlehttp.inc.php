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
		// Excluded: Guzzle's own cURL and stream handlers, cookie jars, pools, retry and log middleware, multipart bodies.
		Finder::create()->files()->in( 'vendor/guzzlehttp/guzzle' )->name( [ '*.php', 'LICENSE', 'composer.json' ] )
			->exclude( 'src/Cookie' )
			->notName(
				[
					'CurlFactory.php',
					'CurlFactoryInterface.php',
					'CurlHandler.php',
					'CurlMultiHandler.php',
					'CurlVersion.php',
					'EasyHandle.php',
					'HeaderProcessor.php',
					'HostValidator.php',
					'MockHandler.php',
					'Proxy.php',
					'ProxyEnvironment.php',
					'StreamHandler.php',
					'TlsVersion.php',
					'MessageFormatter.php',
					'MessageFormatterInterface.php',
					'Pool.php',
					'RetryMiddleware.php',
				],
			),
		Finder::create()->files()->in( 'vendor/guzzlehttp/promises' )->exclude( 'vendor-bin' )->name( [ '*.php', 'LICENSE', 'composer.json' ] ),
		Finder::create()->files()->in( 'vendor/guzzlehttp/psr7' )->name( [ '*.php', 'LICENSE', 'composer.json' ] )
			->notName(
				[
					'AppendStream.php',
					'CachingStream.php',
					'FnStream.php',
					'HttpFactory.php',
					'InflateStream.php',
					'LazyOpenStream.php',
					'LimitStream.php',
					'MimeType.php',
					'MultipartStream.php',
					'NoSeekStream.php',
					'ServerRequest.php',
					'StreamWrapper.php',
					'UploadedFile.php',
					'UriNormalizer.php',
				],
			),
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
		 * Replaces the Adapter string references with the prefixed versions.
		 *
		 * @param string $filePath The path of the current file.
		 * @param string $prefix   The prefix to be used.
		 * @param string $content  The content of the specific file.
		 *
		 * @return string The modified content.
		 */
		function( $file_path, $prefix, $content ) {
			// 18 is the length of the Middleware.php file path.
			if ( substr( $file_path, -18 ) === 'src/Middleware.php' ) {
				return str_replace(
					sprintf( '%s\\\\cookies must be an instance of GuzzleHttp\\\\Cookie\\\\CookieJarInterface', $prefix ),
					sprintf( 'cookies must be an instance of %s\\\\GuzzleHttp\\\\Cookie\\\\CookieJarInterface', $prefix ),
					$content
				);
			}

			if ( substr( $file_path, -14 ) === 'src/Client.php' ) {
				// A WordPress environment doesn't support idn_conversion so we disable it.
				return str_replace(
					"'idn_conversion' => \\true",
					"'idn_conversion' => \\false",
					$content
				);
			}

			return $content;
		},
	],

];
