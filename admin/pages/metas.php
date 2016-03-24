<?php
/**
 * @package WPSEO\Admin
 */

if ( ! defined( 'WPSEO_VERSION' ) ) {
	header( 'Status: 403 Forbidden' );
	header( 'HTTP/1.1 403 Forbidden' );
	exit();
}

$options = WPSEO_Options::get_options( array( 'wpseo_titles', 'wpseo_permalinks', 'wpseo_internallinks' ) );


$yform = Yoast_Form::get_instance();
$yform->admin_header( true, 'wpseo_titles' );
?>

	<h2 class="nav-tab-wrapper" id="wpseo-tabs">
		<a class="nav-tab" id="general-tab" href="#top#general"><?php _e( 'General', 'wordpress-seo' ); ?></a>
		<a class="nav-tab" id="home-tab" href="#top#home"><?php _e( 'Homepage', 'wordpress-seo' ); ?></a>
		<a class="nav-tab" id="post_types-tab" href="#top#post_types"><?php _e( 'Post Types', 'wordpress-seo' ); ?></a>
		<a class="nav-tab" id="taxonomies-tab" href="#top#taxonomies"><?php _e( 'Taxonomies', 'wordpress-seo' ); ?></a>
		<a class="nav-tab" id="archives-tab" href="#top#archives"><?php _e( 'Archives', 'wordpress-seo' ); ?></a>
		<a class="nav-tab" id="other-tab" href="#top#other"><?php _e( 'Other', 'wordpress-seo' ); ?></a>
	</h2>

	<div class="tabwrapper">
		<div id="general" class="wpseotab">
			<?php
			if ( ! current_theme_supports( 'title-tag' ) ) {
				$yform->light_switch( 'forcerewritetitle', __( 'Force rewrite titles', 'wordpress-seo' ) );
				echo '<p class="description">', sprintf( __( '%1$s has auto-detected whether it needs to force rewrite the titles for your pages, if you think it\'s wrong and you know what you\'re doing, you can change the setting here.', 'wordpress-seo' ), 'Yoast SEO' ) . '</p>';
			}
			?>
			<table class="form-table">
				<tr>
					<th>
						<?php _e( 'Title Separator', 'wordpress-seo' ); ?>
					</th>
					<td>
						<?php
						$yform->radio( 'separator', WPSEO_Option_Titles::get_instance()->get_separator_options(), '' );
						echo '<p class="description">', __( 'Choose the symbol to use as your title separator. This will display, for instance, between your post title and site name.', 'wordpress-seo' ), ' ', __( 'Symbols are shown in the size they\'ll appear in in search results.', 'wordpress-seo' ), '</p>';
						?>
					</td>
				</tr>
			</table>
		</div>
		<div id="home" class="wpseotab">
			<?php
			if ( 'posts' == get_option( 'show_on_front' ) ) {
				echo '<div id="homepage-titles-metas">';
				echo '<p><strong>', __( 'Homepage', 'wordpress-seo' ), '</strong><br/>';
				$yform->textinput( 'title-home-wpseo', __( 'Title template', 'wordpress-seo' ), 'template homepage-template' );
				$yform->textarea( 'metadesc-home-wpseo', __( 'Meta description template', 'wordpress-seo' ), array( 'class' => 'template homepage-template' ) );
				if ( $options['usemetakeywords'] === true ) {
					$yform->textinput( 'metakey-home-wpseo', __( 'Meta keywords template', 'wordpress-seo' ) );
				}
				echo '</p>';
				echo '</div>';
			}
			else {
				echo '<p><strong>', __( 'Homepage &amp; Front page', 'wordpress-seo' ), '</strong><br/>';
				printf( __( 'You can determine the title and description for the front page by %sediting the front page itself &raquo;%s', 'wordpress-seo' ), '<a href="' . esc_url( get_edit_post_link( get_option( 'page_on_front' ) ) ) . '">', '</a>' );
				echo '</p>';
				if ( get_option( 'page_for_posts' ) > 0 ) {
					echo '<p>', sprintf( __( 'You can determine the title and description for the blog page by %sediting the blog page itself &raquo;%s', 'wordpress-seo' ), '<a href="' . esc_url( get_edit_post_link( get_option( 'page_for_posts' ) ) ) . '">', '</a>' ), '</p>';
				}
			}
			?>
		</div>
		<div id="post_types" class="wpseotab">
			<?php
			$post_types = get_post_types( array( 'public' => true ), 'objects' );
			$index_switch_values = array(
				'off' => '<code>index</code>',
				'on'  => '<code>noindex</code>',
			);
			if ( is_array( $post_types ) && $post_types !== array() ) {
				foreach ( $post_types as $pt ) {
					$warn = false;
					if ( $options['redirectattachment'] === true && $pt->name == 'attachment' ) {
						echo '<div class="wpseo-warning">';
						$warn = true;
					}
					$name = $pt->name;
					echo "<div id='" . esc_attr( $name ) . "-titles-metas'>";
					echo '<strong id="' . esc_attr( $name ) . '">' . esc_html( ucfirst( $pt->labels->name ) ) . '</strong><br/>';
					if ( $warn === true ) {
						echo '<h4 class="error-message">' . __( 'Take note:', 'wordpress-seo' ) . '</h4>';
						echo '<p class="error-message">' . __( 'As you are redirecting attachment URLs to parent post URLs, these settings will currently only have an effect on <strong>unattached</strong> media items!', 'wordpress-seo' ) . '</p>';
						echo '<p class="error-message">' . sprintf( __( 'So remember: If you change the %sattachment redirection setting%s in the future, the below settings will take effect for *all* media items.', 'wordpress-seo' ), '<a href="' . esc_url( admin_url( 'admin.php?page=wpseo_advanced&tab=permalinks' ) ) . '">', '</a>' ) . '</p>';
					}
					$yform->textinput( 'title-' . $name, __( 'Title template', 'wordpress-seo' ), 'template posttype-template' );
					$yform->textarea( 'metadesc-' . $name, __( 'Meta description template', 'wordpress-seo' ), array( 'class' => 'template posttype-template' ) );
					if ( $options['usemetakeywords'] === true ) {
						$yform->textinput( 'metakey-' . $name, __( 'Meta keywords template', 'wordpress-seo' ) );
					}
					$yform->toggle_switch( 'noindex-' . $name, $index_switch_values, __( 'Meta Robots', 'wordpress-seo' ) );
					$yform->toggle_switch( 'showdate-' . $name, array(
						'on'  => __( 'Show', 'wordpress-seo' ),
						'off' => __( 'Hide', 'wordpress-seo' ),
					), __( 'Date in Snippet Preview', 'wordpress-seo' ) );
					$yform->toggle_switch( 'hideeditbox-' . $name, array(
						'off' => __( 'Show', 'wordpress-seo' ),
						'on'  => __( 'Hide', 'wordpress-seo' ),
						/* translators: %1$s expands to Yoast SEO */
					), sprintf( __( '%1$s Meta Box', 'wordpress-seo' ), 'Yoast SEO' ) );
					echo '</div>';
					/**
					 * Allow adding a custom checkboxes to the admin meta page - Post Types tab
					 * @api  WPSEO_Admin_Pages  $yform  The WPSEO_Admin_Pages object
					 * @api  String  $name  The post type name
					 */
					do_action( 'wpseo_admin_page_meta_post_types', $yform, $name );
					echo '<br/><br/>';
					if ( $warn === true ) {
						echo '</div>';
					}
					unset( $warn );
				}
				unset( $pt );
			}
			unset( $post_types );
			$post_types = get_post_types( array( '_builtin' => false, 'has_archive' => true ), 'objects' );
			if ( is_array( $post_types ) && $post_types !== array() ) {
				echo '<h2>' . __( 'Custom Post Type Archives', 'wordpress-seo' ) . '</h2>';
				echo '<p>' . __( 'Note: instead of templates these are the actual titles and meta descriptions for these custom post type archive pages.', 'wordpress-seo' ) . '</p>';
				foreach ( $post_types as $pt ) {
					$name = $pt->name;
					echo '<strong>' . esc_html( ucfirst( $pt->labels->name ) ) . '</strong><br/>';
					$yform->textinput( 'title-ptarchive-' . $name, __( 'Title', 'wordpress-seo' ), 'template posttype-template' );
					$yform->textarea( 'metadesc-ptarchive-' . $name, __( 'Meta description', 'wordpress-seo' ), array( 'class' => 'template posttype-template' ) );
					if ( $options['usemetakeywords'] === true ) {
						$yform->textinput( 'metakey-ptarchive-' . $name, __( 'Meta keywords', 'wordpress-seo' ) );
					}
					if ( $options['breadcrumbs-enable'] === true ) {
						$yform->textinput( 'bctitle-ptarchive-' . $name, __( 'Breadcrumbs title', 'wordpress-seo' ) );
					}
					$yform->toggle_switch( 'noindex-ptarchive-' . $name, $index_switch_values, __( 'Meta Robots', 'wordpress-seo' ) );

					echo '<br/><br/>';
				}
				unset( $pt );
			}
			unset( $post_types );
			?>
		</div>
		<div id="taxonomies" class="wpseotab">
			<?php
			$taxonomies = get_taxonomies( array( 'public' => true ), 'objects' );
			if ( is_array( $taxonomies ) && $taxonomies !== array() ) {
				foreach ( $taxonomies as $tax ) {
					// Explicitly hide all the core taxonomies we never want to do stuff for.
					if ( in_array( $tax->name, array( 'link_category', 'nav_menu', 'post_format' ) ) ) {
						continue;
					}

					echo '<h4>' . esc_html( ucfirst( $tax->labels->name ) ) . '</h4>';
					if ( $tax->name === 'post_format' ) {
						$yform->light_switch(
							'disable-post_format',
							__( 'Format-based archives', 'wordpress-seo' ),
							array( __( 'Enabled', 'wordpress-seo' ), __( 'Disabled', 'wordpress-seo' ) ),
							false
						);
					}
					echo "<div id='" . esc_attr( $tax->name ) . "-titles-metas'>";
					$yform->textinput( 'title-tax-' . $tax->name, __( 'Title template', 'wordpress-seo' ), 'template taxonomy-template' );
					$yform->textarea( 'metadesc-tax-' . $tax->name, __( 'Meta description template', 'wordpress-seo' ), array( 'class' => 'template taxonomy-template' ) );
					if ( $options['usemetakeywords'] === true ) {
						$yform->textinput( 'metakey-tax-' . $tax->name, __( 'Meta keywords template', 'wordpress-seo' ) );
					}
					$yform->toggle_switch( 'noindex-tax-' . $tax->name, $index_switch_values, __( 'Meta Robots', 'wordpress-seo' ) );
					if ( $tax->name !== 'post_format' ) {
						/* translators: %1$s expands to Yoast SEO */
						$yform->toggle_switch( 'hideeditbox-tax-' . $tax->name,
							array(
								'off' => __( 'Show', 'wordpress-seo' ),
								'on'  => __( 'Hide', 'wordpress-seo' ),
								/* translators: %1$s expands to Yoast SEO */
							), sprintf( __( '%1$s Meta Box', 'wordpress-seo' ), 'Yoast SEO' ) );
					}
					echo '<br/><br/>';
					echo '</div>';
				}
				unset( $tax );
			}
			unset( $taxonomies );
			?>
		</div>
		<div id="archives" class="wpseotab">
			<?php
			echo "<div id='author-archives-titles-metas'>";
			echo '<h3>' . __( 'Author archives', 'wordpress-seo' ) . '</h3>';
			$yform->textinput( 'title-author-wpseo', __( 'Title template', 'wordpress-seo' ), 'template author-template' );
			$yform->textarea( 'metadesc-author-wpseo', __( 'Meta description template', 'wordpress-seo' ), array( 'class' => 'template author-template' ) );
			if ( $options['usemetakeywords'] === true ) {
				$yform->textinput( 'metakey-author-wpseo', __( 'Meta keywords template', 'wordpress-seo' ) );
			}
			echo '</div>';
			echo "<div id='date-archives-titles-metas'>";
			echo '<h3>' . __( 'Date archives', 'wordpress-seo' ) . '</h3>';
			$yform->textinput( 'title-archive-wpseo', __( 'Title template', 'wordpress-seo' ), 'template date-template' );
			$yform->textarea( 'metadesc-archive-wpseo', __( 'Meta description template', 'wordpress-seo' ), array( 'class' => 'template date-template' ) );
			echo '</div>';
			echo '<br/>';
			echo '<div id="duplicate-content-prevention">';
			echo '<h3>' . __( 'Author archives', 'wordpress-seo' ) . '</h3>';
			$yform->toggle_switch( 'disable-author', array(
				'off' => __( 'Enabled', 'wordpress-seo' ),
				'on'  => __( 'Disabled', 'wordpress-seo' ),
			), __( 'Author archives', 'wordpress-seo' ) );
			$yform->toggle_switch( 'noindex-author-wpseo', $index_switch_values, __( 'Meta Robots', 'wordpress-seo' ) );
			echo '<p>';
			/* translators: %1$s / %2$s: links to an article about duplicate content on yoast.com */
			printf( __( 'If you\'re running a one author blog, the author archive will be exactly the same as your homepage. This is what\'s called a %1$sduplicate content problem%2$s.', 'wordpress-seo' ), '<a href="https://yoast.com/articles/duplicate-content/">', '</a>' );
			echo ' ';
			/* translators: %s expands to <code>noindex, follow</code> */
			printf( __( 'If this is the case on your site, you can choose to either disable it (which makes it redirect to the homepage), or to add %s to it so it doesn\'t show up in the search results.', 'wordpress-seo' ), '<code>noindex,follow</code>' );
			echo '</p>';
			echo '<h3>' . __( 'Date-based archives', 'wordpress-seo' ) . '</h3>';
			$yform->toggle_switch( 'disable-date', array(
				'off' => __( 'Enabled', 'wordpress-seo' ),
				'on'  => __( 'Disabled', 'wordpress-seo' ),
			), __( 'Date-based archives', 'wordpress-seo' ) );
			$yform->toggle_switch( 'noindex-archive-wpseo', $index_switch_values, __( 'Meta Robots', 'wordpress-seo' ) );
			echo '<p>';
			_e( 'Date-based archives could in some cases also be seen as duplicate content.', 'wordpress-seo' );
			echo '</p>';
			echo '</div>';
			echo '<br/>';
			echo '<div id="special-pages-titles-metas">';
			echo '<h2>' . __( 'Special Pages', 'wordpress-seo' ) . '</h2>';
			/* translators: %s expands to <code>noindex, follow</code> */
			echo '<p>' . sprintf( __( 'These pages will be %s by default, so they will never show up in search results.', 'wordpress-seo' ), '<code>noindex, follow</code>' ) . '</p>';
			echo '<p><strong>' . __( 'Search pages', 'wordpress-seo' ) . '</strong><br/>';
			$yform->textinput( 'title-search-wpseo', __( 'Title template', 'wordpress-seo' ), 'template search-template' );
			echo '</p>';
			echo '<p><strong>' . __( '404 pages', 'wordpress-seo' ) . '</strong><br/>';
			$yform->textinput( 'title-404-wpseo', __( 'Title template', 'wordpress-seo' ), 'template error404-template' );
			echo '</p>';
			echo '</div>';
			echo '<br class="clear"/>';
			?>
		</div>
		<div id="other" class="wpseotab">
			<h3><?php _e( 'Sitewide meta settings', 'wordpress-seo' ); ?></h3>
			<?php
			$yform->toggle_switch( 'noindex-subpages-wpseo', $index_switch_values, __( 'Subpages of archives', 'wordpress-seo' ) );
			echo '<p>', __( 'If you want to prevent /page/2/ and further of any archive to show up in the search results, set this to "noindex".', 'wordpress-seo' ), '</p>';

			$yform->light_switch( 'usemetakeywords', __( 'Use meta keywords tag?', 'wordpress-seo' ) );
			echo '<p>', __( 'I don\'t know why you\'d want to use meta keywords, but if you want to, enable this.', 'wordpress-seo' ), '</p>';

			/* translators: %s expands to <code>noodp</code> */
			$yform->light_switch( 'noodp', sprintf( __( 'Force %s meta robots tag sitewide', 'wordpress-seo' ), '<code>noodp</code>' ) );
			echo '<p>', __( 'Prevents search engines from using the DMOZ description for all pages from this site in the search results. Pages with descriptions will have the tag regardless of this setting.', 'wordpress-seo' ), '</p>';
			?>
		</div>

	</div>
<?php
$yform->admin_footer();
