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
<<<<<<< HEAD
	 * @param Indexable_Presentation $presentation The presentation of an indexable.
	 * @param bool                   $output_tag   Optional. Whether or not to output the HTML tag. Defaults to true.
	 *
	 * @return string The Facebook app ID tag.
	 */
	public function present( Indexable_Presentation $presentation, $output_tag = true ) {
		$fb_app_id = $presentation->open_graph_fb_app_id;
=======
	 * @return string The Facebook app ID tag.
	 */
	public function present() {
		$fb_app_id = $this->presentation->open_graph_fb_app_id;
>>>>>>> e2e9a4b81435c68471e9fd6075fb2ae7ffa3a8b1

		if ( $fb_app_id !== '' ) {
			if ( ! $output_tag ) {
				return $fb_app_id;
			}

			return \sprintf( '<meta property="fb:app_id" content="%s" />', \esc_attr( $fb_app_id ) );
		}

		return '';
	}
}
