<?php // phpcs:ignore Internal.NoCodeFound ?>
{{schema name="yoast/recipe"}}
{
	"@type": "Recipe",
	"@id": "{{block-id}}",
	"mainEntityOfPage": {
		"@id": "%%main_schema_id%%"
	},
	"image": {{inner-blocks-id allowed-blocks=[ "core/image" ] only-first=true null-when-empty=true }},
	"name": {{inner-blocks-html blocks={ "yoast/recipe-name": "name" } null-when-empty=true allowed-tags=[ "h1","h2","h3","h4","h5","h6","br","a","p","b","strong","i","em", "ul", "ol", "li" ] }},
	"author": {
		"@id": "%%author_id%%"
	},
	"description": {{inner-blocks-html blocks={ "yoast/recipe-description": "description" } null-when-empty=true allowed-tags=[ "h1","h2","h3","h4","h5","h6","br","a","p","b","strong","i","em" ] }},
	"cookTime": {{inner-blocks allowed-blocks=[ "yoast/cooking-time" ] only-first=true }},
	"prepTime": {{inner-blocks allowed-blocks=[ "yoast/preparation-time" ] only-first=true }},
	"recipeInstructions": {{inner-blocks allowed-blocks=[ "yoast/recipe-instructions" ] only-first=true }},
	"recipeIngredient": {{inner-blocks allowed-blocks=[ "yoast/recipe-ingredients" ] only-first=true }},
	"recipeYield": {{attribute name="yield" }}
}
