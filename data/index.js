

self.port.on("search", function(text){
  var qse = document.getElementById('quran-search-engine');
  qse.getElementsByClassName('search')[0].value = text;
  qse.getElementsByClassName('searchbn')[0].click();
});






(function() {


var qse = document.getElementById('quran-search-engine');
var chapters = {};

function clear(text){ 
  var vowz = /[\u064b-\u065F]/g;
  text = text.replace(vowz, '');
  var alif = /[\u0621-\u0627]/g;
  text = text.replace(alif, '\u0627');
  text = text.replace(/[\u0671-\u0673]/g, '\u0627');
  text = text.replace(/ /g, '');
  return text;
}



function changeStart() {
  var start = qse.getElementsByClassName('start')[0];
  var end = qse.getElementsByClassName('end')[0];
  if (parseInt(start.value) > parseInt(end.value)){
    end.value = start.value;
  }
  changeAya();
}

function changeEnd() {
  //debugger;
  var start = qse.getElementsByClassName('start')[0];
  var end = qse.getElementsByClassName('end')[0];
  if (parseInt(start.value) > parseInt(end.value)){
    start.value = end.value;
  }
  changeAya();
}

function changeSourat() {
  var sourat = qse.getElementsByClassName('sourat')[0];
  selectSourat(sourat.value);
}

function changeAya() {
  var sourat = qse.getElementsByClassName('sourat')[0];
  var start = qse.getElementsByClassName('start')[0];
  var end = qse.getElementsByClassName('end')[0];
  var text = qse.getElementsByClassName('text')[0];
  var i, quran = '';
  var aya;
  for (i = parseInt(start.value); i <= parseInt(end.value); i++) {
    aya = i + 1;
    quran += chapters[sourat.value][i] + ' (' + aya + ') ';
  }
  text.value = quran;

}
function changeSourat() {
  var sourat = qse.getElementsByClassName('sourat')[0];
  selectSourat(sourat.value);
}
function selectSourat(value) {
  var i;
  var sourat = qse.getElementsByClassName('sourat')[0];
  sourat.value = value;
  var start = qse.getElementsByClassName('start')[0];
  start.innerHTML = '';
  for (i = 0; i < chapters[value].length; i++) {
    var option = document.createElement('option')
    option.setAttribute('value', i)
    var textnode = document.createTextNode(i + 1);
    option.appendChild(textnode);
    start.appendChild(option); 
  }
  var end = qse.getElementsByClassName('end')[0];
  end.innerHTML = '';
  for (i = 0; i < chapters[value].length; i++) {
    var option = document.createElement('option');
    option.setAttribute('value', i)
    var textnode = document.createTextNode(i + 1);
    option.appendChild(textnode);
    end.appendChild(option); 
  }
  end.value = chapters[value].length - 1;
  changeAya();
} 
function findInChapter(chapter, p) {
  var i = 0, j = 0;
  all = [];
  var vowz = /[\u064b-\u065F]/g;
  for (j = 0; j < chapter.length; j++) {
    if (chapter[j]===' ' || 
        (chapter.charCodeAt(j) >= 0x064b && chapter.charCodeAt(j) <= 0x065F)) {
      continue;
    }  
    if (i == p) return j;  
    i++;
  }
}

function allIndexOf(toSearch, str) {
    var indices = [];
    for(var pos = str.indexOf(toSearch); pos !== -1; pos = str.indexOf(toSearch, pos + 1)) {
        indices.push({start:pos, end:pos + toSearch.length - 1});
        if (indices.length >= 100)
          break;
    }
    return indices;
}
function f(s){
  qse.getElementsByClassName('results')[0].innerHTML = '';
  var name, i, j, start, end, aya_start, aya_end;
  var all_res = [];
  for (name in chapters) {
    //console.log(name);
    var ret = allIndexOf(clear(s), clear(chapters[name].join('')));
    //console.log(ret);
    for (i = 0; i < ret.length; i++){
      var p = ret[i];
      start = findInChapter(chapters[name].join(''), p.start);
      end = findInChapter(chapters[name].join(''), p.end);
      var ss = chapters[name].join('').substring(start, end);
      for (j = 0; j < info[name].length; j++){
        if (info[name][j].end >= start) {
          aya_start = j;
          break;
        }
      }

      for (j = aya_start; j < info[name].length; j++){
        if (info[name][j].end >= end) {
          aya_end = j;
          break;
        }
      }
      start++;
      var end_word = end, start_word = start;
      while(start_word >= info[name][aya_start].start && chapters[name][aya_start][start_word - info[name][aya_start].start] !== ' ')
        start_word--;
      start = start_word + 1;
      while(end_word <= info[name][aya_end].end && chapters[name][aya_end][end_word - info[name][aya_end].start] !== ' ')
        end_word++;
      end = end_word;
      var res = chapters[name].slice(aya_start, aya_end + 1);
      res[res.length - 1] = res[res.length - 1].substring(0, end + 1 - info[name][aya_end].start) + '</b>' + res[res.length - 1].substring(end + 1 - info[name][aya_end].start);

      res[0] = '<b>' + name + ' : </b>' + res[0].substring(0, start - info[name][aya_start].start - 1) + '<b>' + res[0].substring(start - info[name][aya_start].start - 1);
      var current_res = '';
      current_res += '<div sourat="' + name + '"  aya_start="' + aya_start + '" aya_end="' + aya_end + '">';
      current_res += '<a href="#">';
      for (j = aya_start; j <= aya_end; j++){
        current_res += res[j - aya_start] + ' (' + (j + 1) + ') ';
      }
      current_res += '</a></div>';
      all_res.push(current_res);
      //console.log(current_res);
      
        
    }
    if (all_res.length >= 100)
      break;
    //debugger;
  }
  if (all_res.length == 0) {
    qse.getElementsByClassName('results')[0].innerHTML = '<div><b>النص الذي تبحث عنه غير موجود</b></div>';
    
    qse.getElementsByClassName('results')[0].attributes.style.value = '';
  } else {
    qse.getElementsByClassName('results')[0].innerHTML = all_res.join('');

    qse.getElementsByClassName('results')[0].attributes.style.value = 'overflow-y: auto; height:50%';
    if (all_res.length >= 100)
      qse.getElementsByClassName('results')[0].innerHTML += '<div><b>نتائج البحث كثيرا جداً ولا يمكن اظهرها كلها</b></div>';
  }

  for(i = 0; i < qse.getElementsByClassName('results')[0].children.length; i++) {
    qse.getElementsByClassName('results')[0].children[i].onclick = (function(a) {
      return function() {
        showResult(a); 
      }
    })(qse.getElementsByClassName('results')[0].children[i]);
  }
}
function showResult(selected){
  //console.log(selected.attributes.aya_start);
  var sourat = qse.getElementsByClassName('sourat')[0];
  sourat.value = selected.attributes.sourat.value;
  changeSourat();
  
  qse.getElementsByClassName('start')[0].value = selected.attributes.aya_start.value;
  changeStart();
  qse.getElementsByClassName('end')[0].value = selected.attributes.aya_end.value;
  changeEnd();
}

var info = {};
function findInfo(chapters) {
  var name, j, start, end;
  for (name in chapters) {
    info[name] = [];
    start = 0;
    for (j = 0; j < chapters[name].length; j++){
      info[name].push({start: start, end:start + (chapters[name][j]).length - 1});
      start = start + (chapters[name][j]).length;
    }
  }
}

function loaded() {
  var quran = xmlDoc.getElementsByTagName('HolyQuran')[0];
  var i, j;
  all = [];
  var sourat = qse.getElementsByClassName('sourat')[0];

  for (i = 0; i < quran.children.length; i++) {
    var chapter = [];
    var name = quran.children[i].getAttribute('ChapterName');
    var option = document.createElement('option')
    option.setAttribute('value', name)

    var textnode = document.createTextNode(name);
    option.appendChild(textnode);
    sourat.appendChild(option);
  
    for (j = 0; j < quran.children[i].children.length; j++) {
      chapter.push(quran.children[i].children[j].textContent);
      all.push(quran.children[i].children[j].textContent);
    }
    chapters[name] = chapter;
    
  }
  findInfo(chapters);
  selectSourat(quran.children[0].getAttribute('ChapterName'));
  //console.log(all);
}
//debugger;
var sourat = qse.getElementsByClassName('sourat')[0];
sourat.onchange = changeSourat;
var start = qse.getElementsByClassName('start')[0];
start.onchange = changeStart;
var end = qse.getElementsByClassName('end')[0];
end.onchange = changeEnd;
var close = qse.getElementsByClassName('close')[0];
close.onclick = function (){
  self.port.emit("close");
};
var add = qse.getElementsByClassName('add')[0];
add.onclick = function (){
  self.port.emit("add", qse.getElementsByClassName('text')[0].value);
};

qse.getElementsByClassName('searchbn')[0].onclick = function (){
  //debugger;
  f(qse.getElementsByClassName('search')[0].value);
}

qse.getElementsByClassName('search')[0].onkeydown = function(event){
  if (event.keyCode == 13) qse.getElementsByClassName('searchbn')[0].click();
}
var xmlDoc;



if (window.XMLHttpRequest) {
 xhttp = new XMLHttpRequest();
} else {    // IE 5/6
   xhttp = new ActiveXObject("Microsoft.XMLHTTP");
}


xhttp.overrideMimeType('text/xml');

xhttp.open('GET',  'resource://qurantoolbar/data/quran.xml', true);
xhttp.onreadystatechange = function (oEvent) {  
  if (xhttp.readyState === 4) {
    if (xhttp.status === 200) {
      xmlDoc = xhttp.responseXML;
      loaded(); 
    } else {  
      console.log('Error', xhttp.statusText);  
    }  
  }  
};  


xhttp.send(null);

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


})();
