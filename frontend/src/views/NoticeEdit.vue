<template>
  <div class="notice-edit">
    <div class="header">
      <h1>공지사항 수정</h1>
    </div>

    <div class="edit-container" v-if="currentNotice">
      <el-form :model="noticeForm" :rules="rules" ref="noticeFormRef" label-width="80px">
        <el-form-item label="제목" prop="title">
          <el-input v-model="noticeForm.title" placeholder="제목을 입력하세요" />
        </el-form-item>

        <el-form-item label="공지사항" prop="isNotice">
          <el-checkbox v-model="noticeForm.isNotice">
            공지사항으로 등록
          </el-checkbox>
        </el-form-item>

        <el-form-item label="내용" prop="content">
          <div class="editor-container">
            <QuillEditor
              v-model:content="noticeForm.content"
              contentType="html"
              theme="snow"
              :options="editorOptions"
              @ready="onEditorReady"
            />
          </div>
        </el-form-item>

        <el-form-item label="첨부파일">
          <div class="file-upload">
            <!-- 기존 첨부파일 -->
            <div v-if="currentNotice.attachments && currentNotice.attachments.length > 0" class="existing-attachments">
              <h4>기존 첨부파일</h4>
              <div class="attachment-list">
                <div 
                  v-for="attachment in currentNotice.attachments" 
                  :key="attachment.attachmentId"
                  class="attachment-item"
                >
                  <el-icon><Paperclip /></el-icon>
                  <span class="filename">{{ attachment.originalFilename }}</span>
                  <span class="filesize">{{ formatFileSize(attachment.fileSize) }}</span>
                  <el-button 
                    type="danger" 
                    size="small" 
                    @click="removeExistingAttachment(attachment)"
                    :icon="Delete"
                  >
                    삭제
                  </el-button>
                </div>
              </div>
            </div>

            <!-- 새 첨부파일 업로드 -->
            <div class="new-attachments">
              <h4>새 첨부파일 추가</h4>
              <el-upload
                ref="uploadRef"
                :auto-upload="false"
                :on-change="handleFileChange"
                :on-remove="handleFileRemove"
                :file-list="fileList"
                multiple
                :limit="5"
              >
                <el-button type="primary" :icon="Upload">
                  파일 선택
                </el-button>
                <template #tip>
                  <div class="el-upload__tip">
                    최대 5개 파일, 각 파일 10MB 이하
                  </div>
                </template>
              </el-upload>
            </div>
          </div>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="updateNotice" :loading="loading">
            수정
          </el-button>
          <el-button @click="goBack">취소</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 로딩 상태 -->
    <div v-if="loading && !currentNotice" class="loading">
      <el-skeleton :rows="10" animated />
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Upload, Delete, Paperclip } from '@element-plus/icons-vue'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'

