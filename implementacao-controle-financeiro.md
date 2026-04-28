# Implementação — App de Controle Financeiro por Voz

## Visão Geral

Desenvolver um **PWA (Progressive Web App)** de controle financeiro pessoal, onde o usuário registra gastos e recebimentos por voz, sem necessidade de backend próprio. Os dados são salvos diretamente em uma planilha do Google Sheets via Google Apps Script.

---

## Arquitetura

```
Celular do usuário
       ↓
Web Speech API (STT nativo do celular/browser)
       ↓
PWA interpreta o texto com regras simples (parser)
       ↓
Chamada HTTP para URL do Google Apps Script (Web App)
       ↓
Apps Script escreve/lê na planilha do Google Sheets
```

**Sem backend próprio. Sem banco de dados. Sem custos mensais.**

---

## Componentes

| Componente | Tecnologia | Função |
|---|---|---|
| App (frontend) | HTML + CSS + JavaScript puro | Interface do usuário |
| Captura de voz | Web Speech API (nativa) | STT — converte fala em texto |
| Parser | JavaScript (regex/regras) | Interpreta o texto falado |
| Backend | Google Apps Script | Processa e salva os dados |
| Banco de dados | Google Sheets | Armazena todas as transações |
| Armazenamento | Google Drive | Hospeda e compartilha a planilha |

---

## Telas do App

### 1. Login
- Acesso por PIN de 4 dígitos
- Identificação do usuário na planilha

### 2. Home
- Exibe saldo atual do mês em destaque
- Botão grande de microfone para registrar lançamento
- Botões de atalho: "Relatório" e "Histórico"

### 3. Confirmar Lançamento
- Exibe o que o sistema entendeu antes de salvar
- Campos: Tipo (entrada/saída), Valor, Categoria, Descrição
- Botões: "Confirmar" e "Cancelar"

### 4. Histórico
- Lista cronológica de todos os lançamentos
- Filtro por período (dia, semana, mês)
- Indicação visual de entradas (verde) e saídas (vermelho)

### 5. Relatório
- Total de entradas do período
- Total de saídas do período
- Saldo final
- Filtro por período

---

## Regras do Parser de Voz

O sistema interpreta frases simples em português sem uso de IA:

| O usuário fala | Sistema entende |
|---|---|
| *"gastei 80 mercado"* | Saída · R$ 80,00 · Alimentação |
| *"paguei 150 luz"* | Saída · R$ 150,00 · Contas |
| *"paguei 200 aluguel"* | Saída · R$ 200,00 · Moradia |
| *"recebi 3000 salário"* | Entrada · R$ 3.000,00 · Salário |
| *"recebi 500 freela"* | Entrada · R$ 500,00 · Outros |

**Palavras-chave de saída:** gastei, paguei, comprei, transferi  
**Palavras-chave de entrada:** recebi, ganhei, entrou  
**Categorias detectadas:** alimentação, transporte, saúde, moradia, contas, lazer, salário, outros

---

## Estrutura da Planilha Google Sheets

### Aba "Transações"
| Data | Hora | Usuário | Tipo | Valor | Categoria | Descrição |
|---|---|---|---|---|---|---|
| 26/04/2026 | 14:32 | João | Saída | 80.00 | Alimentação | Mercado |

### Aba "Resumo"
Gerada automaticamente pelo Apps Script com totais por categoria e período.

---

## Google Apps Script

Criar um **Web App** publicado como URL pública que aceite requisições GET/POST com as seguintes ações:

- `action=inserir` → adiciona nova linha na aba Transações
- `action=listar` → retorna transações do período informado
- `action=resumo` → retorna totais de entrada, saída e saldo

---

## Requisitos Técnicos

- O PWA deve funcionar em **Android e iOS**
- Deve ser **instalável** na tela inicial do celular (manifest.json + service worker)
- Deve funcionar com **conexão 4G/WiFi** (online)
- A Web Speech API deve usar **língua pt-BR**
- O Google Apps Script deve estar publicado como **"Anyone can access"** (acesso via token secreto na URL para segurança mínima)

---

## Entregáveis

1. **Arquivo `index.html`** — app completo em arquivo único (HTML + CSS + JS)
2. **Código do Google Apps Script** — pronto para colar e publicar
3. **Instruções de configuração** — passo a passo para o cliente configurar a planilha e publicar o script

---

## Restrições

- Sem frameworks externos (React, Vue etc.) — usar HTML/CSS/JS puro para máxima simplicidade
- Sem backend próprio
- Sem banco de dados próprio
- Custo de operação: **R$ 0,00/mês**
