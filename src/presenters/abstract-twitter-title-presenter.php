<?php
/**
 * Abstract presenter class for the Twitter title.
 *
 * @package Yoast\YoastSEO\Presenters
 */

namespace Yoast\WP\Free\Presenters;

use Yoast\WP\Free\Models\Indexable;

/**
 * Class Abstract_Twitter_Title_Presenter
 */
abstract class Abstract_Twitter_Title_Presenter implements Presenter_Interface {
	/**
	 * @var \WPSEO_Replace_Vars
	 */
	protected $replace_vars_helper;

	/**
	 * Generates the Twitter title for an indexable.
	 *
	 * @param Indexable $indexable The indexable.
	 *
	 * @return string The Twitter title.
	 */
	abstract public function generate( Indexable $indexable );

	/**
	 * Returns the Twitter title.
	 *
	 * @param Indexable $indexable The indexable.
	 *
	 * @return string The Twitter title tag.
	 */
	public function present( Indexable $indexable ) {
		$twitter_title = $this->filter( $this->generate( $indexable ) );
		$twitter_title = $this->replace_vars( $twitter_title, $indexable );

		if ( is_string( $twitter_title ) && $twitter_title !== '' ) {
			return sprintf( '<meta name="twitter:title" content="%s" />', $twitter_title );
		}

		return '';
	}

	/**
	 * @required
	 *
	 * Sets the replace vars helper, used by DI.
	 *
	 * @param \WPSEO_Replace_Vars $replace_vars_helper The replace vars helper.
	 */
	public function set_replace_vars_helper( \WPSEO_Replace_Vars $replace_vars_helper ) {
		$this->replace_vars_helper = $replace_vars_helper;
	}

	/**
	 * Retrieves twitter_title from the indexable.
	 *
	 * @param Indexable $indexable The indexable.
	 *
	 * @return string The Twitter title or an empty string when not found.
	 */
	protected function retrieve_twitter_title( Indexable $indexable ) {
		if ( $indexable->twitter_title ) {
			return $indexable->twitter_title;
		}

		return '';
	}

	/**
	 * Gets an object to be used as a source of replacement variables.
	 *
	 * @param Indexable $indexable The indexable.
	 *
	 * @return array A key => value array of variables that may be replaced.
	 */
	protected function get_replace_vars_object( Indexable $indexable ) {
		return \get_post( $indexable->object_id );
	}

	/**
	 * Run the Twitter title through the `wpseo_twitter_title` filter.
	 *
	 * @param string $twitter_title The Twitter title to filter.
	 *
	 * @return string The filtered Twitter title.
	 */
	private function filter( $twitter_title ) {
		/**
		 * Filter: 'wpseo_twitter_title' - Allow changing the Twitter title.
		 *
		 * @api string $twitter_title The Twitter title.
		 */
		return (string) trim( \apply_filters( 'wpseo_twitter_title', $twitter_title ) );
	}

	/**
	 * Replace replacement variables in the Twitter title.
	 *
	 * @param string    $twitter_title The Twitter title.
	 * @param Indexable $indexable     The indexable.
	 *
	 * @return string The Twitter title with replacement variables replaced.
	 */
	private function replace_vars( $twitter_title, Indexable $indexable ) {
		return $this->replace_vars_helper->replace( $twitter_title, $this->get_replace_vars_object( $indexable ) );
	}
}
