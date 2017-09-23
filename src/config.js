global.SALT_KEY = 'f5b99242-6504-4ca3-90f2-05e78e5761ef'; //chave secreta , utilizada para geração do token, md5, so usada no server
global.EMAIL_TMPL = 'Olá <strong>{0}</strong>, seja bem vindo ao Node Store!';

module.exports = {
    connectionString : 'mongodb://tmaturano:tmaturano@ds050189.mlab.com:50189/nodestore',
    sendgridKey: 'SUA KEY', //usado para enviar email
    containerConnectionString: 'SUA CONNECTION STRING DO CONTAINER NO AZURE' //usado para armazear as imagens do produto no azure
}