<?php
/**
 * Reindexation route for indexables
 *
 * @package Yoast\WP\SEO\Routes\Routes
 */

namespace Yoast\WP\SEO\Routes;

use WP_REST_Response;
use Yoast\WP\SEO\Actions\Indexing\Indexable_Post_Indexation_Action;
use Yoast\WP\SEO\Conditionals\No_Conditionals;
use Yoast\WP\SEO\Main;

/**
 * Indexable_Reindexing_Route class
 */
class Indexable_Indexation_Route extends Abstract_Indexation_Route {

	use No_Conditionals;

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
	 * The post indexation action.
	 *
	 * @var Indexable_Post_Indexation_Action
	 */
	private $post_indexation_action;


	/**
	 * Indexable_Indexation_Route constructor
	 *
	 * @param Indexable_Post_Indexation_Action $post_indexation_action The post indexation action.
	 */
	public function __construct( Indexable_Post_Indexation_Action $post_indexation_action ) {
		$this->post_indexation_action = $post_indexation_action;
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
	}

	/**
	 * Indexes a number of unindexed posts.
	 *
	 * @return WP_REST_Response The response.
	 */
	public function index_posts() {
		$indexables = $this->post_indexation_action->index();
		$next_url   = empty( $indexables ) ? false : \rest_url( self::FULL_POSTS_ROUTE );

		return $this->respond_with( $indexables, $next_url );
	}

	/**
	 * Whether or not the current user is allowed to index.
	 *
	 * @return boolean Whether or not the current user is allowed to index.
	 */
	public function can_index() {
		return \current_user_can( 'edit_posts' );
	}
}
