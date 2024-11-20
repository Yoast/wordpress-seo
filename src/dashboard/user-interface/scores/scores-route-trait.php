<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Dashboard\User_Interface\Scores;

use WP_REST_Request;
use WP_REST_Response;
use WPSEO_Capability_Utils;
use Yoast\WP\SEO\Dashboard\Application\Taxonomies\Taxonomies_Repository;
use Yoast\WP\SEO\Dashboard\Domain\Content_Types\Content_Type;
use Yoast\WP\SEO\Dashboard\Domain\Taxonomies\Taxonomy;
use Yoast\WP\SEO\Dashboard\Infrastructure\Content_Types\Content_Types_Collector;
use Yoast\WP\SEO\Main;
use Yoast\WP\SEO\Repositories\Indexable_Repository;

/**
 * Trait for routes of scores.
 */
trait Scores_Route_Trait {

	/**
	 * The content types collector.
	 *
	 * @var Content_Types_Collector
	 */
	protected $content_types_collector;

	/**
	 * The taxonomies repository.
	 *
	 * @var Taxonomies_Repository
	 */
	protected $taxonomies_repository;

	/**
	 * The indexable repository.
	 *
	 * @var Indexable_Repository
	 */
	protected $indexable_repository;

	/**
	 * Sets the collectors for the trait.
	 *
	 * @required
	 *
	 * @param Content_Types_Collector $content_types_collector The content type collector.
	 *
	 * @return void
	 */
	public function set_collectors(
		Content_Types_Collector $content_types_collector
	) {
		$this->content_types_collector = $content_types_collector;
	}

	/**
	 * Sets the collectors for the trait.
	 *
	 * @required
	 *
	 * @param Taxonomies_Repository $taxonomies_repository The taxonomies repository.
	 * @param Indexable_Repository  $indexable_repository  The indexable repository.
	 *
	 * @return void
	 */
	public function set_repositories(
		Taxonomies_Repository $taxonomies_repository,
		Indexable_Repository $indexable_repository
	) {
		$this->taxonomies_repository = $taxonomies_repository;
		$this->indexable_repository  = $indexable_repository;
	}

	/**
	 * Registers routes for scores.
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
					'callback'            => [ $this, 'get_scores' ],
					'permission_callback' => [ $this, 'permission_manage_options' ],
					'args'                => [
						'contentType' => [
							'required'          => true,
							'type'              => 'string',
							'sanitize_callback' => 'sanitize_text_field',
						],
						'term' => [
							'required'          => false,
							'type'              => 'integer',
							'default'           => null,
							'sanitize_callback' => static function ( $param ) {
								return \intval( $param );
							},
						],
						'taxonomy' => [
							'required'          => false,
							'type'              => 'string',
							'default'           => '',
							'sanitize_callback' => 'sanitize_text_field',
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
	 * @return WP_REST_Response The success or failure response.
	 */
	public function get_scores( WP_REST_Request $request ) {
		$content_type = $this->get_content_type( $request['contentType'] );
		if ( $content_type === null ) {
			return new WP_REST_Response(
				[
					'error' => 'Invalid content type.',
				],
				400
			);
		}

		$taxonomy = $this->get_taxonomy( $request['taxonomy'], $content_type );
		if ( $request['taxonomy'] !== '' && $taxonomy === null ) {
			return new WP_REST_Response(
				[
					'error' => 'Invalid taxonomy.',
				],
				400
			);
		}

		if ( ! $this->validate_term( $request['term'], $taxonomy ) ) {
			return new WP_REST_Response(
				[
					'error' => 'Invalid term.',
				],
				400
			);
		}

		return new WP_REST_Response(
			$this->calculate_scores( $content_type, $taxonomy, $request['term'] ),
			200
		);
	}

	/**
	 * Gets the content type object.
	 *
	 * @param string $content_type The content type.
	 *
	 * @return Content_Type|null The content type object.
	 */
	protected function get_content_type( string $content_type ): ?Content_Type {
		$content_types = $this->content_types_collector->get_content_types();

		if ( isset( $content_types[ $content_type ] ) && \is_a( $content_types[ $content_type ], Content_Type::class ) ) {
			return $content_types[ $content_type ];
		}

		return null;
	}

	/**
	 * Gets the taxonomy object.
	 *
	 * @param string       $taxonomy     The taxonomy.
	 * @param Content_Type $content_type The content type that the taxonomy is filtering.
	 *
	 * @return Taxonomy|null The taxonomy object.
	 */
	protected function get_taxonomy( string $taxonomy, Content_Type $content_type ): ?Taxonomy {
		if ( $taxonomy === '' ) {
			return null;
		}

		$valid_taxonomy = $this->taxonomies_repository->get_content_type_taxonomy( $content_type->get_name() );

		if ( $valid_taxonomy && $valid_taxonomy->get_name() === $taxonomy ) {
			return $valid_taxonomy;
		}

		return null;
	}

	/**
	 * Validates the term against the given taxonomy.
	 *
	 * @param int           $term_id  The ID of the term.
	 * @param Taxonomy|null $taxonomy The taxonomy.
	 *
	 * @return bool Whether the term passed validation.
	 */
	protected function validate_term( ?int $term_id, ?Taxonomy $taxonomy ): bool {
		if ( $term_id === null ) {
			return ( $taxonomy === null );
		}

		$term = \get_term( $term_id );
		if ( ! $term || \is_wp_error( $term ) ) {
			return false;
		}

		$taxonomy_name = ( $taxonomy === null ) ? '' : $taxonomy->get_name();
		return $term->taxonomy === $taxonomy_name;
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
