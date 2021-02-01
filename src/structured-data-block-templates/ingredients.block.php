<?php // phpcs:ignore Internal.NoCodeFound ?>
{{block name="yoast/ingredients" title="Ingredients" category="common" parent=[ "yoast/recipe" ] }}
<div class={{class-name}}>
	{{variable-tag-rich-text name="title" tags=[ "h2", "h3", "h4", "h5", "h6", "strong" ] placeholder="Ingredients title" }}
	{{variable-tag-rich-text name="ingredients" tags=["ul", "ol"] multiline="li" placeholder="Ingredient 1" }}
</div>
