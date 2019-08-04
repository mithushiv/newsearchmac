import React, { Component } from 'react';
import isMACAddress from 'validator/lib/isMACAddress';

class Search extends Component {
    constructor(props) {
        super(props);
        this.state = {
          isLoad: false,
          results: [],
        }
        this.fetchData = this.fetchData.bind(this)
        
      }
    //  intial loading the results 
    componentDidMount() {
        var myHeaders = new Headers({
            'Content-Type': 'text/plain',
            'Access-Control-Allow-Origin':'*',
            'X-Custom-Header': 'hello world'
          });
          
        fetch('http://127.0.0.1:5000/alarms', {
            headers: myHeaders
          })
         .then(res => res.json())
         .then((data) => {
         this.setState({ isLoad: true,results: data })
         })
    }

    // render table to the results
    renderTableData() {
        return this.state.results.map((results, index) => {
           const { id, mac, sev, sec, desc } = results //destructuring
           return (
              <tr key={id}>
                 <td>{mac}</td>
                 <td>{sev}</td>
                 <td>{sec}</td>
                 <td>{desc}</td>
              </tr>
           )
        })
     }
     
    //  fetch the data from every search 
     fetchData() {
        let severity;
        var macid;
        var validate = true;


        var macids = document.getElementById('macid').value;
        var values = macids.split(',');
        

        for(let i=0; i<values.length; i++) {
        
        if( values[i].indexOf('macid') === 0) {
          var macidto=values[i].substring(values[i].indexOf("=") + 1);
          macid = macidto.trim()
        }
        if( values[i].indexOf('severity') === 0) {
          var severityy= values[i].substring(values[i].indexOf("=") + 1).trim();
          severity = severityy.trim();
        }
        if( values[i].indexOf('source') === 0) {
          var source1= values[i].substring(values[i].indexOf("=") + 1).trim();
          var sources = source1.toLowerCase()
          var source = sources.trim();
          }
        }

      var url = new URL('http://127.0.0.1:5000/alarms?');
      
      if(macid) {
        // MACID VALIDATION FROM THIRD PARTY LIBRARY
        if(isMACAddress(macid)) {
          url.searchParams.append('macid',macid)
         }else {
           validate = false;
          alert("MAC is invalid")
         }
      }
      if(severity) {
        // severity validation
        if(severity.length === 1  )  {
          if(severity >= 1 &&  severity <= 5 )  {
            url.searchParams.append('severity', severity )
         } else { validate = false
          alert("severity is invalid")}
        } else { validate = false
          alert("severity is invalid")
        }
      }
      if(source) {
        // source validation
        if(source === 'subsys2' || source === 'subsys1'  ) {
          url.searchParams.append('source',source )
        }else {
          validate = false
          alert("source is invalid")
        }
      }
      //  IF ALL VALIDATION IS PASSED THEN WE ARE HITING API
       if(validate) {
        var uri = url;
        var enc = encodeURI(uri);
        var dec = decodeURI(enc);
        document.getElementById("macid").classList.remove("validation");
        
        var myHeaders = new Headers({
          'Content-Type': 'text/plain',
          'Access-Control-Allow-Origin':'*',
          'X-Custom-Header': 'hello world'
        });
        
       fetch(dec, {
          headers: myHeaders
        })
       .then(res => res.json())
       .then((data) => {
          this.setState({ isLoad: true,results: data })
       }) 
       }else {
        //  IF ANY VALDATION IS FAILED
        document.getElementById("macid").classList.add("validation");
       }

     }
    

    //  Clear all the Search filed data or refresh the page
     cleaeALl() {
      document.location.reload() 
     }


    render() { 
      var {isLoad, results, } = this.state;
      var totallenght = results.length; 
      if(!isLoad) {
        // Loading screen
       return <div className="loading">Loading ..</div>
        } else if (totallenght === 0) {
        //  if Data is not there, we can show empty state
          return  <div>
          <div className="search-container"> <h3>Search</h3>   </div>
           <div className="search-container"> 
           <div><input type="text" id="macid" name="macid" placeholder="source=Subsys1,macid=74:E1:82:E0:D0:9C,severity=1"/></div> 
           <br/>
           <button className="search" onClick={this.fetchData}  >Search </button>
           <button className="search-clear" onClick={this.cleaeALl}  >Clear </button>
           </div>
           <br/> 
           </div>
  
         } else {
          return (<div>
           <div className="search-container"> <h3>Search</h3>   </div>
            <div className="search-container"> 
            <div><input type="text" id="macid" name="macid" placeholder="Your search here"/></div> 
            <br/>
            <div>
            <button className="search" onClick={this.fetchData}  >Search </button>
            <button className="search-clear" onClick={this.cleaeALl}  >Clear </button>
            </div>
            <br/>
            </div>
            <div className="container">
            <div> <h5> Total number of results :  {this.state.results.length }</h5>  </div>
            <br></br>
            <table cellPadding="0" cellSpacing="0" >
            <thead>
                <tr>
                <th>ID</th>
                <th>Mac id</th>
                <th>Severity</th>
                <th>Source</th>
                <th>Description</th>
                </tr>
            </thead>
            <tbody>
            {this.state.results.map(row => (
            <tr key={row.id}>
                <td>{row.id}</td>
                <td>{row.macid}</td>
                <td>{row.severity}</td>
                 <td>{row.source}</td>
                <td>{row.description}</td>
           </tr>
             ))}
            </tbody>
           </table>
          </div>
    </div>);
         } 
        
    }
}
export default Search;