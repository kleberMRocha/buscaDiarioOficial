import fs from 'fs';
import pdf from 'pdf-parse';
import chalk from 'chalk';

export class Search {
  constructor(termo = 'TÉCNICO EM TECNOLOGIA DA INFORMAÇÃO') {
    this.stringPesquisa = termo;
    this.arquivos = fs.readdirSync('./download');
  }

  stringPesquisa = '';
  pesquisa = [];
  dataPdf = {};
  ocorrencias = [];
  URL_APP = process.env.URL_APP;

  async searchInFile() {

    if (!this.arquivos.length) {
      console.log(chalk.red('📁 A Pasta Download está vazia!'));
      throw new Error('📁 A Pasta Download está vazia!');
    }

    try {

      for (const file of this.arquivos) {
        await this.handleSearch(file);
      }

      if(!this.pesquisa.length){
        console.log(chalk.red('✖ Nenhum resultado encontrado'));
      }

      return this.pesquisa;

    } catch (erro) {
      console.error('Ocorreu um erro ao ler a pasta:', erro);
    }
  }

  async setPdfData(file) {
    const dataBuffer = fs.readFileSync('download/' + file);
    this.dataPdfdata = await pdf(dataBuffer);
  }

  getResult(text, file, info) {
    for (const ocorrencia of this.ocorrencias) {

      const intervalo = this.getInterval(text, ocorrencia);

      console.log(chalk.green('-----------------'));
      console.log(chalk.green(intervalo));
      console.log(chalk.green('-----------------'));

      const retorno = {
        nomeDoArquivo: `${file} - ${info.Title}`,
        ocorrencia: intervalo,
        url: `${this.URL_APP}/download/${file}`
      };

      this.pesquisa.push(retorno);
    }
  }


  getInterval(text, ocorrencia) {

    const inicioIntervalo = Math.max(0, ocorrencia - 100);
    const fimIntervalo = Math.min(text.length, ocorrencia + this.stringPesquisa.length + 200);

    const intervalo = text.slice(inicioIntervalo, fimIntervalo);

    return intervalo;

  }

  async handleSearch(file,) {

    try {

      await this.setPdfData(file);

      const { text, info } = this.dataPdfdata;

      const regex = new RegExp(this.stringPesquisa, 'gi');

      this.ocorrencias = [];

      let match;
      while ((match = regex.exec(text)) !== null) {
        this.ocorrencias.push(match.index);
      }

      this.getResult(text, file, info);

    } catch (error) {
      console.error(`Erro ao processar o arquivo ${file}: ${error.message}`);
    }
  }
}
