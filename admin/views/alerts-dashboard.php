<?php
/**
 * @package WPSEO\Admin
 */

?>
<div class="wrap yoast-alerts">

	<h1><?php
		/* translators: %1$s expands to Yoast SEO */
		printf( __( '%1$s Dashboard', 'wordpress-seo' ), 'Yoast SEO' );
		?></h1>
	<div class="yoast-container yoast-container__alert">
		<?php include 'partial-alerts-errors.php'; ?>
	</div>

	<div class="yoast-container yoast-container__warning">
		<?php include 'partial-alerts-warnings.php'; ?>
	</div>

</div>
