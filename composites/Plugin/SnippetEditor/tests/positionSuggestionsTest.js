import {
	getVerticalPosition,
	getHorizontalPosition,
	getAnimationStyles,
} from "../positionSuggestions";

describe( "positionSuggestions", () => {
	describe( "vertical and horizontal positioning", () => {
		const parentRect = {
			bottom: 443,
			height: 46,
			left: 20,
			right: 1004,
			top: 397,
			width: 984,
			x: 20,
			y: 397,
		};
		const caretRect = {
			bottom: 437,
			height: 16,
			left: 730,
			right: 748,
			top: 421,
			width: 16,
			x: 730,
			y: 421,
		};
		const popoverSize = {
			width: 220,
			height: 156,
		};

		it( "returns the vertical position that corresponds with bottom", () => {
			global.window.innerHeight = 768;
			const expected = 40;
			const actual = getVerticalPosition( parentRect, caretRect, popoverSize.height );

			expect( actual ).toBe( expected );
		} );

		it( "returns the vertical position that corresponds with top", () => {
			global.window.innerHeight = 500;
			const expected = -148;
			const actual = getVerticalPosition( parentRect, caretRect, popoverSize.height );

			expect( actual ).toBe( expected );
		} );

		it( "returns the horizontal position that corresponds with left", () => {
			global.window.innerWidth = 768;
			const expected = 525;
			const actual = getHorizontalPosition( parentRect, caretRect, popoverSize.width );

			expect( actual ).toBe( expected );
		} );

		it( "returns the horizontal position that corresponds with right", () => {
			global.window.innerWidth = 500;
			const expected = 257;
			const actual = getHorizontalPosition( parentRect, caretRect, popoverSize.width );

			expect( actual ).toBe( expected );
		} );
	} );

	describe( "getAnimationStyles", () => {
		describe( "active animation style", () => {
			const expected = {
				transform: "scale(1)",
				transformOrigin: "1em 0%",
				transition: "all 0.25s cubic-bezier(.3,1.2,.2,1)",
			};

			it( "isActive: true and at least 1 suggestion", () => {
				const state = { isActive: true };
				const props = { suggestions: [ "suggestion" ] };
				const actual = getAnimationStyles( state, props );

				expect( actual ).toEqual( expected );
			} );
		} );

		describe( "inactive animation style", () => {
			const expected = {
				transform: "scale(0)",
				transformOrigin: "1em 0%",
				transition: "all 0.35s cubic-bezier(.3,1,.2,1)",
			};

			it( "isActive: false and at least 1 suggestion", () => {
				const state = { isActive: false };
				const props = { suggestions: [ "suggestion" ] };
				const actual = getAnimationStyles( state, props );

				expect( actual ).toEqual( expected );
			} );

			it( "isActive: true and no suggestions", () => {
				const state = { isActive: false };
				const props = { suggestions: [] };
				const actual = getAnimationStyles( state, props );

				expect( actual ).toEqual( expected );
			} );

			it( "isActive: false and no suggestions", () => {
				const state = { isActive: false };
				const props = { suggestions: [] };
				const actual = getAnimationStyles( state, props );

				expect( actual ).toEqual( expected );
			} );
		} );
	} );
} );
