function check_password()
{
    var pass = document.getElementById('password');
    var conf_password = document.getElementById('conf_password');
  
    var message = document.getElementById('message');
    
    if(pass.value == conf_password.value){
		conf_password.style.backgroundColor = "#006600";
        message.style.color = "#006600";
        message.innerHTML = "Passwords match!"
	}
	else{
        conf_password.style.backgroundColor = "#ff1a1a";
        message.style.color = "darkred";
        message.innerHTML = "Passwords do not match!"
    }
}  