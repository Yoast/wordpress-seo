<?php
/**
 * Yoast SEO plugin file.
 *
 * @package Yoast\WP\SEO\Exceptions\SEMrush
 */

namespace Yoast\WP\SEO\Exceptions\SEMrush;

/**
 * Class SEMrush_Failed_Token_Storage_Exception
 */
class SEMrush_Failed_Token_Storage_Exception extends \Exception {

	const DEFAULT_MESSAGE = 'Token storing failed. Please try again.';

	/**
	 * SEMrush_Failed_Token_Storage_Exception constructor.
	 *
	 * @param string $reason The reason why token storage failed. Optional.
	 */
	public function __construct( $reason = '' ) {
		$message = ( $reason ) ? sprintf( 'Token storing failed. Reason: %s. Please try again', $reason ) : self::DEFAULT_MESSAGE;

		parent::__construct( $message, 500 );
	}
}
