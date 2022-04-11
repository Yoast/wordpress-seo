/**
 * Creates a category element.
 *
 * @param {string} id   The id of the category.
 * @param {string} name The name of the category.
 *
 * @returns {{checkbox: HTMLInputElement, label: HTMLLabelElement}} The category checkbox element and the parent element of that checkbox.
 */
const createCategoryElement = ( id, name ) => {
	const label = document.createElement( "label" );

	const checkbox = document.createElement( "input" );
	checkbox.setAttribute( "type", "checkbox" );
	checkbox.setAttribute( "value", id );

	const text = document.createTextNode( name );

	label.append( checkbox, text );

	return { checkbox, label };
};

/**
 * Creates all category elements.
 *
 * @returns {{allCategoryCheckboxes:{}, allCategories: HTMLDivElement}}  The created elements.
 */
const createAllCategoryElements = () => {
	const catElement1 = createCategoryElement( "1", "cat1" );
	const catElement2 = createCategoryElement( "2", "cat2" );
	const catElement3 = createCategoryElement( "3", "cat3" );
	const catElement4 = createCategoryElement( "4", "Birds" );
	const catElement5 = createCategoryElement( "5", "dogs" );

	const allCats = document.createElement( "div" );
	allCats.setAttribute( "id", "categorychecklist" );
	allCats.append( catElement1.label, catElement2.label, catElement3.label, catElement4.label, catElement5.label );

	const allCategoryCheckboxes = {
		cat1: catElement1.checkbox,
		cat2: catElement2.checkbox,
		cat3: catElement3.checkbox,
		cat4: catElement4.checkbox,
		cat5: catElement5.checkbox,
	};

	return {
		allCategoryCheckboxes,
		allCategories: allCats,
	};
};

/**
 * Creates the most used category elements.
 *
 * @returns {HTMLDivElement} The created elements
 */
const createMostUsedCategoryElements = () => {
	const mostUsedCat1Checkbox = createCategoryElement( "1", "cat1" ).checkbox;
	const mostUsedCat2Checkbox = createCategoryElement( "2", "cat2" ).checkbox;

	const mostUsedCatsDiv = document.createElement( "div" );
	mostUsedCatsDiv.setAttribute( "id", "categorychecklist-pop" );
	mostUsedCatsDiv.append( mostUsedCat1Checkbox, mostUsedCat2Checkbox );

	return mostUsedCatsDiv;
};

/**
 * Creates a tag list element.
 *
 * @param {string} tag The tag text node.
 *
 * @returns {HTMLLIElement} The tag list element.
 */
const createTagElement = ( tag ) => {
	// Create regular tag elements.
	const list = document.createElement( "li" );
	const listChildNode1 = document.createElement( "button" );
	const listChildNode2 = document.createTextNode( "" );
	const listChildNode3 = document.createTextNode( tag );

	list.append( listChildNode1, listChildNode2, listChildNode3 );

	return list;
};

/**
 * Creates all tag elements.
 *
 * @returns {{tagsListElement: HTMLUListElement, parentTagElement: HTMLDivElement}} The tags elements created.
 */
const createAllTagElements = () => {
	const tag1 = createTagElement( "cat food" );
	const tag2 = createTagElement( "cat snack" );

	const tagsListElement = document.createElement( "ul" );
	tagsListElement.setAttribute( "class", "tagchecklist" );
	tagsListElement.append( tag1, tag2 );

	const parentTagElement = document.createElement( "div" );
	parentTagElement.setAttribute( "id", "post_tag" );
	parentTagElement.appendChild( tagsListElement );

	return { tagsListElement, parentTagElement };
};

/**
 * Creates all hierarchical custom taxonomy elements.
 *
 * @returns {{allCTElements: HTMLDivElement, allCTCheckboxes: {actor1: HTMLInputElement, actor2: HTMLInputElement,
 * actor3: HTMLInputElement}}}  All custom taxonomy elements created.
 */
