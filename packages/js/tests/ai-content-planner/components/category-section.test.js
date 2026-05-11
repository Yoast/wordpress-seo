import { render, screen, fireEvent } from "@testing-library/react";
import { CategorySection } from "../../../src/ai-content-planner/components/category-section";

const renderCategorySection = ( props = {} ) => render(
	<CategorySection { ...props } />
);

describe( "CategorySection", () => {
	describe( "toggle", () => {
		it( "renders the Suggest category toggle", () => {
			renderCategorySection();
			expect( screen.getByRole( "switch", { name: "Suggest category" } ) ).toBeInTheDocument();
		} );

		it( "renders the toggle as checked when isEnabled is true", () => {
			renderCategorySection( { isEnabled: true } );
			expect( screen.getByRole( "switch", { name: "Suggest category" } ) ).toBeChecked();
		} );

		it( "renders the toggle as unchecked when isEnabled is false", () => {
			renderCategorySection( { isEnabled: false } );
			expect( screen.getByRole( "switch", { name: "Suggest category" } ) ).not.toBeChecked();
		} );

		it( "disables the toggle when isLoading is true", () => {
			renderCategorySection( { isLoading: true } );
			expect( screen.getByRole( "switch", { name: "Suggest category" } ) ).toBeDisabled();
		} );

		it( "calls onToggle when the toggle is clicked", () => {
			const onToggle = jest.fn();
			renderCategorySection( { onToggle } );
			fireEvent.click( screen.getByRole( "switch", { name: "Suggest category" } ) );
			expect( onToggle ).toHaveBeenCalledTimes( 1 );
		} );

		it( "renders the helper description text", () => {
			renderCategorySection();
			expect( screen.getByText( "Adds post to an existing category, when applicable." ) ).toBeInTheDocument();
		} );
	} );

	describe( "CategoryBadge", () => {
		it( "shows the category name badge when isEnabled is true and category name is provided", () => {
			renderCategorySection( { isEnabled: true, category: { name: "WordPress" } } );
			expect( screen.getByText( "WordPress" ) ).toBeInTheDocument();
		} );

		it( "does not show the category badge when isEnabled is false", () => {
			renderCategorySection( { isEnabled: false, category: { name: "WordPress" } } );
			expect( screen.queryByText( "WordPress" ) ).not.toBeInTheDocument();
		} );

		it( "does not show the category badge when category name is absent", () => {
			renderCategorySection( { isEnabled: true } );
			expect( screen.queryByText( "WordPress" ) ).not.toBeInTheDocument();
		} );

		it( "shows a skeleton loader when isLoading is true instead of the badge", () => {
			renderCategorySection( { isLoading: true, isEnabled: true, category: { name: "WordPress" } } );
			// The skeleton is rendered as a div inside the inline-flex container — badge text is not present.
			expect( screen.queryByText( "WordPress" ) ).not.toBeInTheDocument();
		} );
	} );
} );
