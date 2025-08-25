<template>
  <div class="notice-list">
    <div class="header">
      <h1>공지사항</h1>
      <el-button 
        v-if="canWrite" 
        type="primary" 
        @click="goToWrite"
        :icon="Plus"
      >
        글쓰기
      </el-button>
    </div>

    <div class="notice-container">
      <!-- 공지사항 섹션 -->
      <div v-if="noticeNotices.length > 0" class="notice-section">
        <h2 class="section-title">
          <el-icon><Bell /></el-icon>
          공지사항
        </h2>
        <div class="notice-items">
          <div 
            v-for="notice in noticeNotices" 
            :key="notice.noticeId" 
            class="notice-item notice"
            @click="goToDetail(notice.noticeId)"
          >
            <div class="notice-header">
              <span class="notice-badge">공지</span>
              <h3 class="notice-title">{{ notice.title }}</h3>
            </div>
            <div class="notice-meta">
              <span class="author">{{ notice.user.nickname || notice.user.username }}</span>
              <span class="date">{{ formatDate(notice.createdAt) }}</span>
              <span class="views">조회 {{ notice.viewCount }}</span>
              <span v-if="notice.attachmentCount > 0" class="attachments">
                <el-icon><Paperclip /></el-icon>
                {{ notice.attachmentCount }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- 일반 게시글 섹션 -->
      <div class="regular-section">
        <h2 class="section-title">일반 게시글</h2>
        <div class="notice-items">
          <div 
            v-for="notice in regularNotices" 
            :key="notice.noticeId" 
            class="notice-item"
            @click="goToDetail(notice.noticeId)"
          >
            <div class="notice-header">
              <h3 class="notice-title">{{ notice.title }}</h3>
            </div>
            <div class="notice-meta">
              <span class="author">{{ notice.user.nickname || notice.user.username }}</span>
              <span class="date">{{ formatDate(notice.createdAt) }}</span>
              <span class="views">조회 {{ notice.viewCount }}</span>
              <span v-if="notice.attachmentCount > 0" class="attachments">
                <el-icon><Paperclip /></el-icon>
                {{ notice.attachmentCount }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- 로딩 상태 -->
      <div v-if="loading" class="loading">
        <el-skeleton :rows="5" animated />
      </div>

      <!-- 빈 상태 -->
      <div v-if="!loading && notices.length === 0" class="empty-state">
        <el-empty description="등록된 게시글이 없습니다." />
      </div>
    </div>
  </div>
</template>

<script>
import { computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Plus, Bell, Paperclip } from '@element-plus/icons-vue'
import dayjs from 'dayjs'

export default {
  name: 'NoticeList',
  components: {
    Plus,
    Bell,
    Paperclip
  },
  setup() {
    const store = useStore()
    const router = useRouter()

    const notices = computed(() => store.getters['notice/notices'])
    const noticeNotices = computed(() => store.getters['notice/noticeNotices'])
    const regularNotices = computed(() => store.getters['notice/regularNotices'])
    const loading = computed(() => store.getters['notice/loading'])
    const user = computed(() => store.state.auth.user)

    // 작성 권한 확인
    const canWrite = computed(() => {
      return user.value && (user.value.isAdmin || user.value.hasNoticePermission)
    })

    const loadNotices = async () => {
      try {
        await store.dispatch('notice/fetchNotices')
      } catch (error) {
        ElMessage.error('공지사항을 불러오는데 실패했습니다.')
      }
    }

    const goToDetail = (noticeId) => {
      router.push(`/notices/${noticeId}`)
    }

    const goToWrite = () => {
      router.push('/notices/write')
    }

    const formatDate = (date) => {
      return dayjs(date).format('YYYY.MM.DD')
    }

    onMounted(() => {
      loadNotices()
    })

    return {
      notices,
      noticeNotices,
      regularNotices,
      loading,
      canWrite,
      goToDetail,
      goToWrite,
      formatDate
    }
  }
}
</script>

<style scoped>
.notice-list {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.header h1 {
  margin: 0;
  font-size: 2rem;
  font-weight: bold;
}

.notice-container {
  background: var(--el-bg-color);
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 15px;
  color: var(--el-text-color-primary);
}

.notice-section {
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--el-border-color-lighter);
}

.notice-items {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.notice-item {
  padding: 15px;
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.notice-item:hover {
  border-color: var(--el-color-primary);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.notice-item.notice {
  background: linear-gradient(135deg, var(--el-color-primary-light-9), var(--el-color-primary-light-8));
  border-color: var(--el-color-primary-light-6);
}

.notice-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
}

.notice-badge {
  background: var(--el-color-danger);
  color: white;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
}

.notice-title {
  margin: 0;
  font-size: 1rem;
  font-weight: 500;
  color: var(--el-text-color-primary);
  flex: 1;
}

.notice-meta {
  display: flex;
  align-items: center;
  gap: 15px;
  font-size: 0.9rem;
  color: var(--el-text-color-secondary);
}

.author {
  font-weight: 500;
}

.attachments {
  display: flex;
  align-items: center;
  gap: 4px;
}

.loading {
  padding: 20px;
}

.empty-state {
  padding: 40px 20px;
  text-align: center;
}

@media (max-width: 768px) {
  .notice-list {
    padding: 15px;
  }
  
  .header {
    flex-direction: column;
    gap: 15px;
    align-items: stretch;
  }
  
  .header h1 {
    font-size: 1.5rem;
    text-align: center;
  }
  
  .notice-meta {
    flex-wrap: wrap;
    gap: 10px;
  }
}
</style>
