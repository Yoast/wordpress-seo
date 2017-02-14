<?php
/**
 * @package WPSEO\Admin|Google_Search_Console
 *
 * This is the view for the modal box that appears when the create redirect link is clicked
 */

/**
 * @var string         $view_type        The type of view to be displayed, can be 'create', 'already_exists', 'no_premium'
 * @var WPSEO_Redirect $current_redirect The existing redirect
 * @var string         $url              Redirect for URL
 */

$unique_id = md5( $url );
?>
	<h1 class="wpseo-redirect-url-title"><?php esc_html_e( 'Redirect this broken URL and fix the error', 'wordpress-seo-premium' ); ?></h1>

	<div class='form-field form-required'>
		<label for='wpseo-current-url-<?php echo $unique_id; ?>'><?php esc_html_e( 'Current URL:', 'wordpress-seo-premium' ); ?></label>
		<input type='text' id='wpseo-current-url-<?php echo $unique_id; ?>' name='current_url' value='<?php echo esc_attr( $url ); ?>' readonly />
	</div>
	<div class='form-field form-required'>
		<label for='wpseo-new-url-<?php echo $unique_id; ?>'><?php esc_html_e( 'New URL:', 'wordpress-seo-premium' ); ?></label>
		<input type='text' id='wpseo-new-url-<?php echo $unique_id; ?>' name='new_url' value='' />
	</div>
	<div class='form-field form-required'>
		<label for='wpseo-mark-as-fixed-<?php echo $unique_id; ?>' class='clear'><?php esc_html_e( 'Mark as fixed:', 'wordpress-seo-premium' ); ?></label>
		<input type='checkbox' checked value='1' id='wpseo-mark-as-fixed-<?php echo $unique_id; ?>' name='mark_as_fixed' class='clear' aria-describedby='wpseo-mark-as-fixed-desc-<?php echo $unique_id; ?>' />
		<p id='wpseo-mark-as-fixed-desc-<?php echo $unique_id; ?>'><?php
			/* Translators: %1$s: expands to 'Google Search Console'. */
			echo esc_html( sprintf( __( 'Mark this issue as fixed in %1$s.', 'wordpress-seo-premium' ), 'Google Search Console' ) );
			?></p>
	</div>
	<p class='submit'>
		<input type='button' name='submit' id='submit-<?php echo $unique_id; ?>' class='button button-primary' value='<?php esc_attr_e( 'Create redirect', 'wordpress-seo-premium' ); ?>' onclick='wpseo_gsc_post_redirect( jQuery( this ) );' />
		<button type="button" class="button wpseo-redirect-close"><?php esc_html_e( 'Cancel', 'wordpress-seo-premium' ); ?></button>
	</p>
