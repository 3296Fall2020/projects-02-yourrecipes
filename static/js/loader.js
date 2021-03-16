document.onreadystatechange = function () {
  var state = document.readyState;
  if (state == 'loading') {
       document.getElementById('body').style.visibility="hidden";
       document.getElementById('spinner').style.visibility="visible";
  } else if (state == 'complete') {
      setTimeout(function(){
         document.getElementById('interactive');
         document.getElementById('spinner').style.visibility="hidden";
         document.getElementById('body').style.visibility="visible";
      },500);
  }
}
