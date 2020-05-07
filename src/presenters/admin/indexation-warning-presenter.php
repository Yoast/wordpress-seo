<?php
/**
 * Presenter class for the indexation warning.
 *
 * @package Yoast\YoastSEO\Presenters\Admin
 */

namespace Yoast\WP\SEO\Presenters\Admin;

use WPSEO_Shortlinker;
use Yoast\WP\SEO\Presenters\Abstract_Presenter;

/**
 * Indexation_Warning_Presenter class.
 */
class Indexation_Warning_Presenter extends Abstract_Presenter {

	/**
	 * The number of objects that need to be reindexed.
	 *
	 * @var int
	 */
	protected $total_unindexed;

	/**
	 * Indexation_Warning_Presenter constructor.
	 *
	 * @param int $total_unindexed The number of objects that need to be indexed.
	 */
	public function __construct( $total_unindexed ) {
		$this->total_unindexed = $total_unindexed;
	}

	/**
	 * Presents the warning that your site's content is not fully indexed.
	 *
	 * @return string The warning HTML.
	 */
	public function present() {
		$title = \sprintf(
			'<a href="%1$s" target="_blank">%2$s</a>',
			\esc_url( WPSEO_Shortlinker::get( 'https://yoast.com/' ) ),
			\sprintf(
				/* translators: 1: Expands to Yoast SEO. */
				\esc_html__( '%1$s creates and maintains an index of all of your site\'s SEO data in order to speed up your site.', 'wordpress-seo' ),
				'Yoast SEO'
			)
		);
		$explain = \sprintf(
			/* translators: 1: Link to article about indexing, 2: Anchor closing tag. */
			\esc_html__( 'To build your index, %1$s needs to process all of your content.', 'wordpress-seo' ),
			'Yoast SEO'
		);

		$estimate = '';
		if ( true ) {//$this->total_unindexed > 2500 ) {
			$estimate = \sprintf(
				'%1$s<br/><ul><li>- %2$s</li><li>- %3$s</li></ul>',
				\esc_html__( 'We estimate this could take a long time, due to the size of your site. As an alternative to waiting, you could:', 'wordpress-seo' ),
				\sprintf(
					/* translators: 1: Expands to Yoast SEO, 2: Button start tag for the reminder, 3: Button closing tag */
					\esc_html__( 'Wait for a week or so, until %1$s automatically processes most of your content in the background. %2$sRemind me in a week.%3$s', 'wordpress-seo' ),
					'Yoast SEO',
					\sprintf(
						'<button type="button" id="yoast-indexation-reminder-button" class="button-link hide-if-no-js" data-nonce="%s">',
						\esc_js( \wp_create_nonce( 'wpseo-ignore' ) )
					),
					'</button>'
				),
				\sprintf(
				/* translators: 1: Link to article about indexation command, 2: Anchor closing tag, 3: Link to WP CLI. */
					\esc_html__( '%1$sRun the indexation process on your server%2$s using %3$sWP CLI%2$s', 'wordpress-seo' ),
					\sprintf(
						'<a href="%1$s" target="_blank">',
						\esc_url( WPSEO_Shortlinker::get( 'https://yoast.com/' ) )
					),
					'</a>',
					'<a href="https://wp-cli.org/" target="_blank" rel="noopener noreferrer">'
				)
			);
		} else {
			$small_estimate = \date( 'ii:ss', $this->total_unindexed * 100 );
			$large_estimate = \date( 'ii:ss', $this->total_unindexed * 250 );
			$estimate       = \sprintf(
				/* translators: 1: Expands to the smaller estimate, 2: Expands to the bigger estimate. */
				esc_html__( 'We estimate this will take between %1$s and %2$s.', 'wordpress-seo' ),
				\human_time_diff( $small_estimate ),
				\human_time_diff( $large_estimate )
			);
		}

		$action = \sprintf(
		/* translators: 1: Button start tag to open the indexation modal, 2: Button closing tag. */
			\esc_html__( '%1$sStart processing and speed up your site now%2$s', 'wordpress-seo' ),
			\sprintf( '<button type="button" class="button yoast-open-indexation" data-title="<strong>%s</strong>">',
				\esc_html__( 'Yoast indexation status', 'wordpress-seo' ) ),
			'</button>'
		);
		$dismiss = \sprintf(
			/* translators: 1: Button start tag to dismiss the warning, 2: Button closing tag. */
			\esc_html__( '%1$sHide this notice%2$s (everything will continue to function normally)', 'wordpress-seo' ),
			\sprintf(
				'<button type="button" id="yoast-indexation-dismiss-button" class="button-link hide-if-no-js" data-nonce="%s">',
				\esc_js( \wp_create_nonce( 'wpseo-setoption' ) )
			),
			'</button>'
		);

		return \sprintf(
			'<div id="yoast-indexation-warning" class="notice notice-success"><p>%1$s</p><p>%2$s<br/>%3$s</p>%4$s<hr/><p>%5$s</p></div>',
			$title,
			$explain,
			$estimate,
			$action,
			$dismiss
		);
	}
}
