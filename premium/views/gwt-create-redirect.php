<?php
/**
 * @package WPSEO\Premium\Classes
 *
 * This is the view for the modal box that appears when the create redirect link is clicked
 */

?>
<div id='redirect-<?php echo md5( $url ); ?>' style='display: none;'>
	<form>
		<div class='form-wrap'>
			<h3><?php _e( 'Create a redirect', 'wordpress-seo-premium' ); ?></h3>

			<?php
			switch ( $view_type ) {
				case 'create' :
				?>
					<div class='form-field form-required'>
						<label><?php _e( 'Current URL:', 'wordpress-seo-premium' ); ?></label>
						<input type='text' name='current_url' value='<?php echo $url; ?>' disabled='disabled' />
					</div>
					<div class='form-field form-required'>
						<label><?php _e( 'New URL:', 'wordpress-seo-premium' ); ?></label>
						<input type='text' name='new_url' value='' />
					</div>
					<div class='form-field form-required'>
						<label class='clear'><?php _e( 'Mark as fixed:', 'wordpress-seo-premium' ); ?></label>
						<input type='checkbox' value='1' name="mark_as_fixed" class='clear'  />
						<p><?php echo sprintf( __( 'Mark this issue as fixed in %1$s.', 'wordpress-seo-premium' ), 'Google Search Console' ); ?></p>
					</div>
					<p class='submit'>
						<input type='button' name='submit' id='submit' class='button button-primary' value='<?php _e( 'Save redirect', 'wordpress-seo-premium' ); ?>' onclick='javascript:wpseo_gwt_post_redirect( jQuery( this ) );' />
					</p>
			<?php
					break;

				case 'already_exists' :
					echo '<p>';
					echo sprintf(
						__( 'You do not have to create a redirect for URL %1$s because this one already exists. The existing redirect is refering to the URL %2$s. If this endpoint is fine you can mark this issue as fixed. Otherwise you have to change it on the redirects page.', 'wordpress-seo' ),
						$url,
						$current_redirect
					);
					echo '</p>';
					break;

				case 'no_premium' :
					echo '<p>';
					echo sprintf(
						__( 'You have to install WordPress SEO by Yoast Premium in order to save redirects.', 'wordpress-seo' ),
						$url,
						$current_redirect
					);
					echo '</p>';
					break;
			}
			?>

		</div>
	</form>
</div>