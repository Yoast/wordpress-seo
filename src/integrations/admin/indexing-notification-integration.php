<?php

namespace Yoast\WP\SEO\Integrations\Admin;

use Yoast\WP\SEO\Conditionals\Admin_Conditional;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Integrations\Integration_Interface;
use Yoast_Notification;
use Yoast_Notification_Center;

class Indexing_Notification_Integration implements Integration_Interface {

	const NOTIFICATION_ID = 'wpseo-reindex';

	/**
	 * The indexing integration.
	 *
	 * @var Indexing_Integration
	 */
	private $indexing_integration;

	/**
	 * The Yoast notification center.
	 *
	 * @var Yoast_Notification_Center
	 */
	private $notification_center;

	/**
	 * The options helper.
	 *
	 * @var Options_Helper
	 */
	private $options_helper;

	/**
	 * Prominent_Words_Notifier constructor.
	 *
	 * @param Indexing_Integration      $indexing_integration The indexing integration.
	 * @param Yoast_Notification_Center $notification_center  The notification center.
	 */
	public function __construct(
		Indexing_Integration $indexing_integration,
		Yoast_Notification_Center $notification_center,
		Options_Helper $options_helper
	) {
		$this->indexing_integration = $indexing_integration;
		$this->notification_center  = $notification_center;
		$this->options_helper = $options_helper;
	}

	/**
	 * @inheritDoc
	 */
	public function register_hooks() {
		if ( \filter_input( INPUT_GET, 'page' ) === 'wpseo_dashboard' ) {
			\add_action( 'admin_init', [ $this, 'cleanup_notification' ] );
		}
//
//		if ( ! \wp_next_scheduled( self::NOTIFICATION_ID ) ) {
//			\wp_schedule_event( time(), 'daily', self::NOTIFICATION_ID );
//		}

		\add_action( 'admin_init', [ $this, 'create_notification' ] );
	}

	/**
	 * @inheritDoc
	 */
	public static function get_conditionals() {
		return [
			Admin_Conditional::class
		];
	}

	/**
	 * Checks whether the notification should be shown and removes
	 * it from the notification center if this is the case.
	 */
	public function create_notification() {
		$this->notification_center->add_notification( $this->notification() );
		$notification = $this->notification_center->get_notification_by_id( self::NOTIFICATION_ID );

		if ( $notification || ! $this->should_show_notification() ) {
			return;
		}

		$this->notification_center->add_notification( $this->notification() );
	}

	/**
	 * Checks whether the notification should not be shown anymore and removes
	 * it from the notification center if this is the case.
	 */
	public function cleanup_notification() {
		$notification = $this->notification_center->get_notification_by_id( self::NOTIFICATION_ID );

		if ( $notification === null || $this->should_show_notification() ) {
			return;
		}

		$this->notification_center->remove_notification( $notification );
	}

	/**
	 * Checks whether the notification should be shown.
	 *
	 * @return bool If the notification should be shown.
	 */
	protected function should_show_notification() {
		$indexation_started = $this->options_helper->get( 'indexation_started', false );
		$indexation_completed = $this->options_helper->get( 'indexation_completed', false );
		$ignore_indexation_warning = $this->options_helper->get( 'ignore_indexation_warning', false );
		
		return ( 
			$indexation_started === false && 
			$indexation_completed === false &&
			$ignore_indexation_warning === false
		);
	}

	/**
	 * Returns an instance of the notification.
	 *
	 * @return Yoast_Notification The notification to show.
	 */
	protected function notification() {
		/* Translators: %1$s expands to Yoast SEO. */
		$notification_text = esc_html__( 'You can speed up your site and get insight into your internal linking structure by letting us perform a few optimizations to the way SEO data is stored.' ) . '</br>';
		$notification_text .= $this->get_time_estimate() . '</br>';
		$notification_text .= '<a class="button" href="' . get_admin_url( null, 'admin.php?page=wpseo_tools' ) . '">';
		$notification_text .= esc_html__( 'Start SEO data optimization' );
		$notification_text .= '</a>';

		return new Yoast_Notification(
			$notification_text,
			[
				'type'         => Yoast_Notification::WARNING,
				'id'           => self::NOTIFICATION_ID,
				'capabilities' => 'wpseo_manage_options',
				'priority'     => 0.8,
			]
		);
	}

	protected function get_time_estimate() {
		$unindexed = $this->indexing_integration->get_total_unindexed();

		$unindexed = 3000;
		if ( $unindexed < 400 ) {
			return esc_html__( 'We estimate this will take less than a minute.' );
		}

		if ( $unindexed < 2500 ) {
			return esc_html__( 'We estimate this will take a couple of minutes.' );
		}

		$estimate  = '<p>';
		$estimate .= \esc_html__( 'We estimate this could take a long time, due to the size of your site. As an alternative to waiting, you could:', 'wordpress-seo' );
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
			'<a href="https://wp-cli.org/" target="_blank">',
		);

		$estimate .= '</li>';
		$estimate .= '</ul>';
		$estimate .= '</p>';

		return $estimate;
	}
}
