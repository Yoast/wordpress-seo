<?php
/**
 * Recipe block schema template.
 *
 * @package Yoast\WP\SEO\Schema_Templates
 */

/* translators: %1$s expands to Yoast */
$yoast_seo_block_title = sprintf( __( '%1$s Recipe', 'wordpress-seo' ), 'Yoast' );

$yoast_seo_block_template = [
	[ 'yoast/recipe-name' ],
	[ 'yoast/cooking-time' ],
	[ 'yoast/preparation-time' ],
	[ 'core/image' ],
	[ 'yoast/recipe-description' ],
	[ 'yoast/recipe-ingredients' ],
	[ 'yoast/recipe-instructions' ],
];

$yoast_seo_required_blocks = [
	[ 'name' => 'yoast/recipe-name' ],
	[ 'name' => 'core/image' ],
	[ 'name' => 'yoast/recipe-ingredients' ],
	[ 'name' => 'yoast/recipe-instructions' ],
];

$yoast_seo_recommended_blocks = [
	[ 'name' => 'yoast/cooking-time' ],
	[ 'name' => 'yoast/preparation-time' ],
	[ 'name' => 'yoast/recipe-description' ],
];

// phpcs:disable WordPress.Security.EscapeOutput -- Reason: WPSEO_Utils::format_json_encode is safe.
?>
{{block name="yoast/recipe" title="<?php echo esc_attr( $yoast_seo_block_title ); ?>" category="yoast-structured-data-blocks" keywords=[ "SEO", "Schema"] description="<?php esc_attr_e( 'Create a Recipe in an SEO-friendly way. You can only use one Recipe block per post.', 'wordpress-seo' ); ?>" supports={"multiple": false} }}
{{sidebar-input name="yield" output=false type="number" label="<?php esc_attr_e( 'Serves #', 'wordpress-seo' ); ?>" }}
<div class={{class-name}}>
	{{inner-blocks template=<?php echo WPSEO_Utils::format_json_encode( $yoast_seo_block_template ); ?> required-blocks=<?php echo WPSEO_Utils::format_json_encode( $yoast_seo_required_blocks ); ?> recommended-blocks=<?php echo WPSEO_Utils::format_json_encode( $yoast_seo_recommended_blocks ); ?> appender="button" appenderLabel="<?php esc_attr_e( 'Add a block to your recipe...', 'wordpress-seo' ); ?>" }}
</div>
