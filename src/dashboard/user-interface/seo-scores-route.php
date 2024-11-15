<?php

namespace Yoast\WP\SEO\Dashboard\User_Interface;

use WP_REST_Request;
use WP_REST_Response;
use wpdb;
use WPSEO_Capability_Utils;
use Yoast\WP\Lib\Model;
use Yoast\WP\SEO\Conditionals\No_Conditionals;
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
	 * @param Indexable_Repository    $indexable_repository    The indexable repository.
	 * @param wpdb                    $wpdb                    The WordPress database object.
	 */
	public function __construct(
		Content_Types_Collector $content_types_collector,
		Indexable_Repository $indexable_repository,
		wpdb $wpdb
	) {
		$this->content_types_collector = $content_types_collector;
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
	 * Sets the value of the wistia embed permission.
	 *
	 * @param WP_REST_Request $request The request object.
	 *
	 * @return WP_REST_Response|WP_Error The success or failure response.
	 */
	public function get_seo_scores( WP_REST_Request $request ) {
		$content_type = $request['contentType'];

		$selects = [
			'needs_improvement' => 'COUNT(CASE WHEN primary_focus_keyword_score < 41 THEN 1 END)',
			'ok'                => 'COUNT(CASE WHEN primary_focus_keyword_score >= 41 AND primary_focus_keyword_score < 70 THEN 1 END)',
			'good'              => 'COUNT(CASE WHEN primary_focus_keyword_score >= 71 THEN 1 END)',
			'not_analyzed'      => 'COUNT(CASE WHEN primary_focus_keyword_score IS NULL THEN 1 END)',
		];

		if ( $request['term'] === 0 || $request['taxonomy'] === '' ) {
			// Without taxonomy filtering.
			$counts = $this->indexable_repository->query()
				->select_many_expr( $selects )
				->where_raw( '( post_status = \'publish\' OR post_status IS NULL )' )
				->where_in( 'object_type', [ 'post' ] )
				->where_in( 'object_sub_type', [ $content_type ] )
				->find_one();

			// This results in:
			// SELECT
			//	COUNT(CASE WHEN primary_focus_keyword_score < 41 THEN 1 END) AS `needs_improvement`,
			//	COUNT(CASE WHEN primary_focus_keyword_score >= 41 AND primary_focus_keyword_score < 70 THEN 1 END) AS `ok`,
			//	COUNT(CASE WHEN primary_focus_keyword_score >= 71 THEN 1 END) AS `good`,
			//	COUNT(CASE WHEN primary_focus_keyword_score IS NULL THEN 1 END) AS `not_analyzed`
			// FROM `wp_yoast_indexable`
			// WHERE ( post_status = 'publish' OR post_status IS NULL )
			//	AND `object_type` IN ('post')
			//	AND `object_sub_type` IN ('post')
			// LIMIT 1

		}
		else {
			// With taxonomy filtering.
			$query = $this->wpdb->prepare(
				"
				SELECT
					COUNT(CASE WHEN I.primary_focus_keyword_score < 41 THEN 1 END) AS `needs_improvement`,
					COUNT(CASE WHEN I.primary_focus_keyword_score >= 41 AND I.primary_focus_keyword_score < 70 THEN 1 END) AS `ok`,
					COUNT(CASE WHEN I.primary_focus_keyword_score >= 70 THEN 1 END) AS `good`,
					COUNT(CASE WHEN I.primary_focus_keyword_score IS NULL THEN 1 END) AS `not_analyzed` 
				FROM %i AS I
				WHERE ( I.post_status = 'publish' OR I.post_status IS NULL )
					AND I.object_type IN ('post')
					AND I.object_sub_type IN (%s)
					AND I.object_id IN (
						SELECT object_id
						FROM %i
						WHERE term_taxonomy_id IN (
							SELECT term_taxonomy_id
							FROM 
								%i
							WHERE 
								term_id = %d
								AND taxonomy = %s
						)
				)",
				Model::get_table_name( 'Indexable' ),
				$content_type,
				$this->wpdb->term_relationships,
				$this->wpdb->term_taxonomy,
				$request['term'],
				$request['taxonomy']
			);

			$counts = $this->wpdb->get_row( $query );
		}

		return new WP_REST_Response(
			[
				'json' => (object) [
					'good'              => $counts->good,
					'ok'                => $counts->ok,
					'needs_improvement' => $counts->needs_improvement,
					'not_analyzed'      => $counts->not_analyzed,
				],
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
