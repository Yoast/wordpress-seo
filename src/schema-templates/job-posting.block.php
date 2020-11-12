<?php // phpcs:ignore Internal.NoCodeFound ?>
{{block name="yoast/job-posting" title="Job posting" category="common" }}
{{sidebar-select name="type" output=false label="Employment type" options={ "Full time": "FULL_TIME", "Part time": "PART_TIME" } multiple=true }}
{{sidebar-input name="minimum-hours" output=false type="number" label="Minimum hours" }}
{{sidebar-input name="maximum-hours" output=false type="number" label="Maximum hours" }}
<div class={{class-name}}>
	{{variable-tag-rich-text name="title" tags=[ "h1", "h2", "h3", "h4", "h5", "h6", "strong" ] placeholder="Job title" }}
	{{inner-blocks appender="button" appenderLabel="Add to job" }}
</div>
