require('dotenv').config()
const express = require('express')
const app = express()
const Contact = require('./models/contact')
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

//comment out for prod code
app.use(express.static('dist'))

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
    if (isNaN(new_person.number)) {
        response.status(400).json({error:"invalid number"})
        return
    }

    let name_duplicate=false
    /*
    Contact.find({})
    .then((result)=>{
        for (let p of result) {
            if (p.name===new_person.name) {
                name_duplicate=true
            }
        }
    })*/

    const new_p = new Contact({
        name: new_person.name,
        number: new_person.number
    })

    new_p.save()
    .then((result)=>{
        response.json(result)
    })
    .catch((error)=>{
        response.status(400).json({error: error.name})
    })
    
    


})


app.get('/api/persons',(request,response)=>{
    Contact.find({})
    .then((result)=>{
        response.json(result)
    })
})


/*
app.get('/api/info',(request,response)=>{
    let disp = `<p>Phonebook has info for ${persons.length} persons</p>`
    const now = new Date()
    disp = disp+`<p>${now}</p>`
    response.send(disp)
})
*/

//get by id
app.get('/api/persons/:id',(request,response)=>{
    Contact.findById(request.params.id)
    .then((result)=>{
        response.json(result)
    })
    .catch(()=>{
        response.status(404).json({error: "not found"})
    })
})

//get by name
app.get('/api/persons/name/:name',(request,response)=>{
    Contact.find({name:request.params.name})
    .then((result)=>{
        response.json(result)
    })
})

app.put('/api/persons/:id',(request,response)=>{
    const new_p = {
        name: request.body.content,
        number: request.body.number
    }
    const id = request.params.id
    Contact.findByIdAndUpdate(id,new_p,{new:true})
    .then((result)=>{response.json(result)})
    .catch(()=>{response.status(404).end()})
})


app.delete('/api/persons/:id',(request,response)=>{
    const id = request.params.id
    Contact.findByIdAndDelete(id)
    .then(()=>{response.status(204).end()})
    .catch(()=>{response.status(404).end()})
})


PORT = process.env.PORT || 3001
app.listen(PORT)
console.log(`Server running on PORT ${PORT}`)