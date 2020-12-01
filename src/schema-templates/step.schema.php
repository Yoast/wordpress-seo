<?php // phpcs:ignore Internal.NoCodeFound ?>
{{schema name="yoast/step" only-nested=true }}
{
	"@type": "HowToStep",
	"name": {{inner-blocks-html blocks={ "core/paragraph": "content", "core/heading": "content" } only-first=true null-when-empty=true }},
	"url": {{block-id}},
	"text": {{inner-blocks-html blocks={ "core/paragraph": "content", "core/heading": "content" } skip-first=true null-when-empty=true }},
	"image": {{inner-blocks-id allowed-blocks=[ "core/image" ] only-first=true null-when-empty=true }}
}
