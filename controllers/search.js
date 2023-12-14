import fs from 'fs';
import pdf from 'pdf-parse';
import chalk from 'chalk';

export class Search {
  constructor(termo = 'TÉCNICO EM TECNOLOGIA DA INFORMAÇÃO') {
    this.parametroUm = termo;
  }

  parametroUm = '';

  async searchInFile() {
    const pesquisa = [];
    try {
      const arquivos = fs.readdirSync('./download');

      if (!arquivos.length) {
        console.log(chalk.red(" 📁 A Pasta Download está vazia! "));
        throw new Error ('📁 A Pasta Download está vazia!');
      }

      for (const file of arquivos) {
        const dataBuffer = fs.readFileSync('download/' + file);
        const stringPesquisa = this.parametroUm;

        try {
          const data = await pdf(dataBuffer);
          const textoDiario = data.text;
          
          const regex = new RegExp(stringPesquisa, 'gi');

          const ocorrencias = [];
          let match;
          while ((match = regex.exec(textoDiario)) !== null) {
            ocorrencias.push(match.index);
          }

          for (const ocorrencia of ocorrencias) {
            const inicioIntervalo = Math.max(0, ocorrencia - 100);
            const fimIntervalo = Math.min(textoDiario.length, ocorrencia + stringPesquisa.length + 200);

            const intervalo = textoDiario.slice(inicioIntervalo, fimIntervalo);

            console.log(chalk.green('-----------------'));
            console.log(chalk.green(intervalo));
            console.log(chalk.green('-----------------'));

            const URL_APP = process.env.URL_APP;

            const retorno = { 
              nomeDoArquivo: `${file} - ${data.info.Title}`, 
              ocorrencia: intervalo,
              url: `${URL_APP}/download/${file}`
            };

            pesquisa.push(retorno);
          }

        } catch (error) {
          console.error(`Erro ao processar o arquivo ${file}: ${error.message}`);
        }
      }

      return pesquisa;

    } catch (erro) {
      console.error('Ocorreu um erro ao ler a pasta:', erro);
    }
  }
}
