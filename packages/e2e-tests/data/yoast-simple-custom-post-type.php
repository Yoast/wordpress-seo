<?php
/**
 * Plugin Name:     Yoast_E2E_Post_Type
 * Author:          Team Yoast
 * Text Domain:     yoast_e2e_custom_plugin
 * Version:         0.0.0
 */

function yoast_e2e_register_yoast_post_type() {

	/**
	 * Post Type: Yoast Simple Posts.
	 */

	$labels = [
		"name" => __( "Yoast Simple Posts", "yoast_e2e_custom_plugin" ),
		"singular_name" => __( "Yoast Simple Post", "yoast_e2e_custom_plugin" ),
		"menu_name" => __( "My Yoast Simple Posts", "yoast_e2e_custom_plugin" ),
		"all_items" => __( "All Yoast Simple Posts", "yoast_e2e_custom_plugin" ),
		"add_new" => __( "Add new", "yoast_e2e_custom_plugin" ),
		"add_new_item" => __( "Add new Yoast Simple Post", "yoast_e2e_custom_plugin" ),
		"edit_item" => __( "Edit Yoast Simple Post", "yoast_e2e_custom_plugin" ),
		"new_item" => __( "New Yoast Simple Post", "yoast_e2e_custom_plugin" ),
		"view_item" => __( "View Yoast Simple Post", "yoast_e2e_custom_plugin" ),
		"view_items" => __( "View Yoast Simple Posts", "yoast_e2e_custom_plugin" ),
		"search_items" => __( "Search Yoast Simple Posts", "yoast_e2e_custom_plugin" ),
		"not_found" => __( "No Yoast Simple Posts found", "yoast_e2e_custom_plugin" ),
		"not_found_in_trash" => __( "No Yoast Simple Posts found in trash", "yoast_e2e_custom_plugin" ),
		"parent" => __( "Parent Yoast Simple Post:", "yoast_e2e_custom_plugin" ),
		"featured_image" => __( "Featured image for this Yoast Simple Post", "yoast_e2e_custom_plugin" ),
		"set_featured_image" => __( "Set featured image for this Yoast Simple Post", "yoast_e2e_custom_plugin" ),
		"remove_featured_image" => __( "Remove featured image for this Yoast Simple Post", "yoast_e2e_custom_plugin" ),
		"use_featured_image" => __( "Use as featured image for this Yoast Simple Post", "yoast_e2e_custom_plugin" ),
		"archives" => __( "Yoast Simple Post archives", "yoast_e2e_custom_plugin" ),
		"insert_into_item" => __( "Insert into Yoast Simple Post", "yoast_e2e_custom_plugin" ),
		"uploaded_to_this_item" => __( "Upload to this Yoast Simple Post", "yoast_e2e_custom_plugin" ),
		"filter_items_list" => __( "Filter Yoast Simple Posts list", "yoast_e2e_custom_plugin" ),
		"items_list_navigation" => __( "Yoast Simple Posts list navigation", "yoast_e2e_custom_plugin" ),
		"items_list" => __( "Yoast Simple Posts list", "yoast_e2e_custom_plugin" ),
		"attributes" => __( "Yoast Simple Posts attributes", "yoast_e2e_custom_plugin" ),
		"name_admin_bar" => __( "Yoast Simple Post", "yoast_e2e_custom_plugin" ),
		"item_published" => __( "Yoast Simple Post published", "yoast_e2e_custom_plugin" ),
		"item_published_privately" => __( "Yoast Simple Post published privately.", "yoast_e2e_custom_plugin" ),
		"item_reverted_to_draft" => __( "Yoast Simple Post reverted to draft.", "yoast_e2e_custom_plugin" ),
		"item_scheduled" => __( "Yoast Simple Post scheduled", "yoast_e2e_custom_plugin" ),
		"item_updated" => __( "Yoast Simple Post updated.", "yoast_e2e_custom_plugin" ),
		"parent_item_colon" => __( "Parent Yoast Simple Post:", "yoast_e2e_custom_plugin" ),
	];

	$args = [
		"label" => __( "Yoast Simple Posts", "yoast_e2e_custom_plugin" ),
		"labels" => $labels,
		"description" => "",
		"public" => true,
		"publicly_queryable" => true,
		"show_ui" => true,
		"show_in_rest" => true,
		"rest_base" => "",
		"rest_controller_class" => "WP_REST_Posts_Controller",
		"has_archive" => false,
		"show_in_menu" => true,
		"show_in_nav_menus" => true,
		"delete_with_user" => false,
		"exclude_from_search" => false,
		"capability_type" => "post",
		"map_meta_cap" => true,
		"hierarchical" => false,
		"rewrite" => [ "slug" => "yoast_post_type", "with_front" => true ],
		"query_var" => true,
		"supports" => [ "title", "editor", "thumbnail" ],
		"show_in_graphql" => false,
	];

	register_post_type( "yoast_post_type", $args );
}

