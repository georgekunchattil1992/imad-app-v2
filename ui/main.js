//Counter code
var button=document.getElementById('counter');
var counter=0;

button.onclick=function(){

	//Make a request to the counter endpoint
    var request=new XMLHttpRequest();

	//Capture the response and store it in avariable 

	//Render the variable in the correct span
	counter=counter+1;
	var span=document.getElementById('count');
	span.innerHTML=counter.toString();
};