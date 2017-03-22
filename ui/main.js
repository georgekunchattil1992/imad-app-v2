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
    			var counter=request.responseText;
    			var span=document.getElementById('count');
    			span.innerHTML=counter.toString();
    		}
    	}
    	//Not done yet
    };

};