<?php
/**
 * Recipe ingredients block schema template.
 *
 * @package Yoast\WP\SEO\Schema_Templates
 */

use Yoast\WP\SEO\Schema_Templates\Assets\Icons;

// phpcs:disable WordPress.Security.EscapeOutput -- Reason: The Icons contains safe svg.
?>
{{block name="yoast/recipe-ingredients" title="<?php esc_attr_e( 'Recipe ingredient(s)', 'wordpress-seo' ); ?>" description="<?php esc_attr_e( 'The ingredients used in the recipe, e.g. sugar, flour or garlic.', 'wordpress-seo' ); ?>" icon="<?php echo Icons::heroicons_clipboard_list(); ?>" category="yoast-structured-data-blocks" parent=[ "yoast/recipe" ] supports={"multiple": false} }}
<div class={{class-name}}>
	{{heading name="title" defaultHeadingLevel=3 placeholder="<?php esc_attr_e( 'Ingredients title', 'wordpress-seo' ); ?>" default="<?php esc_attr_e( 'Ingredients', 'wordpress-seo' ); ?>" }}
	{{rich-text name="ingredients" tag="ul" multiline="li" placeholder="<?php esc_attr_e( 'Enter an ingredient', 'wordpress-seo' ); ?>" }}
</div>
