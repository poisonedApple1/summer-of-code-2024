function makeList(itemData,offset){
    var serial=1+offset;
    var itemTable=document.getElementById("product_table");
        for (let item of itemData){
            var entry=document.createElement('tr');
            var sno=document.createElement('th')
            var sku=document.createElement('td');
            var name=document.createElement('td');
            var qty=document.createElement('td');
            var price=document.createElement('td');
            var desc=document.createElement('td');
            var buttons=document.createElement('td')
            var upd=document.createElement('button');
            var del=document.createElement('button');

            upd.setAttribute('class','btn btn-outline-info manageUpd');
            upd.setAttribute('data-id',item["Item_SKU"]);
            upd.setAttribute('type','button');
            upd.innerHTML='<i class="bi bi-arrow-clockwise"></i> Update';
            upd.setAttribute('data-bs-toggle','modal');
            upd.setAttribute('data-bs-target','#updModal2');

            del.setAttribute('class','btn btn-outline-danger manageDel');
            del.setAttribute('data-id',item["Item_SKU"]);
            del.setAttribute('type','button');
            del.innerHTML='<i class="bi bi-trash"></i> Delete';
            del.setAttribute('data-bs-toggle','modal');
            del.setAttribute('data-bs-target','#delModal2'); 
            // <button type="button" class="btn btn-outline-dark" id="search"><i class="bi bi-search"></i> Search</button>
            // data-bs-toggle="modal" data-bs-target="#addModal"

            entry.setAttribute("id",serial);
            sku.innerHTML=item['Item_SKU'];
            name.innerHTML=item["Item_name"];
            qty.innerHTML=item["Item_qty"];
            price.innerHTML=item["Item_price"];
            desc.innerHTML=item["Item_description"];
            sno.innerHTML=serial;
            sno.setAttribute('scope','row');
            serial++;

            entry.appendChild(sno);
            entry.appendChild(sku);
            entry.appendChild(name);
            entry.appendChild(qty);
            entry.appendChild(price);
            entry.appendChild(desc);
            entry.appendChild(buttons);
            buttons.appendChild(upd);
            buttons.appendChild(del);
            itemTable.appendChild(entry);
        }
}

