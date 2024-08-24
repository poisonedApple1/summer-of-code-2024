
// document.addEventListener('DOMContentLoaded',()=>{
//     const loginForm=document.getElementById("logCredentials");
//     loginForm.addEventListener('submit',login);
    
//     console.log("hello")
//     function login(event){
//         console.log("hey");
//         event.preventDefault();
//         const s_email = document.getElementById('loginEmail').value;
//         const s_password = document.getElementById('loginPassword').value;
        
//         const login_url="http://127.0.0.1:5000/";
//         fetch(login_url, {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({ s_email, s_password })
//         })
//         .then(response=>response.json())
//             .then(data => {
//             console.log(data["msg"])
//             var alert=document.getElementById("alert");
//             var existing=document.getElementById("alertMsg");
//             if(existing){
//                 existing.remove();
//             }
//             var loginAlert=document.createElement("div");
//             loginAlert.setAttribute("role","alert");
//             loginAlert.setAttribute("id","alertMsg");
//             if(data["msg"]){
//                 loginAlert.setAttribute("class","alert alert-success");
//                 loginAlert.innerHTML="Logged In!";
//             }
//             else{
//                 loginAlert.setAttribute("class","alert alert-danger");
//                 loginAlert.innerHTML="Invalid Email or Password"
//             }
//             alert.appendChild(loginAlert);
//         })

//         // fetch("http://127.0.0.1:5000/loginUser", {
//         //     method:'POST',
//         //     body:JSON.stringify({'msg':1})
//         // })
//     }
// })