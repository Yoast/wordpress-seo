<?php
/**
 * Presenter of the title for post type singles.
 *
 * @package Yoast\YoastSEO\Presenters
 */

namespace Yoast\WP\Free\Presenters\Post_Type;

use Yoast\WP\Free\Models\Indexable;
use Yoast\WP\Free\Presenters\Abstract_Title_Presenter;

/**
 * Class Title_Presenter
 */
class Title_Presenter extends Abstract_Title_Presenter {

	/**
	 * Generates the title for an indexable.
	 *
	 * @param Indexable $indexable The indexable.
	 *
	 * @return string The title.
	 */
	public function generate( Indexable $indexable ) {
		if ( $indexable->title ) {
			return $indexable->title;
		}

		$post_type = \get_post_type( $indexable->object_id );

		return \WPSEO_Options::get( 'title-' . $post_type );
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
}
