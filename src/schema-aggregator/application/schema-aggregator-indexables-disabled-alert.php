<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Schema_Aggregator\Application;

use Yoast\WP\SEO\Conditionals\Admin_Conditional;
use Yoast\WP\SEO\Helpers\Indexable_Helper;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Helpers\Short_Link_Helper;
use Yoast\WP\SEO\Helpers\User_Helper;
use Yoast\WP\SEO\Integrations\Integration_Interface;
use Yoast\WP\SEO\Schema_Aggregator\Infrastructure\Schema_Aggregator_Conditional;
use Yoast_Notification;
use Yoast_Notification_Center;

/**
 * Schema_Aggregator_Indexables_Disabled_Alert class.
 */
class Schema_Aggregator_Indexables_Disabled_Alert implements Integration_Interface {

	public const NOTIFICATION_ID = 'wpseo-schema-aggregator-indexables-disabled';

	/**
	 * The notifications center.
	 *
	 * @var Yoast_Notification_Center
	 */
	private $notification_center;

	/**
	 * The short link helper.
	 *
	 * @var Short_Link_Helper
	 */
	private $short_link_helper;

	/**
	 * The options helper.
	 *
	 * @var Options_Helper
	 */
	private $options_helper;

	/**
	 * The schema aggregator conditional.
	 *
	 * @var Schema_Aggregator_Conditional
	 */
	private $schema_aggregator_conditional;

	/**
	 * The user helper.
	 *
	 * @var User_Helper
	 */
	private $user_helper;

	/**
	 * The indexable helper.
	 *
	 * @var Indexable_Helper
	 */
	private $indexable_helper;

	/**
	 * Schema_Aggregator_Indexables_Disabled_Alert constructor.
	 *
	 * @param Yoast_Notification_Center     $notification_center           The notification center.
	 * @param Short_Link_Helper             $short_link_helper             The short link helper.
	 * @param Options_Helper                $options_helper                The options helper.
	 * @param Schema_Aggregator_Conditional $schema_aggregator_conditional The schema aggregator conditional.
	 * @param User_Helper                   $user_helper                   The user helper.
	 * @param Indexable_Helper              $indexable_helper              The indexable helper.
	 */
	public function __construct(
		Yoast_Notification_Center $notification_center,
		Short_Link_Helper $short_link_helper,
		Options_Helper $options_helper,
		Schema_Aggregator_Conditional $schema_aggregator_conditional,
		User_Helper $user_helper,
		Indexable_Helper $indexable_helper
	) {
		$this->notification_center           = $notification_center;
		$this->short_link_helper             = $short_link_helper;
		$this->options_helper                = $options_helper;
		$this->schema_aggregator_conditional = $schema_aggregator_conditional;
		$this->user_helper                   = $user_helper;
		$this->indexable_helper              = $indexable_helper;
	}

	/**
	 * Returns the conditionals based on which this loadable should be active.
	 *
	 * @return array<string>
	 */
	public static function get_conditionals(): array {
		return [ Admin_Conditional::class ];
	}

	/**
	 * Initializes the integration.
	 *
	 * @return void
	 */
	public function register_hooks() {
		\add_action( 'admin_init', [ $this, 'add_notifications' ] );
	}

	/**
	 * Adds notification when user has not installed Yoast SEO themselves and has not resolved the notification yet.
	 *
	 * @return void
	 */
	public function add_notifications() {
		if ( ! $this->schema_aggregator_conditional->is_met() ) {
			return;
		}

		if ( $this->has_notification_been_resolved() ) {
			return;
		}

		if ( $this->indexable_helper->should_index_indexables() ) {
			return;
		}

		$notification = $this->get_schema_aggregator_indexables_disabled_notification();

		$this->notification_center->add_notification( $notification );
	}

	/**
	 * Returns whether the alert has been resolved before.
	 *
	 * @return bool Whether the alert has been resolved before.
	 */
	private function has_notification_been_resolved(): bool {
		return $this->user_helper->get_meta( \get_current_user_id(), self::NOTIFICATION_ID . '_resolved', true ) === '1';
	}

	/**
	 * Build the schema_aggregator_indexables_disabled notification.
	 *
	 * @return Yoast_Notification The schema_aggregator_indexables_disabled.
	 */
	private function get_schema_aggregator_indexables_disabled_notification(): Yoast_Notification {
		$message = $this->get_message();

		return new Yoast_Notification(
			$message,
			[
				'id'            => self::NOTIFICATION_ID,
				'type'          => Yoast_Notification::WARNING,
				'capabilities'  => [ 'wpseo_manage_options' ],
				'priority'      => 20,
				'resolve_nonce' => \wp_create_nonce( 'wpseo-resolve-alert-nonce' ),
			]
		);
	}

	/**
	 * Returns the notification as an HTML string.
	 *
	 * @return string The HTML string representation of the notification.
	 */
	private function get_message(): string {
		$short_link = $this->short_link_helper->get( 'https://yoa.st/schema-aggregation-alert/' );
		$message    = \sprintf(
		/* translators: %1$s expands to an opening link tag, %2$s expands to a closing link tag. */
			\esc_html__( 'You’ve disabled Yoast content indexation of your site, which can cause the %1$sschema aggregation endpoint%2$s to respond more slowly.', 'wordpress-seo' ),
			'<a href="' . \esc_url( $short_link ) . '" target="_blank">',
			'</a>'
		);

		return '<p>' . $message . '</p>';
	}
}
