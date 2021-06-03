/**
 * WordPress e2e utilities
 */
import {
	createNewPost,
	trashAllPosts,
	insertBlock,
} from "@wordpress/e2e-test-utils";

describe( "Yoast SEO sidebar", () => {

	it( "shows correctly Yoast SEO sidebar when editing a post", async () => {
		await trashAllPosts();
		await createNewPost();

		await page.waitForSelector( "aria/Yoast SEO" );
		expect(
			`//button[contains( @aria-label, Yoast SEO )]`
		).not.toBeNull;
	} );

} );