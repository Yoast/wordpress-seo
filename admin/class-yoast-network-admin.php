<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Internals
 */

/**
 * Multisite utility class for network admin functionality.
 */
class Yoast_Network_Admin implements WPSEO_WordPress_Integration {

	/**
	 * Action identifier for updating plugin network options.
	 */
	const UPDATE_OPTIONS_ACTION = 'yoast_handle_network_options';

	/**
	 * Action identifier for restoring a site.
	 */
	const RESTORE_SITE_ACTION = 'yoast_restore_site';

	/**
	 * Gets the available sites as choices, e.g. for a dropdown.
	 *
	 * @param bool $include_empty Optional. Whether to include an initial placeholder choice.
	 *
	 * @return array Choices as $site_id => $site_label pairs.
	 */
	public function get_site_choices( $include_empty = false ) {
		$choices = array();

		if ( $include_empty ) {
			$choices['-'] = __( 'None', 'wordpress-seo' );
		}

		$sites = get_sites( array( 'deleted' => 0 ) );
		foreach ( $sites as $site ) {
			$choices[ $site->blog_id ] = $site->blog_id . ': ' . $site->domain . $site->path;

			$site_states = $this->get_site_states( $site );
			if ( ! empty( $site_states ) ) {
				$choices[ $site->blog_id ] .= ' [' . implode( ', ', $site_states ) . ']';
			}
		}

		return $choices;
	}

	/**
	 * Gets the states of a site.
	 *
	 * @param WP_Site $site Site object.
	 *
	 * @return array Array of $state_slug => $state_label pairs.
	 */
	public function get_site_states( $site ) {
		$available_states = array(
			'public'   => __( 'public', 'wordpress-seo' ),
			'archived' => __( 'archived', 'wordpress-seo' ),
			'mature'   => __( 'mature', 'wordpress-seo' ),
			'spam'     => __( 'spam', 'wordpress-seo' ),
			'deleted'  => __( 'deleted', 'wordpress-seo' ),
		);

		$site_states = array();
		foreach ( $available_states as $state_slug => $state_label ) {
			if ( $site->$state_slug === '1' ) {
				$site_states[ $state_slug ] = $state_label;
			}
		}

		return $site_states;
	}

	/**
	 * Handles a request to update plugin network options.
	 *
	 * This method works similar to how option updates are handled in `wp-admin/options.php` and
	 * `wp-admin/network/settings.php`.
	 *
	 * @return void
	 */
	public function handle_update_options_request() {
		$option_group = filter_input( INPUT_POST, 'network_option_group', FILTER_SANITIZE_STRING );

		check_admin_referer( "$option_group-network-options" );

		$whitelist_options = Yoast_Network_Settings_API::get()->get_whitelist_options( $option_group );

		if ( empty( $whitelist_options ) ) {
			wp_die( __( 'Sorry, you are not allowed to modify unregistered network settings.', 'wordpress-seo' ), '', 403 );
		}

		foreach ( $whitelist_options as $option_name ) {
			$value = null;
			if ( isset( $_POST[ $option_name ] ) ) {
				$value = wp_unslash( $_POST[ $option_name ] );
			}

			WPSEO_Options::update_site_option( $option_name, $value );
		}

		$settings_errors = get_settings_errors();
		if ( empty( $settings_errors ) ) {
			add_settings_error( $option_group, 'settings_updated', __( 'Settings Updated.', 'wordpress-seo' ), 'updated' );
		}

		$this->persist_settings_errors();
		$this->redirect_back( array( 'settings-updated' => 'true' ) );
	}

	/**
	 * Handles a request to restore a site's default settings.
	 *
	 * @return void
	 */
	public function handle_restore_site_request() {
		check_admin_referer( 'wpseo-network-restore' );

		$option_group = 'wpseo_ms';

		$site_id = ! empty( $_POST[ $option_group ]['site_id'] ) ? (int) $_POST[ $option_group ]['site_id'] : 0;
		if ( ! $site_id ) {
			add_settings_error( $option_group, 'settings_updated', __( 'No site has been selected to restore.', 'wordpress-seo' ), 'error' );

			$this->persist_settings_errors();
			$this->redirect_back( array( 'settings-updated' => 'true' ) );
			return;
		}

		$site = get_site( $site_id );
		if ( ! $site ) {
			/* translators: %s expands to the ID of a site within a multisite network. */
			add_settings_error( $option_group, 'settings_updated', sprintf( __( 'Site %d not found.', 'wordpress-seo' ), $site_id ), 'error' );
		}
		else {
			WPSEO_Options::reset_ms_blog( $site_id );

			/* translators: %s expands to the name of a site within a multisite network. */
			add_settings_error( $option_group, 'settings_updated', sprintf( __( '%s restored to default SEO settings.', 'wordpress-seo' ), esc_html( $site->blogname ) ), 'updated' );
		}

		$this->persist_settings_errors();
		$this->redirect_back( array( 'settings-updated' => 'true' ) );
	}

