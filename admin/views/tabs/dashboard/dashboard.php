<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin
 */

use Yoast\WP\SEO\Conditionals\Indexables_Page_Conditional;
/**
 * Notifications template variables.
 *
 * @noinspection PhpUnusedLocalVariableInspection
 *
 * @var array
 */
$notifications_data = Yoast_Notifications::get_template_variables();

$wpseo_contributors_phrase = sprintf(
	/* translators: %1$s expands to Yoast SEO */
	__( 'See who contributed to %1$s.', 'wordpress-seo' ),
	'Yoast SEO'
);

?>

<div class="tab-block">
	<div class="yoast-notifications">

		<div class="yoast-container yoast-container__error">
			<?php require WPSEO_PATH . 'admin/views/partial-notifications-errors.php'; ?>
		</div>

		<div class="yoast-container yoast-container__warning">
			<?php require WPSEO_PATH . 'admin/views/partial-notifications-warnings.php'; ?>
		</div>

	</div>
</div>

<?php
if ( YoastSEO()->classes->get( Indexables_Page_Conditional::class )->is_met() ) {
	?>
<div class="tab-block">
	<div id="wpseo-indexables-page"></div>
</div>
	<?php
}
?>

<div class="tab-block">
	<h2><?php esc_html_e( 'Credits', 'wordpress-seo' ); ?></h2>
	<p>
		<a href="<?php WPSEO_Shortlinker::show( 'https://yoa.st/yoast-seo-credits' ); ?>"><?php echo esc_html( $wpseo_contributors_phrase ); ?></a>
	</p>
</div>
