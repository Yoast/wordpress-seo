import "raf/polyfill";
import Enzyme from "enzyme";
import EnzymeAdapter from "enzyme-adapter-react-16";

Enzyme.configure( { adapter: new EnzymeAdapter() } );

jest.mock( "@wordpress/i18n", () => {
	return {
		__: translation => translation,
	};
} );

