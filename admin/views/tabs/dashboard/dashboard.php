<?php
/**
 * @package WPSEO\Admin
 */

/** @noinspection PhpUnusedLocalVariableInspection */
$alerts_data = Yoast_Alerts::get_template_variables();

$options  = WPSEO_Options::get_options( array( 'wpseo' ) );
$notifier = new WPSEO_Configuration_Notifier( $options );
$notifier->listen();
?>
<div class="yoast-alerts">

	<h2><?php
		/* translators: %1$s expands to Yoast SEO */
		printf( __( '%1$s Dashboard', 'wordpress-seo' ), 'Yoast SEO' );
		?></h2>

	<?php echo $notifier->notify(); ?>

	<div class="yoast-container yoast-container__alert">
		<?php require WPSEO_PATH . 'admin/views/partial-alerts-errors.php'; ?>
	</div>

	<div class="yoast-container yoast-container__warning">
		<?php require WPSEO_PATH . 'admin/views/partial-alerts-warnings.php'; ?>
	</div>

</div>
