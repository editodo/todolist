<template>
  <div v-if="showInstallPrompt" class="install-prompt">
    <div class="install-content">
      <div class="install-icon">
        <i class="el-icon-download"></i>
      </div>
      <div class="install-text">
        <h3>Editodo 앱 설치</h3>
        <p>홈 화면에 추가하여 더 빠르게 접근하세요</p>
      </div>
      <div class="install-actions">
        <el-button @click="installApp" type="primary" size="small">
          설치
        </el-button>
        <el-button @click="dismissPrompt" size="small">
          나중에
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'

export default {
  name: 'InstallPrompt',
  setup() {
    const showInstallPrompt = ref(false)
    const deferredPrompt = ref(null)

    const installApp = async () => {
      if (deferredPrompt.value) {
        deferredPrompt.value.prompt()
        const { outcome } = await deferredPrompt.value.userChoice
        if (outcome === 'accepted') {
          console.log('사용자가 앱 설치를 수락했습니다')
        }
        deferredPrompt.value = null
        showInstallPrompt.value = false
      }
    }

    const dismissPrompt = () => {
      showInstallPrompt.value = false
      localStorage.setItem('installPromptDismissed', Date.now().toString())
    }

    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault()
      deferredPrompt.value = e
      
      // 24시간 이내에 거부했으면 표시하지 않음
      const dismissed = localStorage.getItem('installPromptDismissed')
      if (dismissed) {
        const dismissedTime = parseInt(dismissed)
        const now = Date.now()
        const oneDay = 24 * 60 * 60 * 1000
        
        if (now - dismissedTime < oneDay) {
          return
        }
      }
      
      // 이미 설치된 앱이면 표시하지 않음
      if (window.matchMedia('(display-mode: standalone)').matches) {
        return
      }
      
      showInstallPrompt.value = true
    }

    const handleAppInstalled = () => {
      console.log('앱이 설치되었습니다')
      showInstallPrompt.value = false
      deferredPrompt.value = null
    }

    onMounted(() => {
      window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.addEventListener('appinstalled', handleAppInstalled)
    })

    onUnmounted(() => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    })

    return {
      showInstallPrompt,
      installApp,
      dismissPrompt
    }
  }
}
</script>

<style scoped>
.install-prompt {
  position: fixed;
  bottom: 80px;
  left: 16px;
  right: 16px;
  background: var(--el-bg-color);
  border: 1px solid var(--el-border-color);
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  z-index: 999;
  animation: slideUp 0.3s ease-out;
}

.install-content {
  display: flex;
  align-items: center;
  padding: 16px;
  gap: 12px;
}

.install-icon {
  width: 40px;
  height: 40px;
  background: var(--el-color-primary);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 20px;
}

.install-text {
  flex: 1;
}

.install-text h3 {
  margin: 0 0 4px 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.install-text p {
  margin: 0;
  font-size: 14px;
  color: var(--el-text-color-regular);
}

.install-actions {
  display: flex;
  gap: 8px;
}

@keyframes slideUp {
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* 하이브리드 앱 스타일 */
@media (display-mode: standalone) {
  .install-prompt {
    bottom: calc(80px + env(safe-area-inset-bottom));
  }
}

/* iOS Safari 대응 */
@supports (padding-bottom: env(safe-area-inset-bottom)) {
  .install-prompt {
    bottom: calc(80px + env(safe-area-inset-bottom));
  }
}

/* 모바일 최적화 */
@media (max-width: 768px) {
  .install-prompt {
    left: 12px;
    right: 12px;
  }
  
  .install-content {
    padding: 12px;
  }
  
  .install-icon {
    width: 36px;
    height: 36px;
    font-size: 18px;
  }
  
  .install-text h3 {
    font-size: 15px;
  }
  
  .install-text p {
    font-size: 13px;
  }
}
</style>
