<?php
/**
 * @package WPSEO\Admin\Views
 */

if ( ! defined( 'WPSEO_VERSION' ) ) {
	header( 'Status: 403 Forbidden' );
	header( 'HTTP/1.1 403 Forbidden' );
	exit();
}

$features = array(
	(object) array(
		'name'    => __( 'Advanced settings pages', 'wordpress-seo' ),
		'setting' => 'enable_setting_pages',
		'label'   => __( 'Enable the advanced settings pages', 'wordpress-seo' ),
	),
	(object) array(
		'name'    => __( 'OnPage.org', 'wordpress-seo' ),
		'setting' => 'onpage_indexability',
		/* translators: %1$s expands to OnPage.org */
		'label'   => sprintf( __( '%1$s indexability check', 'wordpress-seo' ), 'OnPage.org' ),
	),
);

?>

<?php foreach ( $features as $feature ) : ?>

<h2><?php echo esc_html( $feature->name ); ?></h2>
<p>
	<?php
		$yform->toggle_switch(
			$feature->setting,
			array(
				'on'  => __( 'Enabled', 'wordpress-seo' ),
				'off' => __( 'Disabled', 'wordpress-seo' ),
			),
			$feature->label
		);
	?>
</p>
<br />

<?php endforeach; ?>
