<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin
 */

/**
 * Determines the editor specific replacement variables.
 */
class WPSEO_Admin_Editor_Specific_Replace_Vars {

	/**
	 * @var array The editor specific replacement variables.
	 */
	protected $editor_specific_replace_vars = array(
		// Posts types.
		'page'                    => array( 'id', 'pt_single', 'pt_plural' ),
		'post'                    => array( 'id', 'term404', 'pt_single', 'pt_plural' ),
		// Custom post type.
		'custom_post_type'        => array( 'id', 'term404', 'pt_single', 'pt_plural' ),

		// Taxonomies.
		'category'                => array( 'term_title', 'term_description', 'category_description' ),
		'post_tag'                => array( 'term_title', 'term_description', 'tag_description' ),
		// Custom taxonomy.
		'term-in-custom-taxomomy' => array( 'term_title', 'term_description' ),

		// Settings - archive pages.
		'custom-post-type_archive' => array(),
		// Settings - special pages.
		'search'                  => array( 'searchphrase' ),
	);

	/**
	 * WPSEO_Admin_Editor_Specific_Replace_Vars constructor.
	 */
	public function __construct() {
		$this->apply_custom_fields();
		$this->apply_custom_taxonomies();
	}

	/**
	 * Retrieves the shared replacement variable names.
	 *
	 * Which are the replacement variables without the editor specific ones.
	 *
	 * @param array $replace_vars_list                 The replace vars list.
	 * @param array $editor_specific_replace_vars_list The editor specific replace var names.
	 *
	 * @return array The shared replacement variable names.
	 */
	public static function get_shared_replace_vars( $replace_vars_list, $editor_specific_replace_vars_list ) {
		$filter_values       = self::array_flatten( $editor_specific_replace_vars_list );
		$shared_replace_vars = array();

		foreach ( $replace_vars_list as $replace_var ) {
			$name = $replace_var['name'];
			if ( ! in_array( $name, $filter_values ) ) {
				$shared_replace_vars[] = $name;
			}
		}

		return $shared_replace_vars;
	}

	/**
	 * Determines the page type of the current term.
	 *
	 * @param string $taxonomy The taxonomy name.
	 *
	 * @return string The page type.
	 */
	public function determine_for_term( $taxonomy ) {
		$editor_specific_replace_vars = $this->get_editor_specific_replace_vars();
		if ( array_key_exists( $taxonomy, $editor_specific_replace_vars ) ) {
			return $taxonomy;
		}

		return 'term-in-custom-taxomomy';
	}

	/**
	 * Determines the page type of the current post.
	 *
	 * @param WP_Post $post The WordPress global post object.
	 *
	 * @return string The page type.
	 */
	public function determine_for_post( $post ) {
		if ( $post instanceof WP_Post === false ) {
			return 'post';
		}

		$editor_specific_replace_vars = $this->get_editor_specific_replace_vars();
		if ( array_key_exists( $post->post_type, $editor_specific_replace_vars ) ) {
			return $post->post_type;
		}

		return 'custom_post_type';
	}

	/**
	 * Determines the page type for a post type.
	 *
	 * @param string $post_type The name of the post_type.
	 * @param string $fallback  The page type to fall back to.
	 *
	 * @return string The page type.
	 */
	public function determine_for_post_type( $post_type, $fallback = 'custom_post_type' ) {
		$page_type                        = $post_type;
		$editor_specific_replace_vars     = $this->get_editor_specific_replace_vars();
		$has_editor_specific_replace_vars = $this->has_editor_specific_replace_vars( $editor_specific_replace_vars, $page_type );

		if ( ! $has_editor_specific_replace_vars ) {
			return $fallback;
		}

		return $page_type;
	}

