'use strict' //força o javascript a ser mais criterioso (esquecer ; por exemplo, falha na compilação)

//O node não fornece servidores http, então precisamos instalar alguns pacotes:
//npm install http express debug --save (esses pacotes geram uma pasta node modules, que não são enviadas para o servidor)
//deixando a pasta no gitignore

//quando baixa esse projeto, basta executar o comando npm install que os pacotes serão baixados
//O express prover o mvc
//O http é o servidor http, onde vai ter o listener que fica ouvindo uma porta e responde

//Importando os módulos no node com o require. Tudo que for colocado sem um caminho, será buscado da pasta node_modules
//Se quiser importar algo da aplicação, começar com um ./
const app = require('../src/app');
const http = require('http');
const debug = require('debug')('tmaturano:server');

const port = normalizePort(process.env.PORT || '3000'); //se o Port view setado, joga ele, senão joga o 3000
app.set('port', port);

//Criando o server
const server = http.createServer(app);

//Dizendo para o servidor ficar escutando a porta
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);
console.log('API rodando na porta ' + port);

//Função para verificar se uma porta está disponível (retirada do express)
function normalizePort(val){
    const port = parseInt(val, 10);

    if (isNaN(port)){
        return val;
    }

    if (port >= 0){
        return port;
    }

    return false;
}

//Função retirada do express para tratar erros
function onError(error){
    if (error.syscall !== 'listen'){
        'Pipe ' + port;
        'Port ' + port;
    }

    const bind = typeof port === 'string' ? 
        'Pipe ' + port :
        'Port ' + port;

    switch (error.code){
        case 'EACCES': //erro de permissão , código de erro do node
             console.error(bind + 'requires elevated privileges');
             process.exit(1);
             break; //erro de endereço em uso, código de erro do node
        case 'EADDRINUSE':
             console.error(bind + 'is already in use');
             process.exit(1);             
             break;
        default:
            throw error;
    }
}

//Função que pega informações do servidor e inicia o debug
function onListening(){
    const addr = server.address();
    const bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;

    debug('Listening on '+ addr.port); 
}