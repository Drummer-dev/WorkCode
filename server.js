const express = require('express')
const server = express()

server.use(express.static('public'))

server.use(express.urlencoded({extende: true}))


// configura a conexão com o banco de dados
const Pool = require('pg').Pool
const db = new Pool({
    user: 'postgres',
    password: 'glkabaterista100',
    host: 'localhost',
    port: 5432,
    database: 'WorkCode'

})

const nunjucks = require('nunjucks')
nunjucks.configure('./', {
    express: server,
    noCache: true,
})

server.get('/', function(req, res){
    db.query("SELECT * FROM client", function(err, result){
        if(err) return res.send("Erro de Banco de dados.")

        const client = result.rows
        return res.render("index.html", {client})
    })

    
})

server.post('/', function(req, res){
    const name = req.body.name
    const email = req.body.email
    const endereço = req.body.endereço

    if(name == "" || email == "" || endereço == ""){
        return res.send("Todos os campos são obrigatórios")
    }

    const query = `
        INSERT INTO client ("name", "email", "endereço")
        VALUES ($1, $2, $3)`
    
    const values = [name, email, endereço]

    db.query(query, values, function(err){
        if (err) return res.send("erro no banco de dados.")

        
        return res.redirect('/')
    })

    
})

// Ligar o servidor
server.listen(3000)