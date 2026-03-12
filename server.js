// Importando o Express 
const express = require("express");
// Criando uma aplicação Express 
const app = express();
// Middleware para permitir que o Express entenda JSON 
app.use(express.json());
// Middleware para registrar logs das requisições 
app.use((req, res, next) => {
    const dataHora = new Date().toISOString();
    console.log(`[${dataHora}] ${req.method} - ${req.url}`);
    next();
});
// Simulação do banco de dados em memória 
let filmes = [ 
{ "id": 1, "titulo": "O Poderoso Chefão", "descricao": "Um épico sobre uma família mafiosa", "ano": 1972, "genero": "Drama", "nota": 9.2 }, 
{ "id": 2, "titulo": "Matrix", "descricao": "Um hacker descobre uma realidade alternativa", "ano": 1999, "genero": "Ficção Científica", "nota": 8.7 }, 
{ "id": 3, "titulo": "Toy Story", "descricao": "Brinquedos ganham vida quando ninguém está olhando", "ano": 1995, "genero": "Animação", "nota": 8.3 } 
]
// Rota para obter todos os filmes (com suporte a filtros) 
app.get("/filmes", (req, res) => {
    const { genero } = req.query;

    if (genero) {
        const filtrados = filmes.filter(item => item.genero.toLowerCase() === genero.toLowerCase());
        return res.json(filtrados);
    }
    res.json(filmes);
});
// Rota para obter um filme por ID 
app.get("/filmes/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const filme = filmes.find(item => item.id === id);

    if (!filme) {
        return res.status(404).json({ erro: "filme não encontrado" });
    }

    res.json(filme);
});
// Alias para o caminho singular (mantém compatibilidade com clientes antigos)
app.get("/filme", (req, res) => {
    res.redirect(301, "/filmes");
});

// Rota para adicionar um novo filme 
app.post("/filmes", (req, res) => {
    const body = req.body || {};
    const { titulo, descricao, ano, genero, nota } = body;

    if (!titulo || !descricao || !ano || !genero || nota == null) {
        return res.status(400).json({
            erro: "Todos os campos (titulo, descricao, ano, genero, nota) são obrigatórios"
        });
    }

    if (ano < 1800 || ano > new Date().getFullYear()) {
        return res.status(400).json({ erro: "Ano inválido" });
    }

    if (nota < 0 || nota > 10) {
        return res.status(400).json({ erro: "Nota deve estar entre 0 e 10" });
    }
    const novofilme = {
        id: filmes.length + 1,
        titulo,
        descricao,
        ano,
        genero,
        nota
    };

    filmes.push(novofilme);
    res.status(201).json(novofilme);
});
// Rota para atualizar um filme existente 
app.put("/filmes/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const { titulo, descricao, ano, genero, nota } = req.body;
    const index = filmes.findIndex(item => item.id === id);

    if (index === -1) {
        return res.status(404).json({ erro: "filme não encontrado" });
    }

    if (!titulo || !descricao || !ano || !genero || nota == null) {
        return res.status(400).json({
            erro: "Todos os campos (titulo, descricao, ano, genero, nota) são obrigatórios"
        });
    }

    if (ano < 1800 || ano > new Date().getFullYear()) {
        return res.status(400).json({ erro: "Ano inválido" });
    }

    if (nota < 0 || nota > 10) {
        return res.status(400).json({ erro: "Nota deve estar entre 0 e 10" });
    }

    filmes[index] = { id, titulo, descricao, ano, genero, nota };
    res.json(filmes[index]);
}); 
// Rota para deletar um filme por ID 
app.delete("/filmes/:id", (req, res) => { 
    const id = parseInt(req.params.id); 
    const index = filmes.findIndex(item => item.id === id); 
 
    if (index === -1) { 
        return res.status(404).json({ erro: "filme não encontrado" }); 
    } 
 
    filmes.splice(index, 1); 
    res.status(204).send(); 
});
// Iniciar o servidor 
const PORT = 4000; 
app.listen(PORT, () => { 
    console.log(`Servidor rodando na porta ${PORT}`); 
});