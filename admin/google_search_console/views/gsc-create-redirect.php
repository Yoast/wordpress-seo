<?php
/**
 * @package WPSEO\Admin|Google_Search_Console
 *
 * This is the view for the modal box that appears when the create redirect link is clicked
 */

/**
 * @var string $view_type 		 The type of view to be displayed, can be 'create', 'already_exists', 'no_premium'
 * @var string $current_redirect The existing redirect
 * @var string $url 		     Redirect for URL
 */

?>
<div id='redirect-<?php echo md5( $url ); ?>' style='display: none;'>
	<form>
		<div class='form-wrap'>
			<h3><?php _e( 'Create a redirect', 'wordpress-seo' ); ?></h3>

			<?php
			switch ( $view_type ) {
				case 'create' :
				?>
					<div class='form-field form-required'>
						<label><?php _e( 'Current URL:', 'wordpress-seo' ); ?></label>
						<input type='text' name='current_url' value='<?php echo $url; ?>' disabled='disabled' />
					</div>
					<div class='form-field form-required'>
						<label><?php _e( 'New URL:', 'wordpress-seo' ); ?></label>
						<input type='text' name='new_url' value='' />
					</div>
					<div class='form-field form-required'>
						<label class='clear'><?php _e( 'Mark as fixed:', 'wordpress-seo' ); ?></label>
						<input type='checkbox' value='1' name="mark_as_fixed" class='clear'  />
						<p><?php
							/* Translators: %1$s: expands to 'Google Search Console'. */
							echo sprintf( __( 'Mark this issue as fixed in %1$s.', 'wordpress-seo' ), 'Google Search Console' );
							?></p>
					</div>
					<p class='submit'>
						<input type='button' name='submit' id='submit' class='button button-primary' value='<?php _e( 'Save redirect', 'wordpress-seo' ); ?>' onclick='javascript:wpseo_gsc_post_redirect( jQuery( this ) );' />
					</p>
			<?php
					break;

				case 'already_exists' :
					echo '<p>';

					/* Translators: %1$s: expands to the current url and %1$s expands to url the redirects points to. */
					echo sprintf(
						__( 'You do not have to create a redirect for URL %1$s because a redirect already exists. The existing redirect points to %2$s. If this is fine you can mark this issue as fixed. If not, please go to the redirects page and change the target URL.', 'wordpress-seo' ),
						$url,
						$current_redirect
					);
					echo '</p>';
					break;

				case 'no_premium' :
					echo '<p>';
					/* Translators: %1$s: expands to 'Yoast SEO Premium', %2$s / %3$s: links to Yoast SEO Premium plugin page. */
					echo sprintf(
						__( 'To be able to create a redirect and fix this issue, you need %1$s. You can buy the plugin, including one year support and updates, on %2$sYoast.com%3$s.'),
						'Yoast SEO Premium',
						'<a href="https://yoast.com/wordpress/plugins/seo-premium/" target="_blank">',
						'</a>'
					);
					echo '</p>';
					break;
			}
			?>

		</div>
	</form>
</div>
