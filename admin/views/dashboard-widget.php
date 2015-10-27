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
				<div class="wpseo-score-icon <?php echo sanitize_html_class( $statistic['seo_rank'] ); ?>"></div>
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
	<h4 class="hide-if-no-js">OnPage.Org <?php _e( 'status', 'wordpress-seo' ); ?></h4>

	<div>
		<?php
		if ( $onpage['indexable'] ) {
			echo '<div class="wpseo-score-icon good"></div>';
			_e( 'Your site is indexable at the moment.', 'wordpress-seo' );
		}
		else {
			echo '<div class="wpseo-score-icon bad"></div>';
			_e( "Your site isn't indexable at the moment.", 'wordpress-seo' );
			if ( $onpage['can_fetch'] ) {
				echo '<br />';
				echo '<a class="fetch-status button" href="' . esc_attr( add_query_arg( 'wpseo-redo-onpage', '1' ) ) . '">' . __( 'Fetch the current status', 'wordpress-seo' ) . ' </a>';
			}
		}
		?>
	</div>
</div>
	<?php
endif;
