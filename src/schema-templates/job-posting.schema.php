<?php // phpcs:ignore Internal.NoCodeFound ?>
{{schema name="yoast/job-posting" }}
{
	"@type": "JobPosting",
	"title": {{html name="title"}},
	"description": {{inner-blocks-html blocks={ "core/paragraph": "content", "core/heading": "content", "core/list": "value" } null-when-empty=true allowed-tags=[ "h1","h2","h3","h4","h5","h6","br","a","p","b","strong","i","em", "ul", "ol", "li" ] }},
	"datePosted": "%%post_date%%",
	"employmentType": {{attribute name="type" }},
	"hiringOrganization": {
		"@id": "%%organization_id%%"
	},
	"mainEntityOfPage": {
		"@id": "%%main_schema_id%%"
	},
	"workHours": "{{attribute name="minimum-hours" }}-{{attribute name="maximum-hours" }}",
	"jobLocation": {{inner-blocks allowed-blocks=[ "yoast/address" ] only-first=true }}
}
