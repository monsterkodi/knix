document.observe("dom:loaded", function() {
    Widget = window.Widget;

    $$(".menu").each(function(menu) {
        menu.raise();
    });

    $('add_a').observe('click', function(e) {
        var size = window.getComputedStyle($('content'));
        var cfg = {
            width: 300,
            height: 200,
            x: Math.random() * parseInt(size.width),
            y: Math.random() * parseInt(size.height),
            hasSize: true,
        };
        var wdg = Widget.new(cfg);
    });

    $('add_b').observe('click', function(e) {
        log('hello');
    });

    $('del').observe('click', function(e) {
        Widget.closeAll();
    });

    // Widget.create({
    //     x: 130,
    //     y: 0,
    //     width: 130,
    //     height: 100,
    //     title: "nomove",
    //     isMovable: false
    // });
    // Widget.create({
    //     x: 130,
    //     y: 110,
    //     width: 200,
    //     height: 100,
    //     title: "notitle",
    //     hasTitle: false
    // });
    // Widget.create({
    //     x: 130,
    //     y: 220,
    //     width: 200,
    //     height: 100,
    //     title: "noclose",
    //     hasClose: false
    // });
    // Widget.create({
    //     x: 130,
    //     y: 330,
    //     width: 200,
    //     height: 100,
    //     title: "noshade",
    //     hasShade: false
    // });
    // Widget.create({
    //     x: 130,
    //     y: 440,
    //     width: 200,
    //     height: 100,
    //     title: "titleonly",
    //     hasShade: false,
    //     hasClose: false
    // });
    // Widget.new({ x:500, y:0,   width:130,             title:"noheight"});
    // Widget.new({ x:500, y:40,                          title:"nowidth"});
    // Widget.new({ x:500, y:80,                          title:"noshade",  hasShade:   false });
    // Widget.new({ x:500, y:120,                         title:"noclose",  hasClose:   false });
    // Widget.new({ x:500, y:160,                         title:"notitle",  hasTitle:   false });
    // Widget.new({ x:500, y:160,                         title:"notitle",  hasTitle:   false });
    // Widget.create({
    //     x: 500,
    //     y: 200,
    //     width: 130,
    //     height: 130,
    //     title: "nothing",
    //     hasTitle: false,
    //     hasShade: false,
    //     hasClose: false
    // });

    console.log(window.Widget)
    w = Widget.create({
        x: 500,
        y: 50,
        width: 200,
        height: 100,
        title: "ABgqresize",
        hasSize: true
    });
    // Scroller.new({
    //     vertical: true,
    //     parentID: w.id,
    //     width: 20,
    //     height: 100
    // });

});
