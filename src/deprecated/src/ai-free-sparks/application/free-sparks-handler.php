<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\AI_Free_Sparks\Application;

use Yoast\WP\SEO\Helpers\Options_Helper;

/**
 * Handles the free sparks started on timestamp.
 *
 * @deprecated 26.2
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
	 * @deprecated 26.2
	 * @codeCoverageIgnore
	 *
	 * @param Options_Helper $options_helper The options helper.
	 */
	public function __construct( Options_Helper $options_helper ) {
		\_deprecated_function( __METHOD__, 'Yoast SEO 26.2', 'Yoast\WP\SEO\AI\Free_Sparks\Application\Free_Sparks_Handler::__construct' );
	}

	/**
	 * Retrieves the timestamp.
	 *
	 * @deprecated 26.2
	 * @codeCoverageIgnore
	 *
	 * @param string $format The format in which to return the timestamp. Defaults to 'Y-m-d H:i:s'.
	 *
	 * @return ?string The timestamp when the user started using free sparks, or null if not set.
	 */
	public function get( string $format = 'Y-m-d H:i:s' ): ?string {
		\_deprecated_function( __METHOD__, 'Yoast SEO 26.2', 'Yoast\WP\SEO\AI\Free_Sparks\Application\Free_Sparks_Handler::get' );

		return null;
	}

	/**
	 * Registers the starting of the free sparks.
	 *
	 * @deprecated 26.2
	 * @codeCoverageIgnore
	 *
	 * @param ?int $timestamp The timestamp when the user started using free sparks. If null, the current time will be
	 *                        used.
	 *
	 * @return bool True if the operation was successful, false otherwise.
	 */
	public function start( ?int $timestamp = null ): bool {
		\_deprecated_function( __METHOD__, 'Yoast SEO 26.2', 'Yoast\WP\SEO\AI\Free_Sparks\Application\Free_Sparks_Handler::start' );

		return null;
	}
}
