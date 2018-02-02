<?php
/**
 * @package WPSEO\Admin\Views
 */

/**
 * Class Yoast_View_Utils
 */
class Yoast_View_Utils {
	/** @var Yoast_Form Form to use. */
	protected $form;

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
	 *
	 * @return void
	 */
	public function show_post_type_settings( $post_type ) {
		if ( ! is_object( $post_type ) ) {
			$post_type = get_post_type_object( $post_type );
		}

		$this->form->index_switch(
			'noindex-' . $post_type->name,
			$post_type->labels->name
		);

		$this->form->textinput(
			'title-' . $post_type->name,
			__( 'Title template', 'wordpress-seo' ),
			'template posttype-template'
		)
;
		$this->form->textarea(
			'metadesc-' . $post_type->name,
			__( 'Meta description template', 'wordpress-seo' ),
			array( 'class' => 'template posttype-template' )
		);

		$this->form->show_hide_switch(
			'showdate-' . $post_type->name,
			__( 'Date in Snippet Preview', 'wordpress-seo' )
		);

		$this->form->show_hide_switch(
			'hideeditbox-' . $post_type->name,
			/* translators: %1$s expands to Yoast SEO */
			sprintf( __( '%1$s Meta Box', 'wordpress-seo' ), 'Yoast SEO' )
		);
	}
}
