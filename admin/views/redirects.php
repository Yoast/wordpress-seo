<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin
 * @since   19.0
 */

if ( ! defined( 'WPSEO_VERSION' ) ) {
	header( 'Status: 403 Forbidden' );
	header( 'HTTP/1.1 403 Forbidden' );
	exit();
}

?>
<div class="wrap yoast wpseo-admin-page page-wpseo_redirects">
	<h1 id="wpseo-title"><?php echo \esc_html( \get_admin_page_title() ); ?></h1>
	<div class="wpseo_content_wrapper" style="position: relative;">
		<div style="position: absolute;border: solid 1px #cccccc;top: 0;bottom: 0;left: 0;right: 0;z-index: 100; display: flex;
justify-content: center;
align-items: center;">
			<a class="yoast-button-upsell" href="<?php echo \esc_url( WPSEO_Shortlinker::get( 'https://yoa.st/4e0/' ) ); ?>" target="_blank">
				<?php
				echo \esc_html__( 'Unlock with Premium', 'wordpress-seo' )
					// phpcs:ignore WordPress.Security.EscapeOutput -- Already escapes correctly.
					. WPSEO_Admin_Utils::get_new_tab_message();
				?>
				<span aria-hidden="true" class="yoast-button-upsell__caret"></span></a>
		</div>
		<div class="wpseo_content_cell" id="wpseo_content_top" style="filter: blur(3px);opacity: 01;padding: 16px;box-sizing: border-box;">
			<h2 class="nav-tab-wrapper" id="wpseo-tabs">
				<a class="nav-tab nav-tab-active" id="tab-url-tab" href="#">Redirects</a><a class="nav-tab" id="tab-url-tab" href="">Regex Redirects</a><a class="nav-tab" id="tab-url-tab" href="#">Settings</a></h2>


			<div id="table-plain" class="tab-url redirect-table-tab">
				<h2>Plain redirects</h2>	<form class="wpseo-new-redirect-form" method="post">
					<div class="wpseo_redirect_form">
						<div class="redirect_form_row" id="row-wpseo_redirects_type">
							<label class="textinput" for="wpseo_redirects_type">
								<span class="title">Type</span>
							</label>
							<select name="wpseo_redirects_type" id="wpseo_redirects_type" class="select select2-hidden-accessible" data-select2-id="wpseo_redirects_type" tabindex="-1" aria-hidden="true">
								<option value="301" data-select2-id="2">301 Moved Permanently</option>
								<option value="302">302 Found</option>
								<option value="307">307 Temporary Redirect</option>
								<option value="410">410 Content Deleted</option>
								<option value="451">451 Unavailable For Legal Reasons</option>
							</select><span class="select2 select2-container select2-container--default" dir="ltr" data-select2-id="1" style="width: 400px;"><span class="selection"><span class="select2-selection select2-selection--single" role="combobox" aria-haspopup="true" aria-expanded="false" tabindex="0" aria-disabled="false" aria-labelledby="select2-wpseo_redirects_type-container"><span class="select2-selection__rendered" id="select2-wpseo_redirects_type-container" role="textbox" aria-readonly="true" title="301 Moved Permanently">301 Moved Permanently</span><span class="select2-selection__arrow" role="presentation"><b role="presentation"></b></span></span></span><span class="dropdown-wrapper" aria-hidden="true"></span></span>
						</div>

						<p class="label desc description wpseo-redirect-clear">
							The redirect type is the HTTP response code sent to the browser telling the browser what type of redirect is served. <a href="https://yoa.st/2jb?php_version=7.4&amp;platform=wordpress&amp;platform_version=5.9.3&amp;software=premium&amp;software_version=18.9-RC4&amp;days_active=2-5&amp;user_language=en_US&amp;screen=wpseo_redirects" target="_blank">Learn more about redirect types</a>.</p>

						<div class="redirect_form_row" id="row-wpseo_redirects_origin">
							<label class="textinput" for="wpseo_redirects_origin">
								<span class="title">Old URL</span>
							</label>
							<input type="text" class="textinput" name="wpseo_redirects_origin" id="wpseo_redirects_origin" value="">
						</div>
						<br class="clear">

						<div class="redirect_form_row wpseo_redirect_target_holder" id="row-wpseo_redirects_target">
							<label class="textinput" for="wpseo_redirects_target">
								<span class="title">URL</span>
							</label>
							<input type="text" class="textinput" name="wpseo_redirects_target" id="wpseo_redirects_target" value="">
						</div>
						<br class="clear">

						<button type="button" class="button button-primary">Add Redirect</button>
					</div>
				</form>

				<form id="plain" class="wpseo-redirects-table-form" method="post" action="">
					<input type="hidden" class="wpseo_redirects_ajax_nonce" name="wpseo_redirects_ajax_nonce" value="6ccb86df42">
					<input type="hidden" id="_wpnonce" name="_wpnonce" value="4b02cca185"><input type="hidden" name="_wp_http_referer" value="/wp-admin/admin.php?page=wpseo_redirects">	<div class="tablenav top">

						<div class="alignleft actions">
							<label for="filter-by-redirect" class="screen-reader-text">Filter by redirect type</label>
							<select name="redirect-type" id="filter-by-redirect">
								<option selected="selected" value="0">All redirect types</option>
								<option value="301">301 Moved Permanently</option>
								<option value="302">302 Found</option>
								<option value="307">307 Temporary Redirect</option>
								<option value="410">410 Content Deleted</option>
								<option value="451">451 Unavailable For Legal Reasons</option>
							</select>
							<input type="submit" name="filter_action" id="post-query-submit" class="button" value="Filter">		</div>
						<div class="tablenav-pages no-pages"><span class="displaying-num">0 items</span>
							<span class="pagination-links"><span class="tablenav-pages-navspan button disabled" aria-hidden="true">«</span>
