<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\AI_Free_Sparks\Application;

/**
 * Interface Free_Sparks_Handler_Interface
 *
 * This interface defines the methods for handling free sparks.
 *
 * @deprecated 26.2
 * @codeCoverageIgnore
 */
interface Free_Sparks_Handler_Interface {

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
	public function get( string $format = 'Y-m-d H:i:s' ): ?string;

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
	public function start( ?int $timestamp = null ): bool;
}
