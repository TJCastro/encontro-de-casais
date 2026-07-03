# Encontro de Casais — Formulário de Inscrição

Site estático (HTML puro, sem framework) que grava as inscrições direto numa planilha Google, publicado via GitHub + Vercel.

## Estrutura

```
index.html               -> a página inteira (site + formulário + imagem embutida)
google-apps-script.gs     -> código para colar no Google Apps Script
```

> A imagem do cartaz já vem embutida dentro do próprio `index.html` (não depende de nenhum arquivo separado), então não tem risco de "sumir" ao mover ou renomear a pasta.

## Passo 1 — Criar a planilha e o Apps Script

1. Acesse **sheets.new** e crie uma planilha (dê um nome, ex: "Encontro de Casais - Inscrições").
2. No menu, clique em **Extensões > Apps Script**.
3. Apague o conteúdo padrão do arquivo `Code.gs` e cole o conteúdo do arquivo `google-apps-script.gs` deste projeto.
4. Clique em **Implantar > Nova implantação**.
   - Tipo: **App da Web**
   - Executar como: **Eu** (sua conta)
   - Quem pode acessar: **Qualquer pessoa**
5. Clique em **Implantar**, autorize as permissões pedidas pelo Google.
6. Copie a **URL do App da Web** gerada (é algo como `https://script.google.com/macros/s/AKfycb.../exec`).

> Toda vez que você editar o script, é preciso ir em **Implantar > Gerenciar implantações > editar (ícone de lápis) > Nova versão** para as mudanças valerem.

> **Comprovante de pagamento:** o script agora também salva o comprovante (imagem ou PDF) numa pasta do Google Drive chamada **"Comprovantes - Encontro de Casais"** (criada automaticamente na primeira vez) e coloca o link na planilha. Como isso usa uma permissão nova (acesso ao Drive), o Google vai pedir autorização de novo na hora de implantar — é só aceitar. O limite de tamanho do arquivo no site é 5MB.

## Passo 2 — Conectar o site à planilha

Abra `index.html`, encontre esta linha perto do final do arquivo:

```js
const SCRIPT_URL = "COLE_AQUI_A_URL_DO_SEU_APPS_SCRIPT";
```

Substitua pelo link copiado no passo anterior, por exemplo:

```js
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycb.../exec";
```

Salve o arquivo.

## Passo 3 — Publicar no GitHub

```bash
cd caminho/para/a/pasta/do/site
git init
git add .
git commit -m "Site do Encontro de Casais"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/encontro-de-casais.git
git push -u origin main
```

(Crie o repositório vazio antes em github.com/new — sem README, sem .gitignore.)

## Passo 4 — Publicar no Vercel

1. Acesse **vercel.com**, faça login com sua conta GitHub.
2. Clique em **Add New > Project**.
3. Selecione o repositório `encontro-de-casais`.
4. Como é HTML puro, o Vercel detecta automaticamente (Framework Preset: **Other**). Não precisa mudar nada.
5. Clique em **Deploy**.
6. Em alguns segundos você terá uma URL pública, tipo `encontro-de-casais.vercel.app` — pronta pra compartilhar no grupo da igreja.

## Testando

Depois de configurar a `SCRIPT_URL`, abra o site, preencha o formulário e envie. Volte na planilha do Google Sheets: uma nova linha deve aparecer na aba "Respostas" em poucos segundos.

## Personalizações rápidas

- **Versículo tema:** procure por `[Cole aqui o versículo tema...]` no `index.html` e substitua pelo texto e referência corretos.
- **Chave PIX / valor:** procure por `31997080442` e `R$ 120,00` no `index.html`.
- **Cores:** todas as cores ficam centralizadas no topo do `<style>`, dentro de `:root { ... }`.
