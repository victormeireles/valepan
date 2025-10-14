# 🎬 Guia de Otimização de Mídia

Dicas e ferramentas para otimizar imagens e vídeos do site ValePan para máxima performance.

## 🎯 Por Que Otimizar?

- ⚡ Carregamento mais rápido
- 💰 Menos consumo de banda
- 📱 Melhor experiência mobile
- 🔍 Melhor ranking SEO
- 💚 Menor consumo de dados dos usuários

---

## 📸 Otimização de Imagens

### Formatos Recomendados

| Tipo de Imagem | Formato Ideal | Alternativa |
|----------------|---------------|-------------|
| Fotos | WebP | JPEG (80-85% qualidade) |
| Logos | SVG | PNG |
| Ícones | SVG | PNG |
| Screenshots | PNG | WebP |

### Tamanhos Recomendados

| Uso | Largura Máxima | Peso Máximo |
|-----|----------------|-------------|
| Hero/Background | 1920px | 200KB |
| Produto (destaque) | 1200px | 150KB |
| Produto (grid) | 600px | 80KB |
| Equipe/Perfil | 800px | 100KB |
| Logo | 400px | 20KB (SVG) |
| Ícones | 128px | 10KB |

### Ferramentas de Compressão

#### Online (Grátis):
1. **TinyPNG** - https://tinypng.com/
   - Upload: Até 5MB, 20 imagens por vez
   - Redução: 50-80% sem perda visível
   - Suporta: PNG, JPEG, WebP

2. **Squoosh** - https://squoosh.app/
   - Upload: Ilimitado
   - Controle total de qualidade
   - Suporta: Todos os formatos
   - Converte para WebP

3. **ImageOptim** - https://imageoptim.com/
   - Mac only
   - Batch processing
   - Lossless compression

#### Desktop (Software):
1. **XnConvert** (Windows/Mac/Linux)
   - Batch processing
   - Redimensionar + comprimir
   - Gratuito

2. **RIOT** (Windows)
   - Visual comparison
   - Otimização avançada
   - Gratuito

#### Linha de Comando:
```bash
# Instalar ImageMagick
# Windows: choco install imagemagick
# Mac: brew install imagemagick
# Linux: apt-get install imagemagick

# Redimensionar e comprimir JPEG
magick input.jpg -resize 1920x -quality 85 output.jpg

# Converter para WebP
magick input.jpg -quality 85 output.webp

# Batch processing (todos JPG na pasta)
magick mogrify -resize 1920x -quality 85 -path ./output *.jpg
```

### Passo a Passo: Otimizar Imagens do Site

1. **Identifique imagens grandes:**
   ```bash
   # Windows PowerShell
   Get-ChildItem -Recurse *.jpg,*.png | Where-Object {$_.Length -gt 200KB} | Select Name, @{Name="Size(KB)";Expression={[math]::Round($_.Length/1KB,2)}}
   ```

2. **Para cada imagem > 200KB:**
   - Abra em TinyPNG ou Squoosh
   - Comprima até qualidade 80-85%
   - Baixe e substitua

3. **Converta para WebP** (opcional mas recomendado):
   - Use Squoosh.app
   - Configure qualidade 85
   - Baixe versão WebP
   - Mantenha JPEG como fallback

4. **Implemente no HTML:**
   ```html
   <picture>
     <source srcset="imagem.webp" type="image/webp">
     <img src="imagem.jpg" alt="Descrição" loading="lazy">
   </picture>
   ```

---

## 🎬 Otimização de Vídeos

### Especificações Ideais

| Propriedade | Recomendação |
|-------------|--------------|
| Codec | H.264 (MP4) |
| Resolução | 1920x1080 máximo |
| Frame Rate | 24-30 fps |
| Bitrate | 2-5 Mbps |
| Áudio | Remover (se não necessário) |
| Peso | < 10MB ideal, < 20MB máximo |

### Vídeos Atuais do Site

| Vídeo | Localização | Uso | Peso Ideal |
|-------|-------------|-----|------------|
| hero-bg.mp4 | 01-abertura/ | Background hero | < 15MB |
| montagem-lanche.mp4 | 01-abertura/ | Vertical (9:16) | < 5MB |
| padrao-paes.mp4 | 03-essencia/ | Demonstração | < 10MB |
| paes-saindo-do-forno.mp4 | 03-essencia/ | Background | < 15MB |
| pao-saindo-forno.mp4 | 04-produtos/ | Background | < 15MB |

### Ferramentas de Compressão

#### Online (Grátis):
1. **Cloudinary** - https://cloudinary.com/
   - Upload vídeos
   - Compressão automática
   - CDN gratuito (25GB)
   - Streaming adaptativo

2. **Vimeo** - https://vimeo.com/
   - Upload gratuito (500MB/semana)
   - Player otimizado
   - Embed fácil
   - Compressão automática

3. **Clideo** - https://clideo.com/compress-video
   - Online, sem instalação
   - Compressão rápida
   - Limites: 500MB

#### Desktop (Software):
1. **HandBrake** (Windows/Mac/Linux) - **RECOMENDADO**
   - Gratuito e open-source
   - Presets otimizados
   - Batch processing
   - Download: https://handbrake.fr/

2. **FFmpeg** (Linha de comando)
   - Mais poderoso
   - Controle total
   - Batch processing

### Passo a Passo: Otimizar com HandBrake

1. **Instale HandBrake:**
   - Baixe em https://handbrake.fr/
   - Instale normalmente

2. **Abra o vídeo:**
   - File → Open Source
   - Selecione o vídeo

