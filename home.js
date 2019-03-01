document.querySelector('div').addEventListener('input', (e) => {
    //get caret position
    const caretPosition = getCaretPosition(e.target)
    
    //get text before the caret
    const textBeforeCaret = e.target.textContent.substring(0, caretPosition)
    
    //find last word
    const lastWord = e.target.textContent.split(' ').pop();
    
    //is last word predictable
    const isPredictable = predictableWords.some( word => {
      return word.toLowerCase().startsWith(lastWord.toLowerCase())
    })
  
    if (isPredictable) {
      
      const regExp = new RegExp(lastWord, 'g');
      const highLightedText = textBeforeCaret.replace(regExp, '<strong>$&</strong>');
      e.target.innerHTML = highLightedText + e.target.textContent.substring(caretPosition);
      
      setCaretPosition(caretPosition, e.target);
    }
   
  })
  
  const predictableWords = [
    'John',
    'Jane',
    'June'
  ]
  
  
  /**
  * Find caret position 
  */
  function getCaretPosition(editableDiv) {
    var caretPos = 0,
      sel, range;
    if (window.getSelection) {
      sel = window.getSelection();
      if (sel.rangeCount) {
        range = sel.getRangeAt(0);
        if (range.commonAncestorContainer.parentNode == editableDiv) {
          caretPos = range.endOffset;
        }
      }
    } else if (document.selection && document.selection.createRange) {
      range = document.selection.createRange();
      if (range.parentElement() == editableDiv) {
        var tempEl = document.createElement("span");
        editableDiv.insertBefore(tempEl, editableDiv.firstChild);
        var tempRange = range.duplicate();
        tempRange.moveToElementText(tempEl);
        tempRange.setEndPoint("EndToEnd", range);
        caretPos = tempRange.text.length;
      }
    }
    return caretPos;
  }
  
  function setCaretPosition(pos, el){
  
      // Loop through all child nodes
      for(var node of el.childNodes){
          if(node.nodeType == 3){ // we have a text node
              if(node.length >= pos){
                  // finally add our range
                  var range = document.createRange(),
                      sel = window.getSelection();
                  range.setStart(node,pos);
                  range.collapse(true);
                  sel.removeAllRanges();
                  sel.addRange(range);
                  return -1; // we are done
              }else{
                  pos -= node.length;
              }
          }else{
              pos = setCaretPosition(node,pos);
              if(pos == -1){
                  return -1; // no need to finish the for loop
              }
          }
      }
      return pos; // needed because of recursion stuff
  }