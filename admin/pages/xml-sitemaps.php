<?php
/**
 * @package Admin
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

global $wpseo_admin_pages;

$wpseo_admin_pages->admin_header( true, WPSEO_Options::get_group_name( 'wpseo_xml' ), 'wpseo_xml' );

$options = get_option( 'wpseo_xml' );

$wpseo_admin_pages->checkbox( 'enablexmlsitemap', __( 'Check this box to enable XML sitemap functionality.', 'wordpress-seo' ), false );

?>
	<div id="sitemapinfo">
		<br/>

		<h2 class="nav-tab-wrapper" id="wpseo-tabs">
			<a class="nav-tab" id="general-tab" href="#top#general"><?php _e( 'General', 'wordpress-seo' ); ?></a>
			<a class="nav-tab" id="user-sitemap-tab"
			   href="#top#user-sitemap"><?php _e( 'User sitemap', 'wordpress-seo' ); ?></a>
			<a class="nav-tab" id="post-types-tab"
			   href="#top#post-types"><?php _e( 'Post Types', 'wordpress-seo' ); ?></a>
			<a class="nav-tab" id="taxonomies-tab"
			   href="#top#taxonomies"><?php _e( 'Taxonomies', 'wordpress-seo' ); ?></a>
		</h2>

		<div id="general" class="wpseotab">
			<br/>
			<?php

			if ( $options['enablexmlsitemap'] === true ) {
				echo '<p>';
				printf( esc_html__( 'You can find your XML Sitemap here: %sXML Sitemap%s', 'wordpress-seo' ), '<a target="_blank" class="button-secondary" href="' . esc_url( wpseo_xml_sitemaps_base_url( 'sitemap_index.xml' ) ) . '">', '</a>' );
				echo '<br/>';
				echo '<br/>';
				_e( 'You do <strong>not</strong> need to generate the XML sitemap, nor will it take up time to generate after publishing a post.', 'wordpress-seo' );
				echo '</p>';
			} else {
				echo '<p>', __( 'Save your settings to activate XML Sitemaps.', 'wordpress-seo' ), '</p>';
			}
			?>

			<p>
				<strong style="font-size:110%;"><?php _e( 'Ping Search Engines', 'wordpress-seo' ); ?></strong><br/>
				<?php _e( 'After content publication, the plugin automatically pings Google and Bing, do you need it to ping other search engines too? If so, check the box:', 'wordpress-seo' ); ?>
			</p>
			<?php
			$wpseo_admin_pages->checkbox( 'xml_ping_yahoo', __( 'Ping Yahoo!', 'wordpress-seo' ), false );
			$wpseo_admin_pages->checkbox( 'xml_ping_ask', __( 'Ping Ask.com', 'wordpress-seo' ), false );
			?>

			<p>
				<strong style="font-size:110%;"><?php _e( 'Entries per page', 'wordpress-seo' ); ?></strong><br/>
				<?php printf( __( 'Please enter the maximum number of entries per sitemap page (defaults to %s, you might want to lower this to prevent memory issues on some installs):', 'wordpress-seo' ), WPSEO_Options::get_default( 'wpseo_xml', 'entries-per-page' ) ); ?>
			</p>

			<?php
			$wpseo_admin_pages->textinput( 'entries-per-page', __( 'Max entries per sitemap', 'wordpress-seo' ) );
			?>
		</div>

		<div id="user-sitemap" class="wpseotab">
			<br/>
			<?php
			$wpseo_admin_pages->checkbox( 'disable_author_sitemap', __( 'Disable author/user sitemap', 'wordpress-seo' ), false );
			?>
			<div id="xml_user_block">
				<p><strong><?php _e( 'Exclude users without posts', 'wordpress-seo' ); ?></strong><br/>
					<?php $wpseo_admin_pages->checkbox( 'disable_author_noposts', __( 'Disable all users with zero posts', 'wordpress-seo' ), false );

					$roles = WPSEO_Utils::get_roles();
					if ( is_array( $roles ) && $roles !== array() ) {
						echo '<p><strong>' . __( 'Exclude user roles', 'wordpress-seo' ) . '</strong><br/>';
						echo __( 'Please check the appropriate box below if there\'s a user role that you do <strong>NOT</strong> want to include in your sitemap:', 'wordpress-seo' ) . '</p>';
						foreach ( $roles as $role_key => $role_name ) {
							$wpseo_admin_pages->checkbox( 'user_role-' . $role_key . '-not_in_sitemap', $role_name );
						}
					} ?>
			</div>
		</div>

		<div id="post-types" class="wpseotab">

			<?php
			$post_types = apply_filters( 'wpseo_sitemaps_supported_post_types', get_post_types( array( 'public' => true ), 'objects' ) );
			if ( is_array( $post_types ) && $post_types !== array() ) {
				echo '<p>' . __( 'Please check the appropriate box below if there\'s a post type that you do <strong>NOT</strong> want to include in your sitemap:', 'wordpress-seo' ) . '</p>';
				foreach ( $post_types as $pt ) {
					$wpseo_admin_pages->checkbox( 'post_types-' . $pt->name . '-not_in_sitemap', $pt->labels->name . ' (<code>' . $pt->name . '</code>)' );
				}
			}

			?>

		</div>

		<div id="taxonomies" class="wpseotab">

			<?php
			$taxonomies = apply_filters( 'wpseo_sitemaps_supported_taxonomies', get_taxonomies( array( 'public' => true ), 'objects' ) );
			if ( is_array( $taxonomies ) && $taxonomies !== array() ) {
				echo '<p>' . __( 'Please check the appropriate box below if there\'s a taxonomy that you do <strong>NOT</strong> want to include in your sitemap:', 'wordpress-seo' ) . '</p>';
				foreach ( $taxonomies as $tax ) {
					if ( isset( $tax->labels->name ) && trim( $tax->labels->name ) != '' ) {
						$wpseo_admin_pages->checkbox( 'taxonomies-' . $tax->name . '-not_in_sitemap', $tax->labels->name . ' (<code>' . $tax->name . '</code>)' );
					}
				}
			}

			?>
		</div>
	</div>
<?php
do_action( 'wpseo_xmlsitemaps_config' );

$wpseo_admin_pages->admin_footer();
