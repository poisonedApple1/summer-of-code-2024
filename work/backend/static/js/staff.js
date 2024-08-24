function makeList(staffData,offset){
    var serial=1+offset;
    var itemTable=document.getElementById("product_table");
        for (let staff of staffData){
            var entry=document.createElement('tr');
            var sno=document.createElement('th')
            var id=document.createElement('td');
            var name=document.createElement('td');
            var role=document.createElement('td');
            var contact=document.createElement('td');
            var email=document.createElement('td');
            var buttons=document.createElement('td')
            var upd=document.createElement('button');
            var del=document.createElement('button');

            upd.setAttribute('class','btn btn-outline-info manageUpd');
            upd.setAttribute('data-id',staff["s_ID"]);
            upd.setAttribute('type','button');
            upd.innerHTML='<i class="bi bi-arrow-clockwise"></i> Update';
            upd.setAttribute('data-bs-toggle','modal');
            upd.setAttribute('data-bs-target','#updModal2');

            del.setAttribute('class','btn btn-outline-danger manageDel');
            del.setAttribute('data-id',staff["s_ID"]);
            del.setAttribute('type','button');
            del.innerHTML='<i class="bi bi-x-square"></i> Remove';
            del.setAttribute('data-bs-toggle','modal');
            del.setAttribute('data-bs-target','#delModal2'); 


            entry.setAttribute("id",serial);
            id.innerHTML=staff['s_ID'];
            name.innerHTML=staff["s_name"];
            if(staff['s_isAdmin']==true)role.innerHTML='Admin';
            else role.innerHTML='Cashier';
            contact.innerHTML=staff["s_contact"];
            email.innerHTML=staff["s_email"];
            sno.innerHTML=serial;
            sno.setAttribute('scope','row');
            serial++;

            entry.appendChild(sno);
            entry.appendChild(id);
            entry.appendChild(name);
            entry.appendChild(role);
            entry.appendChild(contact);
            entry.appendChild(email);
            entry.appendChild(buttons);
            buttons.appendChild(upd);
            buttons.appendChild(del);
            itemTable.appendChild(entry);
        }
}

function getData_MakeList(offset){
    const get_all_products_url="http://127.0.0.1:5000/api/staffData";
    fetch(get_all_products_url,{
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({'offset': offset})
    })
    .then(response=>response.json())
    .then(data=>{
        var itemData=data["data"];
        count=data["count"];
        var num=document.getElementById("num");
        var tot=document.getElementById("count");
        num.innerText=itemData.length;
        tot.innerText=count;
        makeList(itemData,offset);
    })
}


