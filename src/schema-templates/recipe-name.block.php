<?php
/**
 * Recipe name block schema template.
 *
 * @package Yoast\WP\SEO\Schema_Templates
 */

?>
{{block name="yoast/recipe-name" title="Recipe name" category="yoast-structured-data-blocks" parent=[ "yoast/recipe" ] }}
{{heading name="name" defaultHeadingLevel=2 placeholder="<?php esc_attr_e( 'Enter a recipe name', 'wordpress-seo' ); ?>" }}
