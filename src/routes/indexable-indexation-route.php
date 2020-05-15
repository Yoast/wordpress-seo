<?php
/**
 * Reindexation route for indexables.
 *
 * @package Yoast\WP\SEO\Routes\Routes
 */

namespace Yoast\WP\SEO\Routes;

use WP_REST_Response;
use Yoast\WP\SEO\Actions\Indexation\Indexable_General_Indexation_Action;
use Yoast\WP\SEO\Actions\Indexation\Indexable_Post_Indexation_Action;
use Yoast\WP\SEO\Actions\Indexation\Indexable_Term_Indexation_Action;
use Yoast\WP\SEO\Actions\Indexation\Indexable_Post_Type_Archive_Indexation_Action;
use Yoast\WP\SEO\Actions\Indexation\Indexation_Action_Interface;
use Yoast\WP\SEO\Conditionals\No_Conditionals;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Main;

/**
 * Indexable_Reindexing_Route class.
 */
class Indexable_Indexation_Route extends Abstract_Indexation_Route {

	use No_Conditionals;

	/**
	 * The indexation complete route constant.
	 *
	 * @var string
	 */
	const COMPLETE_ROUTE = 'indexation/complete';

	/**
	 * The full indexation complete route constant.
	 *
	 * @var string
	 */
	const FULL_COMPLETE_ROUTE = Main::API_V1_NAMESPACE . '/' . self::COMPLETE_ROUTE;

	/**
	 * The indexation prepare route constant.
	 *
	 * @var string
	 */
	const PREPARE_ROUTE = 'indexation/prepare';

	/**
	 * The full indexation complete route constant.
	 *
	 * @var string
	 */
	const FULL_PREPARE_ROUTE = Main::API_V1_NAMESPACE . '/' . self::PREPARE_ROUTE;

	/**
	 * The posts route constant.
	 *
	 * @var string
	 */
	const POSTS_ROUTE = 'indexation/posts';

	/**
	 * The full posts route constant.
	 *
	 * @var string
	 */
	const FULL_POSTS_ROUTE = Main::API_V1_NAMESPACE . '/' . self::POSTS_ROUTE;

	/**
	 * The terms route constant.
	 *
	 * @var string
	 */
	const TERMS_ROUTE = 'indexation/terms';

	/**
	 * The full terms route constant.
	 *
	 * @var string
	 */
	const FULL_TERMS_ROUTE = Main::API_V1_NAMESPACE . '/' . self::TERMS_ROUTE;

	/**
	 * The terms route constant.
	 *
	 * @var string
	 */
	const POST_TYPE_ARCHIVES_ROUTE = 'indexation/post-type-archives';

	/**
	 * The full terms route constant.
	 *
	 * @var string
	 */
	const FULL_POST_TYPE_ARCHIVES_ROUTE = Main::API_V1_NAMESPACE . '/' . self::POST_TYPE_ARCHIVES_ROUTE;

	/**
	 * The general route constant.
	 *
	 * @var string
	 */
	const GENERAL_ROUTE = 'indexation/general';

	/**
	 * The full general route constant.
	 *
	 * @var string
	 */
	const FULL_GENERAL_ROUTE = Main::API_V1_NAMESPACE . '/' . self::GENERAL_ROUTE;

	/**
	 * The post indexation action.
	 *
	 * @var Indexable_Post_Indexation_Action
	 */
	private $post_indexation_action;

	/**
	 * The term indexation action.
	 *
	 * @var Indexable_Term_Indexation_Action
	 */
	private $term_indexation_action;

	/**
	 * The post type archive indexation action.
	 *
	 * @var Indexable_Post_Type_Archive_Indexation_Action
	 */
	private $post_type_archive_indexation_action;

	/**
	 * Represents the general indexation action.
	 *
	 * @var Indexable_General_Indexation_Action
	 */
	private $general_indexation_action;

	/**
	 * Represents the options helper.
	 *
	 * @var Options_Helper
	 */
	private $options_helper;

