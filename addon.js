
// ==UserScript==
// @name         Foco - Bloqueador de Sites
// @namespace    foco.via
// @version      2.0.0
// @description  Bloqueia sites por horario e redireciona para pagina HTTPS personalizavel
// @match        http://*/*
// @match        https://*/*
// @run-at       document-start
// @grant        none
// ==/UserScript==

(() => {
  'use strict';

  // =====================================
  // CONFIGURAÇÕES
  // =====================================

  const CONFIG = {
    // Substitua pela URL do seu GitHub Pages
    pagina: 'https://YOUR_USER.github.io/foco-bloqueio/',

    almoco: {
      inicio: '12:00',
      fim: '13:00'
    },

    noite: '17:30',

    // Liberados no almoço e após 17:30
    sitesAlmoco: [
      '*.youtube.com',
      'youtu.be',
      '*.instagram.com',
      '*.tiktok.com'
    ],

    // Liberados somente após 17:30
    sitesNoite: [
      '*anything*',
    ],

    tema: 'escuro', // 'escuro' ou 'claro'

    textos: {
      titulo:
        'Você escolheu proteger seu tempo.',

      mensagem:
        'O entretenimento pode esperar. Volte ao que você quer construir.',

      objetivo:
        'Conquistar um trabalho remoto como programador, recebendo em moeda forte.',

      acao:
        'Abra o notebook e avance uma pequena tarefa do projeto.',

      rodape:
        'Disciplina hoje. Liberdade amanhã.'
    }
  };

  // =====================================
  // VERIFICAÇÕES INICIAIS
  // =====================================

  if (window.top !== window.self) return;

  if (CONFIG.pagina.includes('SEU_USUARIO')) {
    console.warn(
      '[Foco] Configure a URL da pagina antes de usar.'
    );
    return;
  }

  let pagina;

  try {
    pagina = new URL(CONFIG.pagina);

    if (pagina.protocol !== 'https:') return;
  } catch (_) {
    return;
  }

  // Não bloquear a página motivacional.
  if (location.origin === pagina.origin) return;

  const host = location.hostname
    .toLowerCase()
    .replace(/\.$/, '');

  // =====================================
  // WILDCARDS
  // =====================================

  function combina(dominio, mascara) {
    const p = String(mascara)
      .trim()
      .toLowerCase();

    if (!p) return false;

    // *.youtube.com inclui youtube.com.
    if (
      p.startsWith('*.') &&
      dominio === p.slice(2)
    ) {
      return true;
    }

    const escape = parte =>
      parte.replace(
        /[.*+?^${}()|[\]\\]/g,
        '\\$&'
      );

    const regex =
      '^' +
      p.split('*').map(escape).join('.*') +
      '$';

    return new RegExp(regex, 'i').test(dominio);
  }

  const estaNaLista = lista =>
    lista.some(p => combina(host, p));

  // Lista mais restritiva tem prioridade.
  const soNoite = estaNaLista(
    CONFIG.sitesNoite
  );

  const almoco = estaNaLista(
    CONFIG.sitesAlmoco
  );

  if (!soNoite && !almoco) return;

  // =====================================
  // HORÁRIOS
  // =====================================

  const minutos = horario => {
    const [h, m] = horario
      .split(':')
      .map(Number);

    return h * 60 + m;
  };

  const agora = new Date();

  const atual =
    agora.getHours() * 60 +
    agora.getMinutes();

  const inicioAlmoco = minutos(
    CONFIG.almoco.inicio
  );

  const fimAlmoco = minutos(
    CONFIG.almoco.fim
  );

  const inicioNoite = minutos(
    CONFIG.noite
  );

  // Após 17:30, todos liberados.
  if (atual >= inicioNoite) return;

  // Almoço libera somente primeira lista.
  if (
    !soNoite &&
    almoco &&
    atual >= inicioAlmoco &&
    atual < fimAlmoco
  ) {
    return;
  }

  // Calcula a próxima liberação.
  const horario =
    !soNoite && atual < inicioAlmoco
      ? CONFIG.almoco.inicio
      : CONFIG.noite;

  // =====================================
  // PARÂMETROS DA PÁGINA
  // =====================================

  const parametros = new URLSearchParams({
    site: host,

    ...CONFIG.textos,

    liberacao: `Hoje, às ${horario}`,

    tema: CONFIG.tema
  });

  // =====================================
  // REDIRECIONAMENTO HTTPS
  // =====================================

  // Os parâmetros ficam no fragmento #.
  pagina.hash = parametros.toString();

  location.replace(pagina.href);
})();
