<?php
/**
 * Abstract presenter class for the Twitter description title.
 *
 * @package Yoast\YoastSEO\Presenters
 */

namespace Yoast\WP\Free\Presenters;

use WPSEO_Replace_Vars;
use Yoast\WP\Free\Models\Indexable;

/**
 * Class Abstract_Title_Presenter
 */
abstract class Abstract_Twitter_Description_Presenter implements Presenter_Interface {

	/**
	 * The presenter which will be used as fallback.
	 *
	 * @var Abstract_Meta_Description_Presenter
	 */
	protected $meta_description_presenter;

	/**
	 * Represents the replacement variables.
	 *
	 * @var WPSEO_Replace_Vars
	 */
	protected $replace_vars_helper;

	/**
	 * Generates the description and returns the meta value.
	 *
	 * @param Indexable $indexable The indexable to use.
	 *
	 * @return string The Twitter description tag.
	 */
	public function present( Indexable $indexable ) {
		$twitter_description = $this->generate( $indexable );
		$twitter_description = $this->filter( $twitter_description );
		$twitter_description = $this->replace_vars( $twitter_description, $indexable );

		if ( $twitter_description ) {
			return '<meta name="twitter:description" content="' . esc_attr( $twitter_description ) . '" />';
		}

		return '';
	}

	/**
	 * Generates the Twitter card type for an indexable.
	 *
	 * @param Indexable $indexable The indexable.
	 *
	 * @return string The title.
	 */
	abstract public function generate( Indexable $indexable );

	/**
	 * @required
	 *
	 * Sets the replace vars helper, used by DI.
	 *
	 * @param WPSEO_Replace_Vars $replace_vars_helper The replace vars helper.
	 */
	public function set_replace_vars_helper( WPSEO_Replace_Vars $replace_vars_helper ) {
		$this->replace_vars_helper = $replace_vars_helper;
	}

	/**
	 * Gets an object to be used as a source of replacement variables.
	 *
	 * @param Indexable $indexable The indexable.
	 *
	 * @return array A key => value array of variables that may be replaced.
	 */
	protected function get_replace_vars_object( Indexable $indexable ) {
		return [];
	}

	/**
	 * Run the Twitter description through the `wpseo_twitter_description` filter.
	 *
	 * @param string $twitter_description The Twitter description to filter.
	 *
	 * @return string The filtered Twitter description.
	 */
	private function filter( $twitter_description ) {
		/**
		 * Filter: 'wpseo_twitter_description' - Allow changing the Twitter description as output in the Twitter card by Yoast SEO.
		 *
		 * @api string $twitter_description The description string.
		 */
		return apply_filters( 'wpseo_twitter_description', $twitter_description );
	}

	/**
	 * Replace replacement variables in the title.
	 *
	 * @codeCoverageIgnore
	 *
	 * @param string    $title     The title.
	 * @param Indexable $indexable The indexable.
	 *
	 * @return string The title with replacement variables replaced.
	 */
	private function replace_vars( $title, Indexable $indexable ) {
		return $this->replace_vars_helper->replace( $title, $this->get_replace_vars_object( $indexable ) );
	}
}
