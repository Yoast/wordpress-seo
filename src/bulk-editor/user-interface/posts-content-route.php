<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Bulk_Editor\User_Interface;

use WP_Post;
use WP_REST_Request;
use WP_REST_Response;
use Yoast\WP\SEO\Bulk_Editor\Application\Posts\Posts_Collector_Interface;
use Yoast\WP\SEO\Bulk_Editor\Application\Updates\Post_Access_Checker_Interface;
use Yoast\WP\SEO\Conditionals\No_Conditionals;
use Yoast\WP\SEO\Main;
use Yoast\WP\SEO\Routes\Route_Interface;

/**
 * Registers a route that returns the raw content of the requested posts.
 *
 * Serves the AI bulk suggestions flow, which collects each post's prompt content in the browser (so it runs through
 * the same analysis engine as the in-editor AI generator) and therefore needs the unrendered `post_content`. It is
 * deliberately separate from the posts route: the table listing does not need content, and keeping it out of that
 * payload keeps page loads lean.
 */
class Posts_Content_Route implements Route_Interface {

	use No_Conditionals;

	/**
	 * The namespace for this route.
	 *
	 * @var string
	 */
	public const ROUTE_NAMESPACE = Main::API_V1_NAMESPACE;

	/**
	 * The prefix for this route.
	 *
	 * @var string
	 */
	public const ROUTE_PREFIX = '/bulk_editor/posts_content';

	/**
	 * The maximum number of posts whose content can be requested at once.
	 *
	 * Matches the maximum number of posts a single AI bulk suggestions request accepts, since that is the only
	 * consumer: there is never a reason to ask for more in one call.
	 *
	 * @var int
	 */
	public const MAX_IDS = 20;

	/**
	 * The post access checker.
	 *
	 * @var Post_Access_Checker_Interface
	 */
	private $post_access_checker;

	/**
	 * The constructor.
	 *
	 * @param Post_Access_Checker_Interface $post_access_checker The post access checker.
	 */
	public function __construct( Post_Access_Checker_Interface $post_access_checker ) {
		$this->post_access_checker = $post_access_checker;
	}

	/**
	 * Registers routes with WordPress.
	 *
	 * @return void
	 */
	public function register_routes() {
		\register_rest_route(
			self::ROUTE_NAMESPACE,
			self::ROUTE_PREFIX,
			[
				'methods'             => 'GET',
				'args'                => [
					'ids' => [
						'required'    => true,
						'type'        => 'array',
						'minItems'    => 1,
						'maxItems'    => self::MAX_IDS,
						'items'       => [
							'type'    => 'integer',
							'minimum' => 1,
						],
						'description' => 'The IDs of the posts to return the content of. Accepts a comma separated list.',
					],
				],
				'callback'            => [ $this, 'get_posts_content' ],
				'permission_callback' => [ $this, 'check_permissions' ],
			],
		);
	}

	/**
	 * Returns the raw content of the requested posts.
	 *
	 * Posts that no longer exist, are not of an editable type, that the current user may not edit, or that the
	 * bulk editor does not list are omitted from the response rather than failing the request: one inaccessible
	 * post out of a selection should not cost the caller the whole batch. The caller treats an absent ID as
	 * "no content available" for that row.
	 *
	 * @param WP_REST_Request $request The request object.
	 *
	 * @return WP_REST_Response The posts and their raw content.
	 */
	public function get_posts_content( WP_REST_Request $request ): WP_REST_Response {
		/*
		 * The `ids` argument declares `type: array` in the schema, so WordPress has already normalized it by the
		 * time the callback runs: `rest_sanitize_array()` puts a scalar through `wp_parse_list()`, which means a
		 * comma separated `ids=11,22` arrives here as [ 11, 22 ] rather than as one string. The cast therefore only
		 * guards a non-array reaching this method from a direct call.
		 */
		$post_ids = \array_unique( \array_map( '\intval', (array) $request->get_param( 'ids' ) ) );

		/*
		 * Prime the post cache in one query so the checks below do not run one per post, the same way
		 * Post_Editability_Resolver does for the listing. Neither the meta nor the term cache is needed:
		 * only the post row itself is read.
		 */
		\_prime_post_caches( $post_ids, false, false );

		$posts = [];
		foreach ( $post_ids as $post_id ) {
			if ( ! $this->post_access_checker->exists( $post_id )
				|| ! $this->post_access_checker->is_supported_type( $post_id )
				|| ! $this->post_access_checker->can_edit( $post_id )
			) {
				continue;
			}

			$post = \get_post( $post_id );
			// The access check above already resolved the post, but do not rely on that holding across two
			// lookups: a post that is gone is omitted like any other inaccessible ID, never fataling the batch.
			if ( $post === null || ! $this->is_listed( $post ) ) {
				continue;
			}

			$posts[] = [
				'id'      => $post_id,
				// The stored content, unrendered: the client parses it with the analysis engine, exactly as the
				// post editor does, so blocks and shortcodes are handled there rather than by render filters here.
				'content' => (string) $post->post_content,
			];
		}

		return new WP_REST_Response( [ 'posts' => $posts ] );
	}

	/**
	 * Whether the post is on the bulk editor lists.
	 *
	 * The content served here has to stay in step with the table: a post that has no row cannot have a suggestion
	 * generated for it, so serving its content would only widen what this route exposes. Both collectors narrow on
	 * the same two properties — the bulk editor's post statuses, and password-protected posts being left out of
	 * bulk editing (the indexable collector filters those on `is_protected`, which is derived from `post_password`).
	 *
	 * @param WP_Post $post The post to check.
	 *
	 * @return bool Whether the post is on the bulk editor lists.
	 */
	private function is_listed( WP_Post $post ): bool {
		return \in_array( $post->post_status, Posts_Collector_Interface::STATUSES, true )
			&& $post->post_password === '';
	}

	/**
	 * Checks whether the current user is allowed to use the bulk editor.
	 *
	 * The per-post edit capability is enforced per requested ID in {@see get_posts_content()}.
	 *
	 * @return bool Whether the current user is allowed to use the bulk editor.
	 */
	public function check_permissions(): bool {
		return \current_user_can( 'wpseo_manage_options' );
	}
}
