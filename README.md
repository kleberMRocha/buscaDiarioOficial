### Aplicação para Download e Busca no Diário Oficial

Esta aplicação utiliza o Puppeteer para baixar os Diários Oficiais do site da Prefeitura de Guarulhos. 

Posteriormente, emprega o pdf-parse para realizar buscas nos arquivos baixados.

#### ⚙ Funcionalidades 
- [X] Download arquivos PDF mês / ano
- [X] Busca do termo nos arquivos
- [ ] Gravar os textos em banco de dados para otimizar a busca
- [ ] Salvar os Downloads em subpastas para não precisar excluir os arquivos a cada nova requisição 
- [ ] Implementar uma solução para converter as imagens dentro do pdf para texto   


#### 🔥 Executando o Projeto Localmente

1. Na raiz do projeto, execute o comando `yarn` e depois `yarn start`.
2. Após isso, vá para a pasta 'busca-diario'. Para iniciar o front-end, execute o comando `yarn` e`yarn dev`.
3. Após a execução desses passos, a interface estará disponível em `http://localhost:SUAPORTA/`.

![Tela inicial](https://raw.githubusercontent.com/kleberMRocha/buscaDiarioOficial/master/busca-diario/src/assets/tela.png "Tela")
