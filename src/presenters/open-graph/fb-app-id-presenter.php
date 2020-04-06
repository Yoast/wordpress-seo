<?php
/**
 * Presenter class for the Open Graph FB app ID.
 *
 * @package Yoast\YoastSEO\Presenters\Open_Graph
 */

namespace Yoast\WP\SEO\Presenters\Open_Graph;

use Yoast\WP\SEO\Presentations\Indexable_Presentation;
use Yoast\WP\SEO\Presenters\Abstract_Indexable_Presenter;

/**
 * Class FB_App_ID_Presenter
 */
class FB_App_ID_Presenter extends Abstract_Indexable_Presenter {

	/**
	 * Returns the Facebook app ID tag.
	 *
	 * @return string The Facebook app ID tag.
	 */
	public function present() {
		$fb_app_id = $this->presentation->open_graph_fb_app_id;

		if ( $fb_app_id !== '' ) {
			return \sprintf( '<meta property="fb:app_id" content="%s" />', \esc_attr( $fb_app_id ) );
		}

		return '';
	}
}
