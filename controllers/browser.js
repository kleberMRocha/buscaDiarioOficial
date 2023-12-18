import fs from 'fs';
import https from 'https';
import puppeteer from 'puppeteer';
import { join } from 'path';

export class Browser {
    destino = 'download/';
    mes;
    ano;
    constructor(mes = 11, ano = 2023) {
        this.mes = mes;
        this.ano = ano;


        if (!fs.existsSync(this.destino)) {
            fs.mkdirSync(this.destino);
            console.log(`A pasta '${this.destino}' foi criada.`);
        } else {
            console.log(`A pasta '${this.destino}' já existe.`);
        }

        
    }

    getDonwloadPdf(url) {

        const nomeArquivo = url.split('/').pop();

        const arquivoDestino = fs.createWriteStream(this.destino + nomeArquivo);

        https
            .get(url, (response) => {
                if (response.statusCode === 200) {
                    response.pipe(arquivoDestino);
                    arquivoDestino.on('finish', () => {
                        arquivoDestino.close();
                        console.log('📦 - Download concluído.');
                    });
                } else {
                    console.error(`Falha no download. Status do response: ${response.statusCode}`);
                }
            })
            .on('error', (err) => {
                console.error(`Erro durante a solicitação: ${err.message}`);
            });
    }

    async getManyDownloads(urls = []) {
        await this.cleanFolder();
        try {
       
            await Promise.all(urls.map(url => {
                setTimeout(() => {
                    return this.getDonwloadPdf(url);
                },200)
            }));
    
        } catch (error) {
            console.log(error)
        }
    }

    async getLinkPdf(mes = this.mes, ano = this.ano) {
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();

        await page.goto(`https://diariooficial.guarulhos.sp.gov.br/index.php?mes=${mes}&ano=${ano}`);
        await page.setViewport({ width: 1080, height: 1024 });

        const links = '.trigger';
        const linksDiario = await page.$$(links);

        let index = 0;
        while (index < linksDiario.length) {
            await linksDiario[index].click();
            index++;
        }

        const getLink = '.diarios p > a';
        const pdfLinks = await page.$$(getLink);

        const linksHref = pdfLinks.map(async pdf => {
            const href = await pdf.getProperty('href');
            const fullUrl = await href.jsonValue();

            return fullUrl;
        });


        try {

            const allLinks = await Promise.all(linksHref);

            return allLinks;

        } catch (error) {
            console.log(error);
        } finally {
            await browser.close();
        }
    }

    async getManyLinksPdf(meses = [1], ano = this.ano) {

        let allLinks = [];

        try {
            for (const mes of meses) {
                const links = await this.getLinkPdf(mes, ano);
                allLinks = [...allLinks, ...links];
            }

            return allLinks;

        } catch (error) {
            console.log(error);
        }
    }

    async cleanFolder() {
        try {
            const arquivos = await fs.promises.readdir(this.destino);
    
            await Promise.all(arquivos.map(async (arquivo) => {
                const caminhoArquivo = join(this.destino, arquivo);
                await fs.promises.unlink(caminhoArquivo);
            }));
    
            console.log('Todos os arquivos removidos com sucesso.');
        } catch (erro) {
            console.error('Erro ao limpar a pasta:', erro);
        }
    }
};