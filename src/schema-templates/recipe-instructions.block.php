<?php // phpcs:ignore Internal.NoCodeFound ?>
{{block name="yoast/recipe-instructions" title="<?php esc_attr_e( "Instructions", "wordpress-seo" ) ?>" category="yoast-structured-data-blocks" parent=[ "yoast/recipe" ] supports={"multiple": false} }}
<div class={{class-name}}>
	{{heading name="title" defaultHeadingLevel=3 placeholder="<?php esc_attr_e( "Instructions title", "wordpress-seo" ) ?>" default="<?php esc_attr_e( "Instructions", "wordpress-seo" ) ?>" }}
	{{rich-text name="instructions" tag="ol" multiline="li" placeholder="<?php esc_attr_e( "Enter step", "wordpress-seo" )?>" }}
</div>
