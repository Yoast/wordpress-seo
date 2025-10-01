<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Alerts\Application\Default_SEO_Data;

use Yoast\WP\SEO\Alerts\Infrastructure\Default_SEO_Data\Default_SEO_Data_Collector;
use Yoast\WP\SEO\Conditionals\Admin_Conditional;
use Yoast\WP\SEO\Integrations\Integration_Interface;
use Yoast_Notification;
use Yoast_Notification_Center;

/**
 * Default_SEO_Data_Alert class.
 */
class Default_SEO_Data_Alert implements Integration_Interface {

	public const NOTIFICATION_ID = 'wpseo-default-seo-data';

	/**
	 * The notifications center.
	 *
	 * @var Yoast_Notification_Center
	 */
	private $notification_center;

	/**
	 * The default SEO data collector.
	 *
	 * @var Default_SEO_Data_Collector
	 */
	private $default_seo_data_collector;

	/**
	 * Default_SEO_Data_Alert constructor.
	 *
	 * @param Yoast_Notification_Center  $notification_center        The notification center.
	 * @param Default_SEO_Data_Collector $default_seo_data_collector The default SEO data collector.
	 */
	public function __construct(
		Yoast_Notification_Center $notification_center,
		Default_SEO_Data_Collector $default_seo_data_collector
	) {
		$this->notification_center        = $notification_center;
		$this->default_seo_data_collector = $default_seo_data_collector;
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
	 * Adds notifications (when necessary).
	 *
	 * @return void
	 */
	public function add_notifications() {
		$default_seo_title_types = $this->default_seo_data_collector->get_types_with_default_seo_title();
		$default_seo_desc_types  = $this->default_seo_data_collector->get_types_with_default_seo_description();

		if ( empty( $default_seo_title_types ) && empty( $default_seo_desc_types ) ) {
			$this->notification_center->remove_notification_by_id( self::NOTIFICATION_ID );
			return;
		}

		$notification = $this->get_default_seo_data_notification( ! empty( $default_seo_title_types ), ! empty( $default_seo_desc_types ) );

		$this->notification_center->add_notification( $notification );
	}

	/**
	 * Build the default SEO data notification.
	 *
	 * @param bool $default_seo_title Whether there are content types with default SEO title in their most recent posts.
	 * @param bool $default_seo_desc  Whether there are content types with default SEO description in their most recent posts.
	 *
	 * @return Yoast_Notification The notification containing the suggested plugin.
	 */
	protected function get_default_seo_data_notification( $default_seo_title, $default_seo_desc ) {
		$message = $this->get_default_seo_data_message( $default_seo_title, $default_seo_desc );

		return new Yoast_Notification(
			$message,
			[
				'id'           => self::NOTIFICATION_ID,
				'type'         => Yoast_Notification::WARNING,
				'capabilities' => [ 'wpseo_manage_options' ],
			]
		);
	}

	/**
	 * Creates a message to inform users that they are using only default SEO data lately.
	 *
	 * @param bool $default_seo_title Whether there are content types with default SEO title in their most recent posts.
	 * @param bool $default_seo_desc  Whether there are content types with default SEO description in their most recent posts.
	 *
	 * @return string The default SEO data message.
	 */
	protected function get_default_seo_data_message( $default_seo_title, $default_seo_desc ) {
		if ( $default_seo_title && $default_seo_desc ) {
			/* translators: %1$s expands to an opening strong tag, %2$s expands to a closing strong tag. */
			$message = \esc_html__( 'It looks like you are using default SEO title and meta description for your most recent modified posts. %1$sChange your SEO title and meta description%2$s to make your content stand out in search results.', 'wordpress-seo' );

			return \sprintf(
				$message,
				'<strong>',
				'</strong>'
			);
		}
		elseif ( $default_seo_title ) {
			/* translators: %1$s expands to an opening strong tag, %2$s expands to a closing strong tag. */
			$message = \esc_html__( 'It looks like you are using the default SEO title for your most recent posts. %1$sChange your SEO title%2$s to make your content stand out in search results.', 'wordpress-seo' );

			return \sprintf(
				$message,
				'<strong>',
				'</strong>'
			);
		}
		elseif ( $default_seo_desc ) {
			/* translators: %1$s expands to an opening strong tag, %2$s expands to a closing strong tag. */
			$message = \esc_html__( 'It looks like you are using the default meta description for your most recent posts. %1$sChange your meta description%2$s to make your content stand out in search results.', 'wordpress-seo' );

			return \sprintf(
				$message,
				'<strong>',
				'</strong>'
			);
		}

		return '';
	}
}
