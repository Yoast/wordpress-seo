import createDomSync from "../../../src/classic-editor/watchers/helpers/createDomSync";
import { createPostTwitterSync } from "../../../src/classic-editor/watchers/twitter";
import * as dom from "../../../src/classic-editor/helpers/dom";

jest.mock( "../../../src/classic-editor/watchers/helpers/createDomSync" );

describe( "The Twitter watcher", () => {
	it(
		"syncs the Twitter fields from the store to hidden input fields.",
		() => {
			const selectors = {
				selectTwitterTitle: jest.fn(),
				selectTwitterDescription: jest.fn(),
				selectTwitterImageURL: jest.fn(),
				selectTwitterImageID: jest.fn(),
			};

			createPostTwitterSync( selectors );

			expect( createDomSync ).toBeCalledWith(
				selectors.selectTwitterTitle,
				{
					domGet: dom.getPostTwitterTitle,
					domSet: dom.setPostTwitterTitle,
				},
				"twitterTitle"
			);

			expect( createDomSync ).toBeCalledWith(
				selectors.selectTwitterDescription,
				{
					domGet: dom.getPostTwitterDescription,
					domSet: dom.setPostTwitterDescription,
				},
				"twitterDescription"
			);

			expect( createDomSync ).toBeCalledWith(
				selectors.selectTwitterImageURL,
				{
					domGet: dom.getPostTwitterImageURL,
					domSet: dom.setPostTwitterImageUrl,
				},
				"twitterImageURL"
			);

			expect( createDomSync ).toBeCalledWith(
				selectors.selectTwitterImageID,
				{
					domGet: dom.getPostTwitterImageID,
					domSet: dom.setPostTwitterImageID,
				},
				"twitterImageID"
			);
		} );
} );
