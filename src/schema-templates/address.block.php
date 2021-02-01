<?php // phpcs:ignore Internal.NoCodeFound ?>
{{block name="yoast/address-table" title="Address table" category="common" parent=[ "yoast/job-posting" ] }}
<table class={{class-name}}>
	<tr>
		<th>{{rich-text tag="span" name="address-title" default="Address"}}</th>
		<td>{{rich-text tag="span" name="address" placeholder="Common Street 123"}}</td>
	</tr>
	<tr>
		<th>{{rich-text tag="span" name="city-title" default="City"}}</th>
		<td>{{rich-text tag="span" name="city" placeholder="City"}}</td>
	</tr>
	<tr>
		<th>{{rich-text tag="span" name="province-title" default="Province/State"}}</th>
		<td>{{rich-text tag="span" name="province" placeholder="Province or state"}}</td>
	</tr>
	<tr>
		<th>{{rich-text tag="span" name="postal-code-title" default="Postal code"}}</th>
		<td>{{rich-text tag="span" name="postal-code" placeholder="12345"}}</td>
	</tr>
	<tr>
		<th>{{rich-text tag="span" name="country-title" default="Country"}}</th>
		<td>{{rich-text tag="span" name="country" placeholder="Country"}}</td>
	</tr>
</table>
