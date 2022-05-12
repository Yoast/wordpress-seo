import createDomSync from "../../../src/classic-editor/watchers/helpers/createDomSync";
import { createPostFacebookSync, createTermFacebookSync } from "../../../src/classic-editor/watchers/facebook";
import * as dom from "../../../src/classic-editor/helpers/dom";

jest.mock( "../../../src/classic-editor/watchers/helpers/createDomSync" );

describe( "The Facebook Post watcher", () => {
	it(
		"syncs the Facebook title from the store to a hidden input field.",
		() => {
			const selectors = {
				selectFacebookTitle: jest.fn(),
				selectFacebookDescription: jest.fn(),
				selectFacebookImageURL: jest.fn(),
				selectFacebookImageID: jest.fn(),
			};

			createPostFacebookSync( selectors );

			expect( createDomSync ).toBeCalledWith(
				selectors.selectFacebookTitle,
				{
					domGet: dom.getPostFacebookTitle,
					domSet: dom.setPostFacebookTitle,
				},
				"facebookTitle"
			);

			expect( createDomSync ).toBeCalledWith(
				selectors.selectFacebookDescription,
				{
					domGet: dom.getPostFacebookDescription,
					domSet: dom.setPostFacebookDescription,
				},
				"facebookDescription"
			);

			expect( createDomSync ).toBeCalledWith(
				selectors.selectFacebookImageURL,
				{
					domGet: dom.getPostFacebookImageUrl,
					domSet: dom.setPostFacebookImageUrl,
				},
				"facebookImageURL"
			);

			expect( createDomSync ).toBeCalledWith(
				selectors.selectFacebookImageID,
				{
					domGet: dom.getPostFacebookImageID,
					domSet: dom.setPostFacebookImageID,
				},
				"facebookImageID"
			);
		} );
} );

describe( "The Facebook Term watcher", () => {
	it(
		"syncs the Facebook title from the store to a hidden input field.",
		() => {
			const selectors = {
				selectFacebookTitle: jest.fn(),
				selectFacebookDescription: jest.fn(),
				selectFacebookImageURL: jest.fn(),
				selectFacebookImageID: jest.fn(),
			};

			createTermFacebookSync( selectors );

			expect( createDomSync ).toBeCalledWith(
				selectors.selectFacebookTitle,
				{
					domGet: dom.getTermFacebookTitle,
					domSet: dom.setTermFacebookTitle,
				},
				"facebookTitle"
			);

			expect( createDomSync ).toBeCalledWith(
				selectors.selectFacebookDescription,
				{
					domGet: dom.getTermFacebookDescription,
					domSet: dom.setTermFacebookDescription,
				},
				"facebookDescription"
			);

			expect( createDomSync ).toBeCalledWith(
				selectors.selectFacebookImageURL,
				{
					domGet: dom.getTermFacebookImageUrl,
					domSet: dom.setTermFacebookImageUrl,
				},
				"facebookImageURL"
			);

			expect( createDomSync ).toBeCalledWith(
				selectors.selectFacebookImageID,
				{
					domGet: dom.getTermFacebookImageID,
					domSet: dom.setTermFacebookImageID,
				},
				"facebookImageID"
			);
		} );
} );
