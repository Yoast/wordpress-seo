<?php
/**
 * @package WPSEO\Admin\Views
 */

if ( ! defined( 'WPSEO_VERSION' ) ) {
	header( 'Status: 403 Forbidden' );
	header( 'HTTP/1.1 403 Forbidden' );
	exit();
}

if ( get_user_meta( get_current_user_id(), 'wpseo_ignore_tour' ) ) :
	?>
	<p>
		<strong><?php _e( 'Introduction Tour', 'wordpress-seo' ); ?></strong><br/>
		<?php _e( 'Take this tour to quickly learn about the use of this plugin.', 'wordpress-seo' ); ?>
	</p>
	<p>
		<a class="button-secondary"
		   href="<?php echo esc_url( admin_url( 'admin.php?page=wpseo_dashboard&wpseo_restart_tour=1' ) ); ?>"><?php _e( 'Start Tour', 'wordpress-seo' ); ?></a>
	</p>

	<br/>
	<?php
endif;
?>

<p>
	<strong><?php _e( 'Latest Changes', 'wordpress-seo' ); ?></strong><br/>
	<?php
	/* translators: %s expands to Yoast SEO */
	printf( __( 'We\'ve summarized the most recent changes in %s.', 'wordpress-seo' ), 'Yoast SEO' );
	?>
</p>
<p>
	<a class="button-secondary"
	   href="<?php echo esc_url( admin_url( 'admin.php?page=wpseo_dashboard&intro=1' ) ); ?>"><?php _e( 'View Changes', 'wordpress-seo' ); ?></a>
</p>

<br/>

<p>
	<strong><?php _e( 'Restore Default Settings', 'wordpress-seo' ); ?></strong><br/>
	<?php
	/* translators: %s expands to Yoast SEO */
	printf( __( 'If you want to restore a site to the default %s settings, press this button.', 'wordpress-seo' ), 'Yoast SEO' );
	?>
</p>

<p>
	<a onclick="if( !confirm('<?php _e( 'Are you sure you want to reset your SEO settings?', 'wordpress-seo' ); ?>') ) return false;"
	   class="button"
	   href="<?php echo esc_url( add_query_arg( array( 'nonce' => wp_create_nonce( 'wpseo_reset_defaults' ) ), admin_url( 'admin.php?page=wpseo_dashboard&wpseo_reset_defaults=1' ) ) ); ?>"><?php _e( 'Restore Default Settings', 'wordpress-seo' ); ?></a>
</p>
