//Counter code
var button=document.getElementById('counter');

button.onclick=function(){

	//Make a request to the counter endpoint
    var request=new XMLHttpRequest();

	//Capture the response and store it in avariable 
    request.onreadyStatechange=function(){
    	if (request.readyState==XMLHttpRequest.DONE) {
    		//Take some action
    		if (request.status==200) { //status 200 i.e request is in successful state
    			
    	}
    	//Not done yet
    };

    //Make the request
    request.open('GET','http://georgekunchattil1992.imad.hasura-app.io/counter',true);
    request.send(null);
    //Capture a list of names and render it as a list
    var names=['name1','name2','name3','name4'];
    var list='';
    for (var i=0;i<names.length;i++){
      list+='<li>'+names[i]+'</li>';
  }
  var ul=document.getElementById('namelist');
  ul.innerHTML=list;
};
