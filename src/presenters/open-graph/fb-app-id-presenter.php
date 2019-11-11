<?php
/**
 * Presenter class for the OpenGraph FB app ID.
 *
 * @package Yoast\YoastSEO\Presenters\Open_Graph
 */

namespace Yoast\WP\Free\Presenters\Open_Graph;

use Yoast\WP\Free\Presentations\Indexable_Presentation;
use Yoast\WP\Free\Presenters\Abstract_Indexable_Presenter;

/**
 * Class FB_App_ID_Presenter
 */
class FB_App_ID_Presenter extends Abstract_Indexable_Presenter {
	/**
	 * Returns the Facebook app ID tag.
	 *
	 * @param Indexable_Presentation $presentation The presentation of an indexable.
	 *
	 * @return string The Facebook app ID tag.
	 */
	public function present( Indexable_Presentation $presentation ) {
		$fb_app_id = $presentation->og_fb_app_id;

		if ( $fb_app_id !== '' ) {
			return sprintf( '<meta property="fb:app_id" content="%s" />', \esc_attr( $fb_app_id ) );
		}

		return '';
	}
}
