<template >
  <div class="container" v-loading="isLoading">
    <img src="https://www.guarulhos.sp.gov.br/sites/default/files/2023-02/LOGO_BRASAO_CIDADE_GRU_VERTICAL_CONTORNO-01.png"
      width="150" />
    <h2>Buscar no Diário oficial</h2>
    <br />
      <el-button size="large" type="info" @click="activeStep = 1" class="nova-pesquisa" >Nova Pesquisa</el-button>
    <el-steps class="steps" finish-status="success" :active="activeStep" direction="vertical">
      <el-step title="Download dos arquivos" />
      <el-step title="Buscar termo no PDF" />
      <el-step title="Resultados da busca" />
    </el-steps>
    <el-switch v-if="activeStep == 0" v-model="buscarPor" active-text="Mês" inactive-text="Ano" />
    <section v-if="activeStep == 0">
      <el-date-picker size="large" v-if="buscarPor" format="MM/YYYY" v-model="dataPesquisa" type="month" placeholder="Selecione o mês" />
      <el-date-picker size="large" v-else format="YYYY" v-model="dataPesquisa" type="year" placeholder="Selecione o ano" />
      <el-button size="large" style="margin: 0 8px;" type="info" @click="handleDownlaod">Download</el-button>
    </section>
    <section class="search-container" v-if="activeStep == 1">
      <el-input v-model="termo" placeholder="Digite aqui ! " size="large" />
      <el-button size="large" type="info" @click="handleSearch">Buscar</el-button>
      <el-button size="large" type="default" @click="activeStep = 0">Voltar</el-button>
    </section>
    <section v-if="activeStep == 1" class="lista-resultados">
      <h5 v-if="urls.length">Download concluido!</h5>
      <el-descriptions title="Resultado" direction="vertical" :column="1" size="small" border>
        <el-descriptions-item v-for="url in urls" label="Links">
          <a :key="url" :href="url" target="_blank">{{ url }}</a>
        </el-descriptions-item>
      </el-descriptions>
    </section>
    <section v-if="activeStep == 3">
      <h5 v-if="urls.length">Resultado</h5>
      <el-table :data="tableData" border style="width: 800px">
        <el-table-column prop="nomeDoArquivo" label="Arquivo" width="180" />
        <el-table-column prop="ocorrencia" label="Ocorrencia">
          <template #default="scope">
            <WordHighlighter :query="termo">
              {{ scope.row.ocorrencia }}
            </WordHighlighter>
          </template>
        </el-table-column>
        <el-table-column prop="url" label="Url" align="center">
          <template #default="scope">
            <el-link :href="scope.row.url" target="_blank">Download</el-link>
          </template>
        </el-table-column>
      </el-table>
    </section>
    <div>
    </div>
    <button @click="handleGoToTop" class="gotoTOp"> <el-icon><ArrowUpBold /></el-icon> </button>
  </div>
</template>
<script setup>
import { ref } from 'vue';
import axios from './services/axios';
import WordHighlighter from "vue-word-highlighter";
import {ArrowUpBold} from '@element-plus/icons-vue';

const buscarPor = ref(true);

const tableData = ref([]);

const termo = ref('');

const urls = ref([]);
const dataPesquisa = ref('');
const activeStep = ref(0);

const isLoading = ref(false);

const handleGoToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const handleDownlaod = async () => {

  if (!dataPesquisa.value) return;

  try {
    isLoading.value = true;
    const dataOriginal = new Date(dataPesquisa.value);

    const mes = dataOriginal.getMonth() + 1;
    const ano = dataOriginal.getFullYear();

    const res = buscarPor.value 
      ? await axios.post('fillDownloadFolder', { mes, ano })
      : await axios.post('fillDownloadFolderByYear', { ano });

    urls.value = res.data.links;

  } catch (error) {
    console.log(error);
  } finally {
    setTimeout(() => { 
      isLoading.value = false; 
      activeStep.value = 1;
    }, 5000);
  }
};

const handleSearch = async () => {
  if (!termo.value) return;
  try {
    isLoading.value = true;
    const res = await axios.post('search', { termo: termo.value });

    tableData.value = res.data.pesquisa;

  } catch (error) {
    console.log(error)
  } finally {
    setTimeout(() => { 
      isLoading.value = false; 
      activeStep.value = 3;
    }, 5000);
  }

};


</script>
<style scoped>

.gotoTOp{
  position: fixed;
  z-index: 999999;
  right: 0;
  bottom: 0;
  margin: 14px;
  padding: 12px;
  cursor: pointer;
  background: #8181814d;
  border: none;
  border-radius: 8px;
}

.container {
  width: 100%;
  height: 100vh;
  display: flex;
  padding: 5%;
  justify-content: flex-start;
  align-items: center;
  flex-direction: column;
  gap: 16px;
}

ul.listaPdf {
  list-style: none;
}

ul.listaPdf li {
  margin: 8px 0;
}

.search-container {
  display: flex;
  gap: 8px;
}

.lista-resultados{
  width: 800px;
}

.steps{
  max-height: 100px;
}
</style>
