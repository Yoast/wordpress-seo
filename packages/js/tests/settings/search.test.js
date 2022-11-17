import Search from '../../src/settings/components/search';
import {shallow} from 'enzyme';

describe('Search test', () => {
    let wrapper;
    beforeEach(()=>{
        wrapper = shallow(<Search />);
    })

    it('Should have "Quick Search" text on search button', () => { 
        expect(wrapper.find('button').text()).toContain('Quick search...');
    });

    it('Input should have placeholder', () => {
    expect(wrapper.find('#input-search').prop('placeholder')).toContain("Search...");
    });

    it('Should not search under 3 characters', async () => {
        wrapper.find('#input-search').at(0).simulate('change', { target: {value: 'se' } });
        expect(wrapper.find('SearchNoResultsContent').find('p').text()).toContain("Please enter a search term that is longer than 3 characters.");
    });

    it('Results not found', async () => {
        wrapper.find('#input-search').at(0).simulate('change', { target: {value: 'random' } });
        expect(wrapper.find('SearchNoResultsContent').find('p').text()).toContain("We couldn’t find anything with that term.");
    });

    it('should match search snapshot', () => {
        expect(wrapper.debug()).toMatchSnapshot();
    });

});