export default {
  name: 'NoticeEdit',
  components: {
    QuillEditor,
    Upload,
    Delete,
    Paperclip
  },
  setup() {
    const store = useStore()
    const router = useRouter()
    const route = useRoute()
    const noticeFormRef = ref()
    const uploadRef = ref()
    const loading = ref(false)
    const fileList = ref([])
    const uploadedFiles = ref([])

    const currentNotice = computed(() => store.getters['notice/currentNotice'])
    const user = computed(() => store.state.auth.user)

    const noticeForm = reactive({
      title: '',
      content: '',
      isNotice: false,
      attachments: []
    })

    const rules = {
      title: [
        { required: true, message: '제목을 입력해주세요', trigger: 'blur' },
        { min: 2, max: 200, message: '제목은 2-200자 사이여야 합니다', trigger: 'blur' }
      ],
      content: [
        { required: true, message: '내용을 입력해주세요', trigger: 'blur' }
      ]
    }

    const editorOptions = {
      modules: {
        toolbar: [
          ['bold', 'italic', 'underline', 'strike'],
          ['blockquote', 'code-block'],
          [{ 'header': 1 }, { 'header': 2 }],
          [{ 'list': 'ordered'}, { 'list': 'bullet' }],
          [{ 'script': 'sub'}, { 'script': 'super' }],
          [{ 'indent': '-1'}, { 'indent': '+1' }],
          [{ 'direction': 'rtl' }],
          [{ 'size': ['small', false, 'large', 'huge'] }],
          [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
          [{ 'color': [] }, { 'background': [] }],
          [{ 'font': [] }],
          [{ 'align': [] }],
          ['clean'],
          ['link', 'image']
        ]
      },
      placeholder: '내용을 입력하세요...'
    }

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
        router.push('/notices')
      }
    }

    const initializeForm = () => {
      if (currentNotice.value) {
        noticeForm.title = currentNotice.value.title
        noticeForm.content = currentNotice.value.content
        noticeForm.isNotice = currentNotice.value.isNotice
        noticeForm.attachments = [...(currentNotice.value.attachments || [])]
      }
    }

    const onEditorReady = (quill) => {
      console.log('Editor is ready!', quill)
    }

    const handleFileChange = (file) => {
      console.log('File changed:', file)
    }

    const handleFileRemove = (file) => {
      console.log('File removed:', file)
      const index = uploadedFiles.value.findIndex(f => f.originalFilename === file.name)
      if (index > -1) {
        uploadedFiles.value.splice(index, 1)
      }
    }

    const removeExistingAttachment = (attachment) => {
      const index = noticeForm.attachments.findIndex(a => a.attachmentId === attachment.attachmentId)
      if (index > -1) {
        noticeForm.attachments.splice(index, 1)
      }
    }

    const uploadFiles = async () => {
      const files = fileList.value.map(item => item.raw).filter(Boolean)
      const uploaded = []

      for (const file of files) {
        try {
          const result = await store.dispatch('notice/uploadFile', file)
          uploaded.push(result)
        } catch (error) {
          ElMessage.error(`파일 업로드 실패: ${file.name}`)
          throw error
        }
      }

      return uploaded
    }

    const updateNotice = async () => {
      if (!canEdit.value) {
        ElMessage.error('수정 권한이 없습니다.')
        return
      }

      try {
        await noticeFormRef.value.validate()
        
        loading.value = true

        // 새 파일 업로드
        const newAttachments = await uploadFiles()
        
        // 기존 첨부파일과 새 첨부파일 합치기
        const allAttachments = [...noticeForm.attachments, ...newAttachments]
        noticeForm.attachments = allAttachments

        // 공지사항 수정
        await store.dispatch('notice/updateNotice', {
          noticeId: route.params.id,
          noticeData: noticeForm
        })
        
        ElMessage.success('공지사항이 수정되었습니다.')
        router.push(`/notices/${route.params.id}`)
      } catch (error) {
        console.error('공지사항 수정 실패:', error)
        ElMessage.error('공지사항 수정에 실패했습니다.')
      } finally {
        loading.value = false
      }
    }

    const goBack = () => {
      router.back()
    }

    const formatFileSize = (bytes) => {
      if (bytes === 0) return '0 Bytes'
      const k = 1024
      const sizes = ['Bytes', 'KB', 'MB', 'GB']
      const i = Math.floor(Math.log(bytes) / Math.log(k))
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    }

    onMounted(async () => {
      await loadNoticeDetail()
      if (currentNotice.value) {
        initializeForm()
      }
    })

    return {
      noticeFormRef,
      uploadRef,
      loading,
      fileList,
      currentNotice,
      noticeForm,
      rules,
      editorOptions,
      canEdit,
      onEditorReady,
      handleFileChange,
      handleFileRemove,
      removeExistingAttachment,
      updateNotice,
      goBack,
      formatFileSize,
      Upload,
      Delete
    }
  }
}
</script>

<style scoped>
.notice-edit {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.header {
  margin-bottom: 30px;
}

.header h1 {
  margin: 0;
  font-size: 2rem;
  font-weight: bold;
}

.edit-container {
  background: var(--el-bg-color);
  border-radius: 8px;
  padding: 30px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.editor-container {
  border: 1px solid var(--el-border-color);
  border-radius: 4px;
}

.editor-container :deep(.ql-editor) {
  min-height: 300px;
}

.file-upload {
  width: 100%;
}

.existing-attachments {
  margin-bottom: 20px;
}

.existing-attachments h4 {
  margin: 0 0 10px 0;
  font-size: 1rem;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.attachment-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.attachment-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 4px;
  background: var(--el-fill-color-light);
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

.new-attachments h4 {
  margin: 0 0 10px 0;
  font-size: 1rem;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.el-upload__tip {
  color: var(--el-text-color-secondary);
  font-size: 0.9rem;
  margin-top: 8px;
}

.loading {
  padding: 20px;
}

@media (max-width: 768px) {
  .notice-edit {
    padding: 15px;
  }
  
  .edit-container {
    padding: 20px;
  }
  
  .header h1 {
    font-size: 1.5rem;
  }
  
  .attachment-item {
    flex-wrap: wrap;
    gap: 8px;
  }
}
</style>
