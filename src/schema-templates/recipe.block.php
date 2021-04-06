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
	[ 'core/image' ],
	[ 'yoast/ingredients' ],
	[ 'yoast/steps' ],
];

$yoast_seo_required_blocks = [
	[ 'name' => 'yoast/recipe-name' ],
	[ 'name' => 'core/image' ],
	[ 'name' => 'yoast/ingredients' ],
	[ 'name' => 'yoast/steps' ],
];

$yoast_seo_recommended_blocks = [
	[ 'name' => 'core/paragraph' ],
];

// phpcs:disable WordPress.Security.EscapeOutput -- Reason: WPSEO_Utils::format_json_encode is safe.
?>
{{block name="yoast/recipe" title="<?php echo esc_attr( $yoast_seo_block_title ); ?>" category="yoast-structured-data-blocks" keywords=[ "SEO", "Schema"] description="<?php esc_attr_e( 'Create a Recipe in an SEO-friendly way. You can only use one Recipe block per post.', 'wordpress-seo' ); ?>" supports={"multiple": false} }}
{{sidebar-duration name="cook-time" output=false label="<?php esc_attr_e( 'Cook time', 'wordpress-seo' ); ?>" }}
{{sidebar-duration name="prep-time" output=false label="<?php esc_attr_e( 'Preparation time', 'wordpress-seo' ); ?>" }}
{{sidebar-input name="yield" output=false type="number" label="<?php esc_attr_e( 'Serves #', 'wordpress-seo' ); ?>" }}
<div class={{class-name}}>
	{{inner-blocks template=<?php echo WPSEO_Utils::format_json_encode( $yoast_seo_block_template ); ?> required-blocks=<?php echo WPSEO_Utils::format_json_encode( $yoast_seo_required_blocks ); ?> recommended-blocks=<?php echo WPSEO_Utils::format_json_encode( $yoast_seo_recommended_blocks ); ?> appender="button" appenderLabel="<?php esc_attr_e( 'Add a block to your recipe...', 'wordpress-seo' ); ?>" }}
</div>
