<template>
  <div class="notice-write">
    <div class="header">
      <h1>공지사항 작성</h1>
    </div>

    <div class="write-container">
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
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitNotice" :loading="loading">
            등록
          </el-button>
          <el-button @click="goBack">취소</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Upload } from '@element-plus/icons-vue'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'

export default {
  name: 'NoticeWrite',
  components: {
    QuillEditor
  },
  setup() {
    const store = useStore()
    const router = useRouter()
    const noticeFormRef = ref()
    const uploadRef = ref()
    const loading = ref(false)
    const fileList = ref([])
    const uploadedFiles = ref([])

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

    const user = computed(() => store.state.auth.user)
    const canWrite = computed(() => {
      return user.value && (user.value.isAdmin || user.value.hasNoticePermission)
    })

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

    const submitNotice = async () => {
      if (!canWrite.value) {
        ElMessage.error('게시글 작성 권한이 없습니다.')
        return
      }

      try {
        await noticeFormRef.value.validate()
        
        loading.value = true

        // 파일 업로드
        const attachments = await uploadFiles()
        noticeForm.attachments = attachments

        // 공지사항 등록
        await store.dispatch('notice/createNotice', noticeForm)
        
        ElMessage.success('공지사항이 등록되었습니다.')
        router.push('/notices')
      } catch (error) {
        console.error('공지사항 등록 실패:', error)
        ElMessage.error('공지사항 등록에 실패했습니다.')
      } finally {
        loading.value = false
      }
    }

    const goBack = () => {
      router.back()
    }

    onMounted(() => {
      if (!canWrite.value) {
        ElMessage.error('게시글 작성 권한이 없습니다.')
        router.push('/notices')
      }
    })

    return {
      noticeFormRef,
      uploadRef,
      loading,
      fileList,
      noticeForm,
      rules,
      editorOptions,
      canWrite,
      onEditorReady,
      handleFileChange,
      handleFileRemove,
      submitNotice,
      goBack,
      Upload
    }
  }
}
</script>

<style scoped>
.notice-write {
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

.write-container {
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

.el-upload__tip {
  color: var(--el-text-color-secondary);
  font-size: 0.9rem;
  margin-top: 8px;
}

@media (max-width: 768px) {
  .notice-write {
    padding: 15px;
  }
  
  .write-container {
    padding: 20px;
  }
  
  .header h1 {
    font-size: 1.5rem;
  }
}
</style>
