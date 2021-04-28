<?php
/**
 * Recipe name block schema template.
 *
 * @package Yoast\WP\SEO\Schema_Templates
 */

?>
{{block name="yoast/recipe-name" title="Recipe name" category="yoast-structured-data-blocks" parent=[ "yoast/recipe" ] }}
{{variable-tag-rich-text name="name" tags=[ "h2", "h3", "h4", "h5", "h6", "strong" ] placeholder="<?php esc_attr_e( 'Enter a recipe name', 'wordpress-seo' ); ?>" }}
