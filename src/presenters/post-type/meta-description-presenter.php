<?php
/**
 * Presenter of the meta description for post type singles.
 *
 * @package Yoast\YoastSEO\Presenters
 */

namespace Yoast\WP\Free\Presenters\Post_Type;

use WPSEO_Options;
use Yoast\WP\Free\Models\Indexable;
use Yoast\WP\Free\Presenters\Abstract_Meta_Description_Presenter;

/**
 * Class Meta_Description_Presenter
 */
class Meta_Description_Presenter extends Abstract_Meta_Description_Presenter {

	/**
	 * Generates the meta description for an indexable.
	 *
	 * @param Indexable $indexable The indexable.
	 *
	 * @return string The meta description.
	 */
	public function generate( Indexable $indexable ) {
		if ( $indexable->description ) {
			return $indexable->description;
		}

		return WPSEO_Options::get( 'metadesc-' . $indexable->object_sub_type );
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
