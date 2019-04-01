import Styles from "../src/a11y/Styles";

describe( "Styles", () => {
	it( "contains styles for ScreenReaderText", () => {
		expect( Styles.ScreenReaderText.default ).toEqual(
			{
				clip: "rect(1px, 1px, 1px, 1px)",
				position: "absolute",
				height: "1px",
				width: "1px",
				overflow: "hidden",
			}
		);
		expect( Styles.ScreenReaderText.focused ).toEqual(
			{
				clip: "auto",
				display: "block",
				left: "5px",
				top: "5px",
				height: "auto",
				width: "auto",
				zIndex: "100000",
				position: "absolute",
				backgroundColor: "#eeeeee ",
				padding: "10px",
			}
		);
	} );
} );
