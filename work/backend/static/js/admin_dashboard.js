

const transactInfoURL = "http://127.0.0.1:5000/api/transactInfo"
const staffInfoURL = "http://127.0.0.1:5000/api/staffData"
const itemInfoURL= "http://127.0.0.1:5000/api/itemData"
const rootEle = document.getElementById('root')
const  root=ReactDOM.createRoot(rootEle)



function TopTransactions() {
  const [topData, setTopData] = React.useState([]);
  React.useEffect(() => {
    fetch(transactInfoURL, {
      method: "GET",
      headers: { 'Content-Type': 'application/json' },
    })
      .then(response => response.json())
      .then(data => {
        if (data["data"] != topData) setTopData(data["data"])
      })
  },[])

        return (<>
          <div className="col-7" id="top">
                <h4>Top Transactions Today</h4>
                <hr />
                <table className="table">
                  <thead>
                <tr>
                      <th span="col">Customer ID</th>
                      <th span="col">Transaction ID</th>
                      <th span="col">Amount</th>
                      <th span="col">Time</th>
                      <th span="col">Method</th>
                    </tr>
                  </thead>
                  <tbody>
                      {topData.map(transaction => (
                        <tr>
                          <td>{transaction.c_ID}</td>
                          <td>{transaction.t_ID}</td>
                          <td>{transaction.t_amount}</td>
                          <td>{transaction.t_time}</td>
                          
                          <td>{transaction.t_category}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
      </>)
}


function NewsItem({ name, qty }) {
  var Qstatus = <div  class="status green">OK</div>
  var color="rgb(30, 222, 30)"
  if (qty < 10) {
    Qstatus = <div class="status red">URGENT</div>; 
    color="rgb(220, 4, 4)"
  }
  else if (qty < 50) {
    Qstatus = <div  class="status yellow">LOW</div>
    color="Yellow"
  }
  return (
    <div class="item" style={{borderColor:color,color:color}}>
    <div>
      <p><strong>Item Name:</strong> {name}</p>
      <p><strong>Quantity Left:</strong> {qty}</p>
    </div>
    {Qstatus}
  </div>
  )
}

function News() {
  const [data,setData]=React.useState([])
  React.useEffect(() => {
    fetch(itemInfoURL, {
      method: 'GET',
      headers:{'Content-Type':'application/json'}
    })
      .then(response => response.json())
      .then(dat => {
        setData(dat["data"]);
    })
  },[])
  console.log(data)
  return (
    <div class="col-4 ms-1" id="News">
      <h4>News</h4>
      <hr />
      <div id="newScroll">
      {data.map((item, index) => (
          <NewsItem key={index} name={item.name} qty={item.qty} />
        ))}
      </div>
    </div>
    
  )
}

function RevenueChart() {
  
  React.useEffect(() => {
    fetch(transactInfoURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    })
      .then(response => response.json())
      .then(data => {
        let revenureData = data["revenues"]
        let dates = data["dates"]
        const ctx = document.getElementById('myChart').getContext('2d');
        new Chart(ctx, {
          type: 'line',
          data: {
            labels:dates,
            datasets: [{
              label: 'Revenue',
              data: revenureData,
              borderColor: 'rgba(0, 192, 0, 1)',
              borderWidth: 2,
              fill: {
                target: 'origin',
                above: 'rgba(0,192, 0,0.15)',  
              }
 
            }]
          },
          options: {
            scales: {
              x: {
                ticks: {
                    color: 'red' 
                },
                title: {
                    display: true,
                    text: 'Date',
                    color: 'rgba(0, 200, 0, 1)'
                }
            },
              y: {
                ticks: {
                  color:'yellow' 
                },
                title: {
                  display: true,
                  text: 'Revenue',
                  color: 'rgba(0, 200, 0, 1)' 
              },
                beginAtZero: true
              }
            }
          }
        });
    

        return () => {
          const chart = Chart.getChart('myChart');
          if (chart) {
            chart.destroy();
          }
        };
      }, []);

    })
    


  return (
    <div id="revChart" className="col-8">
      <h2>Revenue Chart</h2>
      <hr />
      <canvas id="myChart"></canvas>
    </div>
  );
}

function StaffCount() {
  const [admin, setAdmin] = React.useState(0);
  const [cashier,setCashier] = React.useState(0);
  React.useEffect(() => {
    fetch(staffInfoURL, {
      method: 'GET',
      headers:{'Content-Type':'application/json'}
    }).then(response => response.json())
      .then(data => {
        setAdmin(data["admin"])
        setCashier(data["cashier"])
    })
  },[])

  
  return (<div className="col-3 ms-1" id="staffCount">
    <h2>Staff Count</h2>
    <hr></hr>
    <h3>{cashier+admin}</h3><h4>Employees</h4>
    <br></br>
    <br></br>
    <h3>{cashier}</h3><h4>Cashiers</h4>
    <br></br>
    <br></br>
    <h3>{admin}</h3><h4>Admin</h4>
  </div>)
}

root.render(<>
  <div className="row justify-content-center mt-1">
    <TopTransactions />
    <News />
  </div>
  <div className="row mt-1 justify-content-center">
    <RevenueChart />
    <StaffCount />
  </div>
</>)