<?php

namespace Yoast\WP\SEO\Routes;

use WP_REST_Request;
use WP_REST_Response;
use Yoast\WP\SEO\Actions\Options\Options_Get_Action;
use Yoast\WP\SEO\Actions\Options\Options_Save_Action;
use Yoast\WP\SEO\Conditionals\No_Conditionals;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Main;

/**
 * Options_Route class.
 */
class Options_Route implements Route_Interface {

	use No_Conditionals;

	/**
	 * Represents options route.
	 *
	 * @var string
	 */
	const OPTIONS_ROUTE = '/options';

	/**
	 * The Options helper.
	 *
	 * @var Options_Helper
	 */
	protected $options_helper;

	/**
	 * The Options get action.
	 *
	 * @var Options_Get_Action
	 */
	protected $get_action;

	/**
	 * The Options save action.
	 *
	 * @var Options_Save_Action
	 */
	protected $save_action;

	/**
	 * Options_Route constructor.
	 *
	 * @param Options_Helper      $options_helper The options' helper.
	 * @param Options_Get_Action  $get_action     The options' get action.
	 * @param Options_Save_Action $save_action    The options' save action.
	 */
	public function __construct(
		Options_Helper $options_helper,
		Options_Get_Action $get_action,
		Options_Save_Action $save_action

	) {
		$this->options_helper = $options_helper;
		$this->get_action     = $get_action;
		$this->save_action    = $save_action;
	}

	/**
	 * Registers routes with WordPress.
	 *
	 * @return void
	 */
	public function register_routes() {
		$options_route = [
			[
				'methods'  => 'GET',
				'callback' => [ $this, 'get_options' ],
//				'permission_callback' => TODO Capability_Helper,
			],
			[
				'methods'  => 'POST',
				'callback' => [ $this, 'save_options' ],
//				'permission_callback' => TODO Capability_Helper,
			],
		];

		\register_rest_route( Main::API_V1_NAMESPACE, self::OPTIONS_ROUTE, $options_route );
	}

	/**
	 * Returns the registered options.
	 *
	 * @return WP_REST_Response the registered options.
	 */
	public function get_options( $request ) {
		$options = array_keys( $request->get_params() );

		$data = $this->get_action->get( $options );

		return new WP_REST_Response( $data, $data->status );
	}

	/**
	 * Sets the options.
	 *
	 * @param WP_REST_Request $request The request object.
	 *
	 * @return WP_REST_Response the set options.
	 */
	public function save_options( $request ) {
		$options = $request->get_params();

		$data = $this->save_action->save( $options );

		return new WP_REST_Response( $data, $data->status );
	}
}
