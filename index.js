const express = require('express')
const app = express()
const morgan = require('morgan')

app.use(express.json())

const cors = require('cors')
app.use(cors())

app.use(morgan(function (tokens, req, res) {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, 'content-length'), '-',
      tokens['response-time'](req, res), 'ms',
      (tokens.method(req,res)==='POST') ? JSON.stringify(req.body) : ''
    ].join(' ')
  }))
app.use(express.static('dist'))
let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.post('/api/persons',(request,response)=>{
    const new_person = request.body

    if (!new_person.name) {
        response.status(400).json({error:"name missing"})
        return
    }
    if (!new_person.number) {
        response.status(400).json({error:"number missing"})
        return
    }

    for (let p of persons) {
        if (p.name===new_person.name) {
            response.status(400).json({error: `${p.name} already exists`})
            return
        }
    }

    let new_id = persons[0].id
    const range=1000
    while ((persons.filter((n)=>{return n.id==new_id})).length>0) {
        new_id = Math.round(Math.random()*range)
    }

    const new_p = {id:new_id,
        name:new_person.name,
        number:new_person.number
    }
    persons = persons.concat(new_p)
    response.json(new_p)


})

app.get('/api/persons',(request,response)=>{
    response.json(persons)
})

app.get('/api/info',(request,response)=>{
    let disp = `<p>Phonebook has info for ${persons.length} persons</p>`
    const now = new Date()
    disp = disp+`<p>${now}</p>`
    response.send(disp)
})

app.get('/api/persons/:id',(request,response)=>{
    const id = request.params.id
    const person = persons.find((n)=>{return n.id===id})
    if (person) {
        response.json(person)
    }
    else {
        response.status(404).end()
    }
})

app.put('/api/persons/:id',(request,response)=>{
    const new_p = request.body
    const id = request.params.id
    persons = persons.map(
        (n)=>{
            if (n.id!==id) {
                return n
            }
            else {
                return {id:id,...new_p}
            }
        }
    )
    response.json({id:id,...new_p})
})

app.delete('/api/persons/:id',(request,response)=>{
    const id = request.params.id
    persons = persons.filter((n)=>{return n.id!==id})
    //response.json(request)
    response.status(204).end()
})

PORT = process.env.PORT || 3001
app.listen(PORT)
console.log(`Server running on PORT ${PORT}`)