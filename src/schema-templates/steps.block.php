<?php // phpcs:ignore Internal.NoCodeFound ?>
{{block name="yoast/steps" title="Steps" category="common" parent=[ "yoast/recipe" ] }}
<ul class={{class-name}}>
	{{variable-tag-rich-text name="title" tags=[ "h2", "h3", "h4", "h5", "h6", "strong" ] placeholder="Steps title" }}
	{{inner-blocks allowed-blocks=["yoast/step"] appender="button" appenderLabel="Add step" }}
</ul>
