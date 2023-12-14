import { Router } from 'express';
import { Search } from '../controllers/search.js';
import { Browser } from '../controllers/browser.js';
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const router = Router();

router
    .post('/search', async (req, res) => {

        try {
            const termo = req.body.termo;

            const search = new Search(termo);
            const pesquisa = await search.searchInFile();

            return res.status(200).json({ pesquisa: pesquisa });

        } catch (error) {

            return res.status(500).json({ error });
        }
    })
    .post('/listLinks', async (req, res) => {
        try {
            const { mes, ano } = req.body;
            const browser = new Browser();

            const links = await browser.getLinkPdf(mes, ano);

            return res.status(200).json({ listaPdf: links })

        } catch (error) {
            return res.status(500).json({ error })
        }
    })
    .post('/fillDownloadFolder', async (req, res) => {

        try {
            const { mes, ano } = req.body;
            const browser = new Browser();

            const links = await browser.getLinkPdf(mes, ano);

            await browser.getManyDownloads(links);

            const mensagge =   "Sucesso ao baixar os diarios do mês" + " " + mes + '/'+ ano;
            return res.status(200).json({ mensagge, links })
           
        } catch (error) {
            return res.status(500).json({ error })
        }

    })
    .post('/fillDownloadFolderByYear', async (req, res) => {

        try {
            const { ano } = req.body;
            const browser = new Browser();

            const arrayDoze = Array.from({ length: 12 }, (_, index) => index + 1);

            const links = await browser.getManyLinksPdf(arrayDoze, ano);

            await browser.getManyDownloads(links);

            const mensagge =  "Sucesso ao baixar os diarios de" + " "+ ano;
            return res.status(200).json({ mensagge, links })
           
        } catch (error) {
            return res.status(500).json({ error })
        }

    })

const routerMain = (app) => {
    app.use(router);
};

export default routerMain;