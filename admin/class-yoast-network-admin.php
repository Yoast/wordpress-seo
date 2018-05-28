<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Internals
 */

/**
 * Multisite utility class for network admin functionality.
 */
class Yoast_Network_Admin {

	/**
	 * Action identifier for restoring a site.
	 */
	const RESTORE_SITE_ACTION = 'yoast_restore_site';

	/**
	 * @var bool Internal flag for whether the necessary hooks have been added.
	 */
	private $hooks_registered = false;

	/**
	 * @var Yoast_Network_Admin The singleton instance of this class.
	 */
	private static $instance = null;

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

		$available_states = array(
			'public'   => __( 'public', 'wordpress-seo' ),
			'archived' => __( 'archived', 'wordpress-seo' ),
			'mature'   => __( 'mature', 'wordpress-seo' ),
			'spam'     => __( 'spam', 'wordpress-seo' ),
		);

		$sites = get_sites( array( 'deleted' => 0 ) );
		foreach ( $sites as $site ) {
			$choices[ $site->blog_id ] = $site->blog_id . ': ' . $site->domain;

			$site_states = array();
			foreach ( $available_states as $state_slug => $state_label ) {
				if ( $site->$state_slug === '1' ) {
					$site_states[] = $state_label;
				}
			}

			if ( ! empty( $site_states ) ) {
				$choices[ $site->blog_id ] .= ' [' . implode( ', ', $site_states ) . ']';
			}
		}

		return $choices;
	}

	/**
	 * Handles a request in which a site's default settings should be restored.
	 *
	 * @return void
	 */
	public function handle_restore_site_request() {
		check_admin_referer( 'wpseo-network-restore' );

		$option_group = 'wpseo_ms';

		$site_id = (int) filter_input( INPUT_POST, 'site_id', FILTER_SANITIZE_NUMBER_INT );
		if ( ! $site_id ) {
			add_settings_error( $option_group, 'settings_updated', __( 'No site has been selected to restore.', 'wordpress-seo' ), 'error' );
			return;
		}

		$site = get_site( $site_id );
		if ( ! $site ) {
			/* translators: %s expands to the ID of a site within a multisite network. */
			add_settings_error( $option_group, 'settings_updated', sprintf( __( 'Site %d not found.', 'wordpress-seo' ), $site_id ), 'error' );
			return;
		}

		WPSEO_Options::reset_ms_blog( $site_id );

		/* translators: %s expands to the name of a site within a multisite network. */
		add_settings_error( $option_group, 'settings_updated', sprintf( __( '%s restored to default SEO settings.', 'wordpress-seo' ), esc_html( $site->blogname ) ), 'updated' );
	}

	/**
	 * Prints the form for restoring a site with its default settings.
	 *
	 * @return void
	 */
	public function print_restore_form() {
		$yform = Yoast_Form::get_instance();

		echo '<h2>' . esc_html__( 'Restore site to default settings', 'wordpress-seo' ) . '</h2>';
		echo '<form method="post" accept-charset="' . esc_attr( get_bloginfo( 'charset' ) ) . '">';
		wp_nonce_field( 'wpseo-network-restore' );
		echo '<p>' . esc_html__( 'Using this form you can reset a site to the default SEO settings.', 'wordpress-seo' ) . '</p>';

		if ( get_blog_count() <= 100 ) {
			$yform->select(
				'site_id',
				__( 'Site ID', 'wordpress-seo' ),
				$this->get_site_choices(),
				'wpseo_ms'
			);
		}
		else {
			$yform->textinput( 'site_id', __( 'Blog ID', 'wordpress-seo' ), 'wpseo_ms' );
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

		if ( $this->hooks_registered ) {
			return;
		}

		$this->hooks_registered = true;

		add_action( 'admin_action_' . self::RESTORE_SITE_ACTION, array( $this, 'handle_restore_site_request' ) );
		add_action( 'wpseo_admin_footer', array( $this, 'print_restore_form' ) );
	}

	/**
	 * Gets the singleton instance of this class.
	 *
	 * @return Yoast_Network_Admin The singleton instance.
	 */
	public static function get() {

		if ( self::$instance === null ) {
			self::$instance = new self();
		}

		return self::$instance;
	}

	/**
	 * Checks whether the requirements to use this class are met.
	 *
	 * @return bool True if requirements are met, false otherwise.
	 */
	public static function meets_requirements() {
		return is_multisite() && is_network_admin();
	}
}
