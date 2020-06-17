<?php
/**
 * Presenter class for the warning that is given when the Category URLs (stripcategorybase) option is touched.
 *
 * @package Yoast\YoastSEO\Presenters\Admin
 */

namespace Yoast\WP\SEO\Presenters\Admin;

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
		$output .= '<p>';
		$output .= \esc_html__( 'Because you changed the category URL setting, some of your SEO data need to be reprocessed.', 'wordpress-seo' );
		$output .= '</p>';
		$output .= $this->get_estimate();
		$output .= $this->get_action( \esc_html__( 'Start processing and speed up your site now', 'wordpress-seo' ) );
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
}
