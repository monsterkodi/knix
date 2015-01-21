
function newElement(type)
{
    e = new Element(type);
    e.identify();
    return e;
}

document.observe("dom:loaded", function()
{
    $('add_a').observe('click', function(e)
    {
        var size = window.getComputedStyle($('content'));
        var cfg = {
            width:100,
            height:200,
            x:Math.random()*parseInt(size.width),
            y:Math.random()*parseInt(size.height)
        };
        var wdg = Widget.new(cfg);
    });

    $('add_b').observe('click', function(e)
    {
        var div = newElement('div').addClassName("b");
        var drg = newElement('div').addClassName("b_drag");
        //$('content').insert(div);
        div.insert(drg);
        var content_style = window.getComputedStyle($('content'));
        div.setStyle({
            left: String(Math.random()*parseInt(content_style.width))+"px",
            top:  String(Math.random()*parseInt(content_style.height))+"px"
        });
        new dragObject(div, drg);
    });

    log('hello %d'.fmt(2));

    Widget.new({width:100, height:200, title:"nomove",  isMovable:0});
    Widget.new({width:200, height:100, title:"notitle", hasTitle:0});
    Widget.new({width:100, height:200, title:"noclose", hasClose:0});

});
