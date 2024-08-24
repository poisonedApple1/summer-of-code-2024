

var addedItemCount = 0;
var totPrice = 0;
var customerID = 4;
var ele;
const categories=document.getElementById('catList');
const catRoot=ReactDOM.createRoot(categories);

const categoriesURL = "http://127.0.0.1:5000/api/item"

function debounce(func, delay) {
    let timeoutId;
    return function(...args) {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
}

fetch(categoriesURL,{
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
})
.then(response=>response.json())
.then(data=>{
    console.log(data);
    catRoot.render(
        <>
            <li key={-1}><div type="button" className="categories" onClick={fetchItems("All")}>All</div></li>
            {data.categories.map((category,index)=>{
                return(<li key={index}><div type="button" className="categories" onClick={fetchItems(category)}>{category}</div></li>);
            })}
        </>
    );
})



const checkoutDiv=document.getElementById('checkoutItems');
const checkoutDivRoot=ReactDOM.createRoot(checkoutDiv);
const modalRoot=ReactDOM.createRoot(document.getElementById('tableBody'));




function ItemsBar({name,price,desc,itemID,sku}){
    const [addedElements,setAddedElements]=React.useState([]);
    var addedElementsRef=React.useRef([]);
    var [itemCount,setItemCount]=React.useState(0);
    var [totalPrice,setTotalPrice]=React.useState(0);
    var itemCountRef=React.useRef(itemCount);
    var totalPriceRef=React.useRef(totalPrice);


    function removeItem(id,price){
        addedElementsRef.current=addedElementsRef.current.filter((item) => item.props.itemID != id);
        setAddedElements(addedElementsRef.current);
        itemCountRef.current--;
        setItemCount(itemCountRef.current);
        totalPriceRef.current-= price
        setTotalPrice(totalPriceRef.current);
    }

    function QtyCounter({itemID,price,qty,updateQty}){

        const [qtyCount,setQtyCount]=React.useState(1);
        
        const changeQty=(operation)=>()=>{
            switch(operation){
                case 1:
                    setQtyCount(qtyCount + 1 );
                    itemCountRef.current++;
                    setItemCount(itemCountRef.current);
                    totalPriceRef.current+= price
                    setTotalPrice(totalPriceRef.current);
                    updateQty( 1);
                    console.log(addedElementsRef.current)
                    return;
                case 0:
                    if(qtyCount==1){
                        removeItem(itemID,price);
                        return;
                    }
                    itemCountRef.current--;
                    setItemCount(itemCountRef.current);
                    totalPriceRef.current-= price
                    setTotalPrice(totalPriceRef.current);
                    setQtyCount(qtyCount - 1);
                    updateQty(- 1);
            }
        }    
    
        return(
            <>
                <button type="button" className="btn btn-danger minus" onClick={changeQty(0)}>-</button>
                <button type="button" className="btn btn-dark qtyCount" >{qtyCount}</button>
                <button type="button" className="btn btn-success plus" onClick={changeQty(1)}>+</button>
            </>
        )
    }

    function AddedItemCard({name,price,itemID,qty}){
        const updateQty=(operation)=>{
            addedElementsRef.current=addedElementsRef.current.map((item)=>{
                if(item.props.itemID==itemID){
                    console.log("updating..");
                    return <AddedItemCard name={name} price={price} itemID={itemID} qty={qty +1 } />
                }
                return item;
            })
        }

        return(
            <>
                <div className="addedItemCard" id={itemID}>
                    <div className="addedItemData">
                        <h6 className="addedItemName">
                            {name}
                        </h6>
                        <p className="addedItemPrice">
                            Price : {price}
                        </p>
                    </div>
                    <div class="qtyCounter">
                        <QtyCounter itemID={itemID} price={price} updateQty={updateQty}></QtyCounter>
                    </div>
                </div>
            </>
        )
    }

    
    function finalConfirm(){
        addedElementsRef.current.map((item)=>{
            console.log(item);
        })
        ele = addedElementsRef.current;
        totPrice = totalPriceRef.current;
        modalRoot.render(
            <>
           { addedElementsRef.current.map((item)=>
                <tr>
                    <td>{item.props.name}</td>
                    <td>{item.props.price}</td>
                    <td>{item.props.qty}</td>
                </tr>
            )}
            <div>
                <p><strong>Total Amount : </strong> ₹{totalPriceRef.current}</p>
                <p><strong>Number of items :</strong> {itemCountRef.current}</p>
            </div>
            </>
        )
    }

    function ProceedCheckout(){
        return(
            <>
                <div id="orderData">
                    <p>Number Of items: {itemCount}</p>
                    <p>Total: <span id="total"> ₹{totalPrice}</span></p>
                </div>
                
                
                <div class="submit" id="addDone">
                    <button type="button" class="btn btn-dark" data-bs-toggle="modal" data-bs-target="#staticBackdrop" onClick={finalConfirm}>Proceed</button>
                </div>
            </>
        )
        }

    if(name){
        React.useEffect(()=>{
        let found=false
        const newAddedItem = <AddedItemCard name={name} price={price} itemID={itemID} qty={1} />;
        addedElementsRef.current.map((item)=>{
            if (item.props.name === name) {
                found=true
            }
        })  
        if (!found){
            console.log("added")
            setItemCount(itemCount+1);
            setTotalPrice (totalPrice+ price);
            itemCountRef.current++;
            totalPriceRef.current+=price;
            addedElementsRef.current=[...addedElementsRef.current,newAddedItem];
            setAddedElements([addedElementsRef.current]);}
        },[sku]);
    }

    checkoutDivRoot.render(
        <ProceedCheckout />
    )
    

    return(
        <>
            {addedElementsRef.current}
        </>
    )
}




const addedItems=document.getElementById('addedItems');
const addedItemsRoot=ReactDOM.createRoot(addedItems);




const displayAddedItem=(name,price,desc,sku)=>()=>{
    addedItemCount++;
    addedItemsRoot.render(
        <>
            <ItemsBar name={name} price={price} desc={desc} itemID={addedItemCount} sku={sku}></ItemsBar>
        </>
    )


}

function ItemCard({name,price,qty,desc,sku}){
    return(
        <div className="col-2 col-lg-3 itemCard" type="button" id={sku} onClick={displayAddedItem(name,price,desc,sku)} >
            <div><strong>
                {name}
            </strong></div> 
            <p>₹{price}</p>
            <p className="qtyItem">Qty : {qty}</p>
            <p className="descItem">{desc}</p>
        </div>
    )
}





const middleDiv=document.getElementById('middleDiv');
const middleRoot=ReactDOM.createRoot(middleDiv);



const fetchItems=(category)=>()=>{
    const fetchURL="http://127.0.0.1:5000/api/itemData";
    fetch(fetchURL,{
        method:'PUT',
        headers:{'Content-Type': 'application/json'},
        body:JSON.stringify({'category': category})
    })
    .then(response=>response.json())
    .then(data=>{
        console.log(data);

        middleRoot.render(
            <>
            {data.map((item)=>{
                return <ItemCard name={item["Item_name"]} price={item["Item_price"]} qty={item["Item_qty"]} desc={item["Item_description"]} sku={item["Item_SKU"]}></ItemCard>
            })
            }
            </>
        )



    })
}
const printButton = document.getElementById('printReceipt')
const proceedButton = document.getElementById('orderConfirm')

function updateData() {
    console.log(ele)
    const updateItem = "http://127.0.0.1:5000/api/item/update"
    const updateTransaction = "http://127.0.0.1:5000/api/transaction"
    // addedElementsRef.current = [];
    // setAddedElements(addedElementsRef.current);
    const printPDF="http://127.0.0.1:5000/api/print"

    ele.map(
        (item) => {
            fetch(updateItem, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({'Item_name' : item.props.name,'Item_qty':item.props.qty})
            })

        }
        
    )
    let t_category = "UPI";
    const radios = document.getElementsByName('flexRadioDefault')
    for (const radio of radios) {
        console.log("haha")
        if (radio.checked) {
            console.log("loll")
            t_category = radio.id;
            break;
        }
    }
    console.log(t_category); 
    console.log('sending');
    fetch(updateTransaction, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({'c_ID':customerID,'t_amount':totPrice ,'t_category':t_category })
    })

    fetch(printPDF, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({'items':ele,'price':totPrice,'cat':t_category,'c_ID':customerID})
    })
        .then(response => response.blob())
        .then(blob => {
            const url = window.URL.createObjectURL(new Blob([blob]))
            
            printButton.href = url
            printButton.setAttribute('download', 'invoice.pdf')
        })
}
const debounceUpdate = debounce(updateData, 500);
proceedButton.addEventListener('click', debounceUpdate);

// printButton.addEventListener('click', () => {
//     window.URL.revokeObjectURL(url);
// })
fetchItems('All')();



