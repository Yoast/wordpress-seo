/**
 * WordPress e2e utilities
 */
import {
	trashAllPosts,
	createNewPost,
} from "@wordpress/e2e-test-utils";

describe( "Yoast SEO plugin metabox", () => {

	it( "should contains the Yoast SEO plugin metabox", async () => {
		await trashAllPosts();
		await createNewPost();
		await page.waitForSelector( ".postbox.yoast.wpseo-metabox" );
		expect(
			`//*[contains( @class, "postbox yoast wpseo-metabox" )]`
		).not.toBeNull();
	} );

} );
