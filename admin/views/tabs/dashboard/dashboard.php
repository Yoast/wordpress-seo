<?php
/**
 * @package WPSEO\Admin
 */

/** @noinspection PhpUnusedLocalVariableInspection */
$alerts_data = Yoast_Alerts::get_template_variables();

$options      = WPSEO_Options::get_options( array( 'wpseo' ) );
$is_dismissed = WPSEO_Configuration_Notification::is_dismissed( get_current_user_id() );
$notifier     = new WPSEO_Configuration_Notifier();
?>
<div class="yoast-alerts">

	<h2><?php
		/* translators: %1$s expands to Yoast SEO */
		printf( __( '%1$s Dashboard', 'wordpress-seo' ), 'Yoast SEO' );
		?></h2>

	<?php if ( ! $is_dismissed && ! empty( $options['show_onboarding_notice'] ) ) : ?>
		<?php echo $notifier->notify(); ?>
	<?php endif ?>

	<div class="yoast-container yoast-container__alert">
		<?php include WPSEO_PATH . 'admin/views/partial-alerts-errors.php'; ?>
	</div>

	<div class="yoast-container yoast-container__warning">
		<?php include WPSEO_PATH . 'admin/views/partial-alerts-warnings.php'; ?>
	</div>

</div>
