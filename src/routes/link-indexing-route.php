<?php

namespace Yoast\WP\SEO\Routes;

use WP_Error;
use WP_REST_Response;
use Yoast\WP\SEO\Actions\Indexation\Indexation_Action_Interface;
use Yoast\WP\SEO\Actions\Indexation\Post_Link_Indexing_Action;
use Yoast\WP\SEO\Actions\Indexation\Term_Link_Indexing_Action;
use Yoast\WP\SEO\Conditionals\No_Conditionals;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Integrations\Admin\Indexing_Notification_Integration;
use Yoast\WP\SEO\Main;

/**
 * Reindexation route for link indexables.
 */
class Link_Indexing_Route extends Abstract_Indexation_Route {

	use No_Conditionals;

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
	 * The terms route constant.
	 *
	 * @var string
	 */
	const TERMS_ROUTE = 'link-indexing/terms';

	/**
	 * The full terms route constant.
	 *
	 * @var string
	 */
	const FULL_TERMS_ROUTE = Main::API_V1_NAMESPACE . '/' . self::TERMS_ROUTE;

	/**
	 * The post link indexing action.
	 *
	 * @var Post_Link_Indexing_Action
	 */
	protected $post_link_indexing_action;

	/**
	 * The term link indexing action.
	 *
	 * @var Term_Link_Indexing_Action
	 */
	protected $term_link_indexing_action;

	/**
	 * The options helper.
	 *
	 * @var Options_Helper
	 */
	protected $options_helper;

	/**
	 * Link_Indexing_Route constructor
	 *
	 * @param Post_Link_Indexing_Action $post_link_indexing_action The post link indexing action.
	 * @param Term_Link_Indexing_Action $term_link_indexing_action The term link indexing action.
	 * @param Options_Helper            $options_helper            The options helper.
	 */
	public function __construct(
		Post_Link_Indexing_Action $post_link_indexing_action,
		Term_Link_Indexing_Action $term_link_indexing_action,
		Options_Helper $options_helper
	) {
		$this->post_link_indexing_action = $post_link_indexing_action;
		$this->term_link_indexing_action = $term_link_indexing_action;
		$this->options_helper            = $options_helper;
	}

	/**
	 * Registers routes with WordPress.
	 */
	public function register_routes() {
		$args = [
			'methods'             => 'POST',
			'callback'            => [ $this, 'index_posts' ],
			'permission_callback' => [ $this, 'can_index' ],
		];
		\register_rest_route( Main::API_V1_NAMESPACE, self::POSTS_ROUTE, $args );

		$args['callback'] = [ $this, 'index_terms' ];
		\register_rest_route( Main::API_V1_NAMESPACE, self::TERMS_ROUTE, $args );
	}

	/**
	 * Indexes a number of posts for links.
	 *
	 * @return WP_Rest_Response The response.
	 */
	public function index_posts() {
		return $this->run_indexation_action( $this->post_link_indexing_action, self::FULL_POSTS_ROUTE );
	}

	/**
	 * Indexes a number of terms for links.
	 *
	 * @return WP_Rest_Response The response.
	 */
	public function index_terms() {
		return $this->run_indexation_action( $this->term_link_indexing_action, self::FULL_TERMS_ROUTE );
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
	 * @return WP_REST_Response|WP_Error The response, or an error when running the indexing action failed.
	 */
	protected function run_indexation_action( Indexation_Action_Interface $indexation_action, $url ) {
		try {
			return parent::run_indexation_action( $indexation_action, $url );
		} catch ( \Exception $exception ) {
			$this->options_helper->set( 'indexables_indexation_reason', Indexing_Notification_Integration::REASON_INDEXING_FAILED );

			return new WP_Error( 'wpseo_error_indexing', $exception->getMessage() );
		}
	}
}
