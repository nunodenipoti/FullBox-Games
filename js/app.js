// js/app.js - FullBox Games (JavaScript puro)


var jogos = [
  {
    id: 1,
    nome: "Grand Theft Auto VI",
    genero: "Ação e Aventura",
    preco: 449.90,
    desc: "Explore Vice City em uma aventura de mundo aberto repleta de ação, crimes e possibilidades."
  },
  {
    id: 2,
    nome: "EA Sports FC 27",
    genero: "Esportes",
    preco: 349.90,
    desc: "Entre em campo, monte seu time dos sonhos e dispute partidas de futebol com clubes e jogadores do mundo todo."
  },
  {
    id: 3,
    nome: "Call of Duty: Modern Warfare IV",
    genero: "Tiro em Primeira Pessoa",
    preco: 349.90,
    desc: "Participe de operações militares intensas em uma campanha cinematográfica e enfrente jogadores no modo multiplayer."
  },
  {
    id: 4,
    nome: "God of War Ragnarök",
    genero: "Ação e Aventura",
    preco: 249.90,
    desc: "Acompanhe Kratos e Atreus em uma jornada pelos Nove Reinos para enfrentar deuses e criaturas da mitologia nórdica."
  },
  {
    id: 5,
    nome: "NBA 2K27",
    genero: "Esportes",
    preco: 349.90,
    desc: "Viva a experiência do basquete profissional, crie seu jogador e dispute partidas na NBA."
  },
  {
    id: 6,
    nome: "Cyberpunk 2077",
    genero: "RPG e Ação",
    preco: 249.90,
    desc: "Explore Night City, uma metrópole futurista, enquanto assume o papel de V em uma aventura repleta de escolhas e tecnologia."
  },
  {
    id: 7,
    nome: "007 First Light",
    genero: "Ação e Espionagem",
    preco: 299.90,
    desc: "Conheça a origem de James Bond em uma aventura de espionagem com missões secretas, investigação e ação."
  },
  {
    id: 8,
    nome: "Forza Horizon 6",
    genero: "Corrida",
    preco: 349.90,
    desc: "Explore o Japão, dirija carros incríveis e participe de corridas e desafios automobilísticos."
  },
];
var desconto = 0;
var atual = 1;

function moeda(v) {
  return "R$ " + v.toFixed(2).replace(".", ",");
}
function valor(id) {
  return document.getElementById(id).value;
}
function escrever(id, texto) {
  document.getElementById(id).textContent = texto;
}
function avisar(id, texto, sucesso) {
  var caixa = document.getElementById(id);
  caixa.textContent = texto;
  if (window.bootstrap != undefined) {
    if (sucesso) {
      caixa.className = "alert alert-success";
    } else {
      caixa.className = "alert alert-danger";
    }
  } else {
    if (sucesso) {
      caixa.className = "msg-ok";
    } else {
      caixa.className = "msg-erro";
    }
  }
}

function ler(chave) {
  return JSON.parse(localStorage.getItem(chave) || "[]");
}
function salvar(chave, lista) {
  localStorage.setItem(chave, JSON.stringify(lista));
}

function contar() {
  escrever("badge-carrinho", ler("carrinho").length);
}

function comprar(id) {
  var carrinho = ler("carrinho");
  carrinho.push(id);
  salvar("carrinho", carrinho);
  contar();
  alert("Jogo adicionado ao carrinho!");
}

function remover(posicao) {
  var carrinho = ler("carrinho");
  carrinho.splice(posicao, 1);
  salvar("carrinho", carrinho);
  mostrarCarrinho();
}

function mostrarCarrinho() {
  var carrinho = ler("carrinho");
  var linhas = "";
  var total = 0;
  for (var i = 0; i < carrinho.length; i++) {
    var j = jogos[carrinho[i] - 1];
    if (j != undefined) {
      total = total + j.preco;
      linhas += `<tr>
        <td>${j.nome}</td>
        <td>${moeda(j.preco)}</td>
        <td><button class="btn-gb claro" onclick="remover(${i})">Remover</button></td>
      </tr>`;
    }
  }
  if (carrinho.length == 0) {
    linhas = "<tr><td colspan='3'>Seu carrinho está vazio.</td></tr>";
  }
  document.getElementById("corpo-carrinho").innerHTML = linhas;
  escrever("total", moeda(total - total * desconto));
  contar();
}

