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

			<div class='form-field form-required'>
				<label><?php _e( 'Current URL:', 'wordpress-seo-premium' ); ?></label>
				<input type='text' value='<?php echo $url; ?>' disabled='disabled' />
				<p><?php _e( 'The URL that have to be redirected to a new destination.', 'wordpress-seo-premium' ); ?></p>
			</div>
			<div class='form-field form-required'>
				<label><?php _e( 'Target URL:', 'wordpress-seo-premium' ); ?></label>
				<input type='text' value='' />
				<p><?php _e( 'The target location to where the redirect will point to.', 'wordpress-seo-premium' ); ?></p>
			</div>
			<div class='form-field form-required'>
				<label class='clear'><?php _e( 'Mark as fixed:', 'wordpress-seo-premium' ); ?></label>
				<input type='checkbox' value='1' name="mark_as_fixed" class='clear'  />
				<p><?php _e( 'The target location to where the redirect will point to.', 'wordpress-seo-premium' ); ?></p>
			</div>
			<p class='submit'>
				<input type='submit' name='submit' id='submit' class='button button-primary' value='<?php _e( 'Save redirect', 'wordpress-seo-premium' ); ?>' />
			</p>
		</div>
	</form>
</div>