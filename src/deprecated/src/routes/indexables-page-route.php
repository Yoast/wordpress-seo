<?php

namespace Yoast\WP\SEO\Routes;

use WP_Error;
use WP_REST_Request;
use WP_REST_Response;
use Yoast\WP\SEO\Actions\Indexables_Page_Action;
use Yoast\WP\SEO\Conditionals\Indexables_Page_Conditional;
use Yoast\WP\SEO\Helpers\Indexables_Page_Helper;
use Yoast\WP\SEO\Main;

/**
 * Indexables_Page_Route class.
 *
 * @deprecated 20.4
 * @codeCoverageIgnore
 */
class Indexables_Page_Route implements Route_Interface {

	/**
	 * Represents the route that retrieves the neccessary information for setting up the Indexables Page.
	 *
	 * @var string
	 */
	const SETUP_INFO = '/setup_info';

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
	const UPDATE_IGNORED_INDEXABLES_ROUTE = '/update_ignored_indexables';

	/**
	 * Allows to restore an indexable previously ignored.
	 *
	 * @var string
	 */
	const RESTORE_INDEXABLE_ROUTE = '/restore_indexable';

	/**
	 * Allows to restore all indexables previously ignored.
	 *
	 * @var string
	 */
	const RESTORE_ALL_INDEXABLES_ROUTE = '/restore_all_indexables';

	/**
	 * Allows to restore all indexables previously ignored for a certain list.
	 *
	 * @var string
	 */
	const RESTORE_ALL_INDEXABLES_FOR_LIST_ROUTE = '/restore_all_indexables_for_list';

	/**
	 * Gets the reading list state.
	 *
	 * @var string
	 */
	const GET_READING_LIST_STATE = '/get_reading_list';

	/**
	 * Sets the reading list state.
	 *
	 * @var string
	 */
	const SET_READING_LIST_STATE = '/set_reading_list';

	/**
	 * The indexable actions.
	 *
	 * @var Indexables_Page_Action
	 */
	private $indexables_page_action;

	/**
	 * The indexables page helper.
	 *
	 * @var Indexables_Page_Helper
	 */
	private $indexables_page_helper;

	/**
	 * Indexables_Route constructor.
	 *
	 * @deprecated 20.4
	 * @codeCoverageIgnore
	 *
	 * @param Indexables_Page_Action $indexables_page_action The indexable actions.
	 * @param Indexables_Page_Helper $indexables_page_helper The indexables page helper.
	 */
	public function __construct( Indexables_Page_Action $indexables_page_action, Indexables_Page_Helper $indexables_page_helper ) {
		\_deprecated_function( __METHOD__, 'Yoast SEO 20.4' );

		$this->indexables_page_action = $indexables_page_action;
		$this->indexables_page_helper = $indexables_page_helper;
	}

	/**
	 * {@inheritDoc}
	 *
	 * @deprecated 20.4
	 * @codeCoverageIgnore
	 */
	public static function get_conditionals() {
		\_deprecated_function( __METHOD__, 'Yoast SEO 20.4' );
		return [
			Indexables_Page_Conditional::class,
		];
	}

	/**
	 * Permission callback.
	 *
	 * @deprecated 20.4
	 * @codeCoverageIgnore
	 *
	 * @return bool true when user has 'edit_others_posts' permission.
	 */
	public static function permission_edit_others_posts() {
		\_deprecated_function( __METHOD__, 'Yoast SEO 20.4' );
		return \current_user_can( 'edit_others_posts' );
	}

