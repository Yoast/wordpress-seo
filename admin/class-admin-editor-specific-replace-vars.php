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
		'page'                     => array( 'id', 'pt_single', 'pt_plural', 'parent_title' ),
		'post'                     => array( 'id', 'term404', 'pt_single', 'pt_plural' ),
		// Custom post type.
		'custom_post_type'         => array( 'id', 'term404', 'pt_single', 'pt_plural', 'parent_title' ),

		// Taxonomies.
		'category'                 => array( 'term_title', 'term_description', 'category_description', 'parent_title' ),
		'post_tag'                 => array( 'term_title', 'term_description', 'tag_description' ),
		'post_format'              => array(),
		// Custom taxonomy.
		'term-in-custom-taxomomy'  => array( 'term_title', 'term_description', 'category_description', 'parent_title' ),

		// Settings - archive pages.
		'custom-post-type_archive' => array(),
		// Settings - special pages.
		'search'                   => array( 'searchphrase' ),
	);

	/**
	 * WPSEO_Admin_Editor_Specific_Replace_Vars constructor.
	 */
	public function __construct() {
		$this->apply_custom_fields( WPSEO_Custom_Fields::get_custom_fields() );
		$this->apply_custom_taxonomies( WPSEO_Custom_Taxonomies::get_custom_taxonomies() );
	}

	/**
	 * Retrieves the shared replacement variable names.
	 *
	 * Which are the replacement variables without the editor specific ones.
	 *
	 * @param array $replacement_variables Possibly shared replacement variables.
	 *
	 * @return array The shared replacement variable names.
	 */
	public function get_shared( $replacement_variables ) {
		return array_diff(
			$this->extract_names( $this->get() ),
			$this->extract_names( $replacement_variables )
		);
	}

	/**
	 * Determines the page type of the current term.
	 *
	 * @param string $taxonomy The taxonomy name.
	 *
	 * @return string The page type.
	 */
	public function determine_for_term( $taxonomy ) {
		$editor_specific_replace_vars = $this->get();
		if ( array_key_exists( $taxonomy, $editor_specific_replace_vars ) ) {
			return $taxonomy;
		}

		return 'term-in-custom-taxomomy';
	}

	/**
	 * Determines the page type of the current post.
	 *
	 * @param WP_Post $post A WordPress post instance.
	 *
	 * @return string The page type.
	 */
	public function determine_for_post( $post ) {
		if ( $post instanceof WP_Post === false ) {
			return 'post';
		}

		$editor_specific_replace_vars = $this->get();
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
		if ( ! $this->has_for_page_type( $post_type ) ) {
			return $fallback;
		}

		return $post_type;
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
		$page_type = $name . '_archive';

		if ( ! $this->has_for_page_type( $page_type ) ) {
			return $fallback;
		}

		return $page_type;
	}

	/**
	 * Retrieves the editor specific replacement variables.
	 *
	 * @return array The editor specific replacement variables.
	 */
	public function get() {
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
	 * Applies the custom fields to the appropriate page types.
	 *
	 * @param array $custom_fields The custom fields to add.
	 *
	 * @return void
	 */
	protected function apply_custom_fields( $custom_fields ) {
		$page_types = array_fill_keys(
			array( 'page', 'post', 'custom_post_type' ),
			$custom_fields
		);

		$this->add_page_type_replacement_variables( $page_types );
	}

	/**
	 * Applies the custom taxonomies to the appropriate page types.
	 *
	 * @param array $custom_taxonomies The custom taxonomies to add.
	 *
	 * @return void
	 */
	protected function apply_custom_taxonomies( $custom_taxonomies ) {
		$page_types = array_fill_keys(
			array( 'post', 'term-in-custom-taxonomies' ),
			$custom_taxonomies
		);

		$this->add_page_type_replacement_variables( $page_types );
	}

	/**
	 * Adds the replavement variables for the given page types.
	 *
	 * @param array $page_types Page types to add.
	 *
	 * @return void
	 */
	protected function add_page_type_replacement_variables( $page_types ) {
		$this->editor_specific_replace_vars = array_merge( $this->editor_specific_replace_vars, $page_types );
	}

	/**
	 * Extracts the names from the given replacements variables.
	 *
	 * @param array $replacement_variables Replacement variables to extract the name from.
	 *
	 * @return array Extracted names.
	 */
	protected function extract_names( $replacement_variables ) {
		$extracted_names = array();

		foreach ( $replacement_variables as $replacement_variable ) {
			if ( empty( $replacement_variable['name'] ) ) {
				continue;
			}

			$extracted_names[] = $replacement_variable['name'];
		}

		return $extracted_names;
	}

	/**
	 * Returns whether the given page type has editor specific replace vars.
	 *
	 * @param string $page_type The page type to check.
	 *
	 * @return bool True if there are associated editor specific replace vars.
	 */
	private function has_for_page_type( $page_type ) {
		$editor_specific_replace_vars = $this->get();

		if ( ! isset( $editor_specific_replace_vars[ $page_type ] ) ) {
			return false;
		}

		if ( ! is_array( $editor_specific_replace_vars[ $page_type ] ) ) {
			return false;
		}

		return true;
	}
}
