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
<ul class="wpseo-dashboard-overview-scores">
	<?php foreach ( $statistics as $statistic ) :
		if ( current_user_can( 'edit_others_posts' ) === false ) {
			$url = esc_url( admin_url( 'edit.php?post_status=publish&post_type=post&seo_filter=' . $statistic['seo_rank'] . '&author=' . get_current_user_id() ) );
		}
		else {
			$url = esc_url( admin_url( 'edit.php?post_status=publish&post_type=post&seo_filter=' . $statistic['seo_rank'] ) );
		}
	?>
	<li>
		<span class="wpseo-dashboard-overview-post-score">
			<span class="wpseo-score-icon <?php echo sanitize_html_class( $statistic['icon_class'] ); ?>"></span>
			<a href="<?php echo $url; ?>"
				class="wpseo-glance <?php echo esc_attr( $statistic['class'] ); ?>">
				<?php printf( $statistic['title'], intval( $statistic['count'] ) ); ?>
				<span class="screen-reader-text">(<?php echo absint( $statistic['count'] ); ?>)</span>
			</a>
		</span>
		<span class="wpseo-dashboard-overview-post-count" aria-hidden="true">
			<?php echo absint( $statistic['count'] ); ?>
		</span>
	</li>
	<?php endforeach; ?>
</ul>
<?php $can_access = is_multisite() ? WPSEO_Utils::grant_access() : current_user_can( 'manage_options' );
if ( ! empty( $onpage ) && $can_access ) : ?>
<div class="onpage">
	<h3><?php
		printf(
			/* translators: %1$s expands to Ryte. */
			__( 'Indexability check by %1$s', 'wordpress-seo' ),
			'Ryte'
		);
	?></h3>

	<p>
		<?php
		/**
		 * @var array $onpage Array containing the indexable and can_fetch value.
		 */
		switch ( $onpage['indexable'] ) :
			case WPSEO_OnPage_Option::IS_INDEXABLE :
				echo '<span class="wpseo-score-icon good"></span>';
				_e( 'Your homepage can be indexed by search engines.', 'wordpress-seo' );

				break;
			case WPSEO_OnPage_Option::IS_NOT_INDEXABLE :
				echo '<span class="wpseo-score-icon bad"></span>';
				printf(
					/* translators: %1$s: opens a link to a related knowledge base article. %2$s: closes the link. */
					__( '%1$sYour homepage cannot be indexed by search engines%2$s. This is very bad for SEO and should be fixed.', 'wordpress-seo' ),
					'<a href="' . WPSEO_Shortlinker::get( 'https://yoa.st/onpageindexerror' ) . '" target="_blank">',
					'</a>'
				);
				break;
			case WPSEO_OnPage_Option::CANNOT_FETCH :
				echo '<span class="wpseo-score-icon na"></span>';
				printf(
					/* translators: %1$s: opens a link to a related knowledge base article, %2$s: expands to Yoast SEO, %3$s: closes the link, %4$s: expands to Ryte. */
					__( '%1$s%2$s has not been able to fetch your site\'s indexability status%3$s from %4$s', 'wordpress-seo' ),
					'<a href="' . WPSEO_Shortlinker::get( 'https://yoa.st/onpagerequestfailed' ) . '" target="_blank">',
					'Yoast SEO',
					'</a>',
					'Ryte'
				);
				break;
			case WPSEO_OnPage_Option::NOT_FETCHED :
				echo '<span class="wpseo-score-icon na"></span>';
				echo esc_html( sprintf(
					/* translators: %1$s: expands to Yoast SEO, %2$s: expands to Ryte. */
					__( '%1$s has not fetched your site\'s indexability status yet from %2$s', 'wordpress-seo' ),
					'Yoast SEO',
					'Ryte'
				) );
				break;
		endswitch;
		?>
	</p>

	<p>
		<?php
		if ( $onpage['indexable'] !== WPSEO_OnPage_Option::IS_INDEXABLE && $onpage['can_fetch'] ) :
			echo '<a class="fetch-status button" href="' . esc_attr( add_query_arg( 'wpseo-redo-onpage', '1' ) ) . '#wpseo-dashboard-overview">' . __( 'Fetch the current status', 'wordpress-seo' ) . ' </a> ';
		endif;

		echo '<a class="landing-page button" href="' . WPSEO_Shortlinker::get( 'https://yoa.st/rytelp' ) . '" target="_blank">' . __( 'Analyze entire site', 'wordpress-seo' ) . ' </a>';
		?>
	</p>
</div>
	<?php
endif;
