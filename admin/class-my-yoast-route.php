<?php

class WPSEO_MyYoast_Route implements WPSEO_WordPress_Integration {

	/**
	 * @var string
	 */
	const PAGE_IDENTIFIER = 'wpseo_myyoast';

	/**
	 * @var WPSEO_MyYoast_Client
	 */
	protected $client;

	/**
	 * Class constructor.
	 */
	public function __construct() {
		$this->client = $this->get_client();
	}

	/**
	 * Sets the hooks when the user has enough rights and is on the right page.
	 *
	 * @return void
	 */
	public function register_hooks() {
		if ( ! ( $this->is_myyoast_route() && $this->can_access_route() ) ) {
			return;
		}

		if ( ! $this->is_valid_action( $this->get_action() ) ) {
			return;
		}

		add_action( 'admin_menu', array( $this, 'register_route' ) );
		add_action( 'admin_init', array( $this, 'handle_route' ) );
	}

	/**
	 * Registers the page for the MyYoast route.
	 *
	 * @codeCoverageIgnore
	 *
	 * @return void
	 */
	public function register_route() {
		add_dashboard_page(
			'',
			'',
			'wpseo_manage_options',
			self::PAGE_IDENTIFIER
		);
	}

	/**
	 * Abstracts the action from the url and follows the appropriate route.
	 *
	 * @return void
	 */
	public function handle_route() {
		$action = $this->get_action();
		switch ( $action ) {
			case 'connect';
				$this->connect();
			break;
		}

		exit;
	}

	/**
	 * Checks if the current page is the MyYoast route.
	 *
	 * @return bool
	 */
	protected function is_myyoast_route() {
		return ( filter_input( INPUT_GET, 'page' ) === self::PAGE_IDENTIFIER );
	}

	/**
	 * Creates a new MyYoast Client instance.
	 *
	 * @return WPSEO_MyYoast_Client
	 */
	protected function get_client() {
		return new WPSEO_MyYoast_Client();
	}

	/**
	 * Connects to MyYoast, generates a ClientId if needed.
	 *
	 * @return void
	 */
	protected function connect() {
		$config    = $this->client->get_configuration();
		$client_id = $config['clientId'];

		if ( empty( $config['clientId'] ) ) {
			$client_id = wp_generate_uuid4();

			$this->client->save_configuration(
				array(
					'clientId' => $client_id,
				)
			);
		}

		$this->redirect(
			'https://my.yoast.com/connect',
			array(
				'url'          => WPSEO_Utils::get_home_url(),
				'client_id'    => $client_id,
				'extensions'   => array(),
				'redirect_url' => admin_url( 'admin.php?page=' . WPSEO_Admin::PAGE_IDENTIFIER )
			)
		);
	}

	/**
	 * Abstracts the action from the url.
	 *
	 * @return string The action from the url.
	 */
	protected function get_action() {
		return filter_input( INPUT_GET, 'action' );
	}

	/**
	 * Compares an action to a list of allowed actions to see if it is valid.
	 *
	 * @param string $action The action to check.
	 *
	 * @return bool True if the action is valid.
	 **/
	protected function is_valid_action( $action ) {
		$allowed_actions = array( 'connect' );

		return in_array( $action, $allowed_actions );
	}

	/**
	 * Generates an URL-encoded query string, redirects there.
	 *
	 * @codeCoverageIgnore
	 *
	 * @param string $url        The url to redirect to.
	 * @param array  $query_args The additional arguments to build the url from.
	 *
	 * @return void
	 */
	protected function redirect( $url, $query_args ) {
		wp_redirect( $url . '?' . http_build_query( $query_args ) );
		exit;
	}

	/**
	 * Checks if current user is allowed to access the route.
	 *
	 * @return bool True when current user has rights to manage options.
	 */
	protected function can_access_route() {
		return current_user_can( 'wpseo_manage_options' );
	}
}