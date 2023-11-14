<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Given it's a very specific case.
namespace Yoast\WP\SEO\Indexables\Domain\Exceptions;

/**
 * The No_Non_Timestamped_Objects_Found_Exception exception.
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
class No_Non_Timestamped_Objects_Found_Exception extends \Exception {

	/**
	 * Named constructor to create this exception for when the repository finds no objects left.
	 *
	 * @return No_Non_Timestamped_Objects_Found_Exception The exception.
	 */
	public static function because_no_objects_queried(): self {
		return new self(
			'No objects found.'
		);
	}
}