	/**
	 * Registers routes with WordPress.
	 *
	 * @deprecated 20.4
	 * @codeCoverageIgnore
	 *
	 * @return void
	 */
	public function register_routes() {
		\_deprecated_function( __METHOD__, 'Yoast SEO 20.4' );

		$setup_info_route = [
			[
				'methods'             => 'GET',
				'callback'            => [ $this, 'get_setup_info' ],
				'permission_callback' => [ $this, 'permission_edit_others_posts' ],
			],
		];

		\register_rest_route( Main::API_V1_NAMESPACE, self::SETUP_INFO, $setup_info_route );

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

		$update_ignored_indexables_route = [
			[
				'methods'             => 'POST',
				'callback'            => [ $this, 'update_ignored_indexables' ],
				'permission_callback' => [ $this, 'permission_edit_others_posts' ],
				'args'                => [
					'id' => [
						'type'     => 'integer',
						'minimum'  => 0,
					],
					'type' => [
						'type'     => 'string',
						'enum'     => [
							'least_readability',
							'least_seo_score',
							'most_linked',
							'least_linked',
						],
					],
				],
			],
		];

		\register_rest_route( Main::API_V1_NAMESPACE, self::UPDATE_IGNORED_INDEXABLES_ROUTE, $update_ignored_indexables_route );

		$restore_indexable_route = [
			[
				'methods'             => 'POST',
				'callback'            => [ $this, 'restore_indexable' ],
				'permission_callback' => [ $this, 'permission_edit_others_posts' ],
				'args'                => [
					'id' => [
						'type'     => 'integer',
						'minimum'  => 0,
					],
					'type' => [
						'type'     => 'string',
						'enum'     => [
							'least_readability',
							'least_seo_score',
							'most_linked',
							'least_linked',
						],
					],
				],
			],
		];

		\register_rest_route( Main::API_V1_NAMESPACE, self::RESTORE_INDEXABLE_ROUTE, $restore_indexable_route );

		$restore_all_indexables_route = [
			[
				'methods'             => 'POST',
				'callback'            => [ $this, 'restore_all_indexables' ],
				'permission_callback' => [ $this, 'permission_edit_others_posts' ],
			],
		];

		\register_rest_route( Main::API_V1_NAMESPACE, self::RESTORE_ALL_INDEXABLES_ROUTE, $restore_all_indexables_route );

		$restore_all_indexables_for_list_route = [
			[
				'methods'             => 'POST',
				'callback'            => [ $this, 'restore_all_indexables_for_list' ],
				'permission_callback' => [ $this, 'permission_edit_others_posts' ],
				'args'                => [
					'type' => [
						'type'     => 'string',
						'enum'     => [
							'least_readability',
							'least_seo_score',
							'most_linked',
							'least_linked',
						],
					],
				],
			],
		];

		\register_rest_route( Main::API_V1_NAMESPACE, self::RESTORE_ALL_INDEXABLES_FOR_LIST_ROUTE, $restore_all_indexables_for_list_route );

		$get_reading_list_route = [
			[
				'methods'             => 'GET',
				'callback'            => [ $this, 'get_reading_list' ],
				'permission_callback' => [ $this, 'permission_edit_others_posts' ],
			],
		];

		\register_rest_route( Main::API_V1_NAMESPACE, self::GET_READING_LIST_STATE, $get_reading_list_route );

		$set_reading_list_route = [
			[
				'methods'             => 'POST',
				'callback'            => [ $this, 'set_reading_list' ],
				'permission_callback' => [ $this, 'permission_edit_others_posts' ],
				'args'                => [
					'state' => [
						'type'     => 'array',
					],
				],
			],
		];

		\register_rest_route( Main::API_V1_NAMESPACE, self::SET_READING_LIST_STATE, $set_reading_list_route );
	}

	/**
	 * Gets the necessary information to set up the indexables page.
	 *
	 * @deprecated 20.4
	 * @codeCoverageIgnore
	 *
	 * @return WP_REST_Response The neccessary information to set up the indexables page.
	 */
	public function get_setup_info() {
		\_deprecated_function( __METHOD__, 'Yoast SEO 20.4' );

		$setup_info = $this->indexables_page_action->get_setup_info( $this->indexables_page_helper->get_minimum_posts_threshold(), $this->indexables_page_helper->get_minimum_analyzed_posts_threshold() );
		return new WP_REST_Response(
			[
				'json' => $setup_info,
			]
		);
	}

