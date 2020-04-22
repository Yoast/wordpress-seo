<?php
/**
 * Reindexation route for indexables.
 *
 * @package Yoast\WP\SEO\Routes\Routes
 */

namespace Yoast\WP\SEO\Routes;

use WP_REST_Request;
use WP_REST_Response;
use Yoast\WP\SEO\Actions\Indexables\Indexable_Head_Action;
use Yoast\WP\SEO\Conditionals\No_Conditionals;
use Yoast\WP\SEO\Main;

/**
 * Indexable_Reindexing_Route class.
 */
class Indexables_Head_Route implements Route_Interface {

	use No_Conditionals;

	/**
	 * The posts route constant.
	 *
	 * @var string
	 */
	const HEAD_FOR_URL_ROUTE = 'get_head';

	/**
	 * The full posts route constant.
	 *
	 * @var string
	 */
	const FULL_HEAD_FOR_URL_ROUTE = Main::API_V1_NAMESPACE . '/' . self::HEAD_FOR_URL_ROUTE;

	/**
	 * The head action.
	 *
	 * @var Indexable_Head_Action
	 */
	private $head_action;

	/**
	 * Indexable_Indexation_Route constructor.
	 *
	 * @param Indexable_Head_Action $head_action The head action.
	 */
	public function __construct( Indexable_Head_Action $head_action ) {
		$this->head_action = $head_action;
	}

	/**
	 * @inheritDoc
	 */
	public function register_routes() {
		\register_rest_route( Main::API_V1_NAMESPACE, self::HEAD_FOR_URL_ROUTE, [
			'methods'  => 'GET',
			'callback' => [ $this, 'get_head' ],
			'args'     => [
				'url' => [
					'validate_callback' => [ $this, 'is_valid_url' ],
					'required'          => true,
				],
			],
		] );
	}

	/**
	 * Gets the head of a page for a given URL.
	 *
	 * @param WP_REST_Request $request The request. This request should have a url param set.
	 *
	 * @return WP_REST_Response The response.
	 */
	public function get_head( WP_REST_Request $request ) {
		$url  = \esc_url_raw( $request['url'] );
		$data = $this->head_action->for_url( $url );

		return new WP_REST_Response( $data, $data->status );
	}

	/**
	 * Checks if a url is a valid url.
	 *
	 * @param string $url The url to check.
	 *
	 * @return boolean Whether or not the url is valid.
	 */
	public function is_valid_url( $url ) {
		if ( \filter_var( $url, FILTER_VALIDATE_URL ) === false ) {
			return false;
		}
		return true;
	}
}
