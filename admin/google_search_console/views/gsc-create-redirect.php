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

$unique_id = md5( $url );
?>
<div id='redirect-<?php echo esc_attr( $unique_id ); ?>' style='display: none;'>
	<div class='form-wrap wpseo_content_wrapper'>
	<?php
	switch ( $view_type ) {
		case 'create' :
			echo '<h1 class="wpseo-redirect-url-title">', esc_html__( 'Redirect this broken URL and fix the error', 'wordpress-seo' ), '</h1>';
			?>
			<div class='form-field form-required'>
				<label for='wpseo-current-url-<?php echo esc_attr( $unique_id ); ?>'><?php esc_html_e( 'Current URL:', 'wordpress-seo' ); ?></label>
				<input type='text' id='wpseo-current-url-<?php echo esc_attr( $unique_id ); ?>' name='current_url' value='<?php echo esc_url( $url ); ?>' readonly />
			</div>
			<div class='form-field form-required'>
				<label for='wpseo-new-url-<?php echo esc_attr( $unique_id ); ?>'><?php esc_html_e( 'New URL:', 'wordpress-seo' ); ?></label>
				<input type='text' id='wpseo-new-url-<?php echo esc_attr( $unique_id ); ?>' name='new_url' value='' />
			</div>
			<div class='form-field form-required'>
				<label for='wpseo-mark-as-fixed-<?php echo esc_attr( $unique_id ); ?>' class='clear'><?php esc_html_e( 'Mark as fixed:', 'wordpress-seo' ); ?></label>
				<input type='checkbox' checked value='1' id='wpseo-mark-as-fixed-<?php echo esc_attr( $unique_id ); ?>' name='mark_as_fixed' class='clear' aria-describedby='wpseo-mark-as-fixed-desc-<?php echo esc_attr( $unique_id ); ?>' />
				<p id='wpseo-mark-as-fixed-desc-<?php echo esc_attr( $unique_id ); ?>'><?php
					/* Translators: %1$s: expands to 'Google Search Console'. */
					echo sprintf( esc_html__( 'Mark this issue as fixed in %1$s.', 'wordpress-seo' ), 'Google Search Console' );
					?></p>
			</div>
			<p class='submit'>
				<input type='button' name='submit' id='submit-<?php echo esc_attr( $unique_id ); ?>' class='button button-primary' value='<?php esc_html_e( 'Create redirect', 'wordpress-seo' ); ?>' onclick='wpseo_gsc_post_redirect( jQuery( this ) );' />
				<button type="button" class="button wpseo-redirect-close"><?php esc_html_e( 'Cancel', 'wordpress-seo' ); ?></button>
			</p>
			<?php
			break;

		case 'already_exists' :
			echo '<h1 class="wpseo-redirect-url-title">', esc_html__( 'Error: a redirect for this URL already exists', 'wordpress-seo' ), '</h1>';
			echo '<p>';

			/* Translators: %1$s: expands to the current URL and %2$s expands to URL the redirects points to. */
			echo sprintf(
				esc_html__( 'You do not have to create a redirect for URL %1$s because a redirect already exists. The existing redirect points to %2$s. If this is fine you can mark this issue as fixed. If not, please go to the redirects page and change the target URL.', 'wordpress-seo' ),
				esc_url( $url ),
				esc_url( $current_redirect )
			);
			echo '</p>';
			echo '<button type="button" class="button wpseo-redirect-close">' . esc_html__( 'Close', 'wordpress-seo' ) . '</button>';
			break;

		case 'no_premium' :
			/* Translators: %s: expands to Yoast SEO Premium */
			echo '<h1 class="wpseo-redirect-url-title">', sprintf( esc_html__( 'Creating redirects is a %s feature', 'wordpress-seo' ), 'Yoast SEO Premium' ), '</h1>';
			echo '<p>';
			/* Translators: %1$s: expands to 'Yoast SEO Premium', %2$s: links to Yoast SEO Premium plugin page. */
			echo sprintf(
				esc_html__( 'To be able to create a redirect and fix this issue, you need %1$s. You can buy the plugin, including one year of support and updates, on %2$s.', 'wordpress-seo' ),
				'Yoast SEO Premium',
				'<a href="https://yoa.st/redirects" target="_blank">yoast.com</a>'
			);
			echo '</p>';
			echo '<button type="button" class="button wpseo-redirect-close">' . esc_html__( 'Close', 'wordpress-seo' ) . '</button>';
			break;
	}
	?>
	</div>
</div>
