// Atualiza o ano atual no rodapé automaticamente
function atualizarAnoRodape() {
  const elementoAno = document.getElementById("ano-atual");
  if (elementoAno) {
    elementoAno.textContent = new Date().getFullYear();
  }
}

// Destaca o link da página atual no menu horizontal
function destacarLinkAtivo() {
  const links = document.querySelectorAll(".menu-link");
  const caminhoAtual = window.location.pathname.split("/").pop() || "index.html";

  links.forEach((link) => {
    const href = link.getAttribute("href");
    if (href === caminhoAtual) {
      link.classList.add("ativo");
      link.setAttribute("aria-current", "page");
    } else {
      link.classList.remove("ativo");
      link.removeAttribute("aria-current");
    }
  });
}

// Abre e fecha o menu hambúrguer em telas menores que 768px
function configurarMenuHamburguer() {
  const botaoMenu = document.getElementById("btn-menu");
  const menuNav = document.getElementById("menu-principal");

  if (!botaoMenu || !menuNav) return;

  botaoMenu.addEventListener("click", () => {
    const aberto = menuNav.classList.toggle("aberto");
    botaoMenu.setAttribute("aria-expanded", String(aberto));
  });

  menuNav.querySelectorAll(".menu-link").forEach((link) => {
    link.addEventListener("click", () => {
      menuNav.classList.remove("aberto");
      botaoMenu.setAttribute("aria-expanded", "false");
    });
  });
}

// Filtra os produtos por categoria e aceita ?categoria= na URL
function configurarFiltroProdutos() {
  const botoesFiltro = document.querySelectorAll(".filtro-btn");
  const produtos = document.querySelectorAll(".produto-card");

  if (botoesFiltro.length === 0 || produtos.length === 0) return;

  function aplicarFiltro(categoriaSelecionada) {
    botoesFiltro.forEach((btn) => {
      btn.classList.toggle("ativo", btn.dataset.categoria === categoriaSelecionada);
    });

    produtos.forEach((produto) => {
      const corresponde =
        categoriaSelecionada === "Todos" ||
        produto.dataset.categoria === categoriaSelecionada;

      produto.classList.toggle("oculto", !corresponde);
    });
  }

  botoesFiltro.forEach((botao) => {
    botao.addEventListener("click", () => {
      aplicarFiltro(botao.dataset.categoria);
    });
  });

  const params = new URLSearchParams(window.location.search);
  const categoriaUrl = params.get("categoria");
  const categoriaValida = Array.from(botoesFiltro).some(
    (btn) => btn.dataset.categoria === categoriaUrl
  );

  aplicarFiltro(categoriaValida ? categoriaUrl : "Todos");
}

// Valida o formulário da página Fale Conosco
function configurarFormularioContato() {
  const formulario = document.getElementById("form-contato");
  if (!formulario) return;

  const campoNome = document.getElementById("nome");
  const campoEmail = document.getElementById("email");
  const campoMensagem = document.getElementById("mensagem");

  const erroNome = document.getElementById("erro-nome");
  const erroEmail = document.getElementById("erro-email");
  const erroMensagem = document.getElementById("erro-mensagem");
  const mensagemSucesso = document.getElementById("mensagem-sucesso");

  function limparErro(campo, elementoErro) {
    campo.classList.remove("invalido");
    elementoErro.textContent = "";
  }

  function definirErro(campo, elementoErro, texto) {
    campo.classList.add("invalido");
    elementoErro.textContent = texto;
  }

  function emailValido(valor) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor.trim());
  }

  [campoNome, campoEmail, campoMensagem].forEach((campo) => {
    campo.addEventListener("input", () => {
      mensagemSucesso.classList.remove("visivel");
      mensagemSucesso.textContent = "";

      if (campo === campoNome) limparErro(campoNome, erroNome);
      if (campo === campoEmail) limparErro(campoEmail, erroEmail);
      if (campo === campoMensagem) limparErro(campoMensagem, erroMensagem);
    });
  });

  formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();

    let valido = true;
    mensagemSucesso.classList.remove("visivel");
    mensagemSucesso.textContent = "";

    if (!campoNome.value.trim()) {
      definirErro(campoNome, erroNome, "Por favor, informe seu nome.");
      valido = false;
    } else {
      limparErro(campoNome, erroNome);
    }

    const emailTexto = campoEmail.value.trim();
    if (!emailTexto) {
      definirErro(campoEmail, erroEmail, "Por favor, informe seu e-mail.");
      valido = false;
    } else if (!emailValido(emailTexto)) {
      definirErro(campoEmail, erroEmail, "Digite um e-mail válido (ex.: nome@exemplo.com).");
      valido = false;
    } else {
      limparErro(campoEmail, erroEmail);
    }

    if (!campoMensagem.value.trim()) {
      definirErro(campoMensagem, erroMensagem, "Por favor, escreva sua mensagem.");
      valido = false;
    } else {
      limparErro(campoMensagem, erroMensagem);
    }

    if (valido) {
      formulario.reset();
      mensagemSucesso.textContent =
        "Mensagem enviada com sucesso! A equipe da Café Aroma Serrano responderá em breve.";
      mensagemSucesso.classList.add("visivel");
      mensagemSucesso.focus();
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  atualizarAnoRodape();
  destacarLinkAtivo();
  configurarMenuHamburguer();
  configurarFiltroProdutos();
  configurarFormularioContato();
});