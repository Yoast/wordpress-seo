<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin
 */

/**
 * Represents the yoast columns.
 */
class WPSEO_Yoast_Columns implements WPSEO_WordPress_Integration {

	/**
	 * Registers all hooks to WordPress.
	 */
	public function register_hooks() {
		add_action( 'load-edit.php', [ $this, 'add_help_tab' ] );
	}

	/**
	 * Adds the help tab to the help center for current screen.
	 */
	public function add_help_tab() {
		if ( $this->display_metabox() ) {
			$screen = get_current_screen();
			$screen->add_help_tab(
				[
					/* translators: %s expands to Yoast */
					'title'    => sprintf( __( '%s Columns', 'wordpress-seo' ), 'Yoast' ),
					'id'       => 'yst-columns',
					'content'  => sprintf(
						/* translators: %1$s: Yoast SEO, %2$s: Link to article about content analysis, %3$s: Anchor closing, %4$s: Link to article about text links, %5$s: Emphasis open tag, %6$s: Emphasis close tag */
						'<p>' . __( '%1$s adds several columns to this page. We\'ve written an article about %2$show to use the SEO score and Readability score%3$s. The links columns show the number of articles on this site linking %5$sto%6$s this article and the number of URLs linked %5$sfrom%6$s this article. Learn more about %4$show to use these features to improve your internal linking%3$s, which greatly enhances your SEO.', 'wordpress-seo' ) . '</p>',
						'Yoast SEO',
						'<a href="' . WPSEO_Shortlinker::get( 'https://yoa.st/16p' ) . '">',
						'</a>',
						'<a href="' . WPSEO_Shortlinker::get( 'https://yoa.st/16q' ) . '">',
						'<em>',
						'</em>'
					),
					'priority' => 15,
				]
			);
		}
	}

	/**
	 * Retrieves the post type from the $_GET variable.
	 *
	 * @return string The current post type.
	 */
	private function get_current_post_type() {
		return filter_input( INPUT_GET, 'post_type' );
	}

	/**
	 * Wraps the WPSEO_Metabox check to determine whether the metabox should be displayed either by
	 * choice of the admin or because the post type is not a public post type.
	 *
	 * @return bool Whether or not the meta box (and associated columns etc) should be hidden.
	 */
	private function display_metabox() {
		$current_post_type = sanitize_text_field( $this->get_current_post_type() );

		if ( empty( $current_post_type ) ) {
			return false;
		}

		return WPSEO_Utils::is_metabox_active( $current_post_type, 'post_type' );
	}
}
