<?php // phpcs:ignore Internal.NoCodeFound ?>
{{schema name="yoast/recipe"}}
{
	"@type": "Recipe",
	"@id": "{{block-id}}",
	"mainEntityOfPage": {
		"@id": "%%main_schema_id%%"
	},
	"image": {{inner-blocks-id allowed-blocks=[ "core/image" ] only-first=true null-when-empty=true }},
	"name": {{html name="title"}},
	"author": {
		"@id": "%%author_id%%"
	},
	"description": {{inner-blocks-html blocks={ "core/paragraph": "content" } null-when-empty=true allowed-tags=[ "h1","h2","h3","h4","h5","h6","br","a","p","b","strong","i","em" ] }},
	"cookTime": {{attribute name="cook-time" }},
	"prepTime": {{attribute name="prep-time" }},
	"recipeInstructions": {{inner-blocks allowed-blocks=[ "yoast/steps" ] only-first=true }},
	"recipeIngredient": {{inner-blocks allowed-blocks=[ "yoast/ingredients" ] only-first=true }},
	"recipeYield": {{attribute name="yield" }}
}
