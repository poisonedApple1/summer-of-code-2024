
document.addEventListener("DOMContentLoaded",()=>{
    var form=document.getElementById("signupCredentials");
    form.addEventListener('submit',signUp);
    function signUp(event){
        event.preventDefault();
        const s_name = document.getElementById('signupName').value;
        const s_email = document.getElementById('signupEmail').value;
        const contact = document.getElementById('signupContact').value;
        const s_contact=String(contact)
        var s_isAdmin=document.getElementById('signupRole').value;
        const s_password=document.getElementById('singupPassword').value;
        const re_s_password=document.getElementById('singupPasswordRep').value;

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

        if(!s_password){
            var loginAlert=document.createElement("div");
            loginAlert.setAttribute("role","alert");
            loginAlert.setAttribute("id","alertMsg");
            loginAlert.setAttribute("class","alert alert-danger");
            loginAlert.innerHTML="Please enter password";
            console.log("in");
            alert.appendChild(loginAlert);
            return;
        }

        if(!re_s_password){
            var loginAlert=document.createElement("div");
            loginAlert.setAttribute("role","alert");
            loginAlert.setAttribute("id","alertMsg");
            loginAlert.setAttribute("class","alert alert-danger");
            loginAlert.innerHTML="Please enter password again";
            console.log("in");
            alert.appendChild(loginAlert);
            return;
        }

        if(s_password!=re_s_password){
            var loginAlert=document.createElement("div");
            loginAlert.setAttribute("role","alert");
            loginAlert.setAttribute("id","alertMsg");
            loginAlert.setAttribute("class","alert alert-danger");
            loginAlert.innerHTML="Passwords dont match";
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
        s_isAdmin = Number(s_isAdmin)
        console.log({ s_name,s_email, s_contact ,s_isAdmin:s_isAdmin,s_password})
        const signup_url="http://127.0.0.1:5000/api/staff";
        fetch(signup_url,{
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ s_name,s_email, s_contact ,s_isAdmin:s_isAdmin,s_password})
        })
        .then(response=>response.json())
            .then(data => {
                console.log(JSON.stringify({ s_name, s_email, s_contact, s_isAdmin:s_isAdmin, s_password }));
            console.log(s_isAdmin)
            if(data['msg']=='Done'){
                var loginAlert=document.createElement("div");
                loginAlert.setAttribute("role","alert");
                loginAlert.setAttribute("id","alertMsg");
                loginAlert.setAttribute("class","alert alert-success");
                loginAlert.innerHTML="Successfully Registered User";
                console.log("in");
                alert.appendChild(loginAlert);
            }

            else{
                var loginAlert=document.createElement("div");
                loginAlert.setAttribute("role","alert");
                loginAlert.setAttribute("id","alertMsg");
                loginAlert.setAttribute("class","alert alert-danger");
                loginAlert.innerHTML="User already exists";
                console.log("in");
                alert.appendChild(loginAlert);

            }
            console.log(data);
        })
    }
})