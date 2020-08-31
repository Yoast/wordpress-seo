<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin\Views\General
 *
 * @uses Yoast_Form $yform Form object.
 */

?>
<div class="tab-block">
	<?php
	if ( get_option( 'show_on_front' ) === 'posts' ) {
		$homepage_help = new WPSEO_Admin_Help_Panel(
			'search-appearance-homepage',
			__( 'Learn more about the homepage setting', 'wordpress-seo' ),
			__( 'This is what shows in the search results when people find your homepage. This means this is probably what they see when they search for your brand name.', 'wordpress-seo' ),
			'has-wrapper'
		);

		// phpcs:ignore WordPress.Security.EscapeOutput -- get_button_html() output is properly escaped.
		echo '<h2 class="help-button-inline">', esc_html__( 'Homepage', 'wordpress-seo' ), $homepage_help->get_button_html(), '</h2>';
		// phpcs:ignore WordPress.Security.EscapeOutput -- get_panel_html() output is properly escaped.
		echo $homepage_help->get_panel_html();

		$editor = new WPSEO_Replacevar_Editor(
			$yform,
			[
				'title'                 => 'title-home-wpseo',
				'description'           => 'metadesc-home-wpseo',
				'page_type_recommended' => 'homepage',
				'page_type_specific'    => 'page',
				'paper_style'           => false,
			]
		);
		$editor->render();
	}
	else {
		echo '<h2>', esc_html__( 'Homepage &amp; Front page', 'wordpress-seo' ), '</h2>';
		echo '<p>';
		printf(
			/* translators: 1: link open tag; 2: link close tag. */
			esc_html__( 'You can determine the title and description for the front page by %1$sediting the front page itself%2$s.', 'wordpress-seo' ),
			'<a href="' . esc_url( get_edit_post_link( get_option( 'page_on_front' ) ) ) . '">',
			'</a>'
		);
		echo '</p>';
		if ( get_option( 'page_for_posts' ) > 0 ) {
			echo '<p>';
			printf(
				/* translators: 1: link open tag; 2: link close tag. */
				esc_html__( 'You can determine the title and description for the blog page by %1$sediting the blog page itself%2$s.', 'wordpress-seo' ),
				'<a href="' . esc_url( get_edit_post_link( get_option( 'page_for_posts' ) ) ) . '">',
				'</a>'
			);
			echo '</p>';
		}
	}
	?>
</div>
