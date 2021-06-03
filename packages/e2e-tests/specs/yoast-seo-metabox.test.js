/**
 * WordPress e2e utilities
 */
import {
	trashAllPosts,
	createNewPost,
	visitAdminPage,
} from "@wordpress/e2e-test-utils";
import { addQueryArgs } from '@wordpress/url';

describe( "Yoast SEO plugin metabox", () => {

	it( "shows correctly the Yoast SEO metabox should be present when editing a post", async () => {
		await trashAllPosts();
		await createNewPost();

		await page.waitForSelector( ".postbox.yoast.wpseo-metabox" );
		expect(
			`//div[contains( @class, "postbox yoast wpseo-metabox" )]`
		).not.toBeNull();
	} );

	it( "shows correctly the Yoast SEO metabox should be present when editing a page", async () => {
		await trashAllPosts( "page" );
		await createNewPost( { postType: "page" } );

		await page.waitForSelector( ".postbox.yoast.wpseo-metabox" );
		expect(
			`//div[contains( @class, "postbox yoast wpseo-metabox" )]`
		).not.toBeNull();
	} );

/* 	it( "shows correctly the Yoast SEO metabox should be present when editing a post category page", async () => {
		const postCategoryQuery = addQueryArgs( '', {
			taxonomy: 'category',
		} );

		await visitAdminPage( 'edit-tags.php', postCategoryQuery );
		await page.waitForSelector( '#the-list tr' );
		
		const [ uncathe ] = await page.$x(
			`//a[contains( @class, "row-title" )][contains( text(), "${ categoryTitle }" )]`
		);
		await editLink.click();

		await page.waitForSelector( ".postbox.yoast.wpseo-taxonomy-metabox-postbox" );
		expect(
			`//div[contains( @class, "postbox yoast wpseo-taxonomy-metabox-postbox" )]`
		).not.toBeNull();
	} ); */

} );
