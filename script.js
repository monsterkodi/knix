
document.observe("dom:loaded", function()
{
    $$(".menu").each(function (menu) { menu.raise(); });

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

    Widget.new({x:130, y:0,   width:130, height:100, title:"nomove",  isMovable:0});
    Widget.new({x:130, y:110, width:200, height:100, title:"notitle", hasTitle:0});
    Widget.new({x:130, y:220, width:200, height:100, title:"noclose", hasClose:0});
    Widget.new({x:130, y:330, width:200, height:100, title:"noshade", hasShade:0});
    Widget.new({x:130, y:440, width:200, height:100, title:"titleonly", hasShade:0, hasClose:0});
});
