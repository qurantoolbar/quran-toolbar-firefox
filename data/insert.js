
var div;
var lastFocused;
self.port.on("add", function(text) {
  
  function pasteHtmlAtCaret(html) {
    var sel, range;
    if (window.getSelection) {
        // IE9 and non-IE
        sel = window.getSelection();
        if (sel.getRangeAt && sel.rangeCount) {
            range = sel.getRangeAt(0);
            range.deleteContents();

            // Range.createContextualFragment() would be useful here but is
            // non-standard and not supported in all browsers (IE9, for one)
            var el = document.createElement("div");
            el.innerHTML = html;
            var frag = document.createDocumentFragment(), node, lastNode;
            while ( (node = el.firstChild) ) {
                lastNode = frag.appendChild(node);
            }
            range.insertNode(frag);

            // Preserve the selection
            if (lastNode) {
                range = range.cloneRange();
                range.setStartAfter(lastNode);
                range.collapse(true);
                sel.removeAllRanges();
                sel.addRange(range);
            }
        }
    } else if (document.selection && document.selection.type != "Control") {
        // IE < 9
        document.selection.createRange().pasteHTML(html);
    }
  }
  //http://stackoverflow.com/questions/1064089/inserting-a-text-where-cursor-is-using-javascript-jquery
  function insertText(text) {
    var input = lastFocused;
    console.log(input);
    if (input == undefined) { return; }
    var scrollPos = input.scrollTop;
    var pos = 0;
    var browser = ((input.selectionStart || input.selectionStart == "0") ? 
      "ff" : (document.selection ? "ie" : false ) );
    if (browser == "ie") { 
      input.focus();
      var range = document.selection.createRange();
      range.moveStart ("character", -input.value.length);
      pos = range.text.length;
    }
    else if (browser == "ff") { pos = input.selectionStart };

    var front = (input.value).substring(0, pos);  
    var back = (input.value).substring(pos, input.value.length); 
    input.value = front+text+back;
    pos = pos + text.length;
    if (browser == "ie") { 
      input.focus();
      var range = document.selection.createRange();
      range.moveStart ("character", -input.value.length);
      range.moveStart ("character", pos);
      range.moveEnd ("character", 0);
      range.select();
    }
    else if (browser == "ff") {
      input.selectionStart = pos;
      input.selectionEnd = pos;
      input.focus();
    }
    input.scrollTop = scrollPos;
  }
  lastFocused = document.activeElement;

  if (document.activeElement.tagName === 'DIV' && 'contenteditable' in document.activeElement.attributes &&
      document.activeElement.attributes['contenteditable'].value.toLowerCase() === 'true'){
    lastFocused.focus();
    pasteHtmlAtCaret(text);
  } else if ((document.activeElement.tagName === 'INPUT' && 'type' in document.activeElement.attributes &&
           document.activeElement.attributes['type'].value.toLowerCase() === 'text') ||
           (document.activeElement.tagName === 'TEXTAREA')) {
    insertText(text);
  }
});
