<template>
  <div class="notice-detail">
    <div class="header">
      <el-button @click="goBack" :icon="ArrowLeft" text>
        뒤로가기
      </el-button>
      <div class="actions" v-if="canEdit">
        <el-button @click="goToEdit" :icon="Edit" text>
          수정
        </el-button>
        <el-button @click="deleteNotice" :icon="Delete" text type="danger">
          삭제
        </el-button>
      </div>
    </div>

    <div class="detail-container" v-if="currentNotice">
      <!-- 공지사항 헤더 -->
      <div class="notice-header">
        <div class="notice-badge" v-if="currentNotice.isNotice">
          <el-icon><Bell /></el-icon>
          공지사항
        </div>
        <h1 class="notice-title">{{ currentNotice.title }}</h1>
        <div class="notice-meta">
          <span class="author">{{ currentNotice.user.nickname || currentNotice.user.username }}</span>
          <span class="date">{{ formatDate(currentNotice.createdAt) }}</span>
          <span class="views">조회 {{ currentNotice.viewCount }}</span>
        </div>
      </div>

      <!-- 공지사항 내용 -->
      <div class="notice-content">
        <div class="content-html" v-html="currentNotice.content"></div>
      </div>

      <!-- 첨부파일 -->
      <div class="attachments" v-if="currentNotice.attachments && currentNotice.attachments.length > 0">
        <h3>첨부파일</h3>
        <div class="attachment-list">
          <div 
            v-for="attachment in currentNotice.attachments" 
            :key="attachment.attachmentId"
            class="attachment-item"
            @click="downloadFile(attachment)"
          >
            <el-icon><Paperclip /></el-icon>
            <span class="filename">{{ attachment.originalFilename }}</span>
            <span class="filesize">{{ formatFileSize(attachment.fileSize) }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 로딩 상태 -->
    <div v-if="loading" class="loading">
      <el-skeleton :rows="10" animated />
    </div>

    <!-- 에러 상태 -->
    <div v-if="error" class="error">
      <el-empty description="공지사항을 불러올 수 없습니다." />
    </div>
  </div>
</template>

<script>
import { computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ArrowLeft, Edit, Delete, Bell, Paperclip } from '@element-plus/icons-vue'
import dayjs from 'dayjs'

export default {
  name: 'NoticeDetail',
  components: {
    ArrowLeft,
    Edit,
    Delete,
    Bell,
    Paperclip
  },
  setup() {
    const store = useStore()
    const router = useRouter()
    const route = useRoute()

    const currentNotice = computed(() => store.getters['notice/currentNotice'])
    const loading = computed(() => store.getters['notice/loading'])
    const error = computed(() => store.getters['notice/error'])
    const user = computed(() => store.state.auth.user)

    // 편집 권한 확인
    const canEdit = computed(() => {
      if (!currentNotice.value || !user.value) return false
      return user.value.isAdmin || currentNotice.value.user.userId === user.value.userId
    })

    const loadNoticeDetail = async () => {
      try {
        await store.dispatch('notice/fetchNoticeDetail', route.params.id)
      } catch (error) {
        ElMessage.error('공지사항을 불러오는데 실패했습니다.')
      }
    }

    const goBack = () => {
      router.back()
    }

    const goToEdit = () => {
      router.push(`/notices/edit/${route.params.id}`)
    }

    const deleteNotice = async () => {
      try {
        await ElMessageBox.confirm('정말 삭제하시겠습니까?', '확인', {
          confirmButtonText: '삭제',
          cancelButtonText: '취소',
          type: 'warning'
        })
        
        await store.dispatch('notice/deleteNotice', route.params.id)
        ElMessage.success('공지사항이 삭제되었습니다.')
        router.push('/notices')
      } catch (error) {
        if (error !== 'cancel') {
          ElMessage.error('공지사항 삭제에 실패했습니다.')
        }
      }
    }

    const downloadFile = (attachment) => {
      const link = document.createElement('a')
      link.href = attachment.filePath
      link.download = attachment.originalFilename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }

    const formatDate = (date) => {
      return dayjs(date).format('YYYY.MM.DD HH:mm')
    }

    const formatFileSize = (bytes) => {
      if (bytes === 0) return '0 Bytes'
      const k = 1024
      const sizes = ['Bytes', 'KB', 'MB', 'GB']
      const i = Math.floor(Math.log(bytes) / Math.log(k))
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    }

    onMounted(() => {
      loadNoticeDetail()
    })

    return {
      currentNotice,
      loading,
      error,
      canEdit,
      goBack,
      goToEdit,
      deleteNotice,
      downloadFile,
      formatDate,
      formatFileSize
    }
  }
}
</script>

<style scoped>
.notice-detail {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.actions {
  display: flex;
  gap: 10px;
}

.detail-container {
  background: var(--el-bg-color);
  border-radius: 8px;
  padding: 30px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.notice-header {
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--el-border-color-lighter);
}

.notice-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  background: var(--el-color-danger);
  color: white;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 15px;
}

.notice-title {
  margin: 0 0 15px 0;
  font-size: 1.8rem;
  font-weight: bold;
  color: var(--el-text-color-primary);
  line-height: 1.4;
}

.notice-meta {
  display: flex;
  align-items: center;
  gap: 20px;
  font-size: 0.9rem;
  color: var(--el-text-color-secondary);
}

.author {
  font-weight: 500;
}

.notice-content {
  margin-bottom: 30px;
}

.content-html {
  line-height: 1.8;
  color: var(--el-text-color-primary);
}

.content-html :deep(h1),
.content-html :deep(h2),
.content-html :deep(h3),
.content-html :deep(h4),
.content-html :deep(h5),
.content-html :deep(h6) {
  margin-top: 1.5em;
  margin-bottom: 0.5em;
  font-weight: 600;
}

.content-html :deep(p) {
  margin-bottom: 1em;
}

.content-html :deep(ul),
.content-html :deep(ol) {
  margin-bottom: 1em;
  padding-left: 2em;
}

.content-html :deep(blockquote) {
  border-left: 4px solid var(--el-color-primary);
  padding-left: 1em;
  margin: 1em 0;
  color: var(--el-text-color-secondary);
}

.content-html :deep(code) {
  background: var(--el-fill-color-light);
  padding: 2px 6px;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
}

.content-html :deep(pre) {
  background: var(--el-fill-color-light);
  padding: 1em;
  border-radius: 6px;
  overflow-x: auto;
}

.attachments {
  border-top: 1px solid var(--el-border-color-lighter);
  padding-top: 20px;
}

.attachments h3 {
  margin: 0 0 15px 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.attachment-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.attachment-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.attachment-item:hover {
  border-color: var(--el-color-primary);
  background: var(--el-color-primary-light-9);
}

.filename {
  flex: 1;
  font-weight: 500;
  color: var(--el-text-color-primary);
}

.filesize {
  font-size: 0.9rem;
  color: var(--el-text-color-secondary);
}

.loading {
  padding: 20px;
}

.error {
  padding: 40px 20px;
  text-align: center;
}

@media (max-width: 768px) {
  .notice-detail {
    padding: 15px;
  }
  
  .detail-container {
    padding: 20px;
  }
  
  .notice-title {
    font-size: 1.5rem;
  }
  
  .notice-meta {
    flex-wrap: wrap;
    gap: 15px;
  }
}
</style>
