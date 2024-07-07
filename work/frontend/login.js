
document.addEventListener('DOMContentLoaded',()=>{
    const loginForm=document.getElementById("logCredentials");
    loginForm.addEventListener('submit',login);
    
    console.log("hello")
    function login(event){
        console.log("hey");
        event.preventDefault();
        const s_email = document.getElementById('loginEmail').value;
        const s_contact = document.getElementById('loginPassword').value;
        
        const login_url="http://127.0.0.1:5000/staff";
        fetch(login_url, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ s_email, s_contact })
        })
        .then(response=>response.json())
        .then(data=>{
            var alert=document.getElementById("alert");
            var existing=document.getElementById("alertMsg");
            if(existing){
                existing.remove();
            }
            var loginAlert=document.createElement("div");
            loginAlert.setAttribute("role","alert");
            loginAlert.setAttribute("id","alertMsg");
            if(data["auth"]){
                loginAlert.setAttribute("class","alert alert-success");
                loginAlert.innerHTML="Logged In!";
            }
            else{
                loginAlert.setAttribute("class","alert alert-danger");
                loginAlert.innerHTML=data["msg"]
            }
            alert.appendChild(loginAlert);
        })
    }
})