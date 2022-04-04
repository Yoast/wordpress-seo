<?php

namespace Yoast\WP\SEO\Exceptions\Option;

/**
 * Unimplemented method exception class.
 */
class Method_Unimplemented_Exception extends Abstract_Option_Exception {

	/**
	 * Creates exception for a method that is not implemented in a class.
	 *
	 * @param string $method     The method that does not exist.
	 * @param string $class_name The class name.
	 *
	 * @return static Instance of the exception.
	 */
	public static function for_method( $method, $class_name ) {
		return new static(
			\sprintf(
			/* translators: %1$s expands to the method name. %2$s expands to the class name. */
				\__( 'Method %1$s() is not implemented in class %2$s', 'wordpress-seo' ),
				$method,
				$class_name
			)
		);
	}
}
