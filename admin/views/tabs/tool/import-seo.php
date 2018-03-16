<?php
/**
 * @package WPSEO\Admin\Views
 */

/**
 * @var Yoast_Form                    $yform
 * @var WPSEO_Import_Plugins_Detector $import_check
 */

if ( ! defined( 'WPSEO_VERSION' ) ) {
	header( 'Status: 403 Forbidden' );
	header( 'HTTP/1.1 403 Forbidden' );
	exit();
}

// Determine if we have plugins we can import from. If so, load that tab. Otherwise, load an empty tab.
$import_check = new WPSEO_Import_Plugins_Detector();
$import_check->detect();
if ( count( $import_check->needs_import ) === 0 ) {
	echo '<h2>', esc_html__( 'Import from other SEO plugins', 'wordpress-seo' ), '</h2>';
	echo '<p>';
	esc_html_e( 'Yoast SEO did not detect any plugin data from plugins it can import from.', 'wordpress-seo' );
	echo '</p>';

	return;
}

/**
 * Creates a select box given a name and plugins array.
 *
 * @param string $name    Name field for the select field.
 * @param array  $plugins An array of plugins and classes.
 *
 * @return void
 */
function wpseo_import_external_select( $name, $plugins ) {
	_e( 'Plugin: ', 'wordpress-seo' );
	echo '<select name="', $name, '">';
	foreach ( $plugins as $class => $plugin ) {
		/* translators: %s is replaced with the name of the plugin we're importing from. */
		echo '<option value="' . $class . '">' . esc_html( $plugin ) . '</option>';
	}
	echo '</select>';
}

?>
<h2><?php esc_html_e( 'Import from other SEO plugins', 'wordpress-seo' ); ?></h2>
<p>
	<?php esc_html_e( 'We\'ve detected data from one or more SEO plugins on your site. Please follow the following steps to import that data:', 'wordpress-seo' ); ?>
</p>

<div class="tab-block">
	<h3><?php esc_html_e( 'Step 1: Create a backup', 'wordpress-seo' ); ?></h3>
	<p>
		<?php esc_html_e( 'Please make a backup of your database before starting this process.', 'wordpress-seo' ); ?>
	</p>
</div>

<div class="tab-block">
	<h3><?php _e( 'Step 2: Import', 'wordpress-seo' ); ?></h3>
	<p>
		<?php esc_html_e( 'This will import the post metadata like SEO titles and descriptions into your Yoast SEO metadata. It will only do this when there is no existing Yoast SEO metadata yet. The original data will remain in place.', 'wordpress-seo' ); ?>
	</p>
	<form action="<?php echo esc_url( admin_url( 'admin.php?page=wpseo_tools&tool=import-export#top#import-seo' ) ); ?>"
		  method="post" accept-charset="<?php echo esc_attr( get_bloginfo( 'charset' ) ); ?>">
		<?php
		wp_nonce_field( 'wpseo-import-plugins', '_wpnonce', true, true );
		wpseo_import_external_select( 'import_external_plugin', $import_check->needs_import );
		?>
		<?php
		do_action( 'wpseo_import_other_plugins' );
		?>
		<input type="submit" class="button button-primary" name="import_external"
			   value="<?php esc_attr_e( 'Import', 'wordpress-seo' ); ?>"/>
	</form>
</div>

<div class="tab-block">
	<h3><?php esc_html_e( 'Step 3: Check your data', 'wordpress-seo' ); ?></h3>
	<p>
		<?php esc_html_e( 'Please check your posts and pages and see if the metadata was successfully imported.', 'wordpress-seo' ); ?>
	</p>
</div>

<div class="tab-block">
	<h3><?php esc_html_e( 'Step 4: Run the configuration wizard', 'wordpress-seo' ); ?></h3>
	<p>
		<?php
			printf( esc_html__( 'You should run the configuration wizard, from the SEO &rarr; General &rarr; Dashboard page, to make sure all the settings for your site are correct.', 'wordpress-seo' ), '<a href="' . admin_url( 'admin.php?page=wpseo_dashboard' ) . '">','</a>' );
		?>
	</p>
</div>

<div class="tab-block">
	<h3><?php esc_html_e( 'Step 5: Clean up', 'wordpress-seo' ); ?></h3>
	<p>
		<?php esc_html_e( 'Once you\'re certain your site is OK, you can clean up. This will remove all the original data.', 'wordpress-seo' ); ?>
	</p>
	<form action="<?php echo esc_url( admin_url( 'admin.php?page=wpseo_tools&tool=import-export#top#import-seo' ) ); ?>"
		  method="post" accept-charset="<?php echo esc_attr( get_bloginfo( 'charset' ) ); ?>">
		<?php
		wp_nonce_field( 'wpseo-clean-plugins', '_wpnonce', true, true );
		wpseo_import_external_select( 'clean_external_plugin', $import_check->needs_import );
		?>
		<input type="submit" class="button button-primary" name="clean_external"
			   value="<?php esc_attr_e( 'Clean', 'wordpress-seo' ); ?>"/>
	</form>
</div>
