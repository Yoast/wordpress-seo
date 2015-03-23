var reqTest = require('../js/analyzer.js');

args = {
    textString: "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin laoreet turpis ut ex eleifend scelerisque. Phasellus tempus lorem enim, ut gravida justo pulvinar non. Curabitur sed mattis lectus. Maecenas commodo ipsum auctor, ultricies nisl quis, iaculis nisl. Donec sed libero dolor. Suspendisse orci nisi, pretium in tempor vel, eleifend at metus. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Aliquam erat volutpat. Etiam ac eleifend odio. Aenean venenatis, nunc vel condimentum tempus, elit nisi mattis velit, eget bibendum enim ipsum sed justo. Duis porta ullamcorper odio at vulputate. Phasellus vitae sollicitudin augue, quis rutrum arcu. Quisque posuere porta magna, et aliquam est tincidunt ut.</p><p>Nam tempus, ex vehicula pharetra ultricies, ante mi gravida felis, in placerat purus lectus in eros. Cras eu nisi erat. Morbi purus nisl, condimentum vel nunc in, consequat dapibus eros. Nullam sagittis nulla id lorem hendrerit consequat. Suspendisse varius neque tortor, eget sollicitudin metus vestibulum a. Fusce tincidunt ornare sem, id porta justo ultricies vel. Mauris est sem, volutpat quis ex ac, molestie mollis odio. Fusce magna libero, vestibulum ac diam et, mollis malesuada quam. Integer placerat lorem ac malesuada gravida. Phasellus ante nibh, mattis a bibendum nec, commodo vitae lectus. Praesent malesuada efficitur nisl in semper. Nunc lacinia ante a lorem semper pretium. Pellentesque turpis augue, tincidunt euismod magna non, convallis laoreet arcu. Phasellus eleifend id ex eu malesuada.</p><p>In egestas mauris tellus, in scelerisque leo maximus at. Proin ultrices bibendum nulla, nec condimentum nunc consequat id. Nullam odio est, vehicula dapibus nunc eu, ultricies ullamcorper metus. Praesent blandit, turpis quis dictum mattis, risus ipsum ultrices mauris, eu auctor purus urna vel tortor. Sed nec feugiat justo, ac posuere erat. Nunc semper eleifend lacus, ut sollicitudin sem luctus id. Nunc a eleifend mi. Sed id eleifend nisi. Duis vitae sapien eu mauris vulputate laoreet. Proin porttitor luctus neque, vitae bibendum ligula imperdiet at. Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p><p>Sed accumsan orci quis libero feugiat, iaculis congue erat ornare. Donec sem nibh, blandit ut rhoncus et, pellentesque id nibh. Proin ornare velit condimentum ante euismod, ac pellentesque massa aliquam. Quisque pharetra vitae nulla at faucibus. Cras laoreet quis tortor porta hendrerit. Praesent tempor mattis arcu quis molestie. Sed maximus pulvinar velit, sed ultricies magna vestibulum ac. Duis aliquet suscipit euismod. Aenean sit amet nisl ante. Curabitur semper mauris ut lectus iaculis, id lobortis dui gravida. Aliquam non dolor at leo tristique gravida. Aliquam at felis ut odio laoreet accumsan eget vel urna. Donec egestas iaculis lorem, eget pretium ante tempus nec. Aenean non libero augue. Proin imperdiet sollicitudin diam ac venenatis.</p><p>Vestibulum mattis magna quis nisl ornare, quis bibendum odio pretium. Sed posuere quis risus nec accumsan. Suspendisse potenti. Nam porta, eros a vehicula pretium, purus nisi rutrum neque, a porta erat tortor nec risus. Duis blandit velit nibh, vel egestas risus accumsan eget. Nulla a est et sem lacinia rutrum. Vivamus cursus molestie porta. Maecenas cursus orci commodo finibus dapibus.</p>",
    smallString: "<h1>Dit is een</h1> <h2>standaard</h2>- TEKST <ul><li>test1</li><li>test2</li><li>test3</li><li>test4</li></ul>met VEEL caps, spaties, <h6>tekens</h6> en andere overbodige meuk!?'...; <img src='http://linknaarplaatje' alt='mooiplaatje' />Het aantal Woorden<br><br> is negentien"
};

output = {
    cleanText: "<h1>dit is een</h1> <h2>standaard</h2> tekst <ul><li>test1</li><li>test2</li><li>test3</li><li>test4</li></ul>met veel caps spaties <h6>tekens</h6> en andere overbodige meuk. <img src= http //linknaarplaatje alt= mooiplaatje />het aantal woorden<br><br> is negentien.",
    cleanTextSomeTags: "<h1>dit is een</h1> <h2>standaard</h2> tekst <li>test1</li><li>test2</li><li>test3</li><li>test4</li> met veel caps spaties <h6>tekens</h6> en andere overbodige meuk. het aantal woorden is negentien.",
    cleanTextNoTags: "dit is een standaard tekst test1 test2 test3 test4 met veel caps spaties tekens en andere overbodige meuk. het aantal woorden is negentien."
};

describe("preprocessor flattext output", function(){
    it("returns processed clean text", function(){
        preproc = new PreProcessor(args.smallString);
        expect(preproc._store.cleanText).toBe(output.cleanText);
    })
});

describe("preprocessor flattext output", function(){
    it("returns processed notags text", function(){
        preproc = new PreProcessor(args.smallString);
        expect(preproc._store.cleanTextNoTags).toBe(output.cleanTextNoTags);
    })
});

describe("preprocessor flattext output", function(){
    it("returns processed sometags text", function(){
        preproc = new PreProcessor(args.smallString);
        expect(preproc._store.cleanTextSomeTags).toBe(output.cleanTextSomeTags);
    })
});