3. **Configure preset:**
   - Preset: "Web" → "Gmail Large 3 Minutes 720p30"
   - Ou configure manualmente:
     - Format: MP4
     - Video Codec: H.264 (x264)
     - Framerate: 30 (Same as source)
     - Quality: Constant Quality 22-24
     - Resolution: 1920x1080 max

4. **Remova áudio (se não necessário):**
   - Tab "Audio" → Remove All

5. **Encode:**
   - Escolha destino
   - Start Encode
   - Aguarde

6. **Compare:**
   - Original: ?MB
   - Otimizado: Deve ser 50-70% menor

### Passo a Passo: Otimizar com FFmpeg

```bash
# Instalar FFmpeg
# Windows: choco install ffmpeg
# Mac: brew install ffmpeg
# Linux: apt-get install ffmpeg

# Comprimir vídeo (qualidade alta)
ffmpeg -i input.mp4 -c:v libx264 -crf 23 -preset medium -c:a aac -b:a 128k output.mp4

# Comprimir vídeo (sem áudio, para backgrounds)
ffmpeg -i input.mp4 -c:v libx264 -crf 24 -preset medium -an output.mp4

# Redimensionar + comprimir
ffmpeg -i input.mp4 -vf scale=1920:-1 -c:v libx264 -crf 23 -preset medium -an output.mp4

# Converter para WebM (alternativa ao MP4)
ffmpeg -i input.mp4 -c:v libvpx-vp9 -crf 30 -b:v 0 output.webm

# Criar poster frame (imagem de preview)
ffmpeg -i input.mp4 -ss 00:00:03 -vframes 1 poster.jpg
```

### Melhor Prática: Hospedar Vídeos Externamente

#### Vantagens:
- Site carrega mais rápido
- Menor uso de banda do servidor
- Streaming otimizado
- Qualidade adaptativa (ajusta conforme conexão)

#### Opções:

**1. Cloudinary (Recomendado para produção)**
```html
<!-- Antes -->
<video src="assets/slides/01-abertura/hero-bg.mp4"></video>

<!-- Depois -->
<video src="https://res.cloudinary.com/valepan/video/upload/q_auto/hero-bg.mp4"></video>
```

**2. Vimeo**
```html
<!-- Player embed -->
<iframe src="https://player.vimeo.com/video/XXXXXXX?background=1" frameborder="0"></iframe>
```

**3. YouTube (Unlisted)**
```html
<!-- Background video -->
<iframe src="https://www.youtube.com/embed/XXXXXXX?autoplay=1&mute=1&controls=0&loop=1" frameborder="0"></iframe>
```

---

## 📊 Checklist de Otimização

### Imagens:
- [ ] Todas < 200KB (exceto hero)
- [ ] Formato WebP implementado
- [ ] Loading="lazy" em todas
- [ ] Alt text descritivo
- [ ] Dimensões corretas (não escalar via CSS)

### Vídeos:
- [ ] Todos < 20MB
- [ ] Codec H.264
- [ ] Sem áudio desnecessário
- [ ] Poster frame configurado
- [ ] Considerar hospedagem externa

### Performance Geral:
- [ ] PageSpeed score > 85
- [ ] First Contentful Paint < 2s
- [ ] Largest Contentful Paint < 3s
- [ ] Time to Interactive < 4s

---

## 🧪 Teste de Performance

### Antes de Otimizar:
1. Acesse: https://pagespeed.web.dev/
2. Insira: https://valepan.com
3. Anote scores mobile/desktop

### Depois de Otimizar:
1. Teste novamente
2. Compare scores
3. Meta: +20 pontos ou mais

### Outras Ferramentas:
- **GTmetrix**: https://gtmetrix.com/
- **WebPageTest**: https://webpagetest.org/
- **Lighthouse**: DevTools do Chrome → Lighthouse tab

---

## 💡 Dicas Avançadas

### 1. Lazy Loading de Vídeos
Já implementado no `script.js`:
```javascript
// Vídeos só carregam quando ficam visíveis
const videoObserver = new IntersectionObserver(...)
```

### 2. Preload de Imagens Críticas
```html
<head>
  <link rel="preload" as="image" href="hero-background.jpg">
</head>
```

### 3. CDN para Assets
Considere usar:
- Cloudflare (grátis)
- Cloudinary (25GB grátis)
- BunnyCDN ($1/mês)

### 4. Responsive Images
```html
<img srcset="
  small.jpg 600w,
  medium.jpg 1200w,
  large.jpg 1920w"
  sizes="(max-width: 600px) 600px,
         (max-width: 1200px) 1200px,
         1920px"
  src="medium.jpg" alt="Descrição">
```

### 5. Video Poster + Lazy Load
```html
<video poster="preview.jpg" preload="none" data-autoplay>
  <source src="video.mp4" type="video/mp4">
</video>
```

---

## 📞 Precisa de Ajuda?

**Serviços que podem otimizar por você:**
- Cloudinary - Otimização automática
- Kraken.io - API de compressão
- ShortPixel - Plugin WordPress (se migrar)

**Freelancers:**
- Upwork, Fiverr - Busque "image optimization"
- Custo: $20-50 para otimizar site completo

---

## 🎯 Resultado Esperado

### Antes da Otimização:
- Site: ~100MB
- Tempo de carregamento: 8-12s (4G)
- PageSpeed Score: 40-60

### Depois da Otimização:
- Site: ~30MB
- Tempo de carregamento: 3-5s (4G)
- PageSpeed Score: 80-95

### Benefícios:
- ✅ 70% menos dados
- ✅ 2-3x mais rápido
- ✅ Melhor ranking Google
- ✅ Maior conversão (menos desistências)
- ✅ Economia de servidor/CDN

---

**Otimize suas mídias e dê asas ao seu site! 🚀**

