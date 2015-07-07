<?php
/**
 * @var array $statistics {
 *      An array of statistics to display
 *
 *      @type string $seo_filter The SEO filter that can be used on the archive page
 *      @type string $title The title for this statistic
 *      @type string $class The class for the link
 *      @type int $count The amount of posts that meets the statistic requirements
 * }
 */
?>
<ul>
<?php foreach ( $statistics as $statistic ) : ?>
	<li>
		<div title="" class="wpseo-score-icon <?php echo esc_attr( $statistic['seo_filter'] ); ?>"></div>
		<a href="<?php echo esc_attr( admin_url( 'edit.php?post_status=all&post_type=post&seo_filter=' . $statistic['seo_filter'] ) ); ?>"
			class="wpseo-glance <?php echo esc_attr( $statistic['class'] ); ?>">
			<?php printf( esc_html( $statistic['title'] ), $statistic['count'] ); ?>
		</a>
	</li>
<?php endforeach; ?>
</ul>
