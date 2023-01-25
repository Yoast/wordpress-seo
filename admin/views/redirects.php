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
		<div style="position: absolute;top: 0;bottom: 0;left: 0;right: 0;z-index: 100; display: flex;justify-content: center;align-items: center;background: radial-gradient(#ffffffcf 20%, #ffffff00 50%);">
			<a class="yoast-button-upsell" data-action="load-nfd-ctb" data-ctb-id="57d6a568-783c-45e2-a388-847cff155897" href="<?php echo \esc_url( WPSEO_Shortlinker::get( 'https://yoa.st/4e0/' ) ); ?>" target="_blank">
				<?php
				echo \esc_html__( 'Unlock with Premium', 'wordpress-seo' )
					// phpcs:ignore WordPress.Security.EscapeOutput -- Already escapes correctly.
					. WPSEO_Admin_Utils::get_new_tab_message();
				?>
				<span aria-hidden="true" class="yoast-button-upsell__caret"></span></a>
		</div>
		<div class="wpseo_content_cell" id="wpseo_content_top" style="opacity: 0.5;">
			<h2 class="nav-tab-wrapper" id="wpseo-tabs">
				<a class="nav-tab nav-tab-active" id="tab-url-tab" href="#" tabindex="-1">
					<?php
					\esc_html_e( 'Redirects', 'wordpress-seo' )
					?>
				</a>
				<a class="nav-tab" id="tab-url-tab" href="" tabindex="-1">
					<?php
					\esc_html_e( 'Regex Redirects', 'wordpress-seo' )
					?>
				</a>
				<a class="nav-tab" id="tab-url-tab" href="#" tabindex="-1">
					<?php
					\esc_html_e( 'Settings', 'wordpress-seo' )
					?>
					</a>
			</h2>

			<div id="table-plain" class="tab-url redirect-table-tab">
				<h2>
					<?php
					\esc_html_e( 'Plain redirects', 'wordpress-seo' )
					?>
				</h2>
				<form class="wpseo-new-redirect-form" method="post">
					<div class="wpseo_redirect_form">
						<div class="redirect_form_row" id="row-wpseo_redirects_type">
							<label class="textinput" for="wpseo_redirects_type">
								<span class="title">
									<?php
									\esc_html_e( 'Type', 'wordpress-seo' )
									?>
								</span>
							</label>
							<select name="wpseo_redirects_type" id="wpseo_redirects_type" class="select select2-hidden-accessible" data-select2-id="wpseo_redirects_type" tabindex="-1" aria-hidden="true">
								<option value="301" data-select2-id="2">
									<?php
									\esc_html_e( '301 Moved Permanently', 'wordpress-seo' )
									?>
								</option>
							</select>
							<span class="select2 select2-container select2-container--default" dir="ltr" data-select2-id="1" style="width: 400px;">
								<span class="selection">
									<span class="select2-selection select2-selection--single" role="combobox" aria-haspopup="true" aria-expanded="false" tabindex="-1" aria-disabled="false" aria-labelledby="select2-wpseo_redirects_type-container">
										<span class="select2-selection__rendered" id="select2-wpseo_redirects_type-container" role="textbox" aria-readonly="true" title="301 Moved Permanently">
											<?php
											\esc_html_e( '301 Moved Permanently', 'wordpress-seo' )
											?>
										</span>
										<span class="select2-selection__arrow" role="presentation">
											<b role="presentation"></b>
										</span>
									</span>
								</span>
								<span class="dropdown-wrapper" aria-hidden="true"></span>
							</span>
						</div>

						<p class="label desc description wpseo-redirect-clear">
							<?php
							printf(
								/* translators: 1: opens a link. 2: closes the link. */
								esc_html__( 'The redirect type is the HTTP response code sent to the browser telling the browser what type of redirect is served. %1$sLearn more about redirect types%2$s.', 'wordpress-seo' ),
								'<a href="#" target="_blank">',
								'</a>'
							);
							?>
						<div class="redirect_form_row" id="row-wpseo_redirects_origin">
							<label class="textinput" for="wpseo_redirects_origin">
								<span class="title">
									<?php
									\esc_html_e( 'Old URL', 'wordpress-seo' )
									?>
								</span>
							</label>
							<input type="text" class="textinput" name="wpseo_redirects_origin" id="wpseo_redirects_origin" value="" tabindex="-1">
						</div>
						<br class="clear">

						<div class="redirect_form_row wpseo_redirect_target_holder" id="row-wpseo_redirects_target">
							<label class="textinput" for="wpseo_redirects_target">
								<span class="title">
									<?php
									\esc_html_e( 'URL', 'wordpress-seo' )
									?>
								</span>
							</label>
							<input type="text" class="textinput" name="wpseo_redirects_target" id="wpseo_redirects_target" value="" tabindex="-1">
						</div>
						<br class="clear">

						<button type="button" class="button button-primary" tabindex="-1">
							<?php
							\esc_html_e( 'Add Redirect', 'wordpress-seo' )
							?>
						</button>
					</div>
				</form>
				<p class="desc">&nbsp;</p>
				<form id="plain" class="wpseo-redirects-table-form" method="post" action="">
					<input type="hidden" class="wpseo_redirects_ajax_nonce" name="wpseo_redirects_ajax_nonce" value="6ccb86df42">
					<input type="hidden" id="_wpnonce" name="_wpnonce" value="4b02cca185">
					<input type="hidden" name="_wp_http_referer" value="/wp-admin/admin.php?page=wpseo_redirects">	<div class="tablenav top">

					<div class="alignleft actions">
						<select name="redirect-type" id="filter-by-redirect" tabindex="-1">
							<option selected="selected" value="0">
								<?php
								\esc_html_e( 'All redirect types', 'wordpress-seo' )
								?>
							</option>
						</select>
						<input type="button" name="filter_action" id="post-query-submit" class="button" value="<?php \esc_attr_e( 'Filter', 'wordpress-seo' ); ?>" tabindex="-1">
					</div>
						<br class="clear">
					</div>
					<table class="wp-list-table widefat fixed striped table-view-list plain">
						<thead>
							<tr>
								<td id="cb" class="manage-column column-cb check-column">
									<input id="cb-select-all-1" type="checkbox"  tabindex="-1">
								</td>
								<th scope="col" id="type" class="manage-column column-type column-primary sortable desc">
									<a href="#" tabindex="-1">
										<span>
										<?php
										\esc_html_e( 'Type', 'wordpress-seo' )
										?>
										</span>
										<span class="sorting-indicator"></span>
									</a>
								</th>
								<th scope="col" id="old" class="manage-column column-old sortable desc">
									<a href="#" tabindex="-1">
										<span>
											<?php
											\esc_html_e( 'Old URL', 'wordpress-seo' )
											?>
										</span>
										<span class="sorting-indicator"></span>
									</a>
								</th>
								<th scope="col" id="new" class="manage-column column-new sortable desc">
									<a href="#" tabindex="-1">
										<span>
											<?php
											\esc_html_e( 'New URL', 'wordpress-seo' )
											?>
										</span>
										<span class="sorting-indicator"></span>
									</a>
								</th>
							</tr>
						</thead>

						<tbody id="the-list">
							<tr class="no-items">
								<td class="colspanchange" colspan="4">
									<?php
									\esc_html_e( 'No items found.', 'wordpress-seo' )
									?>
								</td>
							</tr>
						</tbody>

						<tfoot>
							<tr>
								<td class="manage-column column-cb check-column">
									<input id="cb-select-all-2" type="checkbox" tabindex="-1">
								</td>
								<th scope="col" class="manage-column column-type column-primary sortable desc">
									<a href="#" tabindex="-1">
										<span>
											<?php
											\esc_html_e( 'Type', 'wordpress-seo' )
											?>
										</span>
										<span class="sorting-indicator"></span></a>
								</th>
								<th scope="col" class="manage-column column-old sortable desc">
									<a href="#" tabindex="-1">
										<span>
											<?php
											\esc_html_e( 'Old URL', 'wordpress-seo' )
											?>
										</span>
										<span class="sorting-indicator"></span>
									</a>
								</th>
								<th scope="col" class="manage-column column-new sortable desc">
									<a href="#" tabindex="-1">
										<span>
											<?php
											\esc_html_e( 'New URL', 'wordpress-seo' )
											?>
										</span>
										<span class="sorting-indicator"></span></a>
								</th>
							</tr>
						</tfoot>

					</table>
				</form>
			</div>

			<br class="clear">

		</div><!-- end of div wpseo_content_top --></div><!-- end of div wpseo_content_wrapper -->
</div>
