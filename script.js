
document.observe("dom:loaded", function()
{
    $('add_a').observe('click', function(e)
    {
        var size = window.getComputedStyle($('content'));
        var cfg = {
            width:300,
            height:200,
            x:Math.random()*parseInt(size.width),
            y:Math.random()*parseInt(size.height)
        };
        var wdg = Widget.new(cfg);
    });

    $('add_b').observe('click', function(e)
    {
        log('hello');
    });

    Widget.new({width:100, height:200, title:"nomove",  isMovable:0});
    Widget.new({width:200, height:100, title:"notitle", hasTitle:0});
    Widget.new({width:100, height:200, title:"noclose", hasClose:0});

    $$(".menu").each(function (menu) { menu.raise(); });
});
