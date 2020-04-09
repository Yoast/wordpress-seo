<?php
/**
 * Reindexation route for indexables
 *
 * @package Yoast\WP\SEO\Routes\Routes
 */

namespace Yoast\WP\SEO\Routes;

use Yoast\WP\SEO\Actions\Indexing\Indexable_Post_Indexation_Action;
use Yoast\WP\SEO\Conditionals\No_Conditionals;
use Yoast\WP\SEO\Main;
use Yoast\WP\SEO\Routes\Responses\Indexation_Response;

/**
 * Indexable_Reindexing_Route class
 */
class Indexable_Indexation_Route implements Route_Interface {

	/**
	 * The posts route constant.
	 *
	 * @var string
	 */
	const POSTS_ROUTE = 'indexation/posts';

	use No_Conditionals;

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
	 * @return Indexation_Response The response.
	 */
	public function index_posts() {
		$indexables = $this->post_indexation_action->index();

		return new Indexation_Response( $indexables, \rest_url( Main::API_V1_NAMESPACE . self::POSTS_ROUTE ) );
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