<span class="tablenav-pages-navspan button disabled" aria-hidden="true">‹</span>
<span class="paging-input"><label for="current-page-selector" class="screen-reader-text">Current Page</label><input class="current-page" id="current-page-selector" type="text" name="paged" value="1" size="1" aria-describedby="table-paging"><span class="tablenav-paging-text"> of <span class="total-pages">0</span></span></span>
<a class="next-page button" href="#"><span class="screen-reader-text">Next page</span><span aria-hidden="true">›</span></a>
<a class="last-page button" href="#"><span class="screen-reader-text">Last page</span><span aria-hidden="true">»</span></a></span></div>
						<br class="clear">
					</div>
					<table class="wp-list-table widefat fixed striped table-view-list plain">
						<thead>
						<tr>
							<td id="cb" class="manage-column column-cb check-column"><label class="screen-reader-text" for="cb-select-all-1">Select All</label><input id="cb-select-all-1" type="checkbox"></td><th scope="col" id="type" class="manage-column column-type column-primary sortable desc"><a href="#"><span>Type</span><span class="sorting-indicator"></span></a></th><th scope="col" id="old" class="manage-column column-old sortable desc"><a href="#"><span>Old URL</span><span class="sorting-indicator"></span></a></th><th scope="col" id="new" class="manage-column column-new sortable desc"><a href="#"><span>New URL</span><span class="sorting-indicator"></span></a></th>	</tr>
						</thead>

						<tbody id="the-list">
						<tr class="no-items"><td class="colspanchange" colspan="4">No items found.</td></tr>	</tbody>

						<tfoot>
						<tr>
							<td class="manage-column column-cb check-column"><label class="screen-reader-text" for="cb-select-all-2">Select All</label><input id="cb-select-all-2" type="checkbox"></td><th scope="col" class="manage-column column-type column-primary sortable desc"><a href="#"><span>Type</span><span class="sorting-indicator"></span></a></th><th scope="col" class="manage-column column-old sortable desc"><a href="#"><span>Old URL</span><span class="sorting-indicator"></span></a></th><th scope="col" class="manage-column column-new sortable desc"><a href="#"><span>New URL</span><span class="sorting-indicator"></span></a></th>	</tr>
						</tfoot>

					</table>
					<div class="tablenav bottom">

						<div class="tablenav-pages no-pages"><span class="displaying-num">0 items</span>
							<span class="pagination-links"><span class="tablenav-pages-navspan button disabled" aria-hidden="true">«</span>
<span class="tablenav-pages-navspan button disabled" aria-hidden="true">‹</span>
<span class="screen-reader-text">Current Page</span><span id="table-paging" class="paging-input"><span class="tablenav-paging-text">1 of <span class="total-pages">0</span></span></span>
<a class="next-page button" href="#"><span class="screen-reader-text">Next page</span><span aria-hidden="true">›</span></a>
<a class="last-page button" href="#"><span class="screen-reader-text">Last page</span><span aria-hidden="true">»</span></a></span></div>
						<br class="clear">
					</div>
				</form>
			</div>

			<br class="clear">

		</div><!-- end of div wpseo_content_top --></div><!-- end of div wpseo_content_wrapper -->
</div>
