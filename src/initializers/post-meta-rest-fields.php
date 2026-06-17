<?php

namespace Yoast\WP\SEO\Initializers;

use WP_Post;
use WP_REST_Response;
use WPSEO_Meta;
use Yoast\WP\SEO\Conditionals\No_Conditionals;
use Yoast\WP\SEO\Helpers\Taxonomy_Helper;

/**
 * Registers Yoast post meta fields with the REST API per post type.
 *
 * WPSEO_Meta::init() registers meta globally (no object_subtype) at plugins_loaded,
 * before custom post types are available. A global registration without object_subtype
 * causes WordPress to omit fields with empty values from CPT REST responses, so the
 * block editor never sees them in save payloads.
 *
 * Hooked to wp_loaded so all CPTs and taxonomies registered at any init priority are
 * present before registration runs.
 */
class Post_Meta_Rest_Fields implements Initializer_Interface {

	use No_Conditionals;

	/**
	 * The taxonomy helper.
	 *
	 * @var Taxonomy_Helper
	 */
	private $taxonomy_helper;

	/**
	 * Constructor.
	 *
	 * @param Taxonomy_Helper $taxonomy_helper The taxonomy helper.
	 */
	public function __construct( Taxonomy_Helper $taxonomy_helper ) {
		$this->taxonomy_helper = $taxonomy_helper;
	}

	/**
	 * Initializes the post meta REST field registrations.
	 *
	 * @return void
	 */
	public function initialize() {
		\add_action( 'wp_loaded', [ $this, 'register_post_meta' ] );
	}

	/**
	 * Registers all Yoast meta fields per REST-enabled post type and adds the
	 * unauthorized-read filter for each.
	 *
	 * Also populates WPSEO_Meta::$fields_index and WPSEO_Meta::$defaults, which were
	 * previously built inside the registration loop in WPSEO_Meta::init().
	 *
	 * @return void
	 */
	public function register_post_meta() {
		foreach ( WPSEO_Meta::$meta_fields as $subset => $field_group ) {
			foreach ( $field_group as $key => $field_def ) {
				$full_key = WPSEO_Meta::$meta_prefix . $key;

				WPSEO_Meta::$fields_index[ $full_key ] = [
					'subset' => $subset,
					'key'    => $key,
				];
				WPSEO_Meta::$defaults[ $full_key ]     = ( $field_def['default_value'] ?? '' );
			}
		}

		foreach ( \get_post_types( [ 'show_in_rest' => true ], 'names' ) as $post_type ) {
			foreach ( WPSEO_Meta::$meta_fields as $field_group ) {
				foreach ( $field_group as $key => $field_def ) {
					$this->register_meta( $post_type, $key, $field_def );
				}
			}

			$this->register_primary_term_meta( $post_type );

			if ( ! \post_type_supports( $post_type, 'custom-fields' ) ) {
				\add_post_type_support( $post_type, 'custom-fields' );
			}

			\add_filter( 'rest_prepare_' . $post_type, [ $this, 'hide_meta_from_unauthorized_rest_response' ], 10, 2 );
		}
	}

	/**
	 * Registers primary term meta for all non-excluded hierarchical taxonomies on a post type.
	 *
	 * @param string $post_type The post type slug.
	 *
	 * @return void
	 */
	private function register_primary_term_meta( string $post_type ) {
		foreach ( \get_object_taxonomies( $post_type, 'objects' ) as $taxonomy ) {
			if ( ! $taxonomy->hierarchical || $this->taxonomy_helper->is_excluded( $taxonomy->name ) ) {
				continue;
			}

			$primary_key = 'primary_' . $taxonomy->name;
			$full_key    = WPSEO_Meta::$meta_prefix . $primary_key;

			if ( ! isset( WPSEO_Meta::$fields_index[ $full_key ] ) ) {
				WPSEO_Meta::$meta_fields['primary_term'][ $primary_key ] = [ 'type' => 'hidden' ];
				WPSEO_Meta::$fields_index[ $full_key ]                   = [
					'subset' => 'primary_term',
					'key'    => $primary_key,
				];
				WPSEO_Meta::$defaults[ $full_key ]                       = '-1';
			}

			$this->register_meta(
				$post_type,
				$primary_key,
				[
					'type'          => 'hidden',
					'default_value' => '-1',
				],
			);
		}
	}

	/**
	 * Registers a single Yoast meta field for a specific post type.
	 *
	 * Fields with `type: null` are internal/serialized fields not suitable for REST API
	 * access and will be registered with `show_in_rest: false`.
	 *
	 * @param string                             $post_type The post type slug.
	 * @param string                             $key       The internal key of the meta field (without prefix).
	 * @param array<string,array<string,string>> $field_def The field definition array.
	 *
	 * @return void
	 */
	private function register_meta( string $post_type, string $key, array $field_def = [] ) {
		$show_in_rest = ! \array_key_exists( 'type', $field_def ) || $field_def['type'] !== null;

		$args = [
			'show_in_rest'      => $show_in_rest,
			'single'            => true,
			'type'              => 'string',
			'sanitize_callback' => [ WPSEO_Meta::class, 'sanitize_post_meta' ],
			'auth_callback'     => static function ( $allowed, $meta_key, $object_id ) {
				return \current_user_can( 'edit_post', $object_id );
			},
		];

		if ( isset( $field_def['default_value'] ) ) {
			$args['default'] = $field_def['default_value'];
		}

		\register_post_meta( $post_type, WPSEO_Meta::$meta_prefix . $key, $args );
	}

	/**
	 * Strips REST-exposed Yoast meta fields from the response for users without edit_post capability.
	 *
	 * The register_meta's auth_callback only covers writes; read access must be restricted separately.
	 *
	 * @param WP_REST_Response $response The REST response.
	 * @param WP_Post          $post     The post object.
	 *
	 * @return WP_REST_Response The (possibly modified) response.
	 */
	public function hide_meta_from_unauthorized_rest_response( $response, $post ) {
		if ( \current_user_can( 'edit_post', $post->ID ) ) {
			return $response;
		}
		$data = $response->get_data();
		foreach ( WPSEO_Meta::$meta_fields as $field_group ) {
			foreach ( $field_group as $key => $field_def ) {
				// Mirror the show_in_rest logic from register_meta(): only expose fields whose type is not null.
				if ( ! \array_key_exists( 'type', $field_def ) || $field_def['type'] !== null ) {
					unset( $data['meta'][ WPSEO_Meta::$meta_prefix . $key ] );
				}
			}
		}
		$response->set_data( $data );
		return $response;
	}
}
