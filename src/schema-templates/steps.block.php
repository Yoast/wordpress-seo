<?php // phpcs:ignore Internal.NoCodeFound ?>
{{block name="yoast/steps" title="Steps" category="common" parent=[ "yoast/recipe" ] }}
<ul class={{class-name}}>
	{{heading name="title" defaultHeadingLevel=3 placeholder="Steps title" }}
	{{inner-blocks allowed-blocks=["yoast/step"] appender="button" appenderLabel="Add step" }}
</ul>
