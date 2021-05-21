<?php
/**
 * Recipe description block schema template.
 *
 * @package Yoast\WP\SEO\Schema_Templates
 */

use Yoast\WP\SEO\Schema_Templates\Assets\Icons;

// phpcs:disable WordPress.Security.EscapeOutput -- Reason: The Icons contains safe svg.
?>
{{block name="yoast/recipe-description" title="<?php esc_attr_e( 'Recipe description', 'wordpress-seo' ); ?>" category="yoast-required-recipe-blocks" description="<?php esc_attr_e( 'The description of the recipe.', 'wordpress-seo' ); ?>" icon="<?php echo Icons::heroicons_identification(); ?>" supports={"multiple": false} }}
<div class="yoast-recipe-block__description {{class-name}}">
	{{rich-text name="description" required=true tag="p" keepPlaceholderOnFocus=true placeholder="<?php esc_attr_e( 'Enter a recipe description...', 'wordpress-seo' ); ?>"}}
</div>