const createAllHierarchicalCTElements = () => {
	// Set to the document the hierarchical custom taxonomy elements.
	const actorElement1 = createCategoryElement( "1", "actor1" );
	const actorElement2 = createCategoryElement( "2", "actor2" );
	const actorElement3 = createCategoryElement( "3", "actor3" );

	const allActors = document.createElement( "div" );
	allActors.setAttribute( "id", "actorschecklist" );
	allActors.append( actorElement1.label, actorElement2.label, actorElement3.label );

	const allCTCheckboxes = {
		actor1: actorElement1.checkbox,
		actor2: actorElement2.checkbox,
		actor3: actorElement3.checkbox,
	};

	return {
		allCTCheckboxes,
		allCTElements: allActors,
	};
};

/**
 * Creates most used hierarchical custom taxonomy elements.
 *
 * @returns {HTMLDivElement}    The created elements.
 */
const createMostUsedCTElements = () => {
	const mostUsedActor1 = createCategoryElement( "1", "actor1" ).checkbox;
	const mostUsedActor2 = createCategoryElement( "2", "actor2" ).checkbox;

	const mostUsedActors = document.createElement( "div" );
	mostUsedActors.setAttribute( "id", "actorschecklist-pop" );
	mostUsedActors.append( mostUsedActor1, mostUsedActor2 );

	return mostUsedActors;
};


/**
 * Creates non hierarchical custom taxonomy elements.
 *
 * @returns {HTMLDivElement} The non-hierarchical custom taxonomy elements created.
 */
const createNonHierarchicalCTElements = () => {
	// Set to the document the non-hierarchical custom taxonomy elements.
	const director1 = createTagElement( "Steven Spielberg" );
	const director2 = createTagElement( "Spike Lee" );

	const nonHierarchicalCTElement = document.createElement( "ul" );
	nonHierarchicalCTElement.setAttribute( "class", "tagchecklist" );
	nonHierarchicalCTElement.append( director1, director2 );

	// Set the parent element for the non-hierarchical custom taxonomies.
	const nonHierarchicalParentElement = document.createElement( "div" );
	nonHierarchicalParentElement.setAttribute( "id", "directors" );
	nonHierarchicalParentElement.appendChild( nonHierarchicalCTElement );

	return nonHierarchicalParentElement;
};

/**
 * Creates the elements for post and term slug.
 *
 * @returns {{fullLengthSlugElement: HTMLSpanElement, postNameElement: HTMLInputElement,
 * slugEditDiv: HTMLDivElement, shortSlugElement: HTMLSpanElement}} The created slug elements
 */
const createSlugElements = () => {
	// Creates post slug elements.
	const fullLengthSlugElement = document.createElement( "span" );
	fullLengthSlugElement.setAttribute( "id", "editable-post-name-full" );

	const fullLengthSlugText = document.createTextNode( "best-cat-food" );
	fullLengthSlugElement.appendChild( fullLengthSlugText );

	const shortSlugElement = document.createElement( "span" );
	shortSlugElement.setAttribute( "id", "editable-post-name" );

	const shortSlugText = document.createTextNode( "best-cat" );
	shortSlugElement.appendChild( shortSlugText );

	const slugEditDiv = document.createElement( "div" );
	slugEditDiv.appendChild( fullLengthSlugElement );
	slugEditDiv.appendChild( shortSlugElement );

	const postNameElement = document.createElement( "input" );
	postNameElement.setAttribute( "id", "post_name" );
	postNameElement.setAttribute( "value", "cat-toys" );

	// Creates term slug elements.
	const termSlugElement = document.createElement( "input" );
	termSlugElement.setAttribute( "id", "slug" );
	termSlugElement.setAttribute( "value", "cat-adoption" );

	return {
		fullLengthSlugElement: fullLengthSlugElement,
		shortSlugElement: shortSlugElement,
		slugEditDiv: slugEditDiv,
		postNameElement: postNameElement,
		termSlugElement: termSlugElement,
	};
};

export {
	createCategoryElement,
	createTagElement,
	createAllCategoryElements,
	createMostUsedCategoryElements,
	createAllTagElements,
	createAllHierarchicalCTElements,
	createMostUsedCTElements,
	createNonHierarchicalCTElements,
	createSlugElements,
};
