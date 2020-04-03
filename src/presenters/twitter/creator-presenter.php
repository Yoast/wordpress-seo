<?php
/**
 * Presenter class for the Open Graph title.
 *
 * @package Yoast\YoastSEO\Presenters\Twitter
 */

namespace Yoast\WP\SEO\Presenters\Twitter;

use Yoast\WP\SEO\Presenters\Abstract_Indexable_Presenter;

/**
 * Class Creator_Presenter
 */
class Creator_Presenter extends Abstract_Indexable_Presenter {
	/**
	 * Presents the Twitter creator meta tag.
	 *
	 * @return string The Twitter creator tag.
	 */
	public function present() {
		$twitter_creator = $this->presentation->twitter_creator;

		if ( \is_string( $twitter_creator ) && $twitter_creator !== '' ) {
			return \sprintf( '<meta name="twitter:creator" content="%s" />', \esc_attr( $twitter_creator ) );
		}

		return '';
	}
}
