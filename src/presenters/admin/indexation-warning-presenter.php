<?php
/**
 * Presenter class for the indexation warning.
 *
 * @package Yoast\YoastSEO\Presenters\Admin
 */

namespace Yoast\WP\SEO\Presenters\Admin;

use WPSEO_Shortlinker;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Presenters\Abstract_Presenter;

/**
 * Indexation_Warning_Presenter class.
 */
class Indexation_Warning_Presenter extends Abstract_Presenter {

	/**
	 * The number of objects that needs to be indexed.
	 *
	 * @var int
	 */
	protected $total_unindexed;

	/**
	 * The options helper.
	 *
	 * @var Options_Helper
	 */
	private $options_helper;

	/**
	 * Indexation_Warning_Presenter constructor.
	 *
	 * @param int            $total_unindexed The number of objects that needs to be indexed.
	 * @param Options_Helper $options_helper  The options helper.
	 */
	public function __construct( $total_unindexed, Options_Helper $options_helper ) {
		$this->total_unindexed = $total_unindexed;
		$this->options_helper  = $options_helper;
	}

	/**
	 * Presents the warning that your site's content is not fully indexed.
	 *
	 * @return string The warning HTML.
	 */
	public function present() {
		$output = '<div id="yoast-indexation-warning" class="notice notice-success">';

		if ( $this->show_indexation_incomplete_alert() ) {
			$output .= $this->get_incomplete_indexation_alert();
		}
		else {
			$output .= $this->get_base_alert();
		}

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
	private function get_base_alert() {
		$output = \sprintf(
			'<p><a href="%1$s" target="_blank">%2$s</a></p>',
			\esc_url( WPSEO_Shortlinker::get( 'https://yoa.st/3-y' ) ),
			\sprintf(
				/* translators: 1: Expands to Yoast SEO. */
				\esc_html__( '%1$s creates and maintains an index of all of your site\'s SEO data in order to speed up your site.', 'wordpress-seo' ),
				'Yoast SEO'
			)
		);
		$output .= '<p>';
		$output .= \sprintf(
			/* translators: 1: Yoast SEO. */
			\esc_html__( 'To build your index, %1$s needs to process all of your content.', 'wordpress-seo' ),
			'Yoast SEO'
		);
		$output .= '</p>';
		$output .= $this->get_estimate();
		$output .= \sprintf(
			'<button type="button" class="button yoast-open-indexation" data-title="<strong>%1$s</strong>">%2$s</button>',
			/* translators: 1: Expands to Yoast. */
			\sprintf( \esc_html__( '%1$s indexing status', 'wordpress-seo' ), 'Yoast' ),
			\esc_html__( 'Start processing and speed up your site now', 'wordpress-seo' )
		);

		return $output;
	}

	/**
	 * Retrieves the incompleted indexation alert.
	 *
	 * @return string The generated alert.
	 */
	private function get_incomplete_indexation_alert() {
		$output = \sprintf(
			'<p><a href="%1$s" target="_blank">%2$s</a></p>',
			\esc_url( WPSEO_Shortlinker::get( 'https://yoa.st/3-x' ) ),
			\sprintf(
			/* translators: 1: Expands to Yoast SEO. */
				\esc_html__( '%1$s maintains an index of all of your site\'s SEO data in order to speed up your site.', 'wordpress-seo' ),
				'Yoast SEO'
			)
		);
		$output .= '<p>';
		$output .= \esc_html__( 'It looks like an indexing process was run earlier, but didn\'t complete. There is still some content which hasn\'t been indexed yet. Don\'t worry, you can pick up where you left off.', 'wordpress-seo' );
		$output .= '</p>';
		$output .= $this->get_estimate();
		$output .= \sprintf(
			'<button type="button" class="button yoast-open-indexation" data-title="<strong>%1$s</strong>">%2$s</button>',
			/* translators: 1: Expands to Yoast. */
			\sprintf( \esc_html__( '%1$s indexing status', 'wordpress-seo' ), 'Yoast' ),
			\esc_html__( 'Continue processing and speed up your site now', 'wordpress-seo' )
		);

		return $output;
	}

	/**
	 * Determines the message given for the estimation of the time that calculation might take.
	 *
	 * @return string The message.
	 */
	private function get_estimate() {
		if ( $this->total_unindexed > 2500 ) {
			$estimate  = '<p>';
			$estimate .= \esc_html__( 'We estimate this could take a long time, due to the size of your site. As an alternative to waiting, you could:', 'wordpress-seo' );
			$estimate .= '<ul class="ul-disc">';
			$estimate .= '<li>';
			$estimate .= \sprintf(
				/* translators: 1: Expands to Yoast SEO, 2: Button start tag for the reminder, 3: Button closing tag */
				\esc_html__( 'Wait for a week or so, until %1$s automatically processes most of your content in the background. %2$sRemind me in a week.%3$s', 'wordpress-seo' ),
				'Yoast SEO',
				\sprintf(
					'<button type="button" id="yoast-indexation-remind-button" class="button-link hide-if-no-js" data-nonce="%s">',
					\esc_js( \wp_create_nonce( 'wpseo-indexation-remind' ) )
				),
				'</button>'
			);
			$estimate .= '</li>';
			$estimate .= '<li>';
			$estimate .= \sprintf(
			/* translators: 1: Link to article about indexation command, 2: Anchor closing tag, 3: Link to WP CLI. */
				\esc_html__( '%1$sRun the indexation process on your server%2$s using %3$sWP CLI%2$s', 'wordpress-seo' ),
				'<a href="' . \esc_url( WPSEO_Shortlinker::get( 'https://yoa.st/3-w' ) ) . '" target="_blank">',
				'</a>',
				'<a href="https://wp-cli.org/" target="_blank">'
			);
			$estimate .= '</li>';
			$estimate .= '</ul>';
			$estimate .= '</p>';

			return $estimate;
		}

		if ( $this->total_unindexed >= 400 ) {
			return '<p>' . \esc_html__( 'We estimate this will take a couple of minutes.', 'wordpress-seo' ) . '</p>';
		}

		return '<p>' . \esc_html__( 'We estimate this will take less than a minute.', 'wordpress-seo' ) . '</p>';
	}

	/**
	 * If the 'indexation is incomplete' warning should be shown or not.
	 *
	 * @return bool `true` if the 'indexation is incomplete' warning should be shown, `false` if not.
	 */
	private function show_indexation_incomplete_alert() {
		$indexation_started = $this->options_helper->get( 'indexation_started', false );
		if ( ! $indexation_started ) {
			return false;
		}

		return $indexation_started <= ( \time() - \MONTH_IN_SECONDS );
	}
}