	/**
	 * Determines the page type for an archive page.
	 *
	 * @param string $name     The name of the archive.
	 * @param string $fallback The page type to fall back to.
	 *
	 * @return string The page type.
	 */
	public function determine_for_archive( $name, $fallback = 'custom-post-type_archive' ) {
		$page_type                        = $name . '_archive';
		$editor_specific_replace_vars     = $this->get_editor_specific_replace_vars();
		$has_editor_specific_replace_vars = $this->has_editor_specific_replace_vars( $editor_specific_replace_vars, $page_type );

		if ( ! $has_editor_specific_replace_vars ) {
			return $fallback;
		}

		return $page_type;
	}

	/**
	 * Retrieves the editor specific replacement variables for the given page type.
	 *
	 * @param string $page_type The page type.
	 *
	 * @return array The editor specific replacement variables.
	 */
	public function get_editor_specific_replace_vars_for( $page_type ) {
		$editor_specific_replace_vars     = $this->get_editor_specific_replace_vars();
		$has_editor_specific_replace_vars = $this->has_editor_specific_replace_vars( $editor_specific_replace_vars, $page_type );

		if ( ! $has_editor_specific_replace_vars ) {
			return array();
		}

		return $editor_specific_replace_vars[ $page_type ];
	}

	/**
	 * Retrieves the editor specific replacement variables.
	 *
	 * @return array The editor specific replacement variables.
	 */
	public function get_editor_specific_replace_vars() {
		/**
		 * Filter: Adds the possibility to add extra editor specific replacement variables.
		 *
		 * @api array $editor_specific_replace_vars Empty array to add the editor specific replace vars to.
		 */
		$editor_specific_replace_vars = apply_filters(
			'wpseo_editor_specific_replace_vars',
			$this->editor_specific_replace_vars
		);

		if ( ! is_array( $editor_specific_replace_vars ) ) {
			return $this->editor_specific_replace_vars;
		}

		return $editor_specific_replace_vars;
	}

	/**
	 * Flattens an array.
	 *
	 * @param array $array The array to flatten.
	 *
	 * @return array The flattened array.
	 */
	private static function array_flatten( $array ) {
		$flattened = array();

		foreach ( $array as $key => $value ) {
			if ( is_array( $value ) ) {
				$flattened = array_merge( $flattened, self::array_flatten( $value ) );
				continue;
			}
			$flattened[ $key ] = $value;
		}

		return $flattened;
	}

	/**
	 * Returns whether the given page type has editor specific replace vars.
	 *
	 * @param array  $editor_specific_replace_vars The editor specific replace
	 *                                             vars to check in.
	 * @param string $page_type                    The page type to check.
	 *
	 * @return bool True if there are associated editor specific replace vars.
	 */
	private function has_editor_specific_replace_vars( $editor_specific_replace_vars, $page_type ) {
		if ( ! isset( $editor_specific_replace_vars[ $page_type ] ) ) {
			return false;
		}

		if ( ! is_array( $editor_specific_replace_vars[ $page_type ] ) ) {
			return false;
		}

		return true;
	}

	/**
	 * Applies the custom fields to the appropriate page types.
	 *
	 * @return void
	 */
	protected function apply_custom_fields() {
		$custom_fields = WPSEO_Custom_Fields::get_custom_fields();
		$page_types    = array( 'page', 'post', 'custom_post_type' );
		foreach ( $page_types as $page_type ) {
			$this->editor_specific_replace_vars[ $page_type ] = array_merge(
				$this->editor_specific_replace_vars[ $page_type ],
				$custom_fields
			);
		}
	}

	/**
	 * Applies the custom taxonomies to the appropriate page types.
	 *
	 * @return void
	 */
	protected function apply_custom_taxonomies() {
		$custom_taxonomies = WPSEO_Custom_Taxonomies::get_custom_taxonomies();
		$page_types        = array( 'post', 'term-in-custom-taxomomy' );
		foreach ( $page_types as $page_type ) {
			$this->editor_specific_replace_vars[ $page_type ] = array_merge(
				$this->editor_specific_replace_vars[ $page_type ],
				$custom_taxonomies
			);
		}
	}
}
