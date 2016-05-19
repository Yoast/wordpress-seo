<?php

/**
 * Use Notification Center to create an overview of alerts
 */

$yoast_alerts = Yoast_Alerts::get_instance();
$alerts_data = $yoast_alerts->get_template_variables();

?>

<div class="wrap yoast-alerts">

	<h1>Yoast SEO alerts</h1>
	<div class="yoast-container yoast-container__alert">
		<?php include 'partial-alerts-errors.php'; ?>
	</div>

	<div class="yoast-container yoast-container__warning">
		<?php include 'partial-alerts-warnings.php'; ?>
	</div>

</div>
