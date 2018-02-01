<?php

class Yoast_View_Utils {

	public function __construct() {
		$this->form = Yoast_Form::get_instance();
	}

	public function show_post_type_settings( $post_type ) {
		$this->form->textinput( 'title-' . $post_type, __( 'Title template', 'wordpress-seo' ), 'template posttype-template' );
		$this->form->textarea( 'metadesc-' . $post_type, __( 'Meta description template', 'wordpress-seo' ), array( 'class' => 'template posttype-template' ) );
		$this->form->index_switch( 'noindex-' . $post_type, __( 'Meta Robots', 'wordpress-seo' ) );
		$this->form->toggle_switch( 'showdate-' . $post_type, array(
			'on'  => __( 'Show', 'wordpress-seo' ),
			'off' => __( 'Hide', 'wordpress-seo' ),
		), __( 'Date in Snippet Preview', 'wordpress-seo' ) );
		$this->form->toggle_switch( 'hideeditbox-' . $post_type, array(
			'off' => __( 'Show', 'wordpress-seo' ),
			'on'  => __( 'Hide', 'wordpress-seo' ),
			/* translators: %1$s expands to Yoast SEO */
		), sprintf( __( '%1$s Meta Box', 'wordpress-seo' ), 'Yoast SEO' ) );
	}
}
