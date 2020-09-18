<?php

namespace Yoast\WP\SEO\Presenters\Admin;

use Yoast\WP\SEO\Presenters\Abstract_Presenter;

/**
 * Class Indexing_Notification_Presenter.
 *
 * @package Yoast\WP\SEO\Presenters\Admin
 */
class Indexing_Notification_Presenter extends Abstract_Presenter {

	/**
	 * The total number of unindexed objects.
	 *
	 * @var int
	 */
	private $total_unindexed;

	/**
	 * The message to show in the notification.
	 *
	 * @var string
	 */
	private $message;

	/**
	 * Indexing_Notification_Presenter constructor.
	 *
	 * @param int    $total_unindexed Total number of unindexed objects.
	 * @param string $message         The message to show in the notification.
	 */
	public function __construct( $total_unindexed, $message ) {
		$this->total_unindexed = $total_unindexed;
		$this->message         = $message;
	}

	/**
	 * Returns the notification as an HTML string.
	 *
	 * @returns string The HTML string representation of the notification.
	 */
	public function present() {
		$notification_text  = '<p>' . $this->message . '</p>';
		$notification_text .= '<p>' . $this->get_time_estimate( $this->total_unindexed ) . '</p>';
		$notification_text .= '<a class="button" href="' . \get_admin_url( null, 'admin.php?page=wpseo_tools' ) . '">';
		$notification_text .= \esc_html__( 'Start SEO data optimization', 'wordpress-seo' );
		$notification_text .= '</a>';

		return $notification_text;
	}

	/**
	 * Creates a time estimate based on the total number on unindexed objects.
	 *
	 * @param int $total_unindexed The total number of unindexed objects.
	 *
	 * @return string The time estimate as a HTML string.
	 */
	protected function get_time_estimate( $total_unindexed ) {
		if ( $total_unindexed < 400 ) {
			return \esc_html__( 'We estimate this will take less than a minute.', 'wordpress-seo' );
		}

		if ( $total_unindexed < 2500 ) {
			return \esc_html__( 'We estimate this will take a couple of minutes.', 'wordpress-seo' );
		}

		$estimate  = \esc_html__( 'We estimate this could take a long time, due to the size of your site. As an alternative to waiting, you could:', 'wordpress-seo' );
		$estimate .= '<ul class="ul-disc">';
		$estimate .= '<li>';
		$estimate .= \sprintf(
		/* translators: 1: Expands to Yoast SEO, 2: Button start tag for the reminder, 3: Button closing tag */
			\esc_html__( 'Wait for a week or so, until %1$s automatically processes most of your content in the background. %2$sRemind me in a week.%3$s', 'wordpress-seo' ),
			'Yoast SEO',
			\sprintf(
				'<button type="button" id="yoast-indexation-remind-button" class="button-link hide-if-no-js dismiss" data-nonce="%s" data-json=\'{ "temp": true }\'>',
				\esc_js( \wp_create_nonce( 'wpseo-indexation-remind' ) )
			),
			'</button>'
		);
		$estimate .= '</li>';
		$estimate .= '<li>';
		$estimate .= \sprintf(
		/* translators: 1: Link to article about indexation command, 2: Anchor closing tag, 3: Link to WP CLI. */
			\esc_html__( '%1$sRun the indexation process on your server%2$s using %3$sWP CLI%2$s', 'wordpress-seo' ),
			'<a href="' . \esc_url( \WPSEO_Shortlinker::get( 'https://yoa.st/3-w' ) ) . '" target="_blank">',
			'</a>',
			'<a href="https://wp-cli.org/" target="_blank">'
		);

		$estimate .= '</li>';
		$estimate .= '</ul>';

		return $estimate;
	}
}
