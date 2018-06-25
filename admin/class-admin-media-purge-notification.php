<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin
 */

/**
 * Handles the media purge notification showing and hiding.
 */
class WPSEO_Admin_Media_Purge_Notification implements WPSEO_WordPress_Integration {

	/**
	 * Notification ID to use.
	 *
	 * @var string
	 */
	private $notification_id = 'wpseo_media_purge';

	/**
	 * Registers all hooks to WordPress.
	 *
	 * @return void
	 */
	public function register_hooks() {
		add_action( 'admin_init', array( $this, 'manage_notification' ) );
		add_filter( 'wpseo_option_tab-metas_media', array( $this, 'output_hidden_setting' ) );

		// Dismissing is just setting the relevancy to false, which cancels out any functionality.
		if ( WPSEO_Utils::is_yoast_seo_page() && filter_input( INPUT_GET, 'dismiss' ) === $this->notification_id ) {
			WPSEO_Options::set( 'is-media-purge-relevant', false );
		}
	}

	/**
	 * Adds a hidden setting to the media tab.
	 *
	 * To make sure the setting is not reverted to the default when -anything-
	 * is saved on the entire page (not just the media tab).
	 *
	 * @param string|null $input Current filter value.
	 *
	 * @return string|null
	 */
	public function output_hidden_setting( $input ) {
		$form = Yoast_Form::get_instance();
		$form->hidden( 'is-media-purge-relevant' );

		return $input;
	}

	/**
	 * Manages if the notification should be shown or removed.
	 *
	 * @return void
	 */
	public function manage_notification() {
		$this->remove_notification();
	}

	/**
	 * Retrieves the notification that should be shown or removed.
	 *
	 * @return Yoast_Notification The notification to use.
	 */
	private function get_notification() {
		$content = sprintf(
		/* translators: %1$s expands to the link to the article, %2$s closes the link tag. */
			__( 'Your site\'s settings currently allow attachment URLs on your site to exist. Please read %1$sthis post about a potential issue%2$s with attachment URLs and check whether you have the correct setting for your site.', 'wordpress-seo' ),
			'<a href="' . esc_url( WPSEO_Shortlinker::get( 'https://yoa.st/2r8' ) ) . '" rel="nofollow noreferer" target="_blank">',
			'</a>'
		);

		$content .= '<br><br>';
		$content .= sprintf(
			__( 'If you know what this means and you do not want to see this message anymore, you can %1$sdismiss this message%2$s.', 'wordpress-seo' ),
			'<a href="' . admin_url( 'admin.php?page=wpseo_dashboard&dismiss=' . $this->notification_id ) . '">',
			'</a>'
		);

		return new Yoast_Notification(
			$content,
			array(
				'type'         => Yoast_Notification::ERROR,
				'id'           => $this->notification_id,
				'capabilities' => 'wpseo_manage_options',
				'priority'     => 1,
			)
		);
	}

	/**
	 * Adds the notification to the notificaton center.
	 *
	 * @return void
	 */
	private function add_notification() {
		$notification_center = Yoast_Notification_Center::get();
		$notification_center->add_notification( $this->get_notification() );
	}

	/**
	 * Removes the notification from the notification center.
	 *
	 * @return void
	 */
	private function remove_notification() {
		$notification_center = Yoast_Notification_Center::get();
		$notification_center->remove_notification( $this->get_notification() );
	}
}
