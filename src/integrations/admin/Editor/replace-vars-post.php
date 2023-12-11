<?php

namespace Yoast\WP\SEO\Integrations\Admin\Editor;

use WPSEO_Admin_Recommended_Replace_Vars;
use WPSEO_Replace_Vars;

/**
 * This integration registers a run of the cleanup routine whenever the plugin is activated.
 */
class Replace_Vars_Post {

	/**
	 * Get post replace vars.
	 */
	public function get_post_replace_vars( $post ) {
		return [
			'no_parent_text'           => __( '(no parent)', 'wordpress-seo' ),
			'replace_vars'             => $this->get_replace_vars( $post ),
			'hidden_replace_vars'      => $this->get_hidden_replace_vars(),
			'recommended_replace_vars' => $this->get_recommended_replace_vars( $post ),
			'scope'                    => $this->determine_scope( $post ),
			'has_taxonomies'           => $this->current_post_type_has_taxonomies( $post ),
		];
	}

     /**
	 * Prepares the replace vars for localization.
	 *
	 * @param WP_Post $post The post to check for custom taxonomies and fields.
	 * @return array Replace vars.
	 */
	private function get_replace_vars( $post ) {
		$cached_replacement_vars = [];

		$vars_to_cache = [
			'date',
			'id',
			'sitename',
			'sitedesc',
			'sep',
			'page',
			'currentdate',
			'currentyear',
			'currentmonth',
			'currentday',
			'post_year',
			'post_month',
			'post_day',
			'name',
			'author_first_name',
			'author_last_name',
			'permalink',
			'post_content',
			'category_title',
			'tag',
			'category',
		];

		foreach ( $vars_to_cache as $var ) {
			$cached_replacement_vars[ $var ] = wpseo_replace_vars( '%%' . $var . '%%', $post );
		}

		// Merge custom replace variables with the WordPress ones.
		return array_merge( $cached_replacement_vars, $this->get_custom_replace_vars( $post ) );
	}

	/**
	 * Gets the custom replace variables for custom taxonomies and fields.
	 *
	 * @param WP_Post $post The post to check for custom taxonomies and fields.
	 *
	 * @return array Array containing all the replacement variables.
	 */
	private function get_custom_replace_vars( $post ) {
		return [
			'custom_fields'     => $this->get_custom_fields_replace_vars( $post ),
			'custom_taxonomies' => $this->get_custom_taxonomies_replace_vars( $post ),
		];
	}

	/**
	 * Gets the custom replace variables for custom fields.
	 *
	 * @param WP_Post $post The post to check for custom fields.
	 *
	 * @return array Array containing all the replacement variables.
	 */
	private function get_custom_fields_replace_vars( $post ) {
		$custom_replace_vars = [];

		// If no post object is passed, return the empty custom_replace_vars array.
		if ( ! is_object( $post ) ) {
			return $custom_replace_vars;
		}

		$custom_fields = get_post_custom( $post->ID );

		// If $custom_fields is an empty string or generally not an array, return early.
		if ( ! is_array( $custom_fields ) ) {
			return $custom_replace_vars;
		}

		$meta = YoastSEO()->meta->for_post( $post->ID );

		if ( ! $meta ) {
			return $custom_replace_vars;
		}

		// Simply concatenate all fields containing replace vars so we can handle them all with a single regex find.
		$replace_vars_fields = implode(
			' ',
			[
				$meta->presentation->title,
				$meta->presentation->meta_description,
			]
		);

		preg_match_all( '/%%cf_([A-Za-z0-9_]+)%%/', $replace_vars_fields, $matches );
		$fields_to_include = $matches[1];
		foreach ( $custom_fields as $custom_field_name => $custom_field ) {
			// Skip private custom fields.
			if ( substr( $custom_field_name, 0, 1 ) === '_' ) {
				continue;
			}

			// Skip custom fields that are not used, new ones will be fetched dynamically.
			if ( ! in_array( $custom_field_name, $fields_to_include, true ) ) {
				continue;
			}

			// Skip custom field values that are serialized.
			if ( is_serialized( $custom_field[0] ) ) {
				continue;
			}

			$custom_replace_vars[ $custom_field_name ] = $custom_field[0];
		}

		return $custom_replace_vars;
	}

		/**
	 * Gets the custom replace variables for custom taxonomies.
	 *
	 * @param WP_Post $post The post to check for custom taxonomies.
	 *
	 * @return array Array containing all the replacement variables.
	 */
	private function get_custom_taxonomies_replace_vars( $post ) {
		$taxonomies          = get_object_taxonomies( $post, 'objects' );
		$custom_replace_vars = [];

		foreach ( $taxonomies as $taxonomy_name => $taxonomy ) {

			if ( is_string( $taxonomy ) ) { // If attachment, see https://core.trac.wordpress.org/ticket/37368 .
				$taxonomy_name = $taxonomy;
				$taxonomy      = get_taxonomy( $taxonomy_name );
			}

			if ( $taxonomy->_builtin && $taxonomy->public ) {
				continue;
			}

			$custom_replace_vars[ $taxonomy_name ] = [
				'name'        => $taxonomy->name,
				'description' => $taxonomy->description,
			];
		}

		return $custom_replace_vars;
	}

	/**
	 * Determines whether or not the current post type has registered taxonomies.
	 *
	 * @return bool Whether the current post type has taxonomies.
	 */
	private function current_post_type_has_taxonomies($post) {
		$post_taxonomies = get_object_taxonomies( $post->post_type );

		return ! empty( $post_taxonomies );
	}

	/**
	 * Prepares the recommended replace vars for localization.
	 *
	 * @return array Recommended replacement variables.
	 */
	private function get_recommended_replace_vars( $post ) {
		$recommended_replace_vars = new WPSEO_Admin_Recommended_Replace_Vars();

		// What is recommended depends on the current context.
		$post_type = $recommended_replace_vars->determine_for_post( $post );

		return $recommended_replace_vars->get_recommended_replacevars_for( $post_type );
	}

	/**
	 * Returns the list of replace vars that should be hidden inside the editor.
	 *
	 * @return string[] The hidden replace vars.
	 */
	protected function get_hidden_replace_vars() {
		return ( new WPSEO_Replace_Vars() )->get_hidden_replace_vars();
	}

	/**
	 * Determines the scope based on the post type.
	 * This can be used by the replacevar plugin to determine if a replacement needs to be executed.
	 *
	 * @return string String describing the current scope.
	 */
	private function determine_scope( $post ) {
		if ( $post->post_type === 'page' ) {
			return 'page';
		}

		return 'post';
	}
}