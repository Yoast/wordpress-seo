<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin
 */

use Yoast\WP\SEO\Helpers\Primary_Term_Helper;

/**
 * Adds the UI to change the primary term for a post.
 */
class WPSEO_Primary_Term_Admin implements WPSEO_WordPress_Integration {

	/**
	 * Primary term helper
	 *
	 * @var Primary_Term_Helper
	 */
	private $primary_term_helper;

	/**
	 * Registered primary taxonomies.
	 *
	 * @var array<string>
	 */
	private $registered_primary_taxonomies = [];

	/**
	 * Constructor.
	 *
	 * @param Primary_Term_Helper $primary_term_helper Primary term helper.
	 */
	public function __construct( Primary_Term_Helper $primary_term_helper ) {
		$this->primary_term_helper = $primary_term_helper;
	}

	/**
	 * Register hooks.
	 *
	 * @return void
	 */
	public function register_hooks() {
		add_action( 'admin_footer', [ $this, 'wp_footer' ], 10 );
		add_action( 'admin_enqueue_scripts', [ $this, 'enqueue_assets' ] );
		add_filter( 'wpseo_metabox_entries_general', [ $this, 'add_input_fields' ], 10, 2 );
		add_action( 'registered_taxonomy', [ $this, 'register_meta_for_registered_taxonomy' ], 10, 3 );
		add_action( 'rest_api_init', [ $this, 'register_meta_for_filtered_taxonomies' ] );
	}

	/**
	 * Register primary term meta for taxonomies that are added through the 'wpseo_primary_term_taxonomies' filter.
	 *
	 * @return void
	 */
	public function register_meta_for_filtered_taxonomies() {
		$taxonomies = $this->get_primary_term_taxonomies();
		foreach ( $taxonomies as $taxonomy ) {
			$this->register_primary_term_meta( $taxonomy->name );
		}
	}

	/**
	 * Register the primary term metadata.
	 *
	 * @param string $taxonomy    The taxonomy name.
	 * @param string $object_type The object type.
	 * @param array  $args        The taxonomy arguments.
	 *
	 * @return void
	 */
	public function register_meta_for_registered_taxonomy( $taxonomy, $object_type, $args ) {
		if ( ! $args['hierarchical'] ) {
			return;
		}
		$this->register_primary_term_meta( $taxonomy );
	}

	/**
	 * Sanitize the primary term.
	 *
	 * @param int|string    $clean      The clean value to sanitize.
	 * @param int|string    $meta_value The meta value.
	 * @param array<string> $field_def  The field definition.
	 * @param string        $meta_key   The meta key.
	 *
	 * @return string The sanitized value.
	 */
	public function sanitize_primary_term( $clean, $meta_value, $field_def, $meta_key ) {
		if ( strpos( $meta_key, WPSEO_Meta::$meta_prefix . 'primary_' ) === 0 ) {
			$int = WPSEO_Utils::validate_int( $meta_value );
			if ( $int !== false && $int > 0 ) {
				return strval( $int );
			}
		}
		return $clean;
	}

	/**
	 * Gets the current post ID.
	 *
	 * @return int The post ID.
	 */
	protected function get_current_id() {
		// phpcs:ignore WordPress.Security.NonceVerification.Recommended,WordPress.Security.ValidatedSanitizedInput.InputNotSanitized -- Reason: We are not processing form information, We are casting to an integer.
		$post_id = isset( $_GET['post'] ) && is_string( $_GET['post'] ) ? (int) wp_unslash( $_GET['post'] ) : 0;

		if ( $post_id === 0 && isset( $GLOBALS['post_ID'] ) ) {
			$post_id = (int) $GLOBALS['post_ID'];
		}

		return $post_id;
	}

	/**
	 * Adds hidden fields for primary taxonomies.
	 * Post type parameter is not used, but is provided by the filter.
	 *
	 * @param array<array<string>> $field_defs The fields defs for general group.
	 *
	 * @return array<array<string>> The new general group fields defs.
	 */
	public function add_input_fields( $field_defs ) {
		$taxonomies = $this->get_primary_term_taxonomies();
		foreach ( $taxonomies as $taxonomy ) {
			if ( in_array( $taxonomy->name, $this->registered_primary_taxonomies ) ) {
				$field_defs[ 'primary_' . $taxonomy->name ] = [
					'type'          => 'hidden',
					'default_value' => '',
				];
			}
		}

		return $field_defs;
	}

	/**
	 * Adds primary term templates.
	 *
	 * @return void
	 */
	public function wp_footer() {
		$taxonomies = $this->get_primary_term_taxonomies();

		if ( ! empty( $taxonomies ) ) {
			$this->include_js_templates();
		}
	}

