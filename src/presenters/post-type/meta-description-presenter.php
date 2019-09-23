<?php
/**
 * Presenter of the meta description for post type singles.
 *
 * @package Yoast\YoastSEO\Presenters
 */

namespace Yoast\WP\Free\Presenters\Post_Type;

use WPSEO_Options;
use WPSEO_Replace_Vars;
use Yoast\WP\Free\Models\Indexable;
use Yoast\WP\Free\Presenters\Abstract_Meta_Description_Presenter;

class Meta_Description_Presenter extends Abstract_Meta_Description_Presenter {

	/**
	 * @var \WPSEO_Replace_Vars
	 */
	protected $replacement_variables_helper;

	/**
	 * Meta_Description_Presenter constructor.
	 *
	 * @param \WPSEO_Replace_Vars  $replacement_variables_helper The replacement variables helper.
	 */
	public function __construct(
		WPSEO_Replace_Vars $replacement_variables_helper
	) {
		$this->replacement_variables_helper = $replacement_variables_helper;
	}

	/**
	 * Generates the meta description for an indexable.
	 *
	 * @param Indexable $indexable The indexable.
	 *
	 * @return string The meta description.
	 */
	protected function generate( Indexable $indexable ) {
		$meta_description = $indexable->description;

		if ( ! $meta_description ) {
			$meta_description = WPSEO_Options::get( 'metadesc-' . $indexable->object_sub_type );
		}

		$meta_description = $this->replacement_variables_helper->replace( $meta_description, \get_post( $indexable->object_id ) );

		/**
		 * Filter: 'wpseo_metadesc' - Allow changing the Yoast SEO meta description sentence.
		 *
		 * @api string $metadesc The description sentence.
		 */
		return apply_filters( 'wpseo_metadesc', trim( $meta_description ) );
	}
}
