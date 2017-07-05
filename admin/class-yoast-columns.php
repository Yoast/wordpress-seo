<?php
/**
 * @package WPSEO\Admin
 */

/**
 * Represents the yoast columns.
 */
class WPSEO_Yoast_Columns implements WPSEO_WordPress_Integration {

	/**
	 * Registers all hooks to WordPress
	 */
	public function register_hooks() {
		add_action( 'load-edit.php', array( $this, 'add_help_tab' ) );
	}

	/**
	 * Adds the help tab to the help center for current screen.
	 */
	public function add_help_tab() {
		$screen = get_current_screen();
		$screen->add_help_tab(
			array(
				/* translators: %s expands to Yoast */
				'title'    => sprintf( __( '%s Columns', 'wordpress-seo' ), 'Yoast' ),
				'id'       => 'yst-columns',
				'content'  => sprintf(
					/* translators: %1$s: Yoast SEO, %2$s: Link to article about content analysis, %3$s: Anchor closing, %4$s: Link to article about text links */
					'<p>' . __( '%1$s adds several columns to this page. To learn how to use the SEO score and Readability score, read %2$sthis post%3$s. The links columns show the number of articles on this site linking <em>to</em> this article and the number of URLs on this linked to from this article. To learn more about how to use these features to improve your internal linking, which greatly enhances your SEO, read %4$sthis post%3$s.' ) . '</p>',
					'Yoast SEO',
					'<a href="' . WPSEO_Shortlinker::get( 'https://yoast.com/use-content-analysis-yoast-seo' ) . '">',
					'</a>',
					'<a href="' . WPSEO_Shortlinker::get( 'https://yoa.st/text-link-counter-howto' )  .'">'
				),
				'priority' => 15,
			)
		);
	}
}