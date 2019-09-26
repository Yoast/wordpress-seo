<?php
/**
 * Presenter of the Twitter description title for term archives.
 *
 * @package Yoast\YoastSEO\Presenters
 */

namespace Yoast\WP\Free\Presenters\Term_Archive;

use Yoast\WP\Free\Models\Indexable;
use Yoast\WP\Free\Presenters\Abstract_Twitter_Description_Presenter;

/**
 * Class Twitter_Description_Presenter
 */
class Twitter_Description_Presenter extends Abstract_Twitter_Description_Presenter {

	/**
	 * Sets the meta description presenter for fallback purposes.
	 *
	 * @param Meta_Description_Presenter $meta_description_presenter
	 */
	public function __construct( Meta_Description_Presenter $meta_description_presenter ) {
		$this->meta_description_presenter = $meta_description_presenter;
	}

	/**
	 * Generates the Twitter description for an indexable.
	 *
	 * @param Indexable $indexable The indexable.
	 *
	 * @return string The meta description.
	 */
	public function generate( Indexable $indexable ) {
		if ( $indexable->twitter_description ) {
			return $indexable->twitter_description;
		}

		$twitter_description = $this->get_meta_description( $indexable );
		if ( $twitter_description ) {
			return $twitter_description;
		}

		$twitter_description = $this->from_description( $indexable );
		if ( $twitter_description ) {
			return $twitter_description;
		}

		return '';
	}

	/**
	 * Generates a description based on the excerpt.
	 *
	 * @param Indexable $indexable The indexable.
	 *
	 * @return string The excerpt description.
	 */
	protected function from_description( Indexable $indexable ) {
		return \wp_strip_all_tags( \term_description( $indexable->object_id ) );
	}

	/**
	 * Gets an object to be used as a source of replacement variables.
	 *
	 * @param Indexable $indexable The indexable.
	 *
	 * @return array A key => value array of variables that may be replaced.
	 */
	protected function get_replace_vars_object( Indexable $indexable ) {
		return get_term( $indexable->object_id, $indexable->object_sub_type );
	}
}