document.addEventListener("DOMContentLoaded",()=>{
    var count;
    const get_all_products_url="http://127.0.0.1:5000/api/staffData";
    fetch(get_all_products_url,{
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({"offset":0})
    })
    .then(response=>response.json())
    .then(data=>{
        var itemData=data["data"];
        count=data["count"];
        var num=document.getElementById("num");
        var tot=document.getElementById("count");
        num.innerText=itemData.length;
        tot.innerText=count;
        makeList(itemData,0);
    })
    .then(()=>{
        var x=0;
        var value1=1;
        var lp=document.getElementById('lp');
        var l1=document.getElementById('l1');
        var l2=document.getElementById('l2');
        var l3=document.getElementById('l3');
        var ln=document.getElementById('ln');
        
        l1.addEventListener('click',()=>{
            var table=document.getElementById('product_table');
            table.innerHTML=' ';
            getData_MakeList(x);
        })
        if(!lp.classList.contains('disabled')){
            lp.addEventListener('click',()=>{
                x-=10;
                ln.setAttribute("class","page-item");
                value1--;
                l1.querySelector('a').innerText=value1;
                l2.querySelector('a').innerText=value1+1;
                l3.querySelector('a').innerText=value1+1;
                if(value1==1)lp.setAttribute("class","page-item disabled");
            })
        }

        if ((count/10)>1){
            l2.setAttribute("class","page-item");
            l2.addEventListener('click',()=>{
                var table=document.getElementById('product_table');

                table.innerHTML=' ';
                getData_MakeList(x+10);
            })
        }
        if ((count/10)>2){
            l3.setAttribute("class","page-item");
            l3.addEventListener('click',()=>{
                var table=document.getElementById('product_table');

                table.innerHTML=' ';
                getData_MakeList(x+20);
            })
        }
        if ((count/10)>3){
            ln.setAttribute("class","page-item");
            ln.addEventListener('click',()=>{
                x+=10;
                lp.setAttribute("class","page-item");
                value1++;
                l1.querySelector('a').innerText=value1;
                l2.querySelector('a').innerText=value1+1;
                l3.querySelector('a').innerText=value1+1;
                if(count<=x+30)ln.setAttribute("class","page-item disabled");
            })
        }

    })
    
    // .catch(()=>{
    //     var err=document.createElement('p');
    //     err.innerText=error;
    //     var itemTable=document.getElementById("product_table");
    //     itemTable.appendChild(err)
    // }   
    // )


    const searchButton=document.getElementById('search');


    const tableBody = document.getElementById('product_table');

    
    tableBody.addEventListener('click', function(event) {
      if (event.target.classList.contains('manageUpd')) {
        var s_ID = event.target.getAttribute('data-id');
        var staff;
        const updateURLget="http://127.0.0.1:5000/api/staffData"
        fetch(updateURLget,{
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({'s_ID':s_ID})
        })
        .then(response=>response.json())
        .then(data=>{
            
            var s_name=document.getElementById('updName');
            var s_isAdmin=document.getElementById('updPrice');
            var s_contact=document.getElementById('updQty');
            var s_email=document.getElementById('updDesc');

            s_name.textContent=data["s_name"];
            s_isAdmin.textContent=data["s_isAdmin"];
            s_contact.textContent=data["s_contact"];
            s_email.textContent=data["s_email"];
            console.log(data)
            staff=data;
        })
        const updateURL="http://127.0.0.1:5000/api/staff"
        const updForm=document.getElementById('updItemForm');
        var loginAlert=document.getElementById('ualert')
        loginAlert.setAttribute("class"," ");
        loginAlert.innerHTML=" ";
        updForm.addEventListener('submit',(event)=>{
            event.preventDefault();
            console.log("at");
            var s_name=document.getElementById('upditemName').value;
            var s_isAdmin;
            if(document.getElementById('upditemQty').value==='1')s_isAdmin=true;
            else if(document.getElementById('upditemQty').value==='0') s_isAdmin=false;
            var s_contact=document.getElementById('upditemPrice').value;
            var s_email=document.getElementById('upditemDesc').value;
            
            if(!s_name)s_name=staff["s_name"];
            if(s_isAdmin!=0 && s_isAdmin!=1 )s_isAdmin=staff["s_isAdmin"];
            if(!s_contact)s_contact=staff["s_contact"];
            if(!s_email)s_email=staff["s_email"];


            fetch(updateURL,{
                method:'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({s_ID,s_name,s_isAdmin,s_contact,s_email})
            })
            .then(request=>request.json())
            .then(data=>{
                
                loginAlert.setAttribute("class","alert alert-success");
                loginAlert.innerHTML="successfully updated!";
                console.log("in");
                console.log(data);
                fetch(updateURLget,{
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({s_ID})
                })
                .then(response=>response.json())
                .then(data=>{
                    
                    var s_name=document.getElementById('updName');
                    var s_isAdmin=document.getElementById('updQty');
                    var s_contact=document.getElementById('updPrice');
                    var s_email=document.getElementById('updDesc');
        
                    s_name.textContent=data["s_name"];
                    s_isAdmin.textContent=data["s_isAdmin"];
                    s_contact.textContent=data["s_contact"];
                    s_email.textContent=data["s_email"];
                    console.log(data)
                })

            })
        })
        
      }

      if (event.target.classList.contains('manageDel')) {
        const updateURLget="http://127.0.0.1:5000/api/staffData"
        const s_ID = event.target.getAttribute('data-id');
        fetch(updateURLget,{
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({s_ID})
        })
        .then(response=>response.json())
        .then(data=>{
            
            var s_name=document.getElementById('delName');
            var s_isAdmin=document.getElementById('delQty');
            var s_contact=document.getElementById('delPrice');
            var s_email=document.getElementById('delDesc');

            s_name.textContent=data["s_name"];
            s_isAdmin.textContent=data["s_isAdmin"];
            s_contact.textContent=data["s_contact"];
            s_email.textContent=data["s_email"];
            console.log(data)
        })
        
       const delForm=document.getElementById('delItem');
       delForm.addEventListener('submit',(event)=>{
           event.preventDefault();
           const delModal = bootstrap.Modal.getInstance(document.getElementById('delModal2'))
            const urlDel="http://127.0.0.1:5000/api/staff";
            console.log(s_ID);
            fetch(urlDel,{
                method:'DELETE',
                headers:{'Content-Type':'application/json'},
                body:  JSON.stringify({s_ID})
            })
            .then(response=>response.json())
            .then(data=>{
                console.log(data);
                delModal.hide()
            })
      })
    }
    });

    
    

    searchButton.addEventListener('click', function() {
        
        console.log('Search button clicked!');
        
      });

    
  

    
    

    
    
})