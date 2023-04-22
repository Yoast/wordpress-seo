let mockSelectors = {};

module.exports = {
	__setMockSelectors: selectors => {
		mockSelectors = { ...selectors };
	},
	useSelect: select => select( () => mockSelectors ),
};
