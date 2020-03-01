// Configurando o servidor.
const express = require("express")
const server = express()

// Configurar o servidor para apresentar arquivos estáticos.
server.use(express.static("public"))

// Habilitar body do formulário.
server.use(express.urlencoded({ extended: true }))

// Configurar a conexão com o banco de dados.
const Pool = require("pg").Pool
const db = new Pool({
  user: "USUÁRIO", // Usuário do banco de dados.
  password: "SUA_SENHA", // Senha do banco de dados.
  host: "localhost", // Host do banco de dados.
  port: "5432", // Porta de conexão do banco de dados.
  database: "NOME_DO_BANCO_DE_DADOS" // Nome do banco de dados.
})

// Configurando a template engine.
const nunjucks = require("nunjucks")
nunjucks.configure("./", {
  express: server,
  noCache: true,
})

// Configurar a apresentação da página.
server.get("/", function(req, res) {
  db.query("SELECT * FROM donors", function(err, result) {
    if (err) return res.send("[ERRO] in database.")

    const donors = result.rows
    return res.render("index.html", { donors })
  })
})

server.post("/", function(req, res) {
  // Pegar dados do formulário.
  const name = req.body.name
  const email = req.body.email
  const blood = req.body.blood 

  // Verificando se foi inserido algum valor nulo.
  if (name == "" || email == "" || blood == "") {
    return res.send("Todos os campos são obrigatórios !")
  }

  // Colocando valores no Banco de Dados.
  const query = `
    INSERT INTO donors ("name", "email", "blood") 
    VALUES ($1, $2, $3)
    `
  const values = [name, email, blood]
  
  db.query(query, values, function(err) {
    // Fluxo de erro.
    if (err) return res.send("[ERRO] in database.")
    // Fluxo padrão.
    return res.redirect("/")
  })
})

// Ligar o servidor na porta 3000.
server.listen(3000, function() {
  console.log("Server Started :)")
})