function aplicarCupom() {
  if (valor("cupom").toUpperCase() == "GAME10") {
    desconto = 0.1;
    avisar("msg-cupom", "Cupom aplicado: 10% de desconto!", true);
  } else {
    desconto = 0;
    avisar("msg-cupom", "Cupom inválido.", false);
  }
  mostrarCarrinho();
}

function finalizarCompra() {
  if (localStorage.getItem("sessao") == null) {
    alert("Faça login para finalizar a compra.");
    location.href = "login.html?voltar=carrinho";
  } else if (ler("carrinho").length == 0) {
    avisar("msg-cupom", "Seu carrinho está vazio.", false);
  } else {
    salvar("carrinho", []);
    desconto = 0;
    mostrarCarrinho();
    avisar("msg-cupom", "Compra realizada com sucesso!", true);
  }
}

function mostrarLoja() {
  var genero = valor("filtro-genero");
  var html = "";
  for (var i = 0; i < jogos.length; i++) {
    var j = jogos[i];
    if (genero == "todos" || genero == j.genero) {
      html += `<div class="col">
        <article class="card h-100">
          <img src="img/jogo-${j.id}.jpg" alt="Capa de ${j.nome}">
          <div class="card-body">
            <h2>${j.nome}</h2>
            <p>${j.desc}</p>
            <p class="preco">${moeda(j.preco)}</p>
            <a class="btn btn-gb claro" href="produto.html?id=${j.id}">Detalhes</a>
            <button class="btn btn-gb" type="button" onclick="comprar(${j.id})">Comprar</button>
          </div>
        </article>
      </div>`;
    }
  }
  document.getElementById("lista-jogos").innerHTML = html;
}

function mostrarProduto() {
  var id = location.search.replace("?id=", "");
  var j = jogos[id - 1];
  if (j == undefined) {
    j = jogos[0];
  }
  atual = j.id;
  document.getElementById("capa").src = "img/jogo-" + j.id + ".jpg";
  document.title = j.nome + " | FullBox Games";
  escrever("nome", j.nome);
  escrever("desc", j.desc);
  escrever("genero", j.genero);
  escrever("preco", moeda(j.preco));
}

function cadastrar() {
  var usuarios = ler("usuarios");
  var repetido = false;
  for (var i = 0; i < usuarios.length; i++) {
    if (usuarios[i].email == valor("email")) {
      repetido = true;
    }
  }
  if (valor("senha") != valor("senha2")) {
    avisar("msg-form", "As senhas não coincidem.", false);
  } else if (repetido) {
    avisar("msg-form", "E-mail já cadastrado.", false);
  } else {
    usuarios.push({
      nome: valor("nome"),
      email: valor("email"),
      senha: valor("senha"),
    });
    salvar("usuarios", usuarios);
    avisar("msg-form", "Cadastro realizado! Agora faça login.", true);
    document.getElementById("form-cadastro").reset();
  }
  return false;
}


function entrar() {
  var usuarios = ler("usuarios");
  var achou = false;

  for (var i = 0; i < usuarios.length; i++) {
    if (
      usuarios[i].email == valor("email") &&
      usuarios[i].senha == valor("senha")
    ) {
      localStorage.setItem("sessao", usuarios[i].nome);
      avisar("msg-form", "Bem-vindo(a), " + usuarios[i].nome + "!", true);
      achou = true;

      if (location.search == "?voltar=carrinho") {
        location.href = "carrinho.html";
      }
    }
  }
  if (achou == false) {
    avisar("msg-form", "E-mail ou senha incorretos.", false);
  }

  return false;
}


function enviarContato() {
  var mensagens = ler("mensagens");
  mensagens.push({
    nome: valor("nome"),
    email: valor("email"),
    assunto: valor("assunto"),
    texto: valor("mensagem"),
  });
  salvar("mensagens", mensagens);
  avisar("msg-form", "Mensagem enviada! Total salvas: " + mensagens.length, true);
  document.getElementById("form-contato").reset();
  return false;
}

contar();