<?php
/**
 * @package WPSEO\Admin\Views
 */

/**
 * Class Yoast_View_Utils
 */
class Yoast_View_Utils {
	/**
	 * Yoast_View_Utils constructor.
	 */
	public function __construct() {
		$this->form = Yoast_Form::get_instance();
	}

	/**
	 * Shows the search appearance settings for a post type.
	 *
	 * @param string|object $post_type The post type to show the search appearance settings for.
	 */
	public function show_post_type_settings( $post_type ) {
		if ( ! is_object( $post_type ) ) {
			$post_type = get_post_type_object( $post_type );
		}
		/* translators: %s expands to the post type name */
		$this->form->index_switch( 'noindex-' . $post_type->name, sprintf( __( 'Show %s in search results?', 'wordpress-seo' ), '<strong>' . $post_type->labels->name . '</strong>' ) );
		$this->form->textinput( 'title-' . $post_type->name, __( 'Title template', 'wordpress-seo' ), 'template posttype-template' );
		$this->form->textarea( 'metadesc-' . $post_type->name, __( 'Meta description template', 'wordpress-seo' ), array( 'class' => 'template posttype-template' ) );
		$this->form->toggle_switch( 'showdate-' . $post_type->name, array(
			'on'  => __( 'Show', 'wordpress-seo' ),
			'off' => __( 'Hide', 'wordpress-seo' ),
		), __( 'Date in Snippet Preview', 'wordpress-seo' ) );
		$this->form->toggle_switch( 'hideeditbox-' . $post_type->name, array(
			'off' => __( 'Show', 'wordpress-seo' ),
			'on'  => __( 'Hide', 'wordpress-seo' ),
			/* translators: %1$s expands to Yoast SEO */
		), sprintf( __( '%1$s Meta Box', 'wordpress-seo' ), 'Yoast SEO' ) );
	}
}
