import 'dotenv/config';
import express from 'express';
import bodyParser from 'body-parser';
import routes from '../routes/index.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import chalk from 'chalk';
import cors from 'cors';

const URL_APP = process.env.URL_APP || 'http://localhost'; 

const customExpress = (() => {
    try {
        const porta = 7070;
        const app = express();
        app.use(cors());
        
        app.use(bodyParser.json());
        routes(app);

        const currentFilePath = fileURLToPath(import.meta.url);
        const currentDirPath = dirname(currentFilePath);

        const downloadsPath = join(currentDirPath, '../download');
   
        app.use('/download', express.static(downloadsPath));
       
        
        const servidor = app.listen(porta, () => {
            console.log(chalk.yellowBright(`🆗 Servidor rodando na porta ${porta} - URL: ${URL_APP} `));
        });

        servidor.on('error', (erro) => {
            console.error('Erro ao iniciar o servidor:', erro);
        });

        return app;

    } catch (erro) {
        console.error('Erro durante a inicialização do servidor:', erro);
    }
});

export default customExpress;
