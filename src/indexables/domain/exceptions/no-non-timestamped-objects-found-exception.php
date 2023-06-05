<?php

namespace Yoast\WP\SEO\Indexables\Domain\Exceptions;

class No_Non_Timestamped_Objects_Found_Exception extends \Exception {

	/**
	 * Named constructor to create this exception for when the repository finds no objects left.
	 *
	 * @return No_Non_Timestamped_Objects_Found_Exception The exception.
	 */
	public static function because_no_objects_queried() {
		return new self(
			'No objects found.'
		);
	}
}
