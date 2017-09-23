'use strict'
/*
https://www.youtube.com/watch?v=jMCtf4GJyZ4&index=37&list=PLHlHvK2lnJndvvycjBqQAbgEDqXxKLoqn
continuar a partir da aula 38 (Outros)

alt + shift + f identa o código

No package.json, foi colocado um novo script chamado start
Esse comando é usado como se fosse um atalho: npm start no terminal

Foi instalado um pacote chamado nodemon (npm install nodemon --save-dev) que fica "escutando" se teve alguma
alteração nos arquivos e reinicia o servidor. Bom porque não precisa ficar dando Ctrl + C para parar e depois 
npm start para iniciar. O -dev significa que só teremos esse pacote em ambiente de desenvolvimento.
Para rodar o nodemon, basta chamar no terminal: nodemon .\bin\server.js

Foi instalado outro pacote npm install body-parser --save, que vai converter o corpo da requisição para o Json

Foi instalado outro pacote npm install mongoose --save, vai prover a criação de collections através de um schema
porque um banco nosql é schemaless.

Foi instalado outro pacote npm install guid --save  que gera um GUID  

Foi instalado outro pacote npm install md5 --save  para criptografar a senha

Foi instalada a versão 2.0 do sendgrid npm install sendgrid@2.0.0 --save (versão recomendada)

Foi instalado o azure storageexplorer (externo), ferramenta para visualizar as imagens no azure, importante
sempre usar container storage para armazenar os arquivos pensando em escalabilidade da API.

Foi instalado outro pacote npm install azure-storage@2.1.0 --save

Para salvar a imagem, é necessário transformar em base 64, ex: https://www.base64-image.de/

Autenticação:
Usado o JWT, a aplicação decodifica o token utilizando o salt_key definido em config.js.
Cada requisição tem que enviar o token.
Foi instalado outro pacote npm install jsonwebtoken@7.4.0 --save

Se o Token está para expirar, foi feito um mecanismo de RefreshToken, que é gerado um novo token em cima
de um token válido.
*/

const express = require('express');
const bodyParser = require('body-parser');

//instanciando o mongoose
const mongoose = require('mongoose');

//instanciando o arquivo de configurações
const config = require('./config');

//Instanciando a app 
const app = express();
const router = express.Router(); //dada uma url, o usuário vai conseguir acessar a app.

//criando a conexão com o mongodb
mongoose.connect(config.connectionString);

//Carregar os Models
const Product = require('./models/product');
const Customer = require('./models/customer');
const Order = require('./models/order');

//Carregar as Rotas
const indexRoute = require('./routes/index-route');
const productRoute = require('./routes/product-route');
const customerRoute = require('./routes/customer-route');
const orderRoute = require('./routes/order-route');

/*
Status Utilizados:
200 (Ok)
201 (Created)
400 (BadRequest)
401 (Nao autenticado)
403 (Acesso Negado)
500 (Internal Server Error)
*/

//limitando o tamanho do body no request, bem útil principalmente quando converte para base 64 a imagem
app.use(bodyParser.json({
    limit: '5mb'
}));
app.use(bodyParser.urlencoded({
    extended: false
}));

//CORS
app.use(function(req, res, next){
    res.header('Access-Control-Allow-Origin', '*');//Liberando tudo aqui, se tiver URLs específicas que irão acessar, colocá-las aqui
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-Width, Content-Type, Accept, x-access-token');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    next();
});

//Rotas
app.use('/', indexRoute);
app.use('/products', productRoute);
app.use('/customers', customerRoute);
app.use('/orders', orderRoute);

//toda vez que essa classe for importada através do require, o que vai para a classe que importou é esse app
module.exports = app; 