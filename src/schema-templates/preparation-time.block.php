<?php
/**
 * Recipe preparation time block schema template.
 *
 * @package Yoast\WP\SEO\Schema_Templates
 */

use Yoast\WP\SEO\Schema_Templates\Assets\Icons;
// phpcs:disable WordPress.Security.EscapeOutput -- Reason: The Icons contains safe svg.
?>
{{block name="yoast/preparation-time" title="<?php \esc_attr_e( 'Recipe prep time', 'wordpress-seo' ); ?>" category="yoast-structured-data-blocks" parent=[ "yoast/recipe" ] description="<?php \esc_html_e( 'The time it takes to prepare the items to be used in the instructions.', 'wordpress-seo' ); ?>" icon="<?php echo Icons::heroicons_clock(); ?>" supports={"multiple": false} }}
<div class={{class-name}}>
	{{heading name="title" default-heading-level=3 tags=[ "h2", "h3", "h4", "h5", "h6", "strong" ] default="<?php \esc_attr_e( 'Prep time', 'wordpress-seo' ); ?>" }}
	{{duration name="preparation-time" }}
</div>