	/**
	 * Indexable_Indexation_Route constructor.
	 *
	 * @param Indexable_Post_Indexation_Action              $post_indexation_action              The post indexation action.
	 * @param Indexable_Term_Indexation_Action              $term_indexation_action              The term indexation action.
	 * @param Indexable_Post_Type_Archive_Indexation_Action $post_type_archive_indexation_action The post type archive indexation action.
	 * @param Indexable_General_Indexation_Action           $general_indexation_action           The general indexation action.
	 * @param Options_Helper                                $options_helper                      The options helper.
	 */
	public function __construct(
		Indexable_Post_Indexation_Action $post_indexation_action,
		Indexable_Term_Indexation_Action $term_indexation_action,
		Indexable_Post_Type_Archive_Indexation_Action $post_type_archive_indexation_action,
		Indexable_General_Indexation_Action $general_indexation_action,
		Options_Helper $options_helper
	) {
		$this->post_indexation_action              = $post_indexation_action;
		$this->term_indexation_action              = $term_indexation_action;
		$this->post_type_archive_indexation_action = $post_type_archive_indexation_action;
		$this->general_indexation_action           = $general_indexation_action;
		$this->options_helper                      = $options_helper;
	}

	/**
	 * @inheritDoc
	 */
	public function register_routes() {
		\register_rest_route( Main::API_V1_NAMESPACE, self::POSTS_ROUTE, [
			'methods'             => 'POST',
			'callback'            => [ $this, 'index_posts' ],
			'permission_callback' => [ $this, 'can_index' ],
		] );
		\register_rest_route( Main::API_V1_NAMESPACE, self::TERMS_ROUTE, [
			'methods'             => 'POST',
			'callback'            => [ $this, 'index_terms' ],
			'permission_callback' => [ $this, 'can_index' ],
		] );
		\register_rest_route( Main::API_V1_NAMESPACE, self::POST_TYPE_ARCHIVES_ROUTE, [
			'methods'             => 'POST',
			'callback'            => [ $this, 'index_post_type_archives' ],
			'permission_callback' => [ $this, 'can_index' ],
		] );
		\register_rest_route( Main::API_V1_NAMESPACE, self::GENERAL_ROUTE, [
			'methods'             => 'POST',
			'callback'            => [ $this, 'index_general' ],
			'permission_callback' => [ $this, 'can_index' ],
		] );
		\register_rest_route( Main::API_V1_NAMESPACE, self::PREPARE_ROUTE, [
			'methods'             => 'POST',
			'callback'            => [ $this, 'prepare' ],
			'permission_callback' => [ $this, 'can_index' ],
		] );
		\register_rest_route( Main::API_V1_NAMESPACE, self::COMPLETE_ROUTE, [
			'methods'             => 'POST',
			'callback'            => [ $this, 'complete' ],
			'permission_callback' => [ $this, 'can_index' ],
		] );
	}

	/**
	 * Indexes a number of unindexed posts.
	 *
	 * @return WP_REST_Response The response.
	 */
	public function index_posts() {
		return $this->run_indexation_action( $this->post_indexation_action, self::FULL_POSTS_ROUTE );
	}

	/**
	 * Indexes a number of unindexed terms.
	 *
	 * @return WP_REST_Response The response.
	 */
	public function index_terms() {
		return $this->run_indexation_action( $this->term_indexation_action, self::FULL_TERMS_ROUTE );
	}

	/**
	 * Indexes a number of unindexed post type archive pages.
	 *
	 * @return WP_REST_Response The response.
	 */
	public function index_post_type_archives() {
		return $this->run_indexation_action( $this->post_type_archive_indexation_action, self::FULL_POST_TYPE_ARCHIVES_ROUTE );
	}

	/**
	 * Indexes a number of unindexed general items.
	 *
	 * @return WP_REST_Response The response.
	 */
	public function index_general() {
		return $this->run_indexation_action( $this->general_indexation_action, self::FULL_GENERAL_ROUTE );
	}

	/**
	 * Prepares the indexation.
	 */
	public function prepare() {
		$this->options_helper->set( 'indexation_started', time() );

		return $this->respond_with( [], false );
	}

	/**
	 * Completes the indexation.
	 */
	public function complete() {
		$this->options_helper->set( 'indexation_started', 0 );

		return $this->respond_with( [], false );
	}

	/**
	 * Whether or not the current user is allowed to index.
	 *
	 * @return boolean Whether or not the current user is allowed to index.
	 */
	public function can_index() {
		return \current_user_can( 'edit_posts' );
	}

	/**
	 * Runs an indexation action and returns the response.
	 *
	 * @param Indexation_Action_Interface $indexation_action The indexation action.
	 * @param string                      $url               The url of the indexation route.
	 *
	 * @return WP_REST_Response The response.
	 */
	protected function run_indexation_action( Indexation_Action_Interface $indexation_action, $url ) {
		$indexables = $indexation_action->index();

		$next_url = false;
		if ( \count( $indexables ) >= $indexation_action->get_limit() ) {
			$next_url = \rest_url( $url );
		}

		return $this->respond_with( $indexables, $next_url );
	}
}
