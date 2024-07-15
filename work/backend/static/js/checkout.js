

// let object={
//   name: "",
//   age: 0,
// }





// function MyComponent(objec) {
//     const[a ,seta]=React.useState(2);

//     function handleClick(event){
//       console.log(event);
//       seta(3);
//     }
//     return (
//       <>
//         <h1>lol</h1>
//         <div>
//           {a===2? <p>Yes</p>:<p>NO</p>}
//           <h1>Hello, world!</h1>
//           <p onClick={handleClick}>{objec.name}{objec.age}</p>
//         </div>
//       </>
//     );
//   }


  // Render the React component to the DOM
  // const a="aman"
  // const rootElement = document.getElementById('root');
  // const root = ReactDOM.createRoot(rootElement);
  // root.render(<MyComponent name="aman" age={18} />);

function CustomerDetails({name,contact,Address}){
  return(
  <>
    <h6><strong>Details Entered</strong></h6>
    <h6>Name</h6>
    <div id="showName" className="showC">{name}</div>
    <h6>Contact</h6>
    <div id="showNumber" className="showC">{contact}</div>
    {(Address)? <> 
      <h6>Address</h6>
      <div id="showAdd" className="showC">{Address}</div>
    </>:null}
    <div id="proceed">
        <button type="submit" className="btn btn-success">Proceed to checkout <i className="bi bi-arrow-right-square"></i></button>
    </div>
  </>
  );
}

function Alert({msg,type}){
  let aType="alert alert-"+ type;
  return(
    <div className={aType} role="alert">
      {msg}
    </div>
  );
}
  


  const goButton=document.getElementById('goButton');
  const rightBar=document.getElementById('rightBar');
  const rightRoot=ReactDOM.createRoot(rightBar);
  const inputForm=document.getElementById('customerDetails');
  const alertdiv=document.getElementById('showAlert');
  const AlertRoot=ReactDOM.createRoot(alertdiv);
  
  inputForm.addEventListener('submit',(event)=>{
    
    
    event.preventDefault();
    const inName=document.getElementById('signupName').value;
    const inContact=document.getElementById('signupContact').value;
    const inAddress=document.getElementById('signupAddress').value;

    if(!inName){
      AlertRoot.render(<Alert msg="Enter Name" type="danger" />);
      return;
    }

    if(!inContact){
      AlertRoot.render(<Alert msg="Enter Contact" type="danger" />);
      return;
    }

    const url="http://127.0.0.1:5000/api/customer";
    fetch(url,{
      method:'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({c_contact:inContact,searchByContact:true})
    })
    .then(response=>response.json())
    .then(
      data=>{
        console.log(data);
        if(data["msg"]==0){
          AlertRoot.render(
          <>
            <Alert msg="Customer Not Registered" type="danger" />
            
            <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal" id="regNew">
              Register Here
            </button>
          </>
            
          );
          return;
        }
      }
    )

    rightRoot.render(<CustomerDetails name={inName} contact={inContact} Address={inAddress}  />);

  })


  const regNew=document.getElementById('regButton');
  const alertdivReg=document.getElementById('showAlertReg');
  const AlertRootReg=ReactDOM.createRoot(alertdivReg);
  regNew.addEventListener('click',()=>{
    const c_name=document.getElementById('regName').value;
    const c_contact=document.getElementById('regContact').value;
    const c_email=document.getElementById('regEmail').value;

    

    if(!c_name){
      AlertRootReg.render(<Alert msg="Enter Name" type="danger" />);
      return;
    }

    if(!c_contact){
      AlertRootReg.render(<Alert msg="Enter Contact" type="danger" />);
      return;
    }

    if(!c_email){
      AlertRootReg.render(<Alert msg="Enter Email" type="danger" />);
      return;
    }

    AlertRootReg.render(<></>);
    const url="http://127.0.0.1:5000/api/customer";
    fetch(url,{
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ c_name,c_email, c_contact})
    })
    .then(response=>response.json())
    .then(
      data=>{
        if(data["msg"]=="Done"){
          AlertRootReg.render(<Alert msg="Successfully registered User" type="success" />);
        }
      }
    )

  })