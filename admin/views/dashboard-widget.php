<?php
/**
 * @package WPSEO\Admin
 *
 * @var array $statistics {
 *      An array of statistics to display
 *
 *      @type string $seo_rank The SEO rank that this item represents
 *      @type string $title The title for this statistic
 *      @type string $class The class for the link
 *      @type int $count The amount of posts that meets the statistic requirements
 * }
 */

?>
<p><?php _e( 'Below are your published posts&#8217; SEO scores. Now is as good a time as any to start improving some of your posts!', 'wordpress-seo' ); ?></p>
<table>
	<?php foreach ( $statistics as $statistic ) :
		if ( current_user_can( 'edit_others_posts' ) === false ) {
			$url = esc_url( admin_url( 'edit.php?post_status=publish&post_type=post&seo_filter=' . $statistic['seo_rank'] . '&author=' . get_current_user_id() ) );
		}
		else {
			$url = esc_url( admin_url( 'edit.php?post_status=publish&post_type=post&seo_filter=' . $statistic['seo_rank'] ) );
		}
		?>
		<tr>
			<th>
				<div class="wpseo-score-icon <?php echo sanitize_html_class( $statistic['icon_class'] ); ?>"></div>
				<a href="<?php echo $url; ?>"
				   class="wpseo-glance <?php echo esc_attr( $statistic['class'] ); ?>">
					<?php printf( $statistic['title'], intval( $statistic['count'] ) ); ?>
				</a>
			</th>
			<td class="post-count">
				<?php echo absint( $statistic['count'] ); ?>
			</td>
		</tr>
	<?php endforeach; ?>
</table>
<?php $can_access = is_multisite() ? WPSEO_Utils::grant_access() : current_user_can( 'manage_options' );
if ( ! empty( $onpage ) && $can_access ) : ?>
<div class="onpage">
	<h3 class="hide-if-no-js"><?php
		printf(
			/* translators: 1: expands to OnPage.org */
			__( 'Indexability check by %1$s', 'wordpress-seo' ),
			'OnPage.org'
		);
	?></h3>

	<div>
		<?php
		/**
		 * @var array $onpage Array containing the indexable and can_fetch value.
		 */
		switch ( $onpage['indexable'] ) :
			case WPSEO_OnPage_Option::IS_INDEXABLE :
				echo '<div class="wpseo-score-icon good"></div>';
				_e( 'Your homepage can be indexed by search engines.', 'wordpress-seo' );

				break;
			case WPSEO_OnPage_Option::IS_NOT_INDEXABLE :
				echo '<div class="wpseo-score-icon bad"></div>';
				printf(
					/* translators: 1: opens a link to a related knowledge base article. 2: closes the link */
					__( '%1$sYour homepage cannot be indexed by search engines%2$s. This is very bad for SEO and should be fixed.', 'wordpress-seo' ),
					'<a href="https://yoa.st/onpageindexerror" target="_blank">',
					'</a>'
				);
				break;
			case WPSEO_OnPage_Option::CANNOT_FETCH :
				echo '<div class="wpseo-score-icon na"></div>';
				printf(
					/* translators: 1: opens a link to a related knowledge base article. 2: closes the link */
					__( 'Yoast SEO has %1$snot been able to fetch your site’s indexability status%2$s from OnPage.org', 'wordpress-seo' ),
					'<a href="https://yoa.st/onpagerequestfailed" target="_blank">',
					'</a>'
				);
				break;
			case WPSEO_OnPage_Option::NOT_FETCHED :
				echo '<div class="wpseo-score-icon na"></div>';
				printf(
					/* translators: 1: opens a link to a related knowledge base article. 2: closes the link */
					__( 'Yoast SEO has %1$snot fetched your site’s indexability status%2$s yet from OnPage.org', 'wordpress-seo' ),
					'<a href="https://yoa.st/onpagerequestfailed" target="_blank">',
					'</a>'
				);
				break;
		endswitch;

		echo '<br />';

		if ( $onpage['indexable'] !== WPSEO_OnPage_Option::IS_INDEXABLE && $onpage['can_fetch'] ) :
			echo '<a class="fetch-status button" href="' . esc_attr( add_query_arg( 'wpseo-redo-onpage', '1' ) ) . '">' . __( 'Fetch the current status', 'wordpress-seo' ) . ' </a> ';
		endif;


		echo '<a class="landing-page button" href="https://onpage.org/yoast-indexability/" target="_blank">' . __( 'Analyze entire site', 'wordpress-seo' ) . ' </a>';
		?>
	</div>
</div>
	<?php
endif;
