<?php
/**
 * Presenter of the meta description for post type singles.
 *
 * @package Yoast\YoastSEO\Presenters
 */

namespace Yoast\WP\Free\Presenters\Post_Type;

use WPSEO_Post_Type;
use Yoast\WP\Free\Models\Indexable;
use Yoast\WP\Free\Presenters\Abstract_Robots_Presenter;

/**
 * Class Robots_Presenter
 */
class Robots_Presenter extends Abstract_Robots_Presenter {

	/**
	 * Generates the robots output for an indexable.
	 *
	 * @param Indexable $indexable The indexable.
	 *
	 * @return string The robots output.
	 */
	protected function generate( Indexable $indexable ) {
		$robots = [
			'index'        => $indexable->is_robots_noindex === '1' ? 'noindex' : 'index',
			'follow'       => $indexable->is_robots_nofollow === '1' ? 'nofollow' : 'follow',
			'noimageindex' => $indexable->is_robots_noimageindex === '1' ? 'noimageindex' : null,
			'noarchive'    => $indexable->is_robots_noarchive === '1' ? 'noarchive' : null,
			'nosnippet'    => $indexable->is_robots_nosnippet === '1' ? 'nosnippet' : null,
		];

		$private = \get_post_status( $indexable->object_id ) === 'private';
		$noindex = ! WPSEO_Post_Type::is_post_type_indexable( $indexable->object_id );

		// The option `blog_public` is set in Settings > Reading > Search Engine Visibility.
		$is_blog_private = (string) get_option( 'blog_public' ) === '0';

		// When users view a reply to a comment, this URL parameter is set. These should never be indexed separately.
		$is_reply_to_comment = isset( $_GET['replytocom'] );

		if ( $noindex || $private || $is_blog_private || $is_reply_to_comment ) {
			$robots['index'] = 'noindex';
		}

		$robots = array_filter( $robots );

		$robots_string = implode( ',', $robots );
		$robots_string = preg_replace( '`^index,follow,?`', '', $robots_string );

		return $robots_string;
	}
}
