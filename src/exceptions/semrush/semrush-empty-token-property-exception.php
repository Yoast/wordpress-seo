<?php namespace Yoast\WP\SEO\Exceptions\SEMrush;

/**
 * Class SEMrush_Empty_Token_Property_Exception
 * @package Yoast\WP\SEO\Exceptions\SEMrush
 */
class SEMrush_Empty_Token_Property_Exception extends \Exception {

	/**
	 * SEMrush_Empty_Token_Property_Exception constructor.
	 *
	 * @param string $property The property that is empty.
	 */
	public function __construct( $property ) {
		parent::__construct( sprintf( 'Token creation failed. Property `%s` cannot be empty.', $property ), 400 );
	}
}
