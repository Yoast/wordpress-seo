<?php
/**
 * SEMrush route.
 *
 * @package Yoast\WP\SEO\Routes\Routes
 */

namespace Yoast\WP\SEO\Routes;

use WP_REST_Request;
use WP_REST_Response;
use Yoast\WP\SEO\Actions\Semrush\Semrush_Login_Action;
use Yoast\WP\SEO\Actions\Semrush\SEMrush_Options_Action;
use Yoast\WP\SEO\Conditionals\No_Conditionals;
use Yoast\WP\SEO\Main;

/**
 * SEMrush_Route class.
 */
class SEMrush_Route implements Route_Interface {

	use No_Conditionals;

	const ROUTE_PREFIX = 'semrush';

	/**
	 * The authenticate route constant.
	 *
	 * @var string
	 */
	const AUTHENTICATION_ROUTE = self::ROUTE_PREFIX . '/authenticate';

	/**
	 * The country code option route constant.
	 *
	 * @var string
	 */
	const COUNTRY_CODE_OPTION_ROUTE = self::ROUTE_PREFIX . '/country_code';

	/**
	 * The full login route constant.
	 *
	 * @var string
	 */
	const FULL_AUTHENTICATION_ROUTE = Main::API_V1_NAMESPACE . '/' . self::AUTHENTICATION_ROUTE;

	/**
	 * The full country code option route constant.
	 *
	 * @var string
	 */
	const FULL_COUNTRY_CODE_OPTION_ROUTE = Main::API_V1_NAMESPACE . '/' . self::COUNTRY_CODE_OPTION_ROUTE;

	/**
	 * The login action.
	 *
	 * @var SEMrush_Login_Action
	 */
	private $login_action;

	/**
	 * The options action.
	 *
	 * @var SEMrush_Options_Action
	 */
	private $options_action;

	/**
	 * Semrush_Route constructor.
	 *
	 * @param Semrush_Login_Action   $login_action The login action.
	 * @param Semrush_Options_Action $options_action The options action.
	 */
	public function __construct(
		Semrush_Login_Action $login_action,
		Semrush_Options_Action $options_action
	) {
		$this->login_action = $login_action;
		$this->options_action = $options_action;
	}

	/**
	 * @inheritDoc
	 */
	public function register_routes() {
		$authentication_route_args = [
			'methods'  => 'POST',
			'callback' => [ $this, 'authenticate' ],
			'args'     => [
				'code' => [
					'validate_callback' => [ $this, 'has_valid_code' ],
					'required'          => true,
				],
			],
		];

		\register_rest_route( Main::API_V1_NAMESPACE, self::AUTHENTICATION_ROUTE, $authentication_route_args );

		$set_country_code_option_route_args = [
			'methods'  => 'POST',
			'callback' => [ $this, 'set_country_code_option' ],
			'permission_callback' => [ $this, 'can_edit' ],
			'args'     => [
				'country_code' => [
					'validate_callback' => [ $this, 'has_valid_country_code' ],
					'required'          => true,
				],
			],
		];

		\register_rest_route( Main::API_V1_NAMESPACE, self::COUNTRY_CODE_OPTION_ROUTE, $set_country_code_option_route_args );
	}

	/**
	 * Authenticates with SEMrush.
	 *
	 * @param WP_REST_Request $request The request. This request should have a code param set.
	 *
	 * @return WP_REST_Response The response.
	 */
	public function authenticate( WP_REST_Request $request ) {
		$data = $this
			->login_action
			->authenticate( $request['code'] );

		return new WP_REST_Response( $data, $data->status );
	}
	/**
	 * Sets SEMrush country code option.
	 *
	 * @param WP_REST_Request $request The request. This request should have a country code param set.
	 *
	 * @return WP_REST_Response The response.
	 */
	public function set_country_code_option( WP_REST_Request $request ) {
		$data = $this
			->options_action
			->set_country_code( $request['country_code'] );

		return new WP_REST_Response( $data, $data->status );
	}

	/**
	 * Checks if a valid code was returned.
	 *
	 * @param string $code The code to check.
	 *
	 * @return boolean Whether or not the code is valid.
	 */
	public function has_valid_code( $code ) {
		return $code !== '';
	}

	/**
	 * Checks if a valid country code was submitted.
	 *
	 * @param string $country_code The country code to check.
	 *
	 * @return boolean Whether or not the country code is valid.
	 */
	public function has_valid_country_code( $country_code ) {
		return ( $country_code !== '' && preg_match( '/^[a-z]{2}$/', $country_code ) === 1 );
	}

	/**
	 * Whether or not the current user is allowed to edit post and thus access the SEMrush modal.
	 *
	 * @return boolean Whether or not the current user is allowed to edit posts.
	 */
	public function can_edit() {
		return \current_user_can( 'edit_posts' );
	}
}
