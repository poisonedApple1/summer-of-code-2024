
document.addEventListener("DOMContentLoaded",()=>{
    var form=document.getElementById("signupCredentials");
    form.addEventListener('submit',signUp);
    function signUp(event){
        event.preventDefault();
        const c_ID = document.getElementById('customerID').value;
        const t_date = document.getElementById('transactionDate').value;
        const t_amount = document.getElementById('transactionAmount').value;
        const t_category = document.getElementById('transactionCategory').value;

        var alert=document.getElementById("alert");
        var existing=document.getElementById("alertMsg");
        if(existing){
            existing.remove();
        }

        if (!c_ID) {
            var loginAlert = document.createElement("div");
            loginAlert.setAttribute("role", "alert");
            loginAlert.setAttribute("id", "alertMsg");
            loginAlert.setAttribute("class", "alert alert-danger");
            loginAlert.innerHTML = "Please enter Customer ID";
            console.log("in");
            alert.appendChild(loginAlert);
            return;
        }
        
        
        if (!t_amount) {
            var loginAlert = document.createElement("div");
            loginAlert.setAttribute("role", "alert");
            loginAlert.setAttribute("id", "alertMsg");
            loginAlert.setAttribute("class", "alert alert-danger");
            loginAlert.innerHTML = "Please enter Transaction Amount";
            console.log("in");
            alert.appendChild(loginAlert);
            return;
        }
        
        if (!t_category) {
            var loginAlert = document.createElement("div");
            loginAlert.setAttribute("role", "alert");
            loginAlert.setAttribute("id", "alertMsg");
            loginAlert.setAttribute("class", "alert alert-danger");
            loginAlert.innerHTML = "Please enter Transaction Category";
            console.log("in");
            alert.appendChild(loginAlert);
            return;
        }

        
        const reg_url="http://127.0.0.1:5000/api/transaction";
        fetch(reg_url,{
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ c_ID,t_date,t_amount ,t_category})
        })
        .then(response=>response.json())
        .then(data=>{
            var existing=document.getElementById("alertMsg");
            if(existing){
                existing.remove();
            }

            if(data['msg']=='Done'){
                var loginAlert=document.createElement("div");
                loginAlert.setAttribute("role","alert");
                loginAlert.setAttribute("id","alertMsg");
                loginAlert.setAttribute("class","alert alert-success");
                loginAlert.innerHTML="Successfully Registered Transaction";
                console.log("in");
                alert.appendChild(loginAlert);
            }

            else{
                var loginAlert=document.createElement("div");
                loginAlert.setAttribute("role","alert");
                loginAlert.setAttribute("id","alertMsg");
                loginAlert.setAttribute("class","alert alert-danger");
                loginAlert.innerHTML="User Doesn't Exist";
                console.log("in");
                alert.appendChild(loginAlert);

            }
            console.log(data);
        })
    }
})