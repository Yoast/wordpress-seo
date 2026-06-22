<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Bulk_Editor\User_Interface;

use WP_Error;
use WP_REST_Request;
use WP_REST_Response;
use Yoast\WP\SEO\Bulk_Editor\Application\Content_Types\Content_Types_Repository;
use Yoast\WP\SEO\Bulk_Editor\Application\Posts\Posts_Collector_Interface;
use Yoast\WP\SEO\Bulk_Editor\Application\Posts\Posts_Repository;
use Yoast\WP\SEO\Bulk_Editor\Domain\Posts\Posts_Query;
use Yoast\WP\SEO\Conditionals\No_Conditionals;
use Yoast\WP\SEO\Main;
use Yoast\WP\SEO\Routes\Route_Interface;

/**
 * Registers a route that returns a page of posts with their SEO and social meta.
 */
class Posts_Route implements Route_Interface {

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
	public const ROUTE_PREFIX = '/bulk_editor/posts';

	/**
	 * The default number of posts to return.
	 *
	 * @var int
	 */
	public const DEFAULT_PER_PAGE = 20;

	/**
	 * The maximum number of posts that can be requested in one page.
	 *
	 * @var int
	 */
	public const MAX_PER_PAGE = 100;

	/**
	 * The posts repository.
	 *
	 * @var Posts_Repository
	 */
	private $posts_repository;

	/**
	 * The content types repository.
	 *
	 * @var Content_Types_Repository
	 */
	private $content_types_repository;

	/**
	 * The constructor.
	 *
	 * @param Posts_Repository         $posts_repository         The posts repository.
	 * @param Content_Types_Repository $content_types_repository The content types repository.
	 */
	public function __construct(
		Posts_Repository $posts_repository,
		Content_Types_Repository $content_types_repository
	) {
		$this->posts_repository         = $posts_repository;
		$this->content_types_repository = $content_types_repository;
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
					'content_type' => [
						'required'          => true,
						'type'              => 'string',
						'description'       => 'The content type to fetch posts for.',
						'sanitize_callback' => 'sanitize_text_field',
					],
					'per_page'     => [
						'required'          => false,
						'type'              => 'integer',
						'default'           => self::DEFAULT_PER_PAGE,
						'minimum'           => 1,
						'maximum'           => self::MAX_PER_PAGE,
						'description'       => 'The number of posts to fetch.',
						'sanitize_callback' => 'absint',
					],
					'page'         => [
						'required'          => false,
						'type'              => 'integer',
						'default'           => 1,
						'minimum'           => 1,
						'description'       => 'The page of posts to fetch.',
						'sanitize_callback' => 'absint',
					],
					'search'       => [
						'required'          => false,
						'type'              => 'string',
						'default'           => '',
						'description'       => 'The term to search posts by.',
						'sanitize_callback' => 'sanitize_text_field',
					],
					'status'       => [
						'required'    => false,
						'type'        => 'array',
						'default'     => Posts_Collector_Interface::STATUSES,
						'items'       => [
							'type' => 'string',
							'enum' => Posts_Collector_Interface::STATUSES,
						],
						'description' => 'The post statuses to include.',
					],
				],
				'callback'            => [ $this, 'get_posts' ],
				'permission_callback' => [ $this, 'check_permissions' ],
			],
		);
	}

	/**
	 * Returns a page of posts for the requested content type.
	 *
	 * @param WP_REST_Request $request The request object.
	 *
	 * @return WP_REST_Response|WP_Error The posts, or an error when the content type is not editable.
	 */
	public function get_posts( WP_REST_Request $request ) {
		$content_type = $request->get_param( 'content_type' );

		if ( ! $this->is_valid_content_type( $content_type ) ) {
			return new WP_Error(
				'rest_invalid_content_type',
				'The requested content type is not editable.',
				[ 'status' => 400 ],
			);
		}

		// An empty selection (no status filter) means all statuses, never zero results.
		$statuses = (array) $request->get_param( 'status' );
		if ( empty( $statuses ) ) {
			$statuses = Posts_Collector_Interface::STATUSES;
		}

		$query = new Posts_Query(
			$content_type,
			(int) $request->get_param( 'page' ),
			(int) $request->get_param( 'per_page' ),
			(string) $request->get_param( 'search' ),
			$statuses,
		);

		return new WP_REST_Response( $this->posts_repository->get_posts( $query )->to_array() );
	}

	/**
	 * Checks whether the current user is allowed to use the bulk editor.
	 *
	 * @return bool Whether the current user is allowed to use the bulk editor.
	 */
	public function check_permissions(): bool {
		return \current_user_can( 'wpseo_manage_options' );
	}

	/**
	 * Checks whether the given content type is one the bulk editor can edit.
	 *
	 * @param string $content_type The content type to check.
	 *
	 * @return bool Whether the content type is editable.
	 */
	private function is_valid_content_type( string $content_type ): bool {
		foreach ( $this->content_types_repository->get_content_types() as $editable ) {
			if ( $editable['name'] === $content_type ) {
				return true;
			}
		}

		return false;
	}
}