	/**
	 * Enqueues all the assets needed for the primary term interface.
	 *
	 * @return void
	 */
	public function enqueue_assets() {
		global $pagenow;

		if ( ! WPSEO_Metabox::is_post_edit( $pagenow ) ) {
			return;
		}

		$taxonomies = $this->get_primary_term_taxonomies();

		// Only enqueue if there are taxonomies that need a primary term.
		if ( empty( $taxonomies ) ) {
			return;
		}

		$asset_manager = new WPSEO_Admin_Asset_Manager();
		$asset_manager->enqueue_style( 'primary-category' );

		$mapped_taxonomies = $this->get_mapped_taxonomies_for_js( $taxonomies );

		$data = [
			'taxonomies' => $mapped_taxonomies,
		];

		$asset_manager->localize_script( 'post-edit', 'wpseoPrimaryCategoryL10n', $data );
		$asset_manager->localize_script( 'post-edit-classic', 'wpseoPrimaryCategoryL10n', $data );
	}

	/**
	 * Gets the id of the primary term.
	 *
	 * @param string $taxonomy_name Taxonomy name for the term.
	 *
	 * @return int primary term id
	 */
	protected function get_primary_term( $taxonomy_name ) {
		$primary_term = new WPSEO_Primary_Term( $taxonomy_name, $this->get_current_id() );

		return $primary_term->get_primary_term();
	}

	/**
	 * Returns all the taxonomies for which the primary term selection is enabled.
	 *
	 * @param int|null $post_id Default current post ID.
	 * @return array<WP_Taxonomy> The primary term taxonomies.
	 */
	protected function get_primary_term_taxonomies( $post_id = null ) {
		if ( $post_id === null ) {
			$post_id = $this->get_current_id();
		}

		$taxonomies = wp_cache_get( 'primary_term_taxonomies_' . $post_id, 'wpseo' );
		if ( $taxonomies !== false ) {
			return $taxonomies;
		}

		$taxonomies = $this->primary_term_helper->get_primary_term_taxonomies( $post_id );

		wp_cache_set( 'primary_term_taxonomies_' . $post_id, $taxonomies, 'wpseo' );

		return $taxonomies;
	}

	/**
	 * Includes templates file.
	 *
	 * @return void
	 */
	protected function include_js_templates() {
		include_once WPSEO_PATH . 'admin/views/js-templates-primary-term.php';
	}

	/**
	 * Creates a map of taxonomies for localization.
	 *
	 * @param array<WP_Taxonomy> $taxonomies The taxonomies that should be mapped.
	 *
	 * @return array<string,array<string|int|array<int|string>>> The mapped taxonomies.
	 */
	protected function get_mapped_taxonomies_for_js( $taxonomies ) {
		return array_map( [ $this, 'map_taxonomies_for_js' ], $taxonomies );
	}

	/**
	 * Returns an array suitable for use in the javascript.
	 *
	 * @param stdClass $taxonomy The taxonomy to map.
	 *
	 * @return array<string|int|array<int|string>> The mapped taxonomy.
	 */
	private function map_taxonomies_for_js( $taxonomy ) {
		$primary_term = $this->get_primary_term( $taxonomy->name );

		if ( empty( $primary_term ) ) {
			$primary_term = '';
		}

		$terms = get_terms(
			[
				'taxonomy'               => $taxonomy->name,
				'update_term_meta_cache' => false,
				'fields'                 => 'id=>name',
			]
		);

		$mapped_terms_for_js = [];
		foreach ( $terms as $id => $name ) {
			$mapped_terms_for_js[] = [
				'id'   => $id,
				'name' => $name,
			];
		}

		return [
			'title'         => $taxonomy->labels->singular_name,
			'name'          => $taxonomy->name,
			'primary'       => $primary_term,
			'singularLabel' => $taxonomy->labels->singular_name,
			'fieldId'       => WPSEO_Meta::$form_prefix . 'primary_' . $taxonomy->name,
			'restBase'      => ( $taxonomy->rest_base ) ? $taxonomy->rest_base : $taxonomy->name,
			'terms'         => $mapped_terms_for_js,
		];
	}

		/**
		 * Register primary term meta.
		 *
		 * @param string $taxonomy The taxonomy name.
		 *
		 * @return void
		 */
	private function register_primary_term_meta( $taxonomy ) {
		if ( in_array( $taxonomy, $this->registered_primary_taxonomies ) ) {
			return;
		}
		WPSEO_Meta::register_meta( 'primary_' . $taxonomy, 'hidden', '' );
		add_filter( 'wpseo_sanitize_post_meta_primary_' . $taxonomy, [ $this, 'sanitize_primary_term' ], 10, 4 );
		$this->registered_primary_taxonomies[] = $taxonomy;
	}
}
