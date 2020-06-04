<?php
/**
 * Reindexation route for indexables.
 *
 * @package Yoast\WP\SEO\Routes\Routes
 */

namespace Yoast\WP\SEO\Routes;

use WP_REST_Response;
use Yoast\WP\SEO\Actions\Indexation\Post_Link_Indexing_Action;
use Yoast\WP\SEO\Main;

/**
 * Link_Indexing_Route class.
 */
class Link_Indexing_Route extends Abstract_Indexation_Route {

	/**
	 * The posts route constant.
	 *
	 * @var string
	 */
	const POSTS_ROUTE = 'link-indexing/posts';

	/**
	 * The full posts route constant.
	 *
	 * @var string
	 */
	const FULL_POSTS_ROUTE = Main::API_V1_NAMESPACE . '/' . self::POSTS_ROUTE;

	/**
	 * The post link builder.
	 *
	 * @var Post_Link_Indexing_Action
	 */
	protected $post_link_indexing_action;

	/**
	 * Link_Indexing_Route constructor
	 *
	 * @param Post_Link_Indexing_Action $post_link_indexing_action The post link builder.
	 */
	public function __construct( Post_Link_Indexing_Action $post_link_indexing_action ) {
		$this->post_link_indexing_action = $post_link_indexing_action;
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
	 * Indexes a number of posts for links.
	 *
	 * @return WP_Rest_Response The response.
	 */
	public function index_posts() {
		return $this->run_indexation_action( $this->post_link_indexing_action, self::FULL_POSTS_ROUTE );
	}
}
