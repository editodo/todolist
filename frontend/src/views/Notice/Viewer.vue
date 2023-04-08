<template>
  <v-row>
    <v-col>
      <v-card>
        <v-toolbar
          color="secondary"
          dark
          flat
          dense
          height="40px"
        >           
          <v-toolbar-title>상세1</v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          <v-row>
            <v-col>
              <v-text-field    
                v-model="BoardData.CREATER"  
                dense                 
                readonly
                label="작성자"
                required
              />
            </v-col>
            <v-col>
              <v-text-field                
                v-model="BoardData.CREATED_DATE"
                dense                
                readonly
                label="작성일"
                required
              />
            </v-col>
            <v-col>
              <v-text-field                
                v-model="BoardData.COUNT"
                dense                
                readonly
                label="조회수"
                required
              />
            </v-col>
          </v-row>                      
          <v-text-field        
            v-model="BoardData.TITLE"
            readonly
            dense
            label="Title"
            required
          />                    
          <DextEditor v-model="BoardData.CONTENTS " />

          

          <!-- <Viewer 
            class="white"
            :value="BoardData.CONTENTS"
            height="500px"            
          /> -->

          
          <div class="text-right">              
            <v-btn
              small
              text
              to="/notice/list"
            >
              <v-icon left>
                list
              </v-icon>
              리스트
            </v-btn>
          </div>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import 'tui-editor/dist/tui-editor-contents.css';
import 'highlight.js/styles/github.css';
//import Viewer from '@toast-ui/vue-editor/src/Viewer.vue'
import DextEditor from '@/components/DextEditor/DextEditor.vue'
import CONST from '@/const'
import axios from 'axios'



export default {
  components: {
//    Viewer
    DextEditor
  },
  data: () => ({
    BoardData : {
      TITLE : '',           //제목 
      CONTENTS : '',        //내용
      CREATED_DATE : '',     //작성일
      CREATER : '',         //작성자      
    },    
    editor : null,
    myDEXT5 : null
  }),
  created: function()
  {
      this.ReadData();
  },
    
  methods: {
    ReadData : function(){           //현재 입력 된 정보를 서버에 전송한다.

        var searchCond = {cid : this.$route.params.cid};

      //게시물 정보를 전송한다.
      axios.post(`${CONST.HOST_ADDR}/notice/selectBoardContents`, searchCond).then(
        (ret)=>{             
          
          this.BoardData = ret.data;

          //this.myDEXT5.setHtmlValueEx(this.BoardData.CONTENTS, 'editor3');
        }
      );       

    },
  }
}
</script>

<style>

</style>