	/**
	 * Gets the posts with the smallest readability scores.
	 *
	 * @deprecated 20.4
	 * @codeCoverageIgnore
	 *
	 * @return WP_REST_Response The posts with the smallest readability scores.
	 */
	public function get_least_readable() {
		\_deprecated_function( __METHOD__, 'Yoast SEO 20.4' );

		$least_readable = $this->indexables_page_action->get_least_readable( $this->indexables_page_helper->get_buffer_size() );
		return new WP_REST_Response(
			[
				'json' => [
					'list'   => $least_readable,
					'length' => \count( $least_readable ),
				],
			]
		);
	}

	/**
	 * Gets the posts with the smallest readability scores.
	 *
	 * @deprecated 20.4
	 * @codeCoverageIgnore
	 *
	 * @return WP_REST_Response The posts with the smallest readability scores.
	 */
	public function get_least_seo_score() {
		\_deprecated_function( __METHOD__, 'Yoast SEO 20.4' );

		$least_seo_score = $this->indexables_page_action->get_least_seo_score( $this->indexables_page_helper->get_buffer_size() );
		return new WP_REST_Response(
			[
				'json' => [
					'list'   => $least_seo_score,
					'length' => \count( $least_seo_score ),
				],
			]
		);
	}

	/**
	 * Gets the most linked posts.
	 *
	 * @deprecated 20.4
	 * @codeCoverageIgnore
	 *
	 * @return WP_REST_Response The most linked posts.
	 */
	public function get_most_linked() {
		\_deprecated_function( __METHOD__, 'Yoast SEO 20.4' );

		$most_linked = $this->indexables_page_action->get_most_linked( $this->indexables_page_helper->get_buffer_size() );
		return new WP_REST_Response(
			[
				'json' => [
					'list'   => $most_linked,
					'length' => \count( $most_linked ),
				],
			]
		);
	}

	/**
	 * Gets the least linked posts.
	 *
	 * @deprecated 20.4
	 * @codeCoverageIgnore
	 *
	 * @return WP_REST_Response The most linked posts.
	 */
	public function get_least_linked() {
		\_deprecated_function( __METHOD__, 'Yoast SEO 20.4' );

		$least_linked = $this->indexables_page_action->get_least_linked( $this->indexables_page_helper->get_buffer_size() );
		return new WP_REST_Response(
			[
				'json' => [
					'list'   => $least_linked,
					'length' => \count( $least_linked ),
				],
			]
		);
	}

	/**
	 * Adds an indexable id in the ignore list.
	 *
	 * @deprecated 20.4
	 * @codeCoverageIgnore
	 *
	 * @param WP_REST_Request $request The request object.
	 *
	 * @return WP_REST_Response|WP_Error The success or failure response.
	 */
	public function update_ignored_indexables( WP_REST_Request $request ) {
		\_deprecated_function( __METHOD__, 'Yoast SEO 20.4' );

		$params           = $request->get_json_params();
		$ignore_list_name = $params['type'] . '_ignore_list';

		$ignored_indexable_ids = \array_map(
			static function ( $ignored_indexable_id ) {
				return \intval( $ignored_indexable_id );
			},
			$params['list']
		);

		if ( $this->indexables_page_action->update_ignored_indexables( $ignore_list_name, $ignored_indexable_ids ) ) {
			return new WP_REST_Response(
				[
					'json' => (object) [ 'success' => true ],
				],
				200
			);
		}

		return new WP_Error(
			'ignore_failed',
			'Could not save the option in the database',
			[
				'status' => 500,
			]
		);
	}

