<?php
/**
 * A helper object for the robots meta tag.
 *
 * @package Yoast\WP\Free\Helpers
 */

namespace Yoast\WP\Free\Helpers;

use Yoast\WP\Free\Models\Indexable;
use Yoast\WP\Free\Presentations\Indexable_Presentation;

/**
 * Class Robots_Helper
 */
class Robots_Helper {

	/**
	 * Gets the default robots settings applicable for all types of pages.
	 *
	 * @param Indexable $indexable The indexable.
	 *
	 * @return array The base robots values.
	 */
	public function get_base_values( Indexable $indexable ) {
		return [
			'index'  => ( $indexable->is_robots_noindex === true ) ? 'noindex' : 'index',
			'follow' => ( $indexable->is_robots_nofollow === true ) ? 'nofollow' : 'follow',
		];
	}

	/**
	 * Applies global settings and does clean-up for the robots settings for all types of pages.
	 *
	 * @param array $robots The robots settings.
	 *
	 * @return array The robots settings with applied changes.
	 */
	public function after_generate( array $robots ) {

		return $robots;
	}

	/**
	 * Sets the robots index to no index.
	 *
	 * @param string                 $robots       The current robots value.
	 * @param Indexable_Presentation $presentation Presentation.
	 *
	 * @return string The altered robots string.
	 */
	public function set_robots_no_index( $robots, Indexable_Presentation $presentation ) {
		if ( ! in_array( 'noindex', $presentation->robots, true ) ) {
			return $robots;
		}

		$new_robots          = $presentation->robots;
		$new_robots['index'] = 'noindex';

		return implode( ',', $new_robots );
	}
}
