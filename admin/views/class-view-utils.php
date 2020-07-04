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
}
