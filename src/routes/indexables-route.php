<?php

namespace Yoast\WP\SEO\Routes;

use WP_REST_Request;
use WP_REST_Response;
use Yoast\WP\SEO\Actions\Indexables\Indexable_Action;
use Yoast\WP\SEO\Conditionals\No_Conditionals;
use Yoast\WP\SEO\Helpers\Indexables_Page_Helper;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Helpers\Post_Type_Helper;
use Yoast\WP\SEO\Main;

/**
 * Indexables_Route class.
 */
class Indexables_Route implements Route_Interface {

	use No_Conditionals;

	/**
	 * Represents the least readability route.
	 *
	 * @var string
	 */
	const LEAST_READABILITY_ROUTE = '/least_readability';

	/**
	 * Represents the least SEO score route.
	 *
	 * @var string
	 */
	const LEAST_SEO_SCORE_ROUTE = '/least_seo_score';

	/**
	 * Represents the most linked route.
	 *
	 * @var string
	 */
	const MOST_LINKED_ROUTE = '/most_linked';

	/**
	 * Represents the least linked route.
	 *
	 * @var string
	 */
	const LEAST_LINKED_ROUTE = '/least_linked';

	/**
	 * Allows to mark an indexable to be ignored.
	 *
	 * @var string
	 */
	const IGNORE_INDEXABLE_ROUTE = '/ignore_indexable';

	/**
	 * Allows to restore an indexable previously ignored.
	 *
	 * @var string
	 */
	const RESTORE_INDEXABLE_ROUTE = '/restore_indexable';

	/**
	 * The indexable actions.
	 *
	 * @var Indexable_Action
	 */
	private $indexable_action;

	/**
	 * The indexables page helper.
	 *
	 * @var Indexables_Page_Helper
	 */
	private $indexables_page_helper;

	/**
	 * Indexables_Route constructor.
	 *
	 * @param Indexable_Action       $indexable_action The indexable actions.
	 * @param Indexables_Page_Helper $indexables_page_helper The indexables page helper.
	 */
	public function __construct( Indexable_Action $indexable_action, Indexables_Page_Helper $indexables_page_helper ) {
		$this->indexable_action       = $indexable_action;
		$this->indexables_page_helper = $indexables_page_helper;
	}

	/**
	 * Permission callback.
	 *
	 * @return bool true when user has 'edit_others_posts' permission.
	 */
	public static function permission_edit_others_posts() {
		return \current_user_can( 'edit_others_posts' );
	}

	/**
	 * Registers routes with WordPress.
	 *
	 * @return void
	 */
	public function register_routes() {
		$least_readability_route = [
			[
				'methods'             => 'GET',
				'callback'            => [ $this, 'get_least_readable' ],
				'permission_callback' => [ $this, 'permission_edit_others_posts' ],
			],
		];

		\register_rest_route( Main::API_V1_NAMESPACE, self::LEAST_READABILITY_ROUTE, $least_readability_route );

		$least_seo_score_route = [
			[
				'methods'             => 'GET',
				'callback'            => [ $this, 'get_least_seo_score' ],
				'permission_callback' => [ $this, 'permission_edit_others_posts' ],
			],
		];

		\register_rest_route( Main::API_V1_NAMESPACE, self::LEAST_SEO_SCORE_ROUTE, $least_seo_score_route );

		$most_linked_route = [
			[
				'methods'             => 'GET',
				'callback'            => [ $this, 'get_most_linked' ],
				'permission_callback' => [ $this, 'permission_edit_others_posts' ],
			],
		];

		\register_rest_route( Main::API_V1_NAMESPACE, self::MOST_LINKED_ROUTE, $most_linked_route );

		$least_linked_route = [
			[
				'methods'             => 'GET',
				'callback'            => [ $this, 'get_least_linked' ],
				'permission_callback' => [ $this, 'permission_edit_others_posts' ],
			],
		];

		\register_rest_route( Main::API_V1_NAMESPACE, self::LEAST_LINKED_ROUTE, $least_linked_route );

		$ignore_indexable_route = [
			[
				'methods'             => 'POST',
				'callback'            => [ $this, 'ignore_indexable' ],
				'permission_callback' => [ $this, 'permission_edit_others_posts' ],
				// @TODO: add validation/sanitization.
				'args'                => [
					'id' => [
						'type'     => 'integer',
					],
					'type' => [
						'type'     => 'string',
					],
				],
			],
		];

		\register_rest_route( Main::API_V1_NAMESPACE, self::IGNORE_INDEXABLE_ROUTE, $ignore_indexable_route );

		$restore_indexable_route = [
			[
				'methods'             => 'POST',
				'callback'            => [ $this, 'restore_indexable' ],
				'permission_callback' => [ $this, 'permission_edit_others_posts' ],
				// @TODO: add validation/sanitization.
				'args'                => [
					'id' => [
						'type'     => 'integer',
					],
					'type' => [
						'type'     => 'string',
					],
				],
			],
		];

		\register_rest_route( Main::API_V1_NAMESPACE, self::RESTORE_INDEXABLE_ROUTE, $restore_indexable_route );
	}

