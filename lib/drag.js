function hookEvent(element, eventName, callback)
{
  if(typeof(element) == "string")
    element = document.getElementById(element);
  if(element == null)
    return;
  if(element.addEventListener)
  {
    element.addEventListener(eventName, callback, false);
  }
  else if(element.attachEvent)
    element.attachEvent("on" + eventName, callback);
}

function unhookEvent(element, eventName, callback)
{
  if(typeof(element) == "string")
    element = document.getElementById(element);
  if(element == null)
    return;
  if(element.removeEventListener)
    element.removeEventListener(eventName, callback, false);
  else if(element.detachEvent)
    element.detachEvent("on" + eventName, callback);
}

function cancelEvent(e)
{
  e = e ? e : window.event;
  if(e.stopPropagation)
    e.stopPropagation();
  if(e.preventDefault)
    e.preventDefault();
  e.cancelBubble = true;
  e.cancel = true;
  e.returnValue = false;
  return false;
}

function Position(x, y)
{
  this.x = x;
  this.y = y;

  this.Add = function(val)
  {
    var newPos = new Position(this.x, this.y);
    if(val != null)
    {
      if(!isNaN(val.x))
        newPos.x += val.x;
      if(!isNaN(val.y))
        newPos.y += val.y
    }
    return newPos;
  }

  this.Subtract = function(val)
  {
    var newPos = new Position(this.x, this.y);
    if(val != null)
    {
      if(!isNaN(val.x))
        newPos.x -= val.x;
      if(!isNaN(val.y))
        newPos.y -= val.y
    }
    return newPos;
  }

  this.Min = function(val)
  {
    var newPos = new Position(this.x, this.y)
    if(val == null)
      return newPos;

    if(!isNaN(val.x) && this.x > val.x)
      newPos.x = val.x;
    if(!isNaN(val.y) && this.y > val.y)
      newPos.y = val.y;

    return newPos;
  }

  this.Max = function(val)
  {
    var newPos = new Position(this.x, this.y)
    if(val == null)
      return newPos;

    if(!isNaN(val.x) && this.x < val.x)
      newPos.x = val.x;
    if(!isNaN(val.y) && this.y < val.y)
      newPos.y = val.y;

    return newPos;
  }

  this.Bound = function(lower, upper)
  {
    var newPos = this.Max(lower);
    return newPos.Min(upper);
  }

  this.Check = function()
  {
    var newPos = new Position(this.x, this.y);
    if(isNaN(newPos.x))
      newPos.x = 0;
    if(isNaN(newPos.y))
      newPos.y = 0;
    return newPos;
  }

  this.Apply = function(element)
  {
    if(typeof(element) == "string")
      element = document.getElementById(element);
    if(element == null)
      return;
    if(!isNaN(this.x))
      element.style.left = this.x + 'px';
    if(!isNaN(this.y))
      element.style.top = this.y + 'px';
  }
}

function absoluteCursorPostion(eventObj)
{
  eventObj = eventObj ? eventObj : window.event;

  if(isNaN(window.scrollX))
    return new Position(eventObj.clientX + document.documentElement.scrollLeft + document.body.scrollLeft,
      eventObj.clientY + document.documentElement.scrollTop + document.body.scrollTop);
  else
    return new Position(eventObj.clientX + window.scrollX, eventObj.clientY + window.scrollY);
}

function dragObject(element, attachElement, minBound, maxBound, startCallback, moveCallback, endCallback, attachLater)
{
  if(typeof(element) == "string")
    element = document.getElementById(element);
  if(element == null)
      return;

  this.lowerBound = null;
  this.upperBound = null;
  if (minBound != null && maxBound != null)
  {
      this.lowerBound = minBound.Min(maxBound);
      this.upperBound = minBound.Max(maxBound);
  }

  var cursorStartPos = null;
  var elementStartPos = null;
  var dragging = false;
  var listening = false;
  var disposed = false;
  var drag = this;

  function dragStart(eventObj)
  {
    if(dragging || !listening || disposed) return;
    dragging = true;

    if(startCallback != null)
      startCallback(eventObj, element);

    cursorStartPos = absoluteCursorPostion(eventObj);

    style = window.getComputedStyle(element);

    elementStartPos = new Position(parseInt(style.left), parseInt(style.top));
    elementStartPos = elementStartPos.Check();

    hookEvent(document, "mousemove", dragGo);
    hookEvent(document, "mouseup", dragStopHook);

    element.raise();

    return cancelEvent(eventObj);
  }

  function dragGo(eventObj)
  {
    if (!dragging || disposed) return;

    var newPos = absoluteCursorPostion(eventObj);
    newPos = newPos.Add(elementStartPos).Subtract(cursorStartPos);
    newPos = newPos.Bound(drag.lowerBound, drag.upperBound)
    newPos.Apply(element);
    if (moveCallback != null)
      moveCallback(newPos, element);

    return cancelEvent(eventObj);
  }

  function dragStopHook(eventObj)
  {
    dragStop();
    return cancelEvent(eventObj);
  }

  function dragStop()
  {
    if (!dragging || disposed) return;
    unhookEvent(document, "mousemove", dragGo);
    unhookEvent(document, "mouseup", dragStopHook);
    cursorStartPos = null;
    elementStartPos = null;
    if(endCallback != null)
      endCallback(element);
    dragging = false;
  }

  this.Dispose = function()
  {
    if(disposed) return;
    this.StopListening(true);
    element = null;
    attachElement = null
    this.lowerBound = null;
    this.upperBound = null;
    startCallback = null;
    moveCallback = null
    endCallback = null;
    disposed = true;
  }

  this.StartListening = function()
  {
    if(listening || disposed) return;
    listening = true;
    hookEvent(attachElement, "mousedown", dragStart);
  }

  this.StopListening = function(stopCurrentDragging)
  {
    if(!listening || disposed) return;
    unhookEvent(attachElement, "mousedown", dragStart);
    listening = false;

    if(stopCurrentDragging && dragging)
      dragStop();
  }

  this.IsDragging = function(){ return dragging; }
  this.IsListening = function() { return listening; }
  this.IsDisposed = function() { return disposed; }

  if(typeof(attachElement) == "string")
    attachElement = document.getElementById(attachElement);
  if(attachElement == null)
    attachElement = element;

  attachElement.style.cursor='move';

  if(!attachLater)
    this.StartListening();
}
