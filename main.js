const SHA256 = require('crypto-js/sha256');
var readlineSync = require('readline-sync');
var resp = "";
var data = new Date();
var dia     = data.getDate(); 
var mes     = data.getMonth();  
var ano4    = data.getFullYear();       // 4 dígitos

class Bloco{
    constructor(index, timestamp, dados, prev_Hash= ''){
        this.index = index; //mostra onde o bloco esta 
        this.timestamp = timestamp;// data do bloco
        this.data = dados; //dados recebios
        this.previousHash = prev_Hash; //armazena o hase do bloco anterior
        this.hash = this.calculaHash();
        this.nonce = 0;
    } 
    calculaHash(){//Calcular o hash
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data)+ this.nonce).toString();
    }
    mineBloco(dif){//hash do nosso bloco com uma certa dificuldade
        while(this.hash.substring(0, dif) !== Array(dif + 1).join("0")){
            this.nonce++;
            this.hash = this.calculaHash()//calculo do hash do bloco
        }
      //  console.log("Block mined " + this.hash);
    }
}
class Blockchain{
    constructor(){
        this.chain = [];// armazena os blocos 
        this.dificuldade =  parseInt(readlineSync.question('Digite a dificuldade do seus bloco:'));
    }
    SecondBlock(){
        if(this.chain.length ==0)//condicao para saber se é o primeiro bloco
            return this.chain[this.chain.length];
        else
            return this.chain[this.chain.length-1];// coloco -1 para ele volta o hash do anterior corretamente

    }

    addBlock(conteudo_bloco){
        if(this.chain.length ==0) //condicao para saber se é o primeiro bloco
            conteudo_bloco.previousHash = 0// se sim o previousHas = 0, pois ele e o primeiro
        else
            conteudo_bloco.previousHash = this.SecondBlock().hash;// retorna o hash do bloco anterior
        conteudo_bloco.mineBloco(this.dificuldade);
        this.chain.push(conteudo_bloco);//empilha esse bloco
    }

    isChainValid(){
        for(let i =1; i <this.chain.length; i++){
            const currentBlock = this.chain[i]; // bloco atual
            const previousBlock = this.chain[i - 1];//bloco anterior
            if(currentBlock.hash !== currentBlock.calculaHash()){// Recalcula o hash se der diferente esta errado
                return false;
            }
            if(currentBlock.previousHash !== previousBlock.hash){// Se a hash anterior do bloco n for igual a hash do previous do bloco atual esta errado
                return false;
            }
        }

        return true;
    }
}
let b = new Blockchain();
var i =0;// variavel que identifica o index
var qtdBlocos// variavel que faz o usuario sair
var data
while(true){
    qtdBlocos =  parseInt(readlineSync.question('Digite [ 1(Sair) 2(Continuar) ou 3(Verificacao)] : \n'));
    if(qtdBlocos == 2){
        var str_data = dia + '/' + (mes+1) + '/' + ano4;// data atual convertida dia/mes/ano
        data =  parseInt(readlineSync.question('Digite os dados: \n'));// armazena os dados
        var antes = Date.now();
        b.addBlock(new Bloco(i,str_data, data));// cria um novo bloco
        var duracao = Date.now() - antes;
        console.log(JSON.stringify(b,null,4));// 4 espacos para formatar
        console.log("Duracao de tempo desse bloco: " + duracao +"ms");
    }else if(qtdBlocos ==3){
        console.log("O Bloco está: " + b.isChainValid());
    }else{
        break
    }
    i++
}
//b.chain[1].data = 8000


