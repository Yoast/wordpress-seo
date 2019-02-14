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

	public function __construct() {
		$this->client = $this->get_client();
	}

	/**
	 * Sets the hooks when the user has enough rights and is on the right page.
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
	 */
	public function register_route() {
		add_dashboard_page(
			'',
			'',
			'wpseo_manage_options',
			self::PAGE_IDENTIFIER
		);
	}

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

	protected function get_client() {
		return new WPSEO_MyYoast_Client();
	}

	protected function connect() {
		$config    = $this->client->get_configuration();
		$client_id = $config['clientId'];
		if ( ! $config['clientId'] ) {
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

	protected function get_action() {
		return filter_input( INPUT_GET, 'action' );
	}

	protected function is_valid_action( $action ) {
		$allowed_actions = array( 'connect' );

		return in_array( $action, $allowed_actions );
	}

	/**
	 *
	 * @codeCoverageIgnore
	 *
	 * @param $url
	 * @param $query_args
	 */
	protected function redirect( $url, $query_args ) {
		wp_redirect( $url . '?' . http_build_query( $query_args ) );
		exit;
	}

	protected function can_access_route() {
		return current_user_can( 'wpseo_manage_options' );
	}

}