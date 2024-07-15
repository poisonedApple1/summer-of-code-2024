
document.addEventListener("DOMContentLoaded",()=>{
    var form=document.getElementById("signupCredentials");
    form.addEventListener('submit',signUp);
    console.log("yo")
    function signUp(event){
        console.log("hey");
        event.preventDefault();
        const c_name = document.getElementById('signupName').value;
        const c_email = document.getElementById('signupEmail').value;
        const contact = document.getElementById('signupContact').value;
        const c_contact=String(contact)

        var alert=document.getElementById("alert");
        var existing=document.getElementById("alertMsg");
        if(existing){
            existing.remove();
        }

        if(!c_name){
            var loginAlert=document.createElement("div");
            loginAlert.setAttribute("role","alert");
            loginAlert.setAttribute("id","alertMsg");
            loginAlert.setAttribute("class","alert alert-danger");
            loginAlert.innerHTML="Please enter name";
            console.log("in");
            alert.appendChild(loginAlert);
            return;
        }

        if(!c_email){
            var loginAlert=document.createElement("div");
            loginAlert.setAttribute("role","alert");
            loginAlert.setAttribute("id","alertMsg");
            loginAlert.setAttribute("class","alert alert-danger");
            loginAlert.innerHTML="Please enter email";
            console.log("in");
            alert.appendChild(loginAlert);
            return;
        }

        if(!c_contact){
            var loginAlert=document.createElement("div");
            loginAlert.setAttribute("role","alert");
            loginAlert.setAttribute("id","alertMsg");
            loginAlert.setAttribute("class","alert alert-danger");
            loginAlert.innerHTML="Please enter contact";
            console.log("in");
            alert.appendChild(loginAlert);
            return;
        }


        const signup_url="http://127.0.0.1:5000/api/customer";
        fetch(signup_url,{
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ c_name,c_email, c_contact})
        })
        .then(response=>response.json())
        .then(data=>{
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
                loginAlert.innerHTML="User already exists with given contact";
                console.log("in");
                alert.appendChild(loginAlert);

            }
            console.log(data);
        })
    }
})