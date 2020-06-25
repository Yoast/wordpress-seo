<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin
 */

/**
 * Notifications template variables.
 *
 * @noinspection PhpUnusedLocalVariableInspection
 *
 * @var array
 */
$notifications_data = Yoast_Notifications::get_template_variables();

$notifier = new WPSEO_Configuration_Notifier();
$notifier->notify();

$wpseo_contributors_phrase = sprintf(
	/* translators: 1: expands to Yoast SEO. */
	__( 'See who contributed to %1$s.', 'wordpress-seo' ),
	'Yoast SEO'
);

?>

	<div class="tab-block">

		<div class="yoast-paper">
			<?php require WPSEO_PATH . 'admin/views/partial-notifications-errors.php'; ?>
		</div>

	<div class="yoast-paper">
		<?php require WPSEO_PATH . 'admin/views/partial-notifications-warnings.php'; ?>
	</div>
</div>

	<div class="tab-block">
		<h2><?php esc_html_e( 'Credits', 'wordpress-seo' ); ?></h2>
		<p>
			<a href="<?php WPSEO_Shortlinker::show( 'https://yoa.st/yoast-seo-credits' ); ?>"><?php echo esc_html( $wpseo_contributors_phrase ); ?></a>
		</p>
	</div>

<?php

/**
 * Action: 'wpseo_internal_linking' - Hook to add the internal linking analyze interface to the interface.
 *
 * @deprecated 7.0
 */
do_action_deprecated( 'wpseo_internal_linking', [], 'WPSEO 7.0' );
