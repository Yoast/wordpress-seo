<?php // phpcs:ignore Internal.NoCodeFound ?>
{{schema name="core/image" separate-in-graph=true }}
{
	"@type": "ImageObject",
	"@id": {{block-id}},
	"url": {{attribute name="url" }},
	"width": {{attribute name="width" }},
	"height": {{attribute name="height" }},
	"caption": {{html name="caption" }}
}
