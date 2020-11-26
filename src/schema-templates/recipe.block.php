<?php // phpcs:ignore Internal.NoCodeFound ?>
{{block name="yoast/recipe" title="Recipe" category="common" }}
{{sidebar-duration name="cook-time" output=false label="<?php esc_html__( 'Cook time', 'wordpress-seo' ); ?>" }}
{{sidebar-duration name="prep-time" output=false label="<?php esc_html__( 'Preparation time', 'wordpress-seo' ); ?>" }}
{{sidebar-input name="yield" output=false type="number" label="Serves #" }}
<div class={{class-name}}>
	{{variable-tag-rich-text name="title" tags=[ "h1", "h2", "h3", "h4", "h5", "h6", "strong" ] placeholder="Recipe title" }}
	{{inner-blocks allowed-blocks=[ "core/paragraph", "core/image", "yoast/ingredients" ] appender="button" appenderLabel="Add to recipe" }}
</div>
