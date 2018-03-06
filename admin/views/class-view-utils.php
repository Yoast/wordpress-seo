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
	 * Shows the search results help question mark and help section.
	 *
	 * Used for all the Help sections for indexable objects like post types, taxonomies, or archives.
	 *
	 * @param string|object $post_type        The post type to show the search results help for.
	 * @param string        $help_text_switch Switch the help text to one that's more appropriate
	 *                                        for the indexable object type the help section is for.
	 *
	 * @return object The help panel instance.
	 */
	public function search_results_setting_help( $post_type, $help_text_switch = '' ) {
		if ( ! is_object( $post_type ) ) {
			$post_type = get_post_type_object( $post_type );
		}

		/* translators: 1: expands to an indexable object's name, like a post type or taxonomy; 2: expands to <code>noindex</code>; 3: link open tag; 4: link close tag. */
		$help_text = esc_html__( 'Not showing %1$s in the search results technically means those will have a %2$s robots meta and will be excluded from XML sitemaps. %3$sMore info on the search results settings%4$s.', 'wordpress-seo' );

		if ( $help_text_switch === 'archive' ) {
			/* translators: 1: expands to an indexable object's name, like a post type or taxonomy; 2: expands to <code>noindex</code>; 3: link open tag; 4: link close tag. */
			$help_text = esc_html__( 'Not showing the archive for %1$s in the search results technically means those will have a %2$s robots meta and will be excluded from XML sitemaps. %3$sMore info on the search results settings%4$s.', 'wordpress-seo' );
		}

		$help_panel = new WPSEO_Admin_Help_Panel(
			// Sometimes the same post type is used more than once in the same page, we need a unique ID though.
			uniqid( 'noindex-' . $post_type->name ),
			esc_html__( 'Help on this search results setting', 'wordpress-seo' ),
			sprintf(
				$help_text,
				$post_type->labels->name,
				'<code>noindex</code>',
				'<a href="' . esc_url( WPSEO_Shortlinker::get( 'https://yoa.st/show-x' ) ) . '" target="_blank" rel="noopener noreferrer">',
				'</a>'
			)
		);

		return $help_panel;
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

		$show_post_type_help = $this->search_results_setting_help( $post_type );

		$this->form->index_switch(
			'noindex-' . $post_type->name,
			$post_type->labels->name,
			$show_post_type_help->get_button_html() . $show_post_type_help->get_panel_html()
		);

		$this->form->textinput(
			'title-' . $post_type->name,
			__( 'Title template', 'wordpress-seo' ),
			'template posttype-template'
		);

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
			'display-metabox-pt-' . $post_type->name,
			/* translators: %1$s expands to Yoast SEO */
			sprintf( __( '%1$s Meta Box', 'wordpress-seo' ), 'Yoast SEO' )
		);
	}
}
