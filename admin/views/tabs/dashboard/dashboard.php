<?php
/**
 * @package WPSEO\Admin
 */

/** @noinspection PhpUnusedLocalVariableInspection */
$alerts_data = Yoast_Alerts::get_template_variables();

?>
<div class="wrap yoast-alerts">

	<h1><?php
		/* translators: %1$s expands to Yoast SEO */
		printf( __( '%1$s Dashboard', 'wordpress-seo' ), 'Yoast SEO' );
		?></h1>
	<div class="yoast-container yoast-container__alert">
		<?php include WPSEO_PATH . 'admin/views/partial-alerts-errors.php'; ?>
	</div>

	<div class="yoast-container yoast-container__warning">
		<?php include WPSEO_PATH . 'admin/views/partial-alerts-warnings.php'; ?>
	</div>

</div>
