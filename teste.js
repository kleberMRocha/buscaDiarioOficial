import pdfPoppler from 'pdf-poppler';

async function extractImages(pdfPath, outputDirectory) {
  const options = {
    format: 'png',
    out_dir: outputDirectory,
    out_prefix: 'image_',
    page: null,
  };

  try {
    const pages = await pdfPoppler.info(pdfPath);
    for (let i = 0; i < pages.length; i++) {
        console.log(pages);
      const pageOptions = { ...options, page: i + 1 };
      await pdfPoppler.convert(pdfPath, pageOptions);
    }
    console.log('Imagens extraídas com sucesso!');
  } catch (error) {
    console.error('Erro ao extrair imagens:', error);
  }
}

// Uso
const pdfPath = './download/7486571.pdf';
const outputDirectory = './';

extractImages(pdfPath, outputDirectory);
