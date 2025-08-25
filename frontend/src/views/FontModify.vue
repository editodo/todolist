<template>
  <div class="font-modify">
    <div class="header">
      <h2>글꼴 설정</h2>
      <p>원하는 글꼴을 선택하여 나만의 스타일을 만들어보세요!</p>
    </div>

    <!-- 폰트 미리보기 -->
    <div class="preview-section">
      <h3>미리보기</h3>
      <div class="font-preview" :style="{ fontFamily: selectedFont }">
        <p>더 많은 테마는 E-T에서 열심히 준비 중이에요!</p>
        <p>123456789!@#%&*()_+-=</p>
      </div>
    </div>

    <!-- Google Fonts -->
    <div class="fonts-section">
      <h3>Google Fonts</h3>
      <div class="fonts-grid">
        <div 
          v-for="font in googleFonts" 
          :key="font.family"
          class="font-item"
          :class="{ active: selectedFont === font.family }"
          @click="selectFont(font)"
        >
          <div class="font-sample" :style="{ fontFamily: font.family }">
            {{ font.family }}
          </div>
          <div class="font-info">
            <span class="font-name">{{ font.family }}</span>
            <span class="font-category">{{ font.category }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 기본 폰트 -->
    <div class="fonts-section">
      <h3>기본 폰트</h3>
      <div class="fonts-grid">
        <div 
          v-for="font in defaultFonts" 
          :key="font.family"
          class="font-item"
          :class="{ active: selectedFont === font.family }"
          @click="selectFont(font)"
        >
          <div class="font-sample" :style="{ fontFamily: font.family }">
            {{ font.family }}
          </div>
          <div class="font-info">
            <span class="font-name">{{ font.family }}</span>
            <span class="font-category">기본</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 적용 버튼 -->
    <div class="bottom-actions">
      <el-button 
        type="primary" 
        size="large" 
        @click="applyFont"
        :loading="loading"
        :disabled="!selectedFont"
      >
        적용하기
      </el-button>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import api from '@/api'

export default {
  name: 'FontModify',
  setup() {
    const loading = ref(false)
    const selectedFont = ref('')
    const googleFonts = ref([])
    const defaultFonts = ref([
      { family: 'Noto Sans KR', category: '기본', url: '' },
      { family: 'Nanum Gothic', category: '기본', url: '' },
      { family: 'Malgun Gothic', category: '기본', url: '' },
      { family: 'Arial', category: '기본', url: '' }
    ])

    const loadGoogleFonts = async () => {
      try {
        const response = await api.get('/fonts/google')
        googleFonts.value = response.data
      } catch (error) {
        console.error('Google Fonts 로드 실패:', error)
      }
    }

    const loadUserFont = async () => {
      try {
        const response = await api.get('/fonts/user')
        if (response.data.length > 0) {
          selectedFont.value = response.data[0].fontFamily
        }
      } catch (error) {
        console.error('사용자 폰트 로드 실패:', error)
      }
    }

    const selectFont = (font) => {
      selectedFont.value = font.family
      
      // Google Fonts CSS 로드
      if (font.url && !document.querySelector(`link[href="${font.url}"]`)) {
        const link = document.createElement('link')
        link.href = font.url
        link.rel = 'stylesheet'
        document.head.appendChild(link)
      }
    }

    const applyFont = async () => {
      if (!selectedFont.value) return

      try {
        loading.value = true
        const selectedFontData = [...googleFonts.value, ...defaultFonts.value]
          .find(font => font.family === selectedFont.value)

        await api.post('/fonts/user', {
          fontFamily: selectedFont.value,
          fontUrl: selectedFontData?.url || ''
        })

        ElMessage.success('폰트가 적용되었습니다!')
      } catch (error) {
        ElMessage.error('폰트 적용에 실패했습니다.')
      } finally {
        loading.value = false
      }
    }

    onMounted(() => {
      loadGoogleFonts()
      loadUserFont()
    })

    return {
      loading,
      selectedFont,
      googleFonts,
      defaultFonts,
      selectFont,
      applyFont
    }
  }
}
</script>

<style scoped>
.font-modify {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.header {
  text-align: center;
  margin-bottom: 30px;
}

.header h2 {
  font-size: 2rem;
  margin-bottom: 10px;
}

.header p {
  color: var(--el-text-color-regular);
}

.preview-section {
  margin-bottom: 40px;
  padding: 20px;
  background: var(--el-bg-color);
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.font-preview {
  padding: 20px;
  background: white;
  border-radius: 4px;
  font-size: 1.2rem;
  line-height: 1.6;
}

.fonts-section {
  margin-bottom: 30px;
}

.fonts-section h3 {
  margin-bottom: 20px;
  font-size: 1.3rem;
}

.fonts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 15px;
}

.font-item {
  padding: 15px;
  border: 2px solid var(--el-border-color);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.font-item:hover {
  border-color: var(--el-color-primary);
  transform: translateY(-2px);
}

.font-item.active {
  border-color: var(--el-color-primary);
  background: var(--el-color-primary-light-9);
}

.font-sample {
  font-size: 1.1rem;
  margin-bottom: 10px;
  min-height: 40px;
  display: flex;
  align-items: center;
}

.font-info {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.font-name {
  font-weight: 500;
  font-size: 0.9rem;
}

.font-category {
  font-size: 0.8rem;
  color: var(--el-text-color-secondary);
}

.bottom-actions {
  text-align: center;
  margin-top: 40px;
}

@media (max-width: 768px) {
  .font-modify {
    padding: 15px;
  }
  
  .fonts-grid {
    grid-template-columns: 1fr;
  }
}
</style>
