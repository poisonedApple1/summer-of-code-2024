function makeList(itemData,offset){
    var serial=1+offset;
    var itemTable=document.getElementById("product_table");
        for (let item of itemData){
            var entry = document.createElement('tr');
            var sno = document.createElement('th');
            var tID = document.createElement('td');
            var cID = document.createElement('td');
            var date = document.createElement('td');
            var amount = document.createElement('td');
            var category = document.createElement('td');
            var buttons = document.createElement('td');

            var upd = document.createElement('button');
            var del = document.createElement('button');


            upd.setAttribute('class','btn btn-outline-info manageUpd');
            upd.setAttribute('data-id',item["t_ID"]);
            upd.setAttribute('type','button');
            upd.innerHTML='<i class="bi bi-arrow-clockwise"></i> Update';
            upd.setAttribute('data-bs-toggle','modal');
            upd.setAttribute('data-bs-target','#updModal2');

            del.setAttribute('class','btn btn-outline-danger manageDel');
            del.setAttribute('data-id',item["t_ID"]);
            del.setAttribute('type','button');
            del.innerHTML='<i class="bi bi-trash"></i> Delete';
            del.setAttribute('data-bs-toggle','modal');
            del.setAttribute('data-bs-target','#delModal2'); 
            // <button type="button" class="btn btn-outline-dark" id="search"><i class="bi bi-search"></i> Search</button>
            // data-bs-toggle="modal" data-bs-target="#addModal"


            entry.setAttribute("id", serial);
            tID.innerHTML = item['t_ID'];
            if(item['c_ID'])cID.innerHTML = item['c_ID'];
            else cID.innerHTML = "-";
            date.innerHTML = item['t_date'];
            amount.innerHTML = item['t_amount'];
            category.innerHTML = item['t_category'];
            sno.innerHTML = serial;
            sno.setAttribute('scope', 'row');
            serial++;

            entry.appendChild(sno);
            entry.appendChild(tID);
            entry.appendChild(cID);
            entry.appendChild(date);
            entry.appendChild(amount);
            entry.appendChild(category);
            entry.appendChild(buttons);

            buttons.appendChild(upd);
            buttons.appendChild(del);

            itemTable.appendChild(entry);
        }
}

function getData_MakeList(offset){
    const get_all_products_url="http://127.0.0.1:5000/api/transactData";
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
    const get_all_transactions_url="http://127.0.0.1:5000/api/transactData";
    fetch(get_all_transactions_url,{
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
    
    .catch(()=>{
        var err=document.createElement('p');
        err.innerText=error;
        var itemTable=document.getElementById("product_table");
        itemTable.appendChild(err)
    }   
    )


    const searchButton=document.getElementById('search');


    const tableBody = document.getElementById('product_table');

    
    tableBody.addEventListener('click', function(event) {
      if (event.target.classList.contains('manageUpd')) {
        var t_ID = event.target.getAttribute('data-id');
        var item;
        const updateURLget="http://127.0.0.1:5000/api/transactData"
        fetch(updateURLget,{
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({t_ID})
        })
        .then(response=>response.json())
        .then(data=>{

            var updTID = document.getElementById('updTID');
            var updCID = document.getElementById('updCID');
            var updDate = document.getElementById('updDate');
            var updAmount = document.getElementById('updAmount');
            var updCategory = document.getElementById('updCategory');
            
            updTID.textContent = data["t_ID"];
            updCID.textContent = data["c_ID"];
            updDate.textContent = data["t_date"];
            updAmount.textContent = data["t_amount"];
            updCategory.textContent = data["t_category"];
            
            console.log(data);
            item = data;
        })
        const updateURL="http://127.0.0.1:5000/api/transaction"
        const updForm=document.getElementById('updItemForm');
        var loginAlert=document.getElementById('ualert')
        loginAlert.setAttribute("class"," ");
        loginAlert.innerHTML=" ";
        updForm.addEventListener('submit',(event)=>{
            event.preventDefault();
            console.log("at");
            var Customer_ID = document.getElementById('updCustomerID').value;
            var Transaction_Date = document.getElementById('updTransactionDate').value;
            var Transaction_Amount = document.getElementById('updTransactionAmount').value;
            var Transaction_Category = document.getElementById('updTransactionCategory').value;
            
            if (!Customer_ID) Customer_ID = item["c_ID"];
            if (!Transaction_Date) Transaction_Date = item["t_date"];
            if (!Transaction_Amount) Transaction_Amount = item["t_amount"];
            if (!Transaction_Category) Transaction_Category = item["t_category"];

            fetch(updateURL,{
                method:'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({"t_ID":t_ID,"c_ID":Customer_ID,"t_date":Transaction_Date,"t_amount":Transaction_Amount,"t_category":Transaction_Category})
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
                    body: JSON.stringify({t_ID})
                })
                .then(response=>response.json())
                .then(data=>{
                    
                    var updTID = document.getElementById('updTID');
                    var updCID = document.getElementById('updCID');
                    var updDate = document.getElementById('updDate');
                    var updAmount = document.getElementById('updAmount');
                    var updCategory = document.getElementById('updCategory');
                    
                    updTID.textContent = data["t_ID"];
                    updCID.textContent = data["c_ID"];
                    updDate.textContent = data["t_date"];
                    updAmount.textContent = data["t_amount"];
                    updCategory.textContent = data["t_category"];
                    console.log(data)
                })

            })
        })
        
      }

      if (event.target.classList.contains('manageDel')) {
        const updateURLget="http://127.0.0.1:5000/api/transactData"
        const t_ID = event.target.getAttribute('data-id');
        fetch(updateURLget,{
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({t_ID})
        })
        .then(response=>response.json())
        .then(data=>{
            
            var delTID = document.getElementById('delTID');
            var delCID = document.getElementById('delCID');
            var delDate = document.getElementById('delDate');
            var delAmount = document.getElementById('delAmount');
            var delCategory = document.getElementById('delCategory');

            delTID.textContent = data["t_ID"];
            delCID.textContent = data["c_ID"];
            delDate.textContent = data["t_date"];
            delAmount.textContent = data["t_amount"];
            delCategory.textContent = data["t_category"];

            console.log(data);
        })
       const delForm=document.getElementById('delItem');
          delForm.addEventListener('submit', (event) => {
              event.preventDefault()
              const delModal = bootstrap.Modal.getInstance(document.getElementById('delModal2'))
            const urlDel="http://127.0.0.1:5000/api/transaction";
            fetch(urlDel,{
                method:'DELETE',
                headers:{'Content-Type':'application/json'},
                body:  JSON.stringify({t_ID})
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
    var lp=document.getElementById('lp');
    var l1=document.getElementById('l1');
    var l2=document.getElementById('l2');
    var l3=document.getElementById('l3');
    var ln=document.getElementById('ln');
    
  

    
    

    
    
})