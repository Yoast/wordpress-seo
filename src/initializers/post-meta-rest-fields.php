<?php

namespace Yoast\WP\SEO\Initializers;

use WP_Post;
use WP_REST_Response;
use WPSEO_Meta;
use Yoast\WP\SEO\Conditionals\No_Conditionals;
use Yoast\WP\SEO\Helpers\Capability_Helper;
use Yoast\WP\SEO\Helpers\Options_Helper;
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
	 * The options helper.
	 *
	 * @var Options_Helper
	 */
	private $options_helper;

	/**
	 * The capability helper.
	 *
	 * @var Capability_Helper
	 */
	private $capability_helper;

	/**
	 * Constructor.
	 *
	 * @param Taxonomy_Helper   $taxonomy_helper   The taxonomy helper.
	 * @param Options_Helper    $options_helper    The options helper.
	 * @param Capability_Helper $capability_helper The capability helper.
	 */
	public function __construct( Taxonomy_Helper $taxonomy_helper, Options_Helper $options_helper, Capability_Helper $capability_helper ) {
		$this->taxonomy_helper   = $taxonomy_helper;
		$this->options_helper    = $options_helper;
		$this->capability_helper = $capability_helper;
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

		$metabox_disabled_in_block_editor = \apply_filters( 'wpseo_disable_metabox_in_block_editor', false );

		foreach ( \get_post_types( [ 'show_in_rest' => true ], 'names' ) as $post_type ) {
			foreach ( WPSEO_Meta::$meta_fields as $subset => $field_group ) {
				$requires_advanced_cap = \in_array( $subset, [ 'advanced', 'schema' ], true );
				foreach ( $field_group as $key => $field_def ) {
					$this->register_meta( $post_type, $key, $field_def, $requires_advanced_cap );
				}
			}

			$this->register_primary_term_meta( $post_type );

			// Without custom-fields support, WordPress omits registered meta from the REST schema for CPTs
			// (WP_REST_Posts_Controller::get_item_schema), so the block editor cannot read or write Yoast
			// fields via REST. Only needed when our metabox is disabled in the block editor; otherwise the
			// sidebar handles saving and classic-editor post types are unaffected.
			if (
				$metabox_disabled_in_block_editor
				&& \use_block_editor_for_post_type( $post_type )
				&& ! \post_type_supports( $post_type, 'custom-fields' )
			) {
				\add_post_type_support( $post_type, 'custom-fields' );
			}

			// Add a filter to strip REST-exposed Yoast meta fields from the response for users without edit_post capability.
			\add_filter( 'rest_prepare_' . $post_type, [ $this, 'hide_meta_from_unauthorized_rest_response' ], 10, 2 );

			// Add a filter to trigger wpseo_saved_postdata after a post is updated via REST API, same as in WPSEO_Metabox::save_postdata.
			// The $creating guard ensures it only fires on updates (not on new post creation via REST), matching the
			// classic-editor save_postdata path which is only reachable when a post already exists with an ID in $_POST.
			if ( $metabox_disabled_in_block_editor ) {
				\add_action(
					'rest_after_insert_' . $post_type,
					static function ( $post, $request, $creating ) {
						if ( ! $creating ) {
							\do_action( 'wpseo_saved_postdata' );
						}
					},
					10,
					3,
				);
			}
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
	 * @param string                             $post_type             The post type slug.
	 * @param string                             $key                   The internal key of the meta field (without prefix).
	 * @param array<string,array<string,string>> $field_def             The field definition array.
	 * @param bool                               $requires_advanced_cap Whether the field is in the advanced or schema subset
	 *                                                                  and therefore also requires wpseo_edit_advanced_metadata.
	 *
	 * @return void
	 */
	private function register_meta( string $post_type, string $key, array $field_def = [], bool $requires_advanced_cap = false ) {
		$show_in_rest = ! \array_key_exists( 'type', $field_def ) || $field_def['type'] !== null;

		$args = [
			'show_in_rest'      => $show_in_rest,
			'single'            => true,
			'type'              => 'string',
			'sanitize_callback' => [ WPSEO_Meta::class, 'sanitize_post_meta' ],
		];

		if ( $requires_advanced_cap ) {
			$args['auth_callback'] = [ $this, 'auth_callback_for_advanced_meta' ];
		}
		else {
			$args['auth_callback'] = static function ( $allowed, $meta_key, $object_id ) {
				return \current_user_can( 'edit_post', $object_id );
			};
		}

		\register_post_meta( $post_type, WPSEO_Meta::$meta_prefix . $key, $args );
	}

	/**
	 * Auth callback for advanced and schema meta fields.
	 *
	 * Mirrors the gate in WPSEO_Meta::get_tab_field_defs(): when disableadvanced_meta is on,
	 * only users with wpseo_edit_advanced_metadata (or wpseo_manage_options) may write these fields.
	 *
	 * @param bool   $allowed   Whether the user is allowed (unused; re-evaluated from scratch).
	 * @param string $meta_key  The meta key being written.
	 * @param int    $object_id The post ID.
	 *
	 * @return bool
	 */
	public function auth_callback_for_advanced_meta( $allowed, $meta_key, $object_id ) {
		if ( ! \current_user_can( 'edit_post', $object_id ) ) {
			return false;
		}
		return ! $this->options_helper->get( 'disableadvanced_meta' )
			|| $this->capability_helper->current_user_can( 'wpseo_edit_advanced_metadata' );
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
