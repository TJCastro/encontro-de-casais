/**
 * ENCONTRO DE CASAIS — recebe o formulário do site, grava na planilha
 * e salva o comprovante de pagamento (imagem/PDF) no Google Drive.
 *
 * COMO USAR:
 * 1. Crie uma Planilha Google nova (sheets.new).
 * 2. Menu Extensões > Apps Script.
 * 3. Apague o conteúdo padrão e cole todo este arquivo.
 * 4. Clique em Implantar > Nova implantação.
 *    - Tipo: "App da Web"
 *    - Executar como: "Eu" (seu usuário)
 *    - Quem pode acessar: "Qualquer pessoa"
 * 5. Autorize o acesso quando pedir. Copie a URL gerada (termina em /exec).
 * 6. Cole essa URL na constante SCRIPT_URL do arquivo index.html.
 *
 * Os comprovantes são salvos numa pasta do Drive chamada
 * "Comprovantes - Encontro de Casais" (criada automaticamente na
 * primeira vez), e o link de cada um vai numa coluna da planilha.
 */

const SHEET_NAME = 'Respostas';
const FOLDER_NAME = 'Comprovantes - Encontro de Casais';

function getOrCreateFolder_() {
  const folders = DriveApp.getFoldersByName(FOLDER_NAME);
  if (folders.hasNext()) return folders.next();
  return DriveApp.createFolder(FOLDER_NAME);
}

function saveComprovante_(base64DataUrl, fileName, mimeType, coupleLabel) {
  if (!base64DataUrl) return '';

  // base64DataUrl vem como "data:image/png;base64,AAAA..."
  const commaIndex = base64DataUrl.indexOf(',');
  const pureBase64 = commaIndex > -1 ? base64DataUrl.substring(commaIndex + 1) : base64DataUrl;

  const bytes = Utilities.base64Decode(pureBase64);
  const safeName = `${coupleLabel} - ${fileName || 'comprovante'}`;
  const blob = Utilities.newBlob(bytes, mimeType || 'application/octet-stream', safeName);

  const folder = getOrCreateFolder_();
  const file = folder.createFile(blob);
  file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

  return file.getUrl();
}

function doPost(e) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }

  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      'Data/Hora',
      'Nome do Marido',
      'Nome da Esposa',
      'Restrição Alimentar?',
      'Detalhes da Restrição',
      'Precisa de ajuda com filhos?',
      'Filhos (nome / idade)',
      'WhatsApp',
      'Comprovante de Pagamento'
    ]);
    sheet.setFrozenRows(1);
  }

  const p = e.parameter;
  const coupleLabel = `${p.nomeMarido || 'Sem nome'} e ${p.nomeEsposa || 'Sem nome'}`;

  let comprovanteLink = '';
  try {
    comprovanteLink = saveComprovante_(p.comprovanteBase64, p.comprovanteNome, p.comprovanteTipo, coupleLabel);
  } catch (err) {
    comprovanteLink = 'Erro ao salvar arquivo: ' + err.message;
  }

  sheet.appendRow([
    new Date(),
    p.nomeMarido || '',
    p.nomeEsposa || '',
    p.restricaoAlimentar || '',
    p.detalhesRestricao || '',
    p.ajudaFilhos || '',
    p.filhosInfo || '',
    p.whatsapp || '',
    comprovanteLink
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ result: 'success' }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  return ContentService
    .createTextOutput('O endpoint está funcionando. Use POST para enviar dados.')
    .setMimeType(ContentService.MimeType.TEXT);
}
