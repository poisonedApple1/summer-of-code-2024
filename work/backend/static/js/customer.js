let customer;

document.addEventListener('DOMContentLoaded',()=>{
    var search_by_cont=document.getElementById('inlineRadio1');
    var search_by_id=document.getElementById('inlineRadio2');
    var inputText=document.getElementById('inputLabel');
    var searchByContact=true;
    search_by_cont.addEventListener('click',()=>{
        inputText.innerText="Enter Contact";
        searchByContact=true;
    })

    search_by_id.addEventListener('click',()=>{
        inputText.innerText="Enter Customer ID";
        searchByContact=false;
    })

   
    

    var inputForm=document.getElementById('searchForm')
    inputForm.addEventListener('submit',(event)=>{
        var inValue=document.getElementById('inputValue').value;
        if(searchByContact)var searchKey='c_contact';
        else var searchKey='c_ID';
        event.preventDefault();
        if(searchByContact) var x= JSON.stringify({'c_contact': inValue ,'searchByContact':1});
        else var x= JSON.stringify({'c_ID': inValue ,'searchByContact':0});
        getCustomerDataURL="http://127.0.0.1:5000/api/customer";
        fetch(getCustomerDataURL,{
            method:'PUT',
            headers:{'Content-Type': 'application/json'},
            body:x
        })
        .then(response=>response.json())
        .then(data=>{
            console.log(data);
            var list=document.getElementById('cData');
            list.setAttribute('style','display:block'); 

            var existing=document.getElementById("alertMsg");
            if(existing){
                existing.remove();
            }

            if(data['msg']==0){
                var loginAlert=document.createElement("div");
                loginAlert.setAttribute("role","alert");
                loginAlert.setAttribute("id","alertMsg");
                loginAlert.setAttribute("class","alert alert-danger");
                loginAlert.innerHTML="Couldnt Find Customer";
                console.log("in");
                list.appendChild(loginAlert);
                return;
            }
            
            document.getElementById('details').setAttribute('style','display:block');           
            var id=document.getElementById('ID');
            var name=document.getElementById('name');
            var email=document.getElementById('email');
            var contact=document.getElementById('contact');

            id.innerText=data['c_ID'];
            name.innerText=data['c_name'];
            email.innerText=data['c_email'];
            contact.innerText=data['c_contact'];
            customer=data;
            if(document.getElementById('update'))return;

            var upd=document.createElement('button');
            var del=document.createElement('button');

            upd.setAttribute('class','btn btn-outline-info manageUpd');
            upd.setAttribute('id','update');
            upd.setAttribute('type','button');
            upd.innerHTML='<i class="bi bi-arrow-clockwise"></i> Update';
            upd.setAttribute('data-bs-toggle','modal');
            upd.setAttribute('data-bs-target','#updModal2');
            

            del.setAttribute('class','btn btn-outline-danger manageDel');
            del.setAttribute('id','delete');
            del.setAttribute('type','button');
            del.innerHTML='<i class="bi bi-trash"></i> Delete';
            del.setAttribute('data-bs-toggle','modal');
            del.setAttribute('data-bs-target','#delModal2');
            

            list.appendChild(upd);
            list.appendChild(del);
        })
        .then(()=>{
            if(!document.getElementById('update'))return;
            var upd=document.getElementById('update');
            var del=document.getElementById('delete');

            upd.addEventListener('click',()=>{
                const updateURL="http://127.0.0.1:5000/api/customer"
                const updForm=document.getElementById('updItemForm');
                var loginAlert=document.getElementById('ualert')
                loginAlert.setAttribute("class"," ");
                loginAlert.innerHTML=" ";
                updForm.addEventListener('submit',(event)=>{
                    event.preventDefault();
                    console.log("at");
                    var c_name=document.getElementById('upditemName').value;
                    var c_contact=document.getElementById('upditemPrice').value;
                    var c_email=document.getElementById('upditemDesc').value;
                    
                    if(!c_name)c_name=customer["c_name"];
                    if(!c_contact)c_contact=customer["c_contact"];
                    if(!c_email)c_email=customer["c_email"];
                    var c_ID=customer['c_ID'];
        
                    fetch(updateURL,{
                        method:'PATCH',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({c_ID,c_name,c_contact,c_email})
                    })
                    .then(request=>request.json())
                    .then(data=>{
                        
                        loginAlert.setAttribute("class","alert alert-success");
                        loginAlert.innerHTML="successfully updated!";
                        console.log("in");
                        console.log(data);
                    })
                })
            })

            del.addEventListener('click',()=>{
                const c_ID = customer["c_ID"];
                const delForm=document.getElementById('delItem');
                delForm.addEventListener('submit',(event)=>{
                    event.preventDefault();
                    const delModal = bootstrap.Modal.getInstance(document.getElementById('delModal2'))
                        const urlDel="http://127.0.0.1:5000/api/customer";
                        fetch(urlDel,{
                            method:'DELETE',
                            headers:{'Content-Type':'application/json'},
                            body:  JSON.stringify({c_ID})
                        })
                        .then(response=>response.json())
                        .then(data=>{
                            console.log(data);
                            delModal.hide()
                        })
                })
            })

        }
        )
    })





})