<?php

/**
 * Presenter of the Twitter title for post type singles.
 *
 * @package Yoast\YoastSEO\Presenters
 */

namespace Yoast\WP\Free\Presenters\Post_Type;

use Yoast\WP\Free\Models\Indexable;
use Yoast\WP\Free\Presenters\Abstract_Twitter_Title_Presenter;

/**
 * Class Twitter_Title_Presenter
 */
class Twitter_Title_Presenter extends Abstract_Twitter_Title_Presenter {

	/**
	 * @var Title_Presenter
	 */
	protected $title_presenter;

	/**
	 * Class constructor.
	 *
	 * @param Title_Presenter $title_presenter
	 */
	public function __construct( Title_Presenter $title_presenter ) {
		$this->title_presenter = $title_presenter;
	}

	/**
	 * Generates the Twitter title for an indexable.
	 *
	 * @param Indexable $indexable The indexable.
	 *
	 * @return string The Twitter title.
	 */
	public function generate( Indexable $indexable ) {

		$twitter_title = $this->retrieve_twitter_title( $indexable );
		if ( $twitter_title ) {
			return $twitter_title;
		}

		$twitter_title = $this->single_title( \WPSEO_Frontend_Page_Type::get_simple_page_id() );
		if ( $twitter_title ) {
			return $twitter_title;
		}

		// When no Twitter-specific title can be found, use the general title to fall back on.
		$twitter_title = $this->title_presenter->generate( $indexable );
		if ( $twitter_title ) {
			return $twitter_title;
		}

		return '';
	}

	/**
	 * Returns the Twitter title for a single post.
	 *
	 * @param int $post_id Post ID.
	 *
	 * @return string
	 */
	private function single_title( $post_id = 0 ) {
		$title = \WPSEO_Meta::get_value( 'twitter-title', $post_id );
		if ( ! is_string( $title ) ) {
			return '';
		}

		return $title;
	}
}