	/**
	 * Gets the posts with the smallest readability scores.
	 *
	 * @return WP_REST_Response The posts with the smallest readability scores.
	 */
	public function get_least_readable() {
		$least_readable = $this->indexable_action->get_least_readable( $this->indexables_page_helper->get_buffer_size() );
		return new WP_REST_Response(
			[
				'json' => [
					'list' => $least_readable,
				],
			]
		);
	}

	/**
	 * Gets the posts with the smallest readability scores.
	 *
	 * @return WP_REST_Response The posts with the smallest readability scores.
	 */
	public function get_least_seo_score() {
		$least_seo_score = $this->indexable_action->get_least_seo_score( $this->indexables_page_helper->get_buffer_size() );
		return new WP_REST_Response(
			[
				'json' => [
					'list' => $least_seo_score,
				],
			]
		);
	}

	/**
	 * Gets the most linked posts.
	 *
	 * @return WP_REST_Response The most linked posts.
	 */
	public function get_most_linked() {
		$most_linked = $this->indexable_action->get_most_linked( $this->indexables_page_helper->get_buffer_size() );
		return new WP_REST_Response(
			[
				'json' => [
					'list' => $most_linked,
				],
			]
		);
	}

	/**
	 * Gets the least linked posts.
	 *
	 * @return WP_REST_Response The most linked posts.
	 */
	public function get_least_linked() {
		$least_linked = $this->indexable_action->get_least_linked( $this->indexables_page_helper->get_buffer_size() );
		return new WP_REST_Response(
			[
				'json' => [
					'list' => $least_linked,
				],
			]
		);
	}

	/**
	 * Adds an indexable id in the ignore list.
	 *
	 * @param WP_REST_Request $request The request object.
	 *
	 * @return WP_REST_Response The success or failure response.
	 */
	public function ignore_indexable( WP_REST_Request $request ) {
		$params           = $request->get_json_params();
		$ignore_list_name = $params['type'] . '_ignore_list';
		$indexable_id     = intval( $params['id'] );

		if ( $this->indexable_action->add_indexable_to_ignore_list( $ignore_list_name, $indexable_id ) ) {
			return new WP_REST_Response(
				[ 'success' => true ],
				200
			);
		}
		else {
			return new WP_REST_Response(
				[
					'success' => false,
					'error'   => 'Could not save the option in the database',
				],
				500
			);
		}
	}

	/**
	 * Restores an indexable id from the ignore list.
	 *
	 * @param WP_REST_Request $request The request object.
	 *
	 * @return WP_REST_Response The success or failure response.
	 */
	public function restore_indexable( WP_REST_Request $request ) {
		$params           = $request->get_json_params();
		$ignore_list_name = $params['type'] . '_ignore_list';
		$indexable_id     = intval( $params['id'] );

		if ( $this->indexable_action->remove_indexable_from_ignore_list( $ignore_list_name, $indexable_id ) ) {
			return new WP_REST_Response(
				[ 'success' => true ],
				200
			);
		}
		else {
			return new WP_REST_Response(
				[
					'success' => false,
					'error'   => 'Could not save the option in the database',
				],
				500
			);
		}
	}
}
