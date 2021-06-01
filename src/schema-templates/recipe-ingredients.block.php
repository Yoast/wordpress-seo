<?php // phpcs:ignore Internal.NoCodeFound ?>
{{block name="yoast/recipe-ingredients" title="<?php esc_attr_e( "Ingredients", "wordpress-seo" ) ?>" category="yoast-structured-data-blocks" parent=[ "yoast/recipe" ] supports={"multiple": false} }}
<div class={{class-name}}>
	{{heading name="title" defaultHeadingLevel=3 placeholder="<?php esc_attr_e( "Ingredients title", "wordpress-seo" ) ?>" default="<? esc_attr_e( "Ingredients", "wordpress-seo" ) ?>" }}
	{{rich-text name="ingredients" tag="ul" multiline="li" placeholder="<?php esc_attr_e( "Enter an ingredient", "wordpress-seo" ) ?>" }}
</div>
