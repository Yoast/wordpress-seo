<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Given it's a very specific case.
namespace Yoast\WP\SEO\Indexables\Domain\Exceptions;

use Exception;

/**
 * The No_Outdated_Posts_Found_Exception exception.
 */
class No_Outdated_Posts_Found_Exception extends Exception {

	/**
	 * Named constructor for create this exception for when the repository finds no outdated posts left.
	 *
	 * @return No_Outdated_Posts_Found_Exception The exception.
	 */
	public static function because_no_outdated_posts_queried(): self {
		return new self(
			'No outdated posts found.'
		);
	}
}
