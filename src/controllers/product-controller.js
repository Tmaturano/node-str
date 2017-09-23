'use strict';

/*
    Delegando toda responsabilidade do que vai ser executado em uma rota para um controller,
    Trabalhar com banco de dados, etc
    Usaremos MongoDB como banco de dados, Recomendação da leitura do Livro NoSql Distiled, do Martin Fowler
    Instala o Mongo na máquina ou usamos o mlab (que permite criar um banco nosql online)
    Outra ferramenta instalada foi o 3t studio para controlar o banco de dados de forma visual (free para app não comercial)
*/

const ValidationContract = require('../validators/fluent-validator');
const repository = require('../repositories/product-repository');
const azure = require('azure-storage');
const guid = require('guid');
var config = require('../config');

//Listar todos os produtos aqui
exports.get = async(req, res, next) => {
    try {
        var data = await repository.get();
        res.status(200).send(data);    
    } catch (error) {
        res.status(500).send({
            message: 'Falha ao processar a requisição'
        });
    }

    // .then(data => { //arrow functions, do Ecma Script. Feito isso porque é async e queremos pegar o resultado da function save para saber se salvou
    //     res.status(200).send(data);
    // }).catch(e => {
    //     res.status(400).send(e);
    // });
}

exports.getBySlug = async(req, res, next) => {
    try {
        var data = await repository.getBySlug(req.params.slug);    
        res.status(200).send(data);
    } catch (error) {
        res.status(500).send({
            message: 'Falha ao processar a requisição'
        });
    }
}

exports.getById = async(req, res, next) => {
    try {
        var data = await repository.getById(req.params.id);
        res.status(200).send(data);
    } catch (error) {
        res.status(500).send({
            message: 'Falha ao processar a requisição'
        });
    }
}

//Irá trazer todos os produtos que tenham na tags o parâmetro informado
exports.getByTag = async(req, res, next) => {
    try {
        var data = await repository.getByTag(req.params.tag);
        res.status(200).send(data);
    } catch (error) {
        res.status(500).send({
            message: 'Falha ao processar a requisição'
        });
    }
}

exports.post = async(req, res, next) => {
    /*
    Se não tivesse utilizando o mongoose para inserir no mongodb, e precisasse validar as informações
    antes de persistir no banco de dados, teria validar de alguma outra maneira
    */ 
    let contract = new ValidationContract();
    contract.hasMinLen(req.body.title, 3, 'O título deve conter pelo menos 3 caracteres');
    contract.hasMinLen(req.body.slug, 3, 'O slug deve conter pelo menos 3 caracteres');
    contract.hasMinLen(req.body.description, 3, 'A description deve conter pelo menos 3 caracteres');
    
    //Se os dados forem inválidos
    if (!contract.isValid()){
        res.status(400).send(contract.errors()).end();
        return;
    }

    try {
        //Cria o Blob Service
        const blobSvc = azure.createBlobService(config.containerConnectionString);

        let filename = guid.raw().toString() + '.jpg'; //usado o guid porque se gerar dois arquivos com o mesmo nome, irá substituir
        let rawdata = req.body.image;
        
        //regex para remover uma espécie de cabeçalho que vem nas imagens base 64
        let matches = rawdata.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/); 
        let type = matches[1];
        let buffer = new Buffer(matches[2], 'base64');


        //salva a imagem
        await blobSvc.createBlockBlobFromText('product-image', filename, buffer, {
            contentType: type
        }, function (error, result, response){
            if (error){
                filename = 'default-product.png'
            }
        });
        
        await repository.create({
            title: req.body.title,
            slug: req.body.slug,
            description: req.body.description,
            price: req.body.price,
            active: true,
            tags: req.body.tags,
            image: 'https://nodestoretmo.blob.core.windows.net/product-image/' + filename
        });
        res.status(201).send({
            message: 'Produto cadastrado com sucesso!'
        });
    } catch (error) {
        console.log(error);

        res.status(500).send({
            message: 'Falha ao cadastrar o produto.',
            data: error
        });
    }    
};

exports.put = async(req, res, next) => {
    // const id = req.params.id; //params.nomeDoParametro que vem da url
    // res.status(200).send({
    //     id: id,
    //     item: req.body
    // });
    
    try {
        await repository.update(req.params.id, req.body);
        res.status(200).send({
            message: 'Produto atualizado com sucesso!'
        });
    } catch (error) {
        res.status(400).send({
            message: 'Falha ao atualizar o produto.',
            data: error
        }); 
    }
};

exports.delete = async(req, res, next) => {
    try {
        await repository.delete(req.body.id);
        res.status(200).send({
            message: 'Produto removido com sucesso!'
        });
    } catch (error) {
        res.status(400).send({
            message: 'Falha ao remover o produto.',
            data: error
        });
    }  
};