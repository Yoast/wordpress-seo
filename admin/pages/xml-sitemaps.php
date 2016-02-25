<?php
/**
 * @package WPSEO\Admin
 */

/**
 * @todo - [JRF => whomever] check for other sitemap plugins which may conflict ?
 * @todo - [JRF => whomever] check for existance of .xls rewrite rule in .htaccess from
 * google-sitemaps-plugin/generator and remove as it will cause errors for our sitemaps
 * (or inform the user and disallow enabling of sitemaps )
 * @todo - [JRF => whomever] check if anything along these lines is already being done
 */


if ( ! defined( 'WPSEO_VERSION' ) ) {
	header( 'Status: 403 Forbidden' );
	header( 'HTTP/1.1 403 Forbidden' );
	exit();
}

$yform = Yoast_Form::get_instance();

$yform->admin_header( true, 'wpseo_xml' );

$options = get_option( 'wpseo_xml' );

echo '<br/>';

$yform->light_switch( 'enablexmlsitemap', __( 'XML sitemap functionality', 'wordpress-seo' ) );

?>
	<div id="sitemapinfo">
		<h2 class="nav-tab-wrapper" id="wpseo-tabs">
			<a class="nav-tab" id="general-tab" href="#top#general"><?php _e( 'General', 'wordpress-seo' ); ?></a>
			<a class="nav-tab" id="user-sitemap-tab"
			   href="#top#user-sitemap"><?php _e( 'User sitemap', 'wordpress-seo' ); ?></a>
			<a class="nav-tab" id="post-types-tab"
			   href="#top#post-types"><?php _e( 'Post Types', 'wordpress-seo' ); ?></a>
			<a class="nav-tab" id="exclude-post-tab" href="#top#exclude-post"><?php _e( 'Excluded Posts', 'wordpress-seo' ); ?></a>
			<a class="nav-tab" id="taxonomies-tab"
			   href="#top#taxonomies"><?php _e( 'Taxonomies', 'wordpress-seo' ); ?></a>
		</h2>

		<div id="general" class="wpseotab">
			<?php

			if ( $options['enablexmlsitemap'] === true ) {
				echo '<p>';
				printf( esc_html__( 'You can find your XML Sitemap here: %sXML Sitemap%s', 'wordpress-seo' ), '<a target="_blank" class="button-secondary" href="' . esc_url( wpseo_xml_sitemaps_base_url( 'sitemap_index.xml' ) ) . '">', '</a>' );
				echo '<br/>';
				echo '<br/>';
				_e( 'You do <strong>not</strong> need to generate the XML sitemap, nor will it take up time to generate after publishing a post.', 'wordpress-seo' );
				echo '</p>';
			}
			else {
				echo '<p>', __( 'Save your settings to activate XML Sitemaps.', 'wordpress-seo' ), '</p>';
			}
			?>

			<p>
				<strong><?php _e( 'Entries per page', 'wordpress-seo' ); ?></strong><br/>
				<?php printf( __( 'Please enter the maximum number of entries per sitemap page (defaults to %s, you might want to lower this to prevent memory issues on some installs):', 'wordpress-seo' ), WPSEO_Options::get_default( 'wpseo_xml', 'entries-per-page' ) ); ?>
			</p>

			<?php
			$yform->textinput( 'entries-per-page', __( 'Max entries per sitemap', 'wordpress-seo' ) );
			?>
		</div>

		<div id="user-sitemap" class="wpseotab">
			<?php
			$yform->toggle_switch(
				'disable_author_sitemap',
				array( 'off' => __( 'Enabled', 'wordpress-seo' ), 'on' => __( 'Disabled', 'wordpress-seo' ) ),
				__( 'Author / user sitemap', 'wordpress-seo' )
			);
			?>
			<p class="expl"><?php _e( 'The user sitemap contains the author archive URLs for every user on your site. You can choose to not include users without posts.', 'wordpress-seo' ); ?></p>
			<div id="xml_user_block">
					<?php
					$switch_values = array( 'off' => __( 'In sitemap', 'wordpress-seo' ), 'on' => __( 'Not in sitemap', 'wordpress-seo' ) );
					$yform->toggle_switch( 'disable_author_noposts', $switch_values, __( 'Users with zero posts', 'wordpress-seo' ) );

					$roles = WPSEO_Utils::get_roles();
					if ( is_array( $roles ) && $roles !== array() ) {
						echo '<p class="expl"><strong>' . __( 'Filter specific user roles', 'wordpress-seo' ) . '</strong></p>';
						foreach ( $roles as $role_key => $role_name ) {
							$yform->toggle_switch( 'user_role-' . $role_key . '-not_in_sitemap', $switch_values, $role_name );
						}
					} ?>
			</div>
		</div>

		<div id="post-types" class="wpseotab">

			<?php
			$post_types = apply_filters( 'wpseo_sitemaps_supported_post_types', get_post_types( array( 'public' => true ), 'objects' ) );
			if ( is_array( $post_types ) && $post_types !== array() ) {
				foreach ( $post_types as $pt ) {
					$yform->toggle_switch(
						'post_types-' . $pt->name . '-not_in_sitemap',
						$switch_values,
						$pt->labels->name . ' (<code>' . $pt->name . '</code>)'
					);
				}
			}

			?>

		</div>

		<div id="exclude-post" class="wpseotab">
			<?php
			/* Translators: %1$s: expands to '<code>1,2,99,100</code>' */
			echo '<p>' , sprintf( __( 'You can exclude posts from the sitemap by entering a comma separated string with the Post ID\'s. The format will become something like: %1$s.', 'wordpress-seo' ), '<code>1,2,99,100</code>' ) , '</p>';
			$yform->textinput( 'excluded-posts', __( 'Posts to exclude', 'wordpress-seo' ) );
			?>
		</div>

		<div id="taxonomies" class="wpseotab">

			<?php
			$taxonomies = apply_filters( 'wpseo_sitemaps_supported_taxonomies', get_taxonomies( array( 'public' => true ), 'objects' ) );
			if ( is_array( $taxonomies ) && $taxonomies !== array() ) {
				foreach ( $taxonomies as $tax ) {
					// Explicitly hide all the core taxonomies we never want in our sitemap.
					if ( in_array( $tax->name, array( 'link_category', 'nav_menu', 'post_format' ) ) ) {
						continue;
					}
					if ( isset( $tax->labels->name ) && trim( $tax->labels->name ) != '' ) {
						$yform->toggle_switch(
							'taxonomies-' . $tax->name . '-not_in_sitemap',
							$switch_values,
							$tax->labels->name . ' (<code>' . $tax->name . '</code>)'
						);
					}
				}
			}

			?>
		</div>
	</div>
<?php

do_action( 'wpseo_xmlsitemaps_config' );

$yform->admin_footer();
