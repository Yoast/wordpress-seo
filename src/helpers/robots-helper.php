<?php
/**
 * A helper object for the robots meta tag.
 *
 * @package Yoast\WP\Free\Helpers
 */

namespace Yoast\WP\Free\Helpers;

use Yoast\WP\Free\Models\Indexable;

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
		// The option `blog_public` is set in Settings > Reading > Search Engine Visibility.
		if ( (string) \get_option( 'blog_public' ) === '0' ) {
			$robots['index'] = 'noindex';
		};

		// When users view a reply to a comment, this URL parameter is set. These should never be indexed separately.
		if ( isset( $_GET['replytocom'] ) ) {
			$robots['index'] = 'noindex';
		};

		// Remove null values.
		$robots = array_filter( $robots );

		// If robots index and follow are set, they can be excluded because they are default values.
		if ( $robots['index'] === 'index' && $robots['follow'] === 'follow' ) {
			unset( $robots['index'], $robots['follow'] );
		}

		return $robots;
	}
}
