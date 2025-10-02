<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\AI_Free_Sparks\Application;

use Yoast\WP\SEO\Helpers\Options_Helper;

/**
 * Handles the free sparks started on timestamp.
 *
 * @deprecated
 * @codeCoverageIgnore
 */
class Free_Sparks_Handler implements Free_Sparks_Handler_Interface {

	/**
	 * The key used to store the timestamp when the user started using free sparks.
	 *
	 * @var string
	 */
	public const OPTION_KEY = 'ai_free_sparks_started_on';

	/**
	 * Holds the options helper instance.
	 *
	 * @var Options_Helper
	 */
	private $options_helper;

	/**
	 * Class constructor.
	 *
	 * @deprecated
	 * @codeCoverageIgnore
	 *
	 * @param Options_Helper $options_helper The options helper.
	 */
	public function __construct( Options_Helper $options_helper ) {
		\_deprecated_function( __METHOD__, 'Yoast SEO ', 'Yoast\WP\SEO\AI\Free_Sparks\Application\Free_Sparks_Handler::__construct' );

		$this->options_helper = $options_helper;
	}

	/**
	 * Retrieves the timestamp.
	 *
	 * @deprecated
	 * @codeCoverageIgnore
	 *
	 * @param string $format The format in which to return the timestamp. Defaults to 'Y-m-d H:i:s'.
	 *
	 * @return ?string The timestamp when the user started using free sparks, or null if not set.
	 */
	public function get( string $format = 'Y-m-d H:i:s' ): ?string {
		\_deprecated_function( __METHOD__, 'Yoast SEO ', 'Yoast\WP\SEO\AI\Free_Sparks\Application\Free_Sparks_Handler::get' );

		$timestamp = $this->options_helper->get( self::OPTION_KEY, null );
		if ( $timestamp === null ) {
			return null;
		}

		return \gmdate( $format, (int) $timestamp );
	}

	/**
	 * Registers the starting of the free sparks.
	 *
	 * @deprecated
	 * @codeCoverageIgnore
	 *
	 * @param ?int $timestamp The timestamp when the user started using free sparks. If null, the current time will be
	 *                        used.
	 *
	 * @return bool True if the operation was successful, false otherwise.
	 */
	public function start( ?int $timestamp = null ): bool {
		\_deprecated_function( __METHOD__, 'Yoast SEO ', 'Yoast\WP\SEO\AI\Free_Sparks\Application\Free_Sparks_Handler::start' );

		return (bool) $this->options_helper->set( self::OPTION_KEY, ( $timestamp === null ) ? \time() : $timestamp, 'wpseo' );
	}
}
