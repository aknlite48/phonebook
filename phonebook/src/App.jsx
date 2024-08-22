import { useState,useEffect } from 'react'
import axios from 'axios'

//const base_url = 'http://localhost:3001/api/persons'
const base_url = "/api/persons"

const Filter = ({value,onChange})=> {
  return <div>
    <h2>Search by</h2>
    <input value={value} onChange={onChange}/>
    </div>
}







const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber,setNewNumber] = useState('')
  const [newQuery,setNewQuery] = useState('')
  const [notf_mesg,setMessage] = useState(null)
  const [msg_color,set_msg_color] = useState('red')

  const hook = () => {
    axios
    .get(base_url)
    .then(response => {
      setPersons(response.data)
    })
    .catch((response)=>{
      setMessage('Error Loading')
      set_msg_color('red')
      setTimeout(()=>{setMessage(null)},3000)
    })
  }
  useEffect(hook,[])

  const change_name = (event) => {
    setNewName(event.target.value)

  }

  const change_number = (event) => {
    setNewNumber(event.target.value)
  }

  const update_name = (event)=> {
    event.preventDefault()
    for (let o of persons) {
      if (o.name===newName) {
        //alert(`${newName} already exists!`)
        if (confirm(`${newName} already exists! update number?`)) {
          const new_p = {...o,number: newNumber}
          axios.
          put(`${base_url}/${o.id}`,new_p)
          .then((response)=>{
            setPersons(persons.map((o1)=>{return (o1.id===o.id) ? new_p : o1}))
            setMessage(`${response.data.name} successfully updated with ${response.data.number}`)
            set_msg_color(`green`)
            setTimeout(()=>{setMessage(null)},3000)
          }
          )
          .catch((response)=>{
            setMessage(`${newName} couldnt be updated`)
            set_msg_color('red')
            setTimeout(()=>{setMessage(null)},3000)
          })
        }
        return
      }
    }
    const new_p = {name: newName,number: newNumber}
    //server logic
    axios
    .post(`${base_url}`,new_p)
    .then((response)=>{
      setPersons(persons.concat(response.data))
      setNewName('')
      setNewNumber('')
      setMessage(`Successfully added ${response.data.name}`)
      set_msg_color('green')
      setTimeout(()=>{setMessage(null)},3000)
      
    })
    .catch((response)=>{
      setMessage(`Unable to add ${newName}`)
      set_msg_color('red')
      setTimeout(()=>{setMessage(null)},3000)
    })


  }

  const query_search = (event) => {
    setNewQuery(event.target.value)
  }

  const Final_list = () => {
    return (
      <div>
      <ul>
      {(persons.filter((o)=>{return (o.name).includes(newQuery)})).map((o)=>{return <li key={o.id}>{o.name} : {o.number} <button onClick={()=>{delete_contact(o.id)}}>delete</button></li>})}
      </ul>
      </div>
    )
  
  }

  const delete_contact = (id) => {
    if (confirm('delete contact?')) {
      let temp_name
      let new_persons = persons.filter((o)=>{
        if (o.id!==id) {
          return true
        }
        else {
          temp_name = o.name
          return false
        }
      })
      axios.
      delete(`${base_url}/${id}`).
      then((response)=>{
        setPersons(new_persons)
        setMessage(`Successfully deleted ${temp_name}`)
        set_msg_color('green')
        setTimeout(()=>{setMessage(null)},3000)
      })
      .catch((response)=>{
        setMessage(`Unable to delete ${temp_name}`)
        set_msg_color('red')
        setTimeout(()=>{setMessage(null)},3000)
      })
      
    }
    
  
  }



  const Notification = ({message,msg_color}) => {
    if (message===null) {
      return null
    }
    let temp_style = {
        color: msg_color,
        background: 'lightgrey',
        fontSize: 20,
        borderStyle: 'solid',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10
      }

    return (
      <div style={temp_style}>
        {message}
      </div>
    )
  }




//call {Filter() instead of <Filter /> to prevent re-rendering and losing input field focus}
  

  return (
    <div>
      <Notification message={notf_mesg} msg_color={msg_color}/>
      <Filter value={newQuery} onChange={query_search} />
      <h2>Add New</h2>
      <form onSubmit={update_name}>
        <div>
          name: <input value={newName} onChange={change_name}/>
        </div>
        <div>
          number : <input value={newNumber} onChange={change_number}/>
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      <Final_list />
    </div>
  )
}

export default App