function getData_MakeList(offset){
    const get_all_products_url="http://127.0.0.1:5000/api/itemData";
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
    const get_all_products_url="http://127.0.0.1:5000/api/itemData";
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
    
    .catch(()=>{
        var err=document.createElement('p');
        err.innerText=error;
        var itemTable=document.getElementById("product_table");
        itemTable.appendChild(err)
    }   
    )


    const addButton=document.getElementById('add');
    const searchButton=document.getElementById('search');

    addButton.addEventListener('click',()=>{
        const form=document.getElementById('addItem');
        form.addEventListener('submit',(event)=>{
        event.preventDefault();
        const Item_name = document.getElementById('itemName').value;

        const Item_price = document.getElementById('itemPrice').value;
        const Item_qty=document.getElementById('itemQty').value;
        const Item_description=document.getElementById('itemDesc').value;

        var alert=document.getElementById("alert");
        var existing=document.getElementById("alertMsg");
        if(existing){
            existing.remove();
        }



        if(!Item_name){
            var loginAlert=document.createElement("div");
            loginAlert.setAttribute("role","alert");
            loginAlert.setAttribute("id","alertMsg");
            loginAlert.setAttribute("class","alert alert-danger");
            loginAlert.innerHTML="Please enter name";
            console.log("in");
            alert.appendChild(loginAlert);
            return;
        }


        if(!Item_price){
            var loginAlert=document.createElement("div");
            loginAlert.setAttribute("role","alert");
            loginAlert.setAttribute("id","alertMsg");
            loginAlert.setAttribute("class","alert alert-danger");
            loginAlert.innerHTML="Please enter price";
            console.log("in");
            alert.appendChild(loginAlert);
            return;
        }

        if(!Item_qty){
            var loginAlert=document.createElement("div");
            loginAlert.setAttribute("role","alert");
            loginAlert.setAttribute("id","alertMsg");
            loginAlert.setAttribute("class","alert alert-danger");
            loginAlert.innerHTML="Please enter quantity";
            console.log("in");
            alert.appendChild(loginAlert);
            return;
        }

        if(!Item_description){
            var loginAlert=document.createElement("div");
            loginAlert.setAttribute("role","alert");
            loginAlert.setAttribute("id","alertMsg");
            loginAlert.setAttribute("class","alert alert-danger");
            loginAlert.innerHTML="Please enter description";
            console.log("in");
            alert.appendChild(loginAlert);
            return;
        }

        const signup_url="http://127.0.0.1:5000/api/item";
        fetch(signup_url,{
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ Item_name,Item_description,Item_price,Item_qty})
        })
        .then(response=>response.json())
        .then(data=>{
            var loginAlert=document.createElement("div");
            loginAlert.setAttribute("role","alert");
            loginAlert.setAttribute("id","alertMsg");
            loginAlert.setAttribute("class","alert alert-success");
            loginAlert.innerHTML="successfully added item"
            alert.appendChild(loginAlert);
            console.log(data);
        })

        })        
    })


    const tableBody = document.getElementById('product_table');

    
    tableBody.addEventListener('click', function(event) {
      if (event.target.classList.contains('manageUpd')) {
        var Item_SKU = event.target.getAttribute('data-id');
        var item;
        const updateURLget="http://127.0.0.1:5000/api/item"
        fetch(updateURLget,{
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({Item_SKU})
        })
        .then(response=>response.json())
        .then(data=>{
            
            var Item_name=document.getElementById('updName');
            var Item_qty=document.getElementById('updQty');
            var Item_price=document.getElementById('updPrice');
            var Item_description=document.getElementById('updDesc');

            Item_name.textContent=data["Item_name"];
            Item_qty.textContent=data["Item_qty"];
            Item_price.textContent=data["Item_price"];
            Item_description.textContent=data["Item_description"];
            console.log(data)
            item=data;
        })
        const updateURL="http://127.0.0.1:5000/api/item/update"
        const updForm=document.getElementById('updItemForm');
        var loginAlert=document.getElementById('ualert')
        loginAlert.setAttribute("class"," ");
        loginAlert.innerHTML=" ";
        updForm.addEventListener('submit',(event)=>{
            event.preventDefault();
            console.log("at");
            var Item_name=document.getElementById('upditemName').value;
            var Item_qty=document.getElementById('upditemQty').value;
            var Item_price=document.getElementById('upditemPrice').value;
            var Item_description=document.getElementById('upditemDesc').value;
            
            if(!Item_name)Item_name=item["Item_name"];
            if(!Item_qty)Item_qty=item["Item_qty"];
            if(!Item_price)Item_price=item["Item_price"];
            if(!Item_description)Item_description=item["Item_description"];

            fetch(updateURL,{
                method:'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({Item_SKU,Item_name,Item_qty,Item_price,Item_description})
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
                    body: JSON.stringify({Item_SKU})
                })
                .then(response=>response.json())
                .then(data=>{
                    
                    var Item_name=document.getElementById('updName');
                    var Item_qty=document.getElementById('updQty');
                    var Item_price=document.getElementById('updPrice');
                    var Item_description=document.getElementById('updDesc');
        
                    Item_name.textContent=data["Item_name"];
                    Item_qty.textContent=data["Item_qty"];
                    Item_price.textContent=data["Item_price"];
                    Item_description.textContent=data["Item_description"];
                    console.log(data)
                })

            })
        })
        
      }

      if (event.target.classList.contains('manageDel')) {
        const updateURLget="http://127.0.0.1:5000/api/item"
        const Item_SKU = event.target.getAttribute('data-id');
        fetch(updateURLget,{
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({Item_SKU})
        })
        .then(response=>response.json())
        .then(data=>{
            
            var Item_name=document.getElementById('delName');
            var Item_qty=document.getElementById('delQty');
            var Item_price=document.getElementById('delPrice');
            var Item_description=document.getElementById('delDesc');

            Item_name.textContent=data["Item_name"];
            Item_qty.textContent=data["Item_qty"];
            Item_price.textContent=data["Item_price"];
            Item_description.textContent=data["Item_description"];
            console.log(data)
        })
       const delForm=document.getElementById('delItem');
          delForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const delModal = bootstrap.Modal.getInstance(document.getElementById('delModal2'))
              
            const urlDel="http://127.0.0.1:5000/api/item";
            fetch(urlDel,{
                method:'DELETE',
                headers:{'Content-Type':'application/json'},
                body:  JSON.stringify({Item_SKU})
            })
            .then(response=>response.json())
            .then(data=>{
                console.log(data);
                delModal.hide();
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