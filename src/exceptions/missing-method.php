<?php
/**
 * Exception to use when a method does not exist.
 *
 * @package Yoast\YoastSEO\Exceptions
 */

namespace Yoast\YoastSEO\Exceptions;

/**
 * The exception when a method does not exists.
 */
class Missing_Method extends \Exception {

	/**
	 * Creates exception for a method that does not exists in a class.
	 *
	 * @param string $method     The method that does not exists.
	 * @param string $class_name The class name.
	 *
	 * @return static Instance of the exception.
	 */
	public static function for_class( $method, $class_name ) {
		return new static(
			sprintf(
				/* translators: %1$s expands to the method name. %2$s expands to the class name */
				__( 'Method %1$s() does not exist in class %2$s', 'wordpress-seo' ),
				$method,
				$class_name
			)
		);
	}
}
