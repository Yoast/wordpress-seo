<?php
/**
 * Presenter of the OpenGraph title for post type singles.
 *
 * @package Yoast\YoastSEO\Presenters
 */

namespace Yoast\WP\Free\Presenters\Post_Type;

use Yoast\WP\Free\Models\Indexable;
use Yoast\WP\Free\Presenters\Abstract_Open_Graph_Title_Presenter;

/**
 * Class OpenGraph_Title_Presenter
 */
class Open_Graph_Title_Presenter extends Abstract_Open_Graph_Title_Presenter {

	/**
	 * Generates the meta description for an indexable.
	 *
	 * @param Indexable $indexable The indexable.
	 *
	 * @return string The meta description.
	 */
	protected function generate( Indexable $indexable ) {
		if ( $indexable->og_title ) {
			return $indexable->og_title;
		}

		return $this->title_presenter->present( $indexable );
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
