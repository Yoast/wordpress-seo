<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Suggested_Plugins
 */

/**
 * Class WPSEO_Suggested_Plugins
 */
class WPSEO_Suggested_Plugins implements WPSEO_WordPress_Integration {

	/**
	 * Holds the availability checker.
	 *
	 * @var WPSEO_Plugin_Availability
	 */
	protected $availability_checker;

	/**
	 * Holds the notification center.
	 *
	 * @var Yoast_Notification_Center
	 */
	protected $notification_center;

	/**
	 * WPSEO_Suggested_Plugins constructor.
	 *
	 * @param WPSEO_Plugin_Availability $availability_checker The availability checker to use.
	 * @param Yoast_Notification_Center $notification_center  The notification center to add notifications to.
	 */
	public function __construct( WPSEO_Plugin_Availability $availability_checker, Yoast_Notification_Center $notification_center ) {
		$this->availability_checker = $availability_checker;
		$this->notification_center  = $notification_center;
	}

	/**
	 * Registers all hooks to WordPress.
	 *
	 * @return void
	 */
	public function register_hooks() {
		add_action( 'admin_init', [ $this->availability_checker, 'register' ] );
		add_action( 'admin_init', [ $this, 'add_notifications' ] );
	}

	/**
	 * Adds notifications (when necessary).
	 *
	 * @return void
	 */
	public function add_notifications() {
		$checker = $this->availability_checker;

		// Get all Yoast plugins that have dependencies.
		$plugins = $checker->get_plugins_with_dependencies();

		foreach ( $plugins as $plugin_name => $plugin ) {
			if ( ! $checker->dependencies_are_satisfied( $plugin ) ) {
				continue;
			}

			$notification = $this->get_yoast_seo_suggested_plugins_notification( $plugin_name, $plugin );

			if ( ! $checker->is_installed( $plugin ) || ! $checker->is_active( $plugin['slug'] ) ) {
				$this->notification_center->add_notification( $notification );

				continue;
			}

			$this->notification_center->remove_notification( $notification );
		}
	}

	/**
	 * Build Yoast SEO suggested plugins notification.
	 *
	 * @param string $name   The plugin name to use for the unique ID.
	 * @param array  $plugin The plugin to retrieve the data from.
	 *
	 * @return Yoast_Notification The notification containing the suggested plugin.
	 */
	protected function get_yoast_seo_suggested_plugins_notification( $name, $plugin ) {
		$message = $this->create_install_suggested_plugin_message( $plugin );

		if ( $this->availability_checker->is_installed( $plugin ) && ! $this->availability_checker->is_active( $plugin['slug'] ) ) {
			$message = $this->create_activate_suggested_plugin_message( $plugin );
		}

		return new Yoast_Notification(
			$message,
			[
				'id'           => 'wpseo-suggested-plugin-' . $name,
				'type'         => Yoast_Notification::WARNING,
				'capabilities' => [ 'install_plugins' ],
			]
		);
	}

	/**
	 * Creates a message to suggest the installation of a particular plugin.
	 *
	 * @param array $suggested_plugin The suggested plugin.
	 *
	 * @return string The install suggested plugin message.
	 */
	protected function create_install_suggested_plugin_message( $suggested_plugin ) {
		/* translators: %1$s expands to an opening strong tag, %2$s expands to the dependency name, %3$s expands to a closing strong tag, %4$s expands to an opening anchor tag, %5$s expands to a closing anchor tag. */
		$message      = __( 'It looks like you aren\'t using our %1$s%2$s addon%3$s. %4$sUpgrade today%5$s to unlock more tools and SEO features to make your products stand out in search results.', 'wordpress-seo' );
		$install_link = WPSEO_Admin_Utils::get_install_link( $suggested_plugin );

		return sprintf(
			$message,
			'<strong>',
			$install_link,
			'</strong>',
			$this->create_more_information_link( $suggested_plugin['url'], $suggested_plugin['title'] ),
			'</a>'
		);
	}

	/**
	 * Creates a more information link that directs the user to WordPress.org Plugin repository.
	 *
	 * @param string $url  The URL to the plugin's page.
	 * @param string $name The name of the plugin.
	 *
	 * @return string The more information link.
	 */
	protected function create_more_information_link( $url, $name ) {
		return sprintf(
			'<a href="%s" aria-label="%s" target="_blank" rel="noopener noreferrer">',
			$url,
			/* translators: %1$s expands to the dependency name. */
			sprintf( __( 'More information about %1$s', 'wordpress-seo' ), $name )
		);
	}

	/**
	 * Creates a message to suggest the activation of a particular plugin.
	 *
	 * @param array $suggested_plugin The suggested plugin.
	 *
	 * @return string The activate suggested plugin message.
	 */
	protected function create_activate_suggested_plugin_message( $suggested_plugin ) {
		/* translators: %1$s expands to an opening strong tag, %2$s expands to the dependency name, %3$s expands to a closing strong tag, %4$s expands to and opening anchor tag, %5$s expands to a closing anchor tag. */
		$message        = __( 'It looks like you\'ve installed our %1$s%2$s addon%3$s. %4$sActivate it now%5$s to unlock more tools and SEO features to make your products stand out in search results.', 'wordpress-seo' );
		$activation_url = WPSEO_Admin_Utils::get_activation_url( $suggested_plugin['slug'] );

		return sprintf(
			$message,
			'<strong>',
			$suggested_plugin['title'],
			'</strong>',
			'<a href="' . $activation_url . '">',
			'</a>'
		);
	}
}
