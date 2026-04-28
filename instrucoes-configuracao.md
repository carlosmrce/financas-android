# Instruções de Configuração — FinançasVoz

## O que você vai precisar
- Conta Google
- Celular Android (Chrome) ou iOS (Safari ≥ 14.5)
- Servidor para hospedar os arquivos (ver opções abaixo)

---

## Passo 1 — Criar a Planilha no Google Sheets

1. Acesse [sheets.google.com](https://sheets.google.com) e crie uma planilha em branco
2. Dê qualquer nome (ex: **FinançasVoz**)
3. Copie o **ID da planilha** da URL:
   ```
   https://docs.google.com/spreadsheets/d/  1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2upms  /edit
                                             ↑ isso é o ID
   ```

---

## Passo 2 — Configurar o Google Apps Script

1. Na planilha, clique em **Extensões → Apps Script**
2. Apague todo o código existente
3. Cole o conteúdo do arquivo `apps-script.gs`
4. Edite as duas primeiras linhas do `CONFIG`:
   ```javascript
   SHEET_ID: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2upms', // seu ID
   TOKEN:    'minha-senha-secreta-123',  // invente uma senha qualquer
   ```
5. Clique em **Salvar** (ícone de disquete)

---

## Passo 3 — Publicar o Apps Script como Web App

1. Clique em **Implantar → Nova implantação**
2. Clique no ícone de engrenagem → **App da Web**
3. Configure:
   - **Descrição:** FinançasVoz
   - **Executar como:** Eu (seu e-mail)
   - **Quem pode acessar:** Qualquer pessoa
4. Clique em **Implantar**
5. Autorize as permissões quando solicitado
6. **Copie a URL do Web App** — ela terá o formato:
   ```
   https://script.google.com/macros/s/AKfycbx.../exec
   ```

---

## Passo 4 — Hospedar os Arquivos do App

Você precisa hospedar os 4 arquivos (`index.html`, `manifest.json`, `sw.js` e os ícones) em um servidor HTTPS. Opções gratuitas:

### Opção A — GitHub Pages (recomendado)
1. Crie uma conta em [github.com](https://github.com)
2. Crie um repositório público
3. Faça upload dos arquivos
4. Acesse **Settings → Pages → Deploy from branch → main**
5. Seu app estará em `https://seunome.github.io/nome-do-repo`

### Opção B — Netlify Drop
1. Acesse [app.netlify.com/drop](https://app.netlify.com/drop)
2. Arraste a pasta com os arquivos
3. Pronto — você recebe uma URL imediatamente

### Opção C — Servidor próprio / VPS
Sirva os arquivos por HTTPS normalmente.

> ⚠️ **A Web Speech API exige HTTPS.** Não funcionará em `http://` nem em `file://`.

---

## Passo 5 — Adicionar Ícones (opcional, mas recomendado)

Para a instalação do PWA ter um ícone bonito na tela inicial, crie ou baixe:
- `icon-192.png` — 192×192 px
- `icon-512.png` — 512×512 px

Coloque na mesma pasta dos outros arquivos. Sugestão: use um emoji 💰 em fundo escuro `#0d1117`.

---

## Passo 6 — Configurar o App no Celular

1. Abra o app pelo navegador
2. Toque em **⚙️ Configurações**
3. Preencha:
   - **Nome:** seu nome
   - **PIN:** 4 dígitos à sua escolha
   - **URL do Web App:** a URL copiada no Passo 3
   - **Token:** a senha que você definiu no `CONFIG.TOKEN`
4. Toque em **Salvar Configurações**

---

## Passo 7 — Instalar na Tela Inicial

### Android (Chrome)
- Toque nos 3 pontos → **Adicionar à tela inicial**

### iOS (Safari)
- Toque no ícone de compartilhar → **Adicionar à Tela de Início**

---

## Como usar

| Você fala | Sistema entende |
|---|---|
| *"gastei 80 mercado"* | Saída · R$ 80,00 · Alimentação |
| *"paguei 150 luz"* | Saída · R$ 150,00 · Contas |
| *"paguei 200 aluguel"* | Saída · R$ 200,00 · Moradia |
| *"recebi 3000 salário"* | Entrada · R$ 3.000,00 · Salário |
| *"recebi 500 freela"* | Entrada · R$ 500,00 · Outros |
| *"comprei 40 uber"* | Saída · R$ 40,00 · Transporte |

Após a confirmação, todos os valores ficam registrados na aba **Transações** da sua planilha Google Sheets.

---

## Atualizando o Apps Script

Se precisar corrigir algo no script:
1. Abra o Apps Script → edite o código
2. Clique em **Implantar → Gerenciar implantações**
3. Clique no lápis → **Versão: Nova versão** → **Implantar**
4. A URL permanece a mesma — não precisa reconfigurar o app
