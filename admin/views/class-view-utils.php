<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin\Views
 */

/**
 * Class Yoast_View_Utils.
 */
class Yoast_View_Utils {

	/**
	 * Form to use.
	 *
	 * @var Yoast_Form
	 */
	protected $form;

	/**
	 * Yoast_View_Utils constructor.
	 */
	public function __construct() {
		$this->form = Yoast_Form::get_instance();
	}

	/**
	 * Shows the search results help question mark.
	 *
	 * Used for all the Help sections for indexable objects like post types, taxonomies, or archives.
	 *
	 * @return WPSEO_Admin_Help_Button The help button instance.
	 */
	public function search_results_setting_help() {
		return new WPSEO_Admin_Help_Button( 'https://yoa.st/show-x', esc_html__( 'Help on this search results setting (opens in new tab)', 'wordpress-seo' ) );
	}

	/**
	 * Shows the search appearance settings for a post type.
	 *
	 * @param string|object $post_type   The post type to show the search appearance settings for.
	 * @param bool          $paper_style Whether or not the paper style should be shown.
	 *
	 * @return void
	 */
	public function show_post_type_settings( $post_type, $paper_style = false ) {
		if ( ! is_object( $post_type ) ) {
			$post_type = get_post_type_object( $post_type );
		}

		$noindex_option_name = 'noindex-' . $post_type->name;

		$this->form->index_switch(
			$noindex_option_name,
			$post_type->labels->name,
			$this->search_results_setting_help()
		);

		$this->form->show_hide_switch(
			'showdate-' . $post_type->name,
			__( 'Date in Google Preview', 'wordpress-seo' )
		);

		$this->form->show_hide_switch(
			'display-metabox-pt-' . $post_type->name,
			/* translators: %1$s expands to Yoast SEO */
			sprintf( __( '%1$s Meta Box', 'wordpress-seo' ), 'Yoast SEO' )
		);

		$recommended_replace_vars     = new WPSEO_Admin_Recommended_Replace_Vars();
		$editor_specific_replace_vars = new WPSEO_Admin_Editor_Specific_Replace_Vars();

		$editor = new WPSEO_Replacevar_Editor(
			$this->form,
			[
				'title'                 => 'title-' . $post_type->name,
				'description'           => 'metadesc-' . $post_type->name,
				'page_type_recommended' => $recommended_replace_vars->determine_for_post_type( $post_type->name ),
				'page_type_specific'    => $editor_specific_replace_vars->determine_for_post_type( $post_type->name ),
				'paper_style'           => $paper_style,
			]
		);
		$editor->render();
	}
}
