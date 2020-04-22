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
			'<div id="yoast-indexation-warning" class="notice notice-success"><p>%1$s<br><br>%2$s</p></div>',
			\sprintf(
				/* translators: 1: Strong start tag, 2: Strong closing tag, 3: Button start tag to open the indexation modal, 4: Button closing tag, 5: Button start tag to dismiss the warning, 6: Button closing tag. */
				\esc_html__( '%1$sNEW:%2$s %3$s can now store your site’s SEO data in a smarter way! %4$sClick here to speed up your site now%5$s.', 'wordpress-seo' ),
				'<strong>',
				'</strong>',
				'Yoast SEO',
				\sprintf(
					'<button type="button" class="button-link yoast-open-indexation" data-title="%s">',
					\esc_attr__( 'Speeding up your site', 'wordpress-seo' )
				),
				'</button>'
			),
			\sprintf(
				/* translators: 1: Button start tag to dismiss the warning, 2: Button closing tag. */
				\esc_html__( 'Or %1$sdismiss this warning%2$s (everything will function as normal!).', 'wordpress-seo' ),
				\sprintf(
					'<button type="button" id="yoast-indexation-dismiss-button" class="button-link hide-if-no-js" data-nonce="%s">',
					\esc_js( \wp_create_nonce( 'wpseo-ignore' ) )
				),
				'</button>'
			)
		);
	}
}
