// ==UserScript==
// @name          Quickcamp
// @namespace     http://sebadog.com/quickcamp
// @description	  Organize you projects, Quick!
// @include       http*://*.projectpath.com/*
// @include       http*://*.updatelog.com/*
// @include       http*://*.clientsection.com/*
// @include       http*://*.seework.com/*
// @include       http*://*.grouphub.com/*
// ==/UserScript==

(function() {
// Constants
var glIsMain=false;
window.addEventListener('keydown', keyHandler, false);

var d1=ebi("Tabs");
var d2=ebi("Header");
var link=new Array();
links={
  79:{
    pObj:lookForTab(d1,"Overview","O"),
    },
  84:{
    pObj:lookForTab(d1,"To-Do","T")||lookForTab(d1,"To-Dos","T"),
    },
  73:{
    pObj:lookForTab(d1,"Milestones","i"),
    },
  77:{
    pObj:lookForTab(d1,"Messages","M"),
    },
  87:{
    pObj:lookForTab(d1,"Writeboards","W"),
    },
  80:{
    pObj:lookForTab(d1,"People","P"),
    },
  65:{
    pObj:lookForTab(d1,"Account","A"),
    },
  70:{
    pObj:lookForTab(d1,"Files","F"),
    },
  69:{
    pObj:lookForTab(d1,"Time","e"),
    },
  76:{
    pObj:lookForTab(d1,"Templates","l"),
    },
  83:{
    pObj:lookForTab(d1,"Search","S"),
    },
  68:{
    pObj:lookForTab(d1,"Dashboard","D")||lookForLink(d2,"Dashboard","D"),
    },
  71:{
    pObj:lookForTab(d1,"Settings","g")||lookForLink(d2,"Settings","g"),
    },
  78:{
    pObj:lookForLink(d2,"Permissions","n"),
    },
  72:{
    pObj:lookForLink(d2,"Help","H"),
    },
  67:{
   pObj:lookForLink(d2,"Choose a project","C"),
    }
  };

function keyHandler(event) {
    
  if ( event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) {
    return false;
  }
  
  if (event.target && event.target.nodeName) {
    var targetNodeName = event.target.nodeName.toLowerCase();
    if (targetNodeName == "select" || targetNodeName == "textarea" ||
        (targetNodeName == "input" && event.target.type &&
         event.target.type.toLowerCase() == "text")) {
      return false;
    }
  }
  if (event.keyCode in links) {
    if (event.keyCode==67) {
      ebi("P2P_selector").style.display="inline";
      ebi("P2P_link").style.display="none";
      ebi("projectSelector").focus();
    } else {
      if (links[event.keyCode].pObj){
        location.href=links[event.keyCode].pObj.href;
      }
    }
  }
  return false;
}

})();


function ebi(pId){
  return document.getElementById(pId);
}
function ebtn(pObj,pTag){
  return pObj.getElementsByTagName(pTag);
}
function underline(pObj,pUnderline) {
  var lText=pObj.innerHTML;
  var n=lText.indexOf(pUnderline);
  lNewText=lText.substring(0,n)+'<span style="text-decoration:underline!important">'+lText.substring(n,n+1)+'</span>'+lText.substring(n+1);
  pObj.innerHTML=lNewText;
}
function getLink(pObj){
  return pObj.href;
}
function mark(pObj,pUnderline) {
  var lText=pObj.innerHTML;
  var n=lText.indexOf(pUnderline);
  lNewText=lText.substring(0,n)+'<span style="background:#04143F!important;text-decoration:underline;">'+lText.substring(n,n+1)+'</span>'+lText.substring(n+1);
  pObj.innerHTML=lNewText;
}
function getLink(pObj){
  return pObj.href;
}
function nounderline(pObj){
  pObj.style.textDecoration="none";
}
function getElementsByAttribute(pObj,pAttr,pValue,pArr) {
  if (!pArr) {
    var pArr=new Array();
  }
  if (pObj) {
    if (pAttr=="innerHTML"){
      if (pObj.innerHTML==pValue){
        pArr[pArr.length]=pObj;
      }
    }else{
      if (pObj.getAttribute(pAttr)==pValue){
        pArr[pArr.length]=pObj;
      }
    }
    if (pObj.hasChildNodes) {
      for (var i=0;i<pObj.childNodes.length;i++){
        if (pObj.childNodes[i].nodeName!="#text") {
          pArr=getElementsByAttribute(pObj.childNodes[i],pAttr,pValue,pArr) ;
        }
      }
    }
  } else {
    return false;
  }
  return pArr;
}
function lookForTab(pObj,pStr,pShortcut){
  var lItems=getElementsByAttribute(pObj,"innerHTML",pStr);
  if (lItems.length>0) {
    underline(lItems[0],pShortcut);
    return lItems[0];
  } else {
    return false;
  }
}
function lookForLink(pObj,pStr,pShortcut){
  var lItems=getElementsByAttribute(pObj,"innerHTML",pStr);
  if (lItems.length>0) {
    mark(lItems[0],pShortcut);
    return lItems[0];
  } else {
    return false;
  }
}