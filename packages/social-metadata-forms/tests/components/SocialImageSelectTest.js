import SocialImageSelect from "../../src/components/SocialImageSelect";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";

describe( "SocialImageSelect", () => {
	it( "renders without warnings", () => {
		const { queryByRole } = render(
			<SocialImageSelect
				label="Social image"
				imageUrl=""
				defaultImageUrl="https://example.com/default-image.jpg"
				usingFallback={ false }
				imageAltText="Selected social image"
				hasPreview={ true }
				id="social-image-select"
			/>
		);
		const warningsContainer = queryByRole( "alert" );
		expect( warningsContainer ).not.toBeInTheDocument();
	} );

	it( "renders with warnings", () => {
		const { queryByRole, queryByText } = render(
			<SocialImageSelect
				label="Social image"
				imageUrl=""
				defaultImageUrl="https://example.com/default-image.jpg"
				usingFallback={ true }
				imageAltText="Selected social image"
				hasPreview={ true }
				id="social-image-select"
				warnings={ [ "Warning 1", "Warning 2" ] }
			/>
		);
		const warningsContainer = queryByRole( "alert" );
		const warning1 = queryByText( "Warning 1" );
		const warning2 = queryByText( "Warning 2" );
		expect( warning1 ).toBeInTheDocument();
		expect( warning2 ).toBeInTheDocument();
		expect( warningsContainer ).toBeInTheDocument();
	} );

	it( "shows the image preview when hasPreview is true", () => {
		render(
			<SocialImageSelect
				label="Social image"
				imageUrl="https://example.com/image.jpg"
				defaultImageUrl="https://example.com/default-image.jpg"
				usingFallback={ false }
				imageAltText="Selected social image"
				hasPreview={ true }
				id="social-image-select"
			/>
		);
		expect( screen.getByAltText( "Selected social image" ) ).toBeInTheDocument();
	} );

	it( "hides the image preview when hasPreview is false", () => {
		render(
			<SocialImageSelect
				label="Social image"
				imageUrl="https://example.com/image.jpg"
				defaultImageUrl="https://example.com/default-image.jpg"
				usingFallback={ false }
				imageAltText="Selected social image"
				hasPreview={ false }
				id="social-image-select"
			/>
		);
		expect( screen.queryByAltText( "Selected social image" ) ).not.toBeInTheDocument();
		const selectButton = screen.getAllByRole( "button", { name: /replace image/i } );
		expect( selectButton.length ).toBe( 1 );
	} );

	it( "calls onClick when replace buttons are clicked", () => {
		const onClick = jest.fn();
		render(
			<SocialImageSelect
				label="Social image"
				imageUrl=""
				defaultImageUrl="https://example.com/default-image.jpg"
				usingFallback={ false }
				imageAltText="Selected social image"
				hasPreview={ true }
				onClick={ onClick }
				id="social-image-select"
			/>
		);

		const selectButton = screen.getAllByRole( "button", { name: /replace image/i } );
		fireEvent.click( selectButton[ 0 ] );
		expect( onClick ).toHaveBeenCalled();
		fireEvent.click( selectButton[ 1 ] );
		expect( onClick ).toHaveBeenCalled();
	} );

	it( "calls onClick when select buttons are clicked", () => {
		const onClick = jest.fn();
		render(
			<SocialImageSelect
				label="Social image"
				imageUrl=""
				defaultImageUrl=""
				usingFallback={ false }
				imageAltText="Selected social image"
				hasPreview={ true }
				onClick={ onClick }
				id="social-image-select"
			/>
		);

		const selectButton = screen.getAllByRole( "button", { name: /select image/i } );
		fireEvent.click( selectButton[ 0 ] );
		expect( onClick ).toHaveBeenCalled();
		fireEvent.click( selectButton[ 1 ] );
		expect( onClick ).toHaveBeenCalled();
	} );

	it( "calls onRemoveImageClick when remove image button is clicked", () => {
		const onRemoveImageClick = jest.fn();
		render(
			<SocialImageSelect
				label="Social image"
				imageUrl="https://example.com/image.jpg"
				defaultImageUrl="https://example.com/default-image.jpg"
				usingFallback={ false }
				imageAltText="Selected social image"
				hasPreview={ true }
				onRemoveImageClick={ onRemoveImageClick }
				id="social-image-select"
			/>
		);
		const removeButton = screen.getByRole( "button", { name: /remove image/i } );
		fireEvent.click( removeButton );
		expect( onRemoveImageClick ).toHaveBeenCalled();
	} );
} );
