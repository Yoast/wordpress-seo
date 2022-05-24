<?php

namespace Yoast\WP\SEO\Integrations;

use Yoast\WP\SEO\Actions\Options\Options_Action;
use Yoast\WP\SEO\Conditionals\No_Conditionals;
use Yoast\WP\SEO\Helpers\Capability_Helper;
use Yoast\WP\SEO\Helpers\Input_Helper;
use Yoast\WP\SEO\Helpers\Redirect_Helper;

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
	const SET_OPTIONS_ACTION = 'yoast_set_options';

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
	 * Holds the input helper instance.
	 *
	 * @var Input_Helper
	 */
	protected $input_helper;

	/**
	 * Holds the redirect helper instance.
	 *
	 * @var Redirect_Helper
	 */
	protected $redirect_helper;

	/**
	 * Constructs the options integration.
	 *
	 * @param Options_Action    $options_action    The options action.
	 * @param Capability_Helper $capability_helper The capability helper.
	 * @param Input_Helper      $input_helper      The input helper.
	 * @param Redirect_Helper   $redirect_helper   The redirect helper.
	 */
	public function __construct(
		Options_Action $options_action,
		Capability_Helper $capability_helper,
		Input_Helper $input_helper,
		Redirect_Helper $redirect_helper
	) {
		$this->options_action    = $options_action;
		$this->capability_helper = $capability_helper;
		$this->input_helper      = $input_helper;
		$this->redirect_helper   = $redirect_helper;
	}

	/**
	 * Registers the hooks.
	 *
	 * @return void
	 */
	public function register_hooks() {
		\add_action( 'admin_action_' . self::SET_OPTIONS_ACTION, [ $this, 'handle_set_options_request' ] );
	}

	/**
	 * Handles a request to set plugin options.
	 *
	 * Heavy inspiration from Yoast_Network_Admin.
	 *
	 * @return void
	 */
	public function handle_set_options_request() {
		$option = $this->input_helper->filter( \INPUT_POST, 'option', \FILTER_SANITIZE_STRING, \FILTER_NULL_ON_FAILURE );
		$this->verify_request( self::SET_OPTIONS_ACTION . ":$option" );
		$values = $this->input_helper->filter( \INPUT_POST, $option, \FILTER_SANITIZE_STRING, ( \FILTER_REQUIRE_ARRAY | \FILTER_NULL_ON_FAILURE ) );
		if ( $values === null ) {
			\add_settings_error( 'wpseo_options', 'settings_error', \__( 'Please provide settings to save.', 'wordpress-seo' ), 'error' );
			$this->terminate_request();

			return;
		}

		$result = $this->options_action->set( $values );
		if ( ! $result['success'] ) {
			\add_settings_error( 'wpseo_options', 'settings_save_error', $result['error'], 'error' );
			if ( \array_key_exists( 'field_errors', $result ) ) {
				foreach ( $result['field_errors'] as $key => $field_exception ) {
					\add_settings_error( 'wpseo_options', $key, $field_exception, 'error' );
				}
			}
		}

		$settings_errors = \get_settings_errors();
		if ( empty( $settings_errors ) ) {
			\add_settings_error( $option, 'settings_updated', \__( 'Settings Updated.', 'wordpress-seo' ), 'updated' );
		}

		$this->terminate_request( [ 'settings-updated' => 'true' ] );
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

		if ( \wp_doing_ajax() ) {
			\check_ajax_referer( $action, $query_arg );

			if ( ! $has_access ) {
				\wp_die( -1, 403 );
			}

			return;
		}

		\check_admin_referer( $action, $query_arg );

		if ( ! $has_access ) {
			\wp_die( \esc_html__( 'You are not allowed to perform this action.', 'wordpress-seo' ) );
		}
	}

	/**
	 * Terminates the current request by either redirecting back or sending an AJAX response.
	 *
	 * @param array $query_args Optional. Query arguments to add to the redirect URL. Default none.
	 *
	 * @return void
	 */
	public function terminate_request( $query_args = [] ) {
		if ( \wp_doing_ajax() ) {
			$settings_errors = \get_settings_errors();

			if ( ! empty( $settings_errors ) && $settings_errors[0]['type'] === 'updated' ) {
				\wp_send_json_success( $settings_errors, 200 );
			}

			\wp_send_json_error( $settings_errors, 400 );
		}

		$this->persist_settings_errors();
		$this->redirect_back( $query_args );
	}

	/**
	 * Persists settings errors.
	 *
	 * Settings errors are stored in a transient for 30 seconds so that this transient
	 * can be retrieved on the next page load.
	 *
	 * @return void
	 */
	protected function persist_settings_errors() {
		/*
		 * A regular transient is used here, since it is automatically cleared right after the redirect.
		 * A network transient would be cleaner, but would require a lot of copied code from core for
		 * just a minor adjustment when displaying settings errors.
		 */
		\set_transient( 'settings_errors', \get_settings_errors(), 30 );
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

		$this->redirect_helper->do_safe_redirect( $sendback );
	}
}
