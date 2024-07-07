
document.addEventListener("DOMContentLoaded",()=>{
    var form=document.getElementById("signupCredentials");
    form.addEventListener('submit',signUp);
    console.log("yo")
    function signUp(event){
        console.log("hey");
        event.preventDefault();
        const s_name = document.getElementById('signupName').value;
        const s_email = document.getElementById('signupEmail').value;
        const contact = document.getElementById('signupContact').value;
        const s_contact=String(contact)
        const s_isAdmin=document.getElementById('signupRole').value;

        var alert=document.getElementById("alert");
        var existing=document.getElementById("alertMsg");
        if(existing){
            existing.remove();
        }

        if(!s_name){
            var loginAlert=document.createElement("div");
            loginAlert.setAttribute("role","alert");
            loginAlert.setAttribute("id","alertMsg");
            loginAlert.setAttribute("class","alert alert-danger");
            loginAlert.innerHTML="Please enter name";
            console.log("in");
            alert.appendChild(loginAlert);
            return;
        }

        if(!s_email){
            var loginAlert=document.createElement("div");
            loginAlert.setAttribute("role","alert");
            loginAlert.setAttribute("id","alertMsg");
            loginAlert.setAttribute("class","alert alert-danger");
            loginAlert.innerHTML="Please enter email";
            console.log("in");
            alert.appendChild(loginAlert);
            return;
        }

        if(!s_contact){
            var loginAlert=document.createElement("div");
            loginAlert.setAttribute("role","alert");
            loginAlert.setAttribute("id","alertMsg");
            loginAlert.setAttribute("class","alert alert-danger");
            loginAlert.innerHTML="Please enter contact";
            console.log("in");
            alert.appendChild(loginAlert);
            return;
        }

        if(s_isAdmin==2){
            var loginAlert=document.createElement("div");
            loginAlert.setAttribute("role","alert");
            loginAlert.setAttribute("id","alertMsg");
            loginAlert.setAttribute("class","alert alert-danger");
            loginAlert.innerHTML="Please select role";
            console.log("in");
            alert.appendChild(loginAlert);
            return;
        }

        const signup_url="http://127.0.0.1:5000/staff";
        fetch(signup_url,{
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ s_name,s_email, s_contact ,s_isAdmin})
        })
        .then(response=>response.json())
        .then(data=>{
            console.log(data);
        })
    }
})