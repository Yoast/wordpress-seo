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
<?php if ( WPSEO_Utils::grant_access() ) : ?>
<div class="onpage">
	<h4 class="hide-if-no-js"><?php
		printf(
			/* translators: 1: expands to OnPage.org */
			__( '%1$s status', 'wordpress-seo' ),
			'OnPage.org'
		);
	?></h4>

	<div>
		<?php

		if ( $onpage['indexable'] ) {
			echo '<div class="wpseo-score-icon good"></div>';
			_e( 'Your homepage can be indexed by search engines.', 'wordpress-seo' );
			echo '<br />';
		}
		else {
			echo '<div class="wpseo-score-icon bad"></div>';
			printf(
				/* translators: 1: opens a link to a related knowledge base article. 2: closes the link */
				__( '%1$sYour homepage cannot be indexed by search engines%2$s. This is very bad for SEO and should be fixed.', 'wordpress-seo' ),
				'<a href="http://yoa.st/onpage-index-error" target="_blank">',
				'</a>'
			);
			echo '<br />';
			if ( $onpage['can_fetch'] ) {
				echo '<a class="fetch-status button" href="' . esc_attr( add_query_arg( 'wpseo-redo-onpage', '1' ) ) . '">' . __( 'Fetch the current status', 'wordpress-seo' ) . ' </a> ';
			}
		}

		/* translators: 1: expands to the campaign tags for this link */
		$landing_page_url = sprintf(
			__( 'https://en.onpage.org/lp/yoast/%1$s', 'wordpress-seo' ),
			'?op_campaign=638516a5c963f978&utm_campaign=free&utm_medium=link&utm_source=yoast&offer_id=2&aff_id=872&op_language=en&op_country=-'
		);
		echo '<a class="landing-page button" href="' . $landing_page_url . '" target="_blank">' . __( 'Analyze entire site', 'wordpress-seo' ) . ' </a>';
		?>
	</div>
</div>
	<?php
endif;
