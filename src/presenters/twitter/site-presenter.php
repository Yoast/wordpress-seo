<?php
/**
 * Presenter class for the Twitter site.
 *
 * @package Yoast\YoastSEO\Presenters\Twitter
 */

namespace Yoast\WP\Free\Presenters\Twitter;

use Yoast\WP\Free\Presentations\Indexable_Presentation;
use Yoast\WP\Free\Presenters\Abstract_Indexable_Presenter;

/**
 * Class Site_Presenter
 */
class Site_Presenter extends Abstract_Indexable_Presenter {

	/**
	 * Returns the Twitter site.
	 *
	 * @param Indexable_Presentation $presentation The presentation of an indexable.
	 *
	 * @return string The Twitter site tag.
	 */
	public function present( Indexable_Presentation $presentation ) {
		$twitter_site = $this->filter( $presentation->twitter_site, $presentation );
		$twitter_site = $this->get_twitter_id( $twitter_site );

		if ( \is_string( $twitter_site ) && $twitter_site !== '' ) {
			return \sprintf( '<meta name="twitter:site" content="%s" />', \esc_attr( '@' . $twitter_site ) );
		}

		return '';
	}

	/**
	 * Run the Twitter site through the `wpseo_twitter_site` filter.
	 *
	 * @param string                 $twitter_site The Twitter site to filter.
	 * @param Indexable_Presentation $presentation The presentation of an indexable.
	 *
	 * @return string The filtered Twitter site.
	 */
	private function filter( $twitter_site, Indexable_Presentation $presentation ) {
		/**
		 * Filter: 'wpseo_twitter_site' - Allow changing the Twitter site account as output in the Twitter card by Yoast SEO.
		 *
		 * @api string $twitter_site Twitter site account string.
		 *
		 * @param Indexable_Presentation $presentation The presentation of an indexable.
		 */
		return \apply_filters( 'wpseo_twitter_site', $twitter_site, $presentation );
	}

	/**
	 * Checks if the given id is actually an id or a url and if url, distills the id from it.
	 *
	 * Solves issues with filters returning urls and theme's/other plugins also adding a user meta
	 * twitter field which expects url rather than an id (which is what we expect).
	 *
	 * @param string $id Twitter ID or url.
	 *
	 * @return string|bool Twitter ID or false if it failed to get a valid Twitter ID.
	 */
	private function get_twitter_id( $id ) {
		if ( \preg_match( '`([A-Za-z0-9_]{1,25})$`', $id, $match ) ) {
			return $match[1];
		}

		return false;
	}
}
