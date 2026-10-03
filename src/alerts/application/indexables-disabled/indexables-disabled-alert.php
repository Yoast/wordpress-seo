<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Alerts\Application\Indexables_Disabled;

use Yoast\WP\SEO\Conditionals\Admin_Conditional;
use Yoast\WP\SEO\Helpers\Indexable_Helper;
use Yoast\WP\SEO\Helpers\Short_Link_Helper;
use Yoast\WP\SEO\Integrations\Integration_Interface;
use Yoast_Notification;
use Yoast_Notification_Center;

/**
 * Indexables_Disabled_Alert class.
 */
class Indexables_Disabled_Alert implements Integration_Interface {

	public const NOTIFICATION_ID = 'wpseo-indexables-disabled';

	/**
	 * The notifications center.
	 *
	 * @var Yoast_Notification_Center
	 */
	private $notification_center;

	/**
	 * The indexable helper.
	 *
	 * @var Indexable_Helper
	 */
	private $indexable_helper;

	/**
	 * The short link helper.
	 *
	 * @var Short_Link_Helper
	 */
	private $short_link_helper;

	/**
	 * Indexables_Disabled_Alert constructor.
	 *
	 * @param Yoast_Notification_Center $notification_center The notification center.
	 * @param Indexable_Helper          $indexable_helper    The indexable helper.
	 * @param Short_Link_Helper         $short_link_helper   The short link helper.
	 */
	public function __construct(
		Yoast_Notification_Center $notification_center,
		Indexable_Helper $indexable_helper,
		Short_Link_Helper $short_link_helper
	) {
		$this->notification_center = $notification_center;
		$this->indexable_helper    = $indexable_helper;
		$this->short_link_helper   = $short_link_helper;
	}

	/**
	 * Returns the conditionals based on which this loadable should be active.
	 *
	 * @return array<string>
	 */
	public static function get_conditionals() {
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
	 * Adds or removes notification based on whether indexables are disabled.
	 *
	 * @return void
	 */
	public function add_notifications() {
		if ( $this->indexable_helper->should_index_indexables() ) {
			$this->notification_center->remove_notification_by_id( self::NOTIFICATION_ID );
			return;
		}

		$notification = $this->get_indexables_disabled_notification();

		$this->notification_center->add_notification( $notification );
	}

	/**
	 * Builds the indexables-disabled notification.
	 *
	 * @return Yoast_Notification The indexables-disabled notification.
	 */
	private function get_indexables_disabled_notification(): Yoast_Notification {
		$message = $this->get_message();

		return new Yoast_Notification(
			$message,
			[
				'id'           => self::NOTIFICATION_ID,
				'type'         => Yoast_Notification::WARNING,
				'capabilities' => [ 'wpseo_manage_options' ],
			],
		);
	}

	/**
	 * Returns the notification message as an HTML string.
	 *
	 * @return string The HTML string representation of the notification.
	 */
	private function get_message(): string {
		$shortlink = $this->short_link_helper->get( 'https://yoa.st/indexables-disabled' );

		$message = \sprintf(
			/* translators: %1$s expands to "Yoast", %2$s expands to an opening anchor tag, %3$s expands to a closing anchor tag. */
			\esc_html__( '%1$s indexables are disabled because your site is in a non-production environment or custom code is blocking them. This may affect your SEO features. %2$sLearn more about this%3$s.', 'wordpress-seo' ),
			'Yoast',
			'<a href="' . \esc_url( $shortlink ) . '" target="_blank">',
			'</a>',
		);

		return $message;
	}
}
