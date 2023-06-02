<?php

namespace Yoast\WP\SEO\Indexables\Domain\Exceptions;

use Exception;

class No_Outdated_Posts_Found_Exception extends Exception {

	/**
	 * Named constructor for create this exception for when the repository finds no outdated posts left.
	 *
	 * @return No_Outdated_Posts_Found_Exception The exception.
	 */
	public static function because_no_outdated_posts_queried() {
		return new self(
			'No outdated posts found.'
		);
	}
}
