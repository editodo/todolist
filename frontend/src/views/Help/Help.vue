<template>
  <div class="pt-1">    
    <v-card
      color="grey lighten-5"
      class="baseheight"
    >
      <v-toolbar
        color="secondary"
        dark
        flat
        dense
        height="40px"
      >           
        <v-toolbar-title dense>
          <v-icon>help</v-icon> Help
        </v-toolbar-title>
      </v-toolbar>
      <v-card-text>
        <PageDataTable
          :headers="headers"
          :items="BoardItemList"
          :ppage="page"
          @click:row="goDtl"
        >
          <template v-slot:pageappend="slotProps">
            <v-btn
              text
              small    
              @click="dialog = true"            
            >
              <v-icon left>
                create
              </v-icon>
              글쓰기
            </v-btn>
          </template>
        </PageDataTable>            
      </v-card-text>
    </v-card>
    


    <!-- ReadDialog -->
    <v-dialog
      v-model="readdialog"      
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-toolbar
          dark
          color="primary"
          flat
        >
          <v-btn
            icon
            dark
            @click="readdialog = false"
          >
            <v-icon>close</v-icon>
          </v-btn>
          <v-toolbar-title>상세</v-toolbar-title>        
        </v-toolbar>
        <v-card-text
          fill-height
        >
          <v-text-field  
            v-model="readData.TITLE"                  
            label="Title"
            required
          />
          <editor
            v-model="readData.CONTENTS"           
            height="700px"
            mode="wysiwyg"
            :options="editorOptions"
          />  
          <div class="text-right">            
            <v-btn
              small
              text
              @click="readdialog = false"
            >
              <v-icon left>
                list
              </v-icon>
              리스트
            </v-btn>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- fullscreen -->
    <v-dialog
      v-model="dialog"      
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-toolbar
          dark
          color="primary"
          flat
        >
          <v-btn
            icon
            dark
            @click="dialog = false"
          >
            <v-icon>close</v-icon>
          </v-btn>
          <v-toolbar-title>글쓰기</v-toolbar-title>        
        </v-toolbar>
        <v-card-text
          fill-height
        >
          <v-text-field  
            v-model="BoardData.TITLE"                  
            label="Title"
            required
          />
          <editor
            v-model="BoardData.CONTENTS"           
            height="700px"
            mode="wysiwyg"
            :options="editorOptions"
          />  
          <div class="text-right">
            <v-btn
              small
              text                
              @click="WriteData"
            >
              <v-icon left>
                save
              </v-icon>
              저장
            </v-btn>
            <v-btn
              small
              text
              @click="dialog = false"
            >
              <v-icon left>
                list
              </v-icon>
              리스트
            </v-btn>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import CONST from '@/const'
import axios from 'axios'
import 'tui-editor/dist/tui-editor.css';
import 'tui-editor/dist/tui-editor-contents.css';
import 'codemirror/lib/codemirror.css';
import Editor from '@toast-ui/vue-editor/src/Editor.vue'
import PageDataTable from '@/components/DataTable/PageDataTable'

export default {
  components: {
    PageDataTable,      
    'editor': Editor
  },
  data: () => ({
    BoardItemList : [],     //게시물 리스트    
    headers: [
          { text: 'No.', value: 'CONTENTS_ID',width:'100px'},
          { text: '제목',value: 'TITLE', align: 'left',                                            },
          { text: '작성자', value: 'CREATER', align: 'center', width:'150px'},
          { text: '조회수', value: 'COUNT', align: 'center', width:'150px'},          
          { text: 'Date', value: 'CREATED_DATE' ,align: 'center',width:'150px' },          
        ],


    dialog : false,         //글쓰기 팝업창 Open여부
    readdialog:false,       //글읽기 팝업창 Open여부

    editorOptions: {
          minHeight: '200px',
          hideModeSwitch: true,
          language: 'ko_KR',
        },          
    BoardData : {     //쓰기 Dialog데이터
      TITLE : '',     //제목 
      CONTENTS : '',  //내용
    },
    readData : {      //읽기 Dialog데이터
      TITLE : '',     //제목 
      CONTENTS : '',  //내용
    },

  }),
  computed:{
      
  },
  created : function(){
      this.page = 1;
      this.selectBoardList(); //게시물 리스트를 가져온다.
  },
  methods: {
    selectBoardList(){   //전체 게시물 리스트를 가져온다.
        
      axios.post(`${CONST.HOST_ADDR}/help/selectBoardList`, {}).then(
        (ret)=>{               
          
          this.BoardItemList = ret.data;
        }
      );       
    },
    WriteData(){           //현재 입력 된 정보를 서버에 전송한다.

      //게시물 정보를 전송한다.
      axios.post(`${CONST.HOST_ADDR}/help/insertBoardData`, this.BoardData)
      .then(
        (ret)=>{
          console.log(ret);           
          this.selectBoardList(); //게시물 리스트를 새로 가져온다.
          this.dialog = false;         //리스트 화면으로 이동한다.
        })
       .catch( error => {
						console.log('failed', error)
			});       
    },
    goDtl(item){
      
      //항목을 클리어
      this.readData.TITLE = '',     //제목 
      this.readData.CONTENTS = '',  //내용      
      this.ReadData(item.CONTENTS_ID); //서버에서 컨텐츠 정보를 가져온다.

      this.readdialog = true; //글보기 다이얼로그를 출력한다.      

    },
    ReadData(cid){           //게시물 정보를 읽어 들인다.

      var searchCond = {cid};

      //게시물 정보를 전송한다.
      axios.post(`${CONST.HOST_ADDR}/help/selectBoardContents`, searchCond).then(
        (ret)=>{                       
          this.readData = ret.data;
        }
      );       

    },
    
  }    
}
</script>