	/**
	 * Outputs nonce, action and option group fields for a network settings page in the plugin.
	 *
	 * @param string $option_group Option group name for the current page.
	 *
	 * @return void
	 */
	public function settings_fields( $option_group ) {
		?>
		<input type="hidden" name="network_option_group" value="<?php echo esc_attr( $option_group ); ?>" />
		<input type="hidden" name="action" value="<?php echo esc_attr( self::UPDATE_OPTIONS_ACTION ); ?>" />
		<?php
		wp_nonce_field( "$option_group-network-options" );
	}

	/**
	 * Prints the form for restoring a site with its default settings.
	 *
	 * @return void
	 */
	public function print_restore_form() {
		$yform = Yoast_Form::get_instance();

		echo '<h2>' . esc_html__( 'Restore site to default settings', 'wordpress-seo' ) . '</h2>';
		echo '<form action="' . esc_url( network_admin_url( 'admin.php' ) ) . '" method="post" accept-charset="' . esc_attr( get_bloginfo( 'charset' ) ) . '">';
		wp_nonce_field( 'wpseo-network-restore' );
		echo '<p>' . esc_html__( 'Using this form you can reset a site to the default SEO settings.', 'wordpress-seo' ) . '</p>';

		if ( get_blog_count() <= 100 ) {
			$yform->select(
				'site_id',
				__( 'Site ID', 'wordpress-seo' ),
				$this->get_site_choices()
			);
		}
		else {
			$yform->textinput( 'site_id', __( 'Site ID', 'wordpress-seo' ) );
		}

		echo '<input type="hidden" name="action" value="' . esc_attr( self::RESTORE_SITE_ACTION ) . '" />';
		echo '<input type="submit" name="wpseo_restore_blog" value="' . esc_attr__( 'Restore site to defaults', 'wordpress-seo' ) . '" class="button"/>';
		echo '</form>';
	}

	/**
	 * Hooks in the necessary actions and filters.
	 *
	 * @return void
	 */
	public function register_hooks() {
		if ( ! $this->meets_requirements() ) {
			return;
		}

		add_action( 'admin_action_' . self::UPDATE_OPTIONS_ACTION, array( $this, 'handle_update_options_request' ) );
		add_action( 'admin_action_' . self::RESTORE_SITE_ACTION, array( $this, 'handle_restore_site_request' ) );
		add_action( 'wpseo_admin_footer', array( $this, 'print_restore_form' ) );
	}

	/**
	 * Checks whether the requirements to use this class are met.
	 *
	 * @return bool True if requirements are met, false otherwise.
	 */
	public function meets_requirements() {
		return is_multisite() && is_network_admin();
	}

	/**
	 * Persists settings errors.
	 *
	 * Settings errors are stored in a transient for 30 seconds so that this transient
	 * can be retrieved on the next page load.
	 *
	 * @return void
	 */
	private function persist_settings_errors() {

		/*
		 * A regular transient is used here, since it is automatically cleared right after the redirect.
		 * A network transient would be cleaner, but would require a lot of copied code from core for
		 * just a minor adjustment when displaying settings errors.
		 */
		set_transient( 'settings_errors', get_settings_errors(), 30 );
	}

	/**
	 * Redirects back to the referer URL, with optional query arguments.
	 *
	 * @param array $query_args Optional. Query arguments to add to the redirect URL. Default none.
	 *
	 * @return void
	 */
	private function redirect_back( $query_args = array() ) {
		$sendback = wp_get_referer();

		if ( ! empty( $query_args ) ) {
			$sendback = add_query_arg( $query_args, $sendback );
		}

		wp_safe_redirect( $sendback );
		exit;
	}
}
