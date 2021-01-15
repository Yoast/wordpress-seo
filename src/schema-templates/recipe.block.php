<?php // phpcs:ignore Internal.NoCodeFound ?>
{{block name="yoast/recipe" title="Recipe" category="common" }}
{{sidebar-duration name="cook-time" output=false label="Cook time" }}
{{sidebar-duration name="prep-time" output=false label="Preparation time" }}
{{sidebar-input name="yield" output=false type="number" label="Serves #" }}
<div class={{class-name}}>
	{{variable-tag-rich-text name="title" tags=[ "h1", "h2", "h3", "h4", "h5", "h6", "strong" ] placeholder="Recipe title" }}
	{{inner-blocks required-blocks=[ { "name": "core/paragraph", "option": "1" } ] allowed-blocks=[ "core/paragraph", "core/image", "yoast/ingredients" ] appender="button" appenderLabel="Add to recipe" }}
</div>