add_action( 'init', 'yoast_e2e_register_yoast_post_type' );

function yoast_e2e_register_yoast_post_type_taxonomy() {

	/**
	 * Taxonomy: YSP Taxonomies.
	 */

	$labels = [
		"name" => __( "YSP Taxonomies", "yoast_e2e_custom_plugin" ),
		"singular_name" => __( "YSP Taxonomy", "yoast_e2e_custom_plugin" ),
		"menu_name" => __( "YSP Taxonomies", "yoast_e2e_custom_plugin" ),
		"all_items" => __( "All YSP Taxonomies", "yoast_e2e_custom_plugin" ),
		"edit_item" => __( "Edit YSP Taxonomy", "yoast_e2e_custom_plugin" ),
		"view_item" => __( "View YSP Taxonomy", "yoast_e2e_custom_plugin" ),
		"update_item" => __( "Update YSP Taxonomy name", "yoast_e2e_custom_plugin" ),
		"add_new_item" => __( "Add new YSP Taxonomy", "yoast_e2e_custom_plugin" ),
		"new_item_name" => __( "New YSP Taxonomy name", "yoast_e2e_custom_plugin" ),
		"parent_item" => __( "Parent YSP Taxonomy", "yoast_e2e_custom_plugin" ),
		"parent_item_colon" => __( "Parent YSP Taxonomy:", "yoast_e2e_custom_plugin" ),
		"search_items" => __( "Search YSP Taxonomies", "yoast_e2e_custom_plugin" ),
		"popular_items" => __( "Popular YSP Taxonomies", "yoast_e2e_custom_plugin" ),
		"separate_items_with_commas" => __( "Separate YSP Taxonomies with commas", "yoast_e2e_custom_plugin" ),
		"add_or_remove_items" => __( "Add or remove YSP Taxonomies", "yoast_e2e_custom_plugin" ),
		"choose_from_most_used" => __( "Choose from the most used YSP Taxonomies", "yoast_e2e_custom_plugin" ),
		"not_found" => __( "No YSP Taxonomies found", "yoast_e2e_custom_plugin" ),
		"no_terms" => __( "No YSP Taxonomies", "yoast_e2e_custom_plugin" ),
		"items_list_navigation" => __( "YSP Taxonomies list navigation", "yoast_e2e_custom_plugin" ),
		"items_list" => __( "YSP Taxonomies list", "yoast_e2e_custom_plugin" ),
		"back_to_items" => __( "Back to YSP Taxonomies", "yoast_e2e_custom_plugin" ),
	];

	
	$args = [
		"label" => __( "YSP Taxonomies", "yoast_e2e_custom_plugin" ),
		"labels" => $labels,
		"public" => true,
		"publicly_queryable" => true,
		"hierarchical" => false,
		"show_ui" => true,
		"show_in_menu" => true,
		"show_in_nav_menus" => true,
		"query_var" => true,
		"rewrite" => [ 'slug' => 'yoast_simple_posts_taxonomy', 'with_front' => true, ],
		"show_admin_column" => false,
		"show_in_rest" => true,
		"rest_base" => "yoast_simple_posts_taxonomy",
		"rest_controller_class" => "WP_REST_Terms_Controller",
		"show_in_quick_edit" => false,
		"show_in_graphql" => false,
	];
	register_taxonomy( "yoast_simple_posts_taxonomy", [ "yoast_post_type" ], $args );
}
add_action( 'init', 'yoast_e2e_register_yoast_post_type_taxonomy' );
