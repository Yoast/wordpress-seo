/* External dependencies */
import React from "react";
import renderer from "react-test-renderer";

/* Internal dependencies */
import TwitterImage from "../../src/twitter/TwitterImage";

import * as determineImageProperties from "../../src/helpers/determineImageProperties";
// eslint-disable-next-line
determineImageProperties.handleImage = jest.fn();

describe( "TwitterImage Component", () => {
	it( "calls determineImageProperties with the correct image URL", () => {
		const imageUrl = "https://yoast.com/app/uploads/2019/03/Storytelling_FI.jpg";

		determineImageProperties.handleImage.mockReturnValueOnce(
			{
				imageProperties: {
					mode: "landscape",
					height: 300,
					width: 600,
				},
				status: "loaded",
			}
		);

		renderer.create(
			<TwitterImage src={ imageUrl } isLarge={ true } />
		);

		expect( determineImageProperties.handleImage ).toBeCalledWith( imageUrl, "Twitter", true );
	} );
} );
