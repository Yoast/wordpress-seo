<?php
/**
 * Presenter class for the indexation warning.
 *
 * @package Yoast\YoastSEO\Presenters\Admin
 */

namespace Yoast\WP\SEO\Presenters\Admin;

use Yoast\WP\SEO\Presenters\Abstract_Presenter;

/**
 * Indexation_Warning_Presenter class.
 */
class Indexation_Warning_Presenter extends Abstract_Presenter {

	/**
	 * Presents the warning that your site's content is not fully indexed.
	 *
	 * @return string The warning HTML.
	 */
	public function present() {
		return \sprintf(
			'<div id="yoast-indexation-warning" class="notice notice-warning"><p><strong>%1$s</strong> %2$s</p></div>',
			\sprintf(
				/* translators: 1: Link start tag to open the indexation modal, 2: Link closing tag. */
				\esc_html__( 'Yoast SEO needs to index your site to have the best performance. Please %1$sindex your site now%2$s.', 'wordpress-seo' ),
				'<button type="button" id="yoast-open-indexation" class="button-link">',
				'</button>'
			),
			\sprintf(
				\esc_html__( 'Or %1$sdismiss this warning%2$s.', 'wordpress-seo' ),
				'<button type="button" id="yoast-indexation-dismiss-button" class="button-link hide-if-no-js" data-nonce="' . \esc_js( wp_create_nonce( 'wpseo-ignore' ) ) . '">',
				'</button>'
			)
		);
	}
}
