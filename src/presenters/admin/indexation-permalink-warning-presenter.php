<?php
/**
 * Presenter class for the warning that is given when the Category URLs (stripcategorybase) option is touched.
 *
 * @package Yoast\YoastSEO\Presenters\Admin
 */

namespace Yoast\WP\SEO\Presenters\Admin;

use WPSEO_Shortlinker;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Presenters\Abstract_Presenter;

/**
 * Indexation_Permalink_Warning_Presenter class.
 */
class Indexation_Permalink_Warning_Presenter extends Indexation_Warning_Presenter {

	/**
	 * Presents the warning that your site's content is not fully indexed.
	 *
	 * @return string The warning HTML.
	 */
	public function present() {
		$output = '<div id="yoast-indexation-warning" class="notice notice-success">';
		$output .= $this->get_base_alert();
		$output .= '<hr />';
		$output .= '<p>';
		$output .= \sprintf(
			/* translators: 1: Button start tag to dismiss the warning, 2: Button closing tag. */
			\esc_html__( '%1$sHide this notice%2$s (everything will continue to function normally)', 'wordpress-seo' ),
			\sprintf(
				'<button type="button" id="yoast-indexation-dismiss-button" class="button-link hide-if-no-js" data-nonce="%s">',
				\esc_js( \wp_create_nonce( 'wpseo-ignore' ) )
			),
			'</button>'
		);
		$output .= '</p>';
		$output .= '</div>';

		return $output;
	}

	/**
	 * Retrieves the base alert.
	 *
	 * @return string The generated alert.
	 */
	protected function get_base_alert() {
		$output = '<p>';
		$output .= \esc_html__( 'Because you changed the category URL setting, some of your SEO data need to be reprocessed.', 'wordpress-seo' );
		$output .= '</p>';
		$output .= $this->get_estimate();
		$output .= \sprintf(
			'<button type="button" class="button yoast-open-indexation" data-title="<strong>%1$s</strong>" data-settings="yoastIndexationData">%2$s</button>',
			/* translators: 1: Expands to Yoast. */
			\sprintf( \esc_html__( '%1$s indexing status', 'wordpress-seo' ), 'Yoast' ),
			\esc_html__( 'Start processing and speed up your site now', 'wordpress-seo' )
		);

		return $output;
	}
}
