<?php
/**
 * Plugin Name:     Yoast_E2E_Post_Type
 * Author:          Team Yoast
 * Text Domain:     yoast_e2e_post_type
 * Version:         0.0.0
 */

function yoast_e2e_register_yoast_post_type() {

	/**
	 * Post Type: Yoast Simple Posts.
	 */

	$labels = [
		"name" => __( "Yoast Simple Posts", "twentytwentyone" ),
		"singular_name" => __( "Yoast Simple Post", "twentytwentyone" ),
		"menu_name" => __( "My Yoast Simple Posts", "twentytwentyone" ),
		"all_items" => __( "All Yoast Simple Posts", "twentytwentyone" ),
		"add_new" => __( "Add new", "twentytwentyone" ),
		"add_new_item" => __( "Add new Yoast Simple Post", "twentytwentyone" ),
		"edit_item" => __( "Edit Yoast Simple Post", "twentytwentyone" ),
		"new_item" => __( "New Yoast Simple Post", "twentytwentyone" ),
		"view_item" => __( "View Yoast Simple Post", "twentytwentyone" ),
		"view_items" => __( "View Yoast Simple Posts", "twentytwentyone" ),
		"search_items" => __( "Search Yoast Simple Posts", "twentytwentyone" ),
		"not_found" => __( "No Yoast Simple Posts found", "twentytwentyone" ),
		"not_found_in_trash" => __( "No Yoast Simple Posts found in trash", "twentytwentyone" ),
		"parent" => __( "Parent Yoast Simple Post:", "twentytwentyone" ),
		"featured_image" => __( "Featured image for this Yoast Simple Post", "twentytwentyone" ),
		"set_featured_image" => __( "Set featured image for this Yoast Simple Post", "twentytwentyone" ),
		"remove_featured_image" => __( "Remove featured image for this Yoast Simple Post", "twentytwentyone" ),
		"use_featured_image" => __( "Use as featured image for this Yoast Simple Post", "twentytwentyone" ),
		"archives" => __( "Yoast Simple Post archives", "twentytwentyone" ),
		"insert_into_item" => __( "Insert into Yoast Simple Post", "twentytwentyone" ),
		"uploaded_to_this_item" => __( "Upload to this Yoast Simple Post", "twentytwentyone" ),
		"filter_items_list" => __( "Filter Yoast Simple Posts list", "twentytwentyone" ),
		"items_list_navigation" => __( "Yoast Simple Posts list navigation", "twentytwentyone" ),
		"items_list" => __( "Yoast Simple Posts list", "twentytwentyone" ),
		"attributes" => __( "Yoast Simple Posts attributes", "twentytwentyone" ),
		"name_admin_bar" => __( "Yoast Simple Post", "twentytwentyone" ),
		"item_published" => __( "Yoast Simple Post published", "twentytwentyone" ),
		"item_published_privately" => __( "Yoast Simple Post published privately.", "twentytwentyone" ),
		"item_reverted_to_draft" => __( "Yoast Simple Post reverted to draft.", "twentytwentyone" ),
		"item_scheduled" => __( "Yoast Simple Post scheduled", "twentytwentyone" ),
		"item_updated" => __( "Yoast Simple Post updated.", "twentytwentyone" ),
		"parent_item_colon" => __( "Parent Yoast Simple Post:", "twentytwentyone" ),
	];

	$args = [
		"label" => __( "Yoast Simple Posts", "twentytwentyone" ),
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
		"name" => __( "YSP Taxonomies", "twentytwentyone" ),
		"singular_name" => __( "YSP Taxonomy", "twentytwentyone" ),
		"menu_name" => __( "YSP Taxonomies", "twentytwentyone" ),
		"all_items" => __( "All YSP Taxonomies", "twentytwentyone" ),
		"edit_item" => __( "Edit YSP Taxonomy", "twentytwentyone" ),
		"view_item" => __( "View YSP Taxonomy", "twentytwentyone" ),
		"update_item" => __( "Update YSP Taxonomy name", "twentytwentyone" ),
		"add_new_item" => __( "Add new YSP Taxonomy", "twentytwentyone" ),
		"new_item_name" => __( "New YSP Taxonomy name", "twentytwentyone" ),
		"parent_item" => __( "Parent YSP Taxonomy", "twentytwentyone" ),
		"parent_item_colon" => __( "Parent YSP Taxonomy:", "twentytwentyone" ),
		"search_items" => __( "Search YSP Taxonomies", "twentytwentyone" ),
		"popular_items" => __( "Popular YSP Taxonomies", "twentytwentyone" ),
		"separate_items_with_commas" => __( "Separate YSP Taxonomies with commas", "twentytwentyone" ),
		"add_or_remove_items" => __( "Add or remove YSP Taxonomies", "twentytwentyone" ),
		"choose_from_most_used" => __( "Choose from the most used YSP Taxonomies", "twentytwentyone" ),
		"not_found" => __( "No YSP Taxonomies found", "twentytwentyone" ),
		"no_terms" => __( "No YSP Taxonomies", "twentytwentyone" ),
		"items_list_navigation" => __( "YSP Taxonomies list navigation", "twentytwentyone" ),
		"items_list" => __( "YSP Taxonomies list", "twentytwentyone" ),
		"back_to_items" => __( "Back to YSP Taxonomies", "twentytwentyone" ),
	];

	
	$args = [
		"label" => __( "YSP Taxonomies", "twentytwentyone" ),
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
