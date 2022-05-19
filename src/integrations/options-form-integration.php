<?php

namespace Yoast\WP\SEO\Integrations;

use Yoast\WP\SEO\Actions\Options\Options_Action;
use Yoast\WP\SEO\Conditionals\No_Conditionals;
use Yoast\WP\SEO\Helpers\Capability_Helper;
use Yoast\WP\SEO\Helpers\Options_Helper;

/**
 * Adds hooks for the Yoast Form.
 */
class Options_Form_Integration implements Integration_Interface {

	use No_Conditionals;

	/**
	 * Holds the action identifier for setting options.
	 *
	 * @var string
	 */
	const SET_OPTIONS_ACTION = 'yoast_handle_set_options';

	/**
	 * Holds the options action instance.
	 *
	 * @var Options_Action
	 */
	protected $options_action;

	/**
	 * Holds the capability helper instance.
	 *
	 * @var Capability_Helper
	 */
	protected $capability_helper;

	/**
	 * Constructs the options integration.
	 *
	 * @param Options_Helper $options_helper The options helper.
	 */
	public function __construct( Options_Action $options_action, Capability_Helper $capability_helper ) {
		$this->options_action    = $options_action;
		$this->capability_helper = $capability_helper;
	}

	/**
	 * Registers the hooks.
	 *
	 * @return void
	 */
	public function register_hooks() {
		\add_action( 'admin_action_' . self::SET_OPTIONS_ACTION, [ $this, 'handle_update_options_request' ] );
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
		$option = \filter_input( INPUT_POST, 'option', FILTER_SANITIZE_STRING );

		$this->verify_request( self::SET_OPTIONS_ACTION . ":$option" );

		$value = null;
		if ( isset( $_POST[ $option ] ) ) {
			// Adding sanitize_text_field around this will break the saving of settings because it expects a string: https://github.com/Yoast/wordpress-seo/issues/12440.
			$value = \wp_unslash( $_POST[ $option ] );
		}

		$result = $this->options_action->set( $value );
		if ( ! $result['success'] ) {
			\add_settings_error( 'wpseo_options', 'settings_save_error', $result['error'], 'error' );
			if ( \array_key_exists( 'field_errors', $result ) ) {
				foreach ( $result['field_errors'] as $option => $field_exception ) {
					\add_settings_error( 'wpseo_options', $option, $field_exception, 'error' );
				}
			}
		}

		$settings_errors = \get_settings_errors();
		if ( empty( $settings_errors ) ) {
			\add_settings_error( $option, 'settings_updated', __( 'Settings Updated.', 'wordpress-seo' ), 'updated' );
		}

		$this->redirect_back( [ 'settings-updated' => 'true' ] );
	}

	/**
	 * Verifies that the current request is valid.
	 *
	 * @param string $action    Nonce action.
	 * @param string $query_arg Optional. Nonce query argument. Default '_wpnonce'.
	 *
	 * @return void
	 */
	public function verify_request( $action, $query_arg = '_wpnonce' ) {
		$has_access = $this->capability_helper->current_user_can( 'wpseo_manage_options' );

		\check_admin_referer( $action, $query_arg );

		if ( ! $has_access ) {
			\wp_die( \esc_html__( 'You are not allowed to perform this action.', 'wordpress-seo' ) );
		}
	}

	/**
	 * Redirects back to the referer URL, with optional query arguments.
	 *
	 * @param array $query_args Optional. Query arguments to add to the redirect URL. Default none.
	 *
	 * @return void
	 */
	protected function redirect_back( $query_args = [] ) {
		$sendback = \wp_get_referer();

		if ( ! empty( $query_args ) ) {
			$sendback = \add_query_arg( $query_args, $sendback );
		}

		\wp_safe_redirect( $sendback );
		exit;
	}
}
