<?php

namespace Yoast\WP\SEO\Dashboard\User_Interface;

use WP_REST_Request;
use WP_REST_Response;
use wpdb;
use WPSEO_Capability_Utils;
use Yoast\WP\SEO\Conditionals\No_Conditionals;
use Yoast\WP\SEO\Dashboard\Application\SEO_Scores\SEO_Scores_Repository;
use Yoast\WP\SEO\Dashboard\Infrastructure\Content_Types\Content_Types_Collector;
use Yoast\WP\SEO\Main;
use Yoast\WP\SEO\Repositories\Indexable_Repository;
use Yoast\WP\SEO\Routes\Route_Interface;

/**
 * Registers a route to get SEO scores.
 */
class SEO_Scores_Route implements Route_Interface {

	use No_Conditionals;

	/**
	 * Represents the prefix.
	 *
	 * @var string
	 */
	public const ROUTE_PREFIX = '/seo_scores';

	/**
	 * The content type collector.
	 *
	 * @var Content_Types_Collector
	 */
	private $content_types_collector;

	/**
	 * The SEO Scores repository.
	 *
	 * @var SEO_Scores_Repository
	 */
	private $seo_scores_repository;

	/**
	 * The indexable repository.
	 *
	 * @var Indexable_Repository
	 */
	private $indexable_repository;

	/**
	 * The WordPress database instance.
	 *
	 * @var wpdb
	 */
	protected $wpdb;

	/**
	 * Constructs the class.
	 *
	 * @param Content_Types_Collector $content_types_collector The content type collector.
	 * @param SEO_Scores_Repository   $seo_scores_repository   The SEO Scores repository.
	 * @param Indexable_Repository    $indexable_repository    The indexable repository.
	 * @param wpdb                    $wpdb                    The WordPress database object.
	 */
	public function __construct(
		Content_Types_Collector $content_types_collector,
		SEO_Scores_Repository $seo_scores_repository,
		Indexable_Repository $indexable_repository,
		wpdb $wpdb
	) {
		$this->content_types_collector = $content_types_collector;
		$this->seo_scores_repository   = $seo_scores_repository;
		$this->indexable_repository    = $indexable_repository;
		$this->wpdb                    = $wpdb;
	}

	/**
	 * Registers routes with WordPress.
	 *
	 * @return void
	 */
	public function register_routes() {
		\register_rest_route(
			Main::API_V1_NAMESPACE,
			self::ROUTE_PREFIX,
			[
				[
					'methods'             => 'GET',
					'callback'            => [ $this, 'get_seo_scores' ],
					'permission_callback' => [ $this, 'permission_manage_options' ],
					'args'                => [
						'contentType' => [
							'required'          => true,
							'type'              => 'string',
							'sanitize_callback' => 'sanitize_text_field',
							'validate_callback' => [ $this, 'validate_content_type' ],
						],
						'term' => [
							'required'          => false,
							'type'              => 'integer',
							'default'           => 0,
							'sanitize_callback' => static function ( $param ) {
								return \intval( $param );
							},
							'validate_callback' => [ $this, 'validate_term' ],
						],
						'taxonomy' => [
							'required'          => false,
							'type'              => 'string',
							'default'           => '',
							'sanitize_callback' => 'sanitize_text_field',
							'validate_callback' => [ $this, 'validate_taxonomy' ],
						],
					],
				],
			]
		);
	}

	/**
	 * Gets the SEO scores of a specific content type.
	 *
	 * @param WP_REST_Request $request The request object.
	 *
	 * @return WP_REST_Response|WP_Error The success or failure response.
	 */
	public function get_seo_scores( WP_REST_Request $request ) {
		$result = $this->seo_scores_repository->get_seo_scores( $request['contentType'], $request['taxonomy'], $request['term'] );

		return new WP_REST_Response(
			[
				'scores' => $result,
			],
			200
		);
	}

	/**
	 * Validates the content type against the content types collector.
	 *
	 * @param string $content_type The content type.
	 *
	 * @return bool Whether the content type passed validation.
	 */
	public function validate_content_type( $content_type ) {
		// @TODO: Is it necessary to go through all the indexable content types again and validate against those? If so, it can look like this.
		$content_types = $this->content_types_collector->get_content_types();

		if ( isset( $content_types[ $content_type ] ) ) {
			return true;
		}

		return false;
	}

	/**
	 * Validates the taxonomy against the given content type.
	 *
	 * @param string          $taxonomy The taxonomy.
	 * @param WP_REST_Request $request  The request object.
	 *
	 * @return bool Whether the taxonomy passed validation.
	 */
	public function validate_taxonomy( $taxonomy, $request ) {
		// @TODO: Is it necessary to validate against content types? If so, it can take inspiration from validate_content_type().
		return true;
	}

	/**
	 * Validates the term against the given content type.
	 *
	 * @param int             $term_id The term ID.
	 * @param WP_REST_Request $request The request object.
	 *
	 * @return bool Whether the term passed validation.
	 */
	public function validate_term( $term_id, $request ) {
		// @TODO: Is it necessary to validate against content types? If so, it can look like this.
		if ( $request['term'] === 0 ) {
			return true;
		}

		$term = \get_term( $term_id );
		if ( ! $term || \is_wp_error( $term ) ) {
			return false;
		}

		$post_type = $request['contentType'];

		// Check if the term's taxonomy is associated with the post type.
		return \in_array( $term->taxonomy, \get_object_taxonomies( $post_type ), true );
	}

	/**
	 * Permission callback.
	 *
	 * @return bool True when user has the 'wpseo_manage_options' capability.
	 */
	public function permission_manage_options() {
		return WPSEO_Capability_Utils::current_user_can( 'wpseo_manage_options' );
	}
}
