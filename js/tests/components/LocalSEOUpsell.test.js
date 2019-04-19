import renderer from "react-test-renderer";
import { ThemeProvider } from "styled-components";
import LocalSEOUpsell from "../../src/components/LocalSEOUpsell";

describe( "LocalSEOUpsell", () => {
	it( "matches the snapshot", () => {
		const component = renderer.create(
			<LocalSEOUpsell
				url="https://example.com"
				backgroundUrl="https://example.com/image"
			/>
		);

		const tree = component.toJSON();
		expect( tree ).toMatchSnapshot();
	} );

	it( "matches the snapshot in right to left mode", () => {
		const component = renderer.create(
			<ThemeProvider theme={ { isRtl: true } }>
				<LocalSEOUpsell
					url="https://example.com"
					backgroundUrl="https://example.com/image"
				/>
			</ThemeProvider>
		);

		const tree = component.toJSON();
		expect( tree ).toMatchSnapshot();
	} );
} );