	/**
	 * Restores an indexable id from the ignore list.
	 *
	 * @deprecated 20.4
	 * @codeCoverageIgnore
	 *
	 * @param WP_REST_Request $request The request object.
	 *
	 * @return WP_REST_Response|WP_Error The success or failure response.
	 */
	public function restore_indexable( WP_REST_Request $request ) {
		\_deprecated_function( __METHOD__, 'Yoast SEO 20.4' );

		$params           = $request->get_json_params();
		$ignore_list_name = $params['type'] . '_ignore_list';
		$indexable_id     = \intval( $params['id'] );

		if ( $this->indexables_page_action->remove_indexable_from_ignore_list( $ignore_list_name, $indexable_id ) ) {
			return new WP_REST_Response(
				[
					'json' => (object) [ 'success' => true ],
				],
				200
			);
		}

		return new WP_Error(
			'restore_failed',
			'Could not save the option in the database',
			[
				'status' => 500,
			]
		);
	}

	/**
	 * Restores all indexables from all ignore lists.
	 *
	 * @deprecated 20.4
	 * @codeCoverageIgnore
	 *
	 * @return WP_REST_Response|WP_Error The success or failure response.
	 */
	public function restore_all_indexables() {
		\_deprecated_function( __METHOD__, 'Yoast SEO 20.4' );

		$list_names = $this->indexables_page_helper->get_ignore_list_names();
		$success    = true;
		foreach ( $list_names as $list_name ) {
			$result = $this->indexables_page_action->remove_all_indexables_from_ignore_list( $list_name );

			if ( $result === false ) {
				$success = false;
			}
		}

		if ( $success === true ) {
			return new WP_REST_Response(
				[
					'json' => (object) [ 'success' => true ],
				],
				200
			);
		}

		return new WP_Error(
			'restore_all_failed',
			'Could not save the option in the database',
			[
				'status' => 500,
			]
		);
	}

	/**
	 * Restores all indexables from a specific ignore list.
	 *
	 * @deprecated 20.4
	 * @codeCoverageIgnore
	 *
	 * @param WP_REST_Request $request The request object.
	 *
	 * @return WP_REST_Response|WP_Error The success or failure response.
	 */
	public function restore_all_indexables_for_list( WP_REST_Request $request ) {
		\_deprecated_function( __METHOD__, 'Yoast SEO 20.4' );

		$params           = $request->get_json_params();
		$ignore_list_name = $params['type'] . '_ignore_list';

		if ( $this->indexables_page_action->remove_all_indexables_from_ignore_list( $ignore_list_name ) ) {
			return new WP_REST_Response(
				[
					'json' => (object) [ 'success' => true ],
				],
				200
			);
		}

		return new WP_Error(
			'restore_all_list_failed',
			'Could not save the option in the database',
			[
				'status' => 500,
			]
		);
	}

	/**
	 * Gets the state of the reading list.
	 *
	 * @deprecated 20.4
	 * @codeCoverageIgnore
	 *
	 * @return WP_REST_Response A list of boolean values which are true if an article has been flagged as read.
	 */
	public function get_reading_list() {
		\_deprecated_function( __METHOD__, 'Yoast SEO 20.4' );

		$reading_list = $this->indexables_page_action->get_reading_list();
		return new WP_REST_Response(
			[
				'json' => [
					'state' => $reading_list,
				],
			]
		);
	}

	/**
	 * Sets the state of the reading list.
	 *
	 * @deprecated 20.4
	 * @codeCoverageIgnore
	 *
	 * @param WP_REST_Request $request The request object.
	 *
	 * @return WP_REST_Response|WP_Error The success or failure response.
	 */
	public function set_reading_list( WP_REST_Request $request ) {
		\_deprecated_function( __METHOD__, 'Yoast SEO 20.4' );

		$params             = $request->get_json_params();
		$reading_list_state = \array_map(
			static function ( $article ) {
				return \boolval( $article );
			},
			$params['state']
		);

		if ( $this->indexables_page_action->set_reading_list( $reading_list_state ) ) {
			return new WP_REST_Response(
				[
					'json' => (object) [ 'success' => true ],
				],
				200
			);
		}

		return new WP_Error(
			'set_list_failed',
			'Could not save the option in the database',
			[
				'status' => 500,
			]
		);
	}
}
