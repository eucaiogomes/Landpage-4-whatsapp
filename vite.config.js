import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  server: { host: true, port: 8080 },
  appType: 'mpa',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        analise: resolve(__dirname, 'analise-de-documentos.html'),
        pesquisa: resolve(__dirname, 'pesquisa-de-jurisprudencia.html'),
        preElaboracao: resolve(__dirname, 'pre-elaboracao-de-pecas.html'),
        teste: resolve(__dirname, 'teste.html'),
        trabalhista: resolve(__dirname, 'trabalhista-empresarial.html'),
        transcricao: resolve(__dirname, 'transcricao-de-audiencias.html')
      }
    }
  }
});
