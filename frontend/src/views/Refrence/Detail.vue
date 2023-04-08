<template>
  <v-row>
    <v-col>
      <v-card>
        
        <v-toolbar
        flat        
        dense             
        class="title_font_color"
        :height="this.$vuetify.toolbar_height"
      >           
      
        <v-toolbar-title dense>
            <v-icon class="title_font_color toolbar_icon_size">save</v-icon> <span class="toolbar_font_size">Detail</span>          
        </v-toolbar-title>
      </v-toolbar>
      
        <v-card-text>
          <v-text-field        
            v-model="BoardData.TITLE"
            label="Title"
            :readonly="!isEditable"
            hide-details  
            required
          />
                    
          <br />
          <TiptapEditor 
          v-model="BoardData.CONTENTS"
          :editable="isEditable"
        />
<!--         
          <editor 
            v-model="BoardData.CONTENTS"
            height="500px"
            mode="wysiwyg"
            :options="editorOptions"
          /> -->
          
          <v-chip
            v-for="item in NO_DEL_FILES"            
            :key="item.UUID"
            close
            class="ma-2"
            close-icon="mdi-delete"       
            @click="FileDownload(item)"
            @click:close="FileDelete(item)"
          >
            <v-icon
              left              
            >
              save
            </v-icon>
            {{ item.filename }}
            ({{ item.size | makeComma }})
          </v-chip>
          <div class="text-right">                  
            <v-btn
              small
              text
              v-if="(IsDelete == true)&& (USER_DATA.EMP_USER_ID == BoardData.CREATER)"
              @click="DeleteData"
              >
              <v-icon left>
                delete
              </v-icon>
              삭제
            </v-btn>

            <v-btn
              small
              text
              @click="updateData"
              v-if="(isEditable)"
            >
              <v-icon left>
                edit
              </v-icon>
              수정
            </v-btn>

            

            <v-btn
              small
              text
              to="/reference/list/1"
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
    <confirm ref="confirm" />
  </v-row>
</template>

<script>
import CONST from '@/const'
import axios from 'axios'
import confirm from '@/components/Dialog/Confirm.vue'
import TiptapEditor from '@/components/Tiptap/TiptapEditor.vue';
import {mapGetters} from 'vuex';
          
          
export default {
  components: {
    confirm,
    TiptapEditor : TiptapEditor,
  },
  data: () => ({
    BoardData : {
      TITLE : '',     //제목 
      CONTENTS : '',  //내용
      FILES:[]        //파일 리스트
    },
    editorOptions: {
          minHeight: '200px',
          hideModeSwitch: true,
          language: 'ko_KR'
        }          
  }),
  computed : {
    ...mapGetters(
                    [
                    'IsWrite',      //쓰기 권한이 있는가?
                    'IsDelete',     //삭제 권한이 있는가?                    
                    'USER_DATA',
                    //'GET_USER_LIST_INFO',
                    ]),
    NO_DEL_FILES : function()
    {
      return this.BoardData.FILES.filter((element)=>{return element.del_FLAG === 'N'});
    },
    isEditable()    //수정가능한지
    {
      if(this.IsWrite == false) return false;
      if(this.BoardData == undefined) return false;

      if(this.USER_DATA.EMP_USER_ID == this.BoardData.CREATER) return true;

      return false;
    }
  },
  created: function()
  {
      this.ReadData();
  },
  methods: {
    FileDownload: async function(item)
    {
      console.log('FileDownload Start!!!');
      
      var searchCond = {UUID:item.uuid};

      axios.post(`${CONST.HOST_ADDR}/reference/axiosDownload`, searchCond, {responseType: "blob"}).then(
        (ret)=>{                       

          function getFileName(contentDisposition) {
            let fileName = contentDisposition
              .split(';')
              .filter((ele) => {
                return ele.indexOf('filename') > -1
              })
              .map((ele) => {
                return ele
                  .replace(/"/g, '')
                  .split('=')[1]
              })
            return fileName[0] ? fileName[0] : null
          }

          const url = window.URL.createObjectURL(new Blob([ret.data], { type: ret.data.type }))
          const link = document.createElement('a');
          link.href = url;

          const filename = getFileName(ret.headers['content-disposition']);
          link.setAttribute('download', decodeURI(filename))
          document.body.appendChild(link)
          link.click()

          console.log('Real End!!!');


        }
      );       



      
    },
    FileDelete: async function(item)  //파일 삭제 처리를 한다.
    {
            
      if (await this.$refs.confirm.open('Confirm', '첨부 파일을 삭제 하시겠습니까?', { color: 'red' }) == false)  
          return;

      item.del_FLAG = 'Y';      //삭제처리      
    },
    ReadData : function(){           //현재 입력 된 정보를 서버에 전송한다.

      var searchCond = {cid : this.$route.params.cid};

      //게시물 정보를 전송한다.
      axios.post(`${CONST.HOST_ADDR}/reference/selectBoardContents`, searchCond).then(
        (ret)=>{             
          console.log(ret);
          this.BoardData = ret.data;
        }
      );       

    },
    DeleteData : async function(){
      
      if (await this.$root.$confirm.open('Confirm', '삭제 하시겠습니까??', { color: 'primary' }) == false) return;  

      axios.post(`${CONST.HOST_ADDR}/reference/deleteBoardContents`, this.BoardData).then(
            (ret)=>{
                this.$root.$commretmsg.CommonDTOMsg(ret.data);  //결과를 화면에 뿌린다.
                if(ret.data.ret == true)
                {
                  //성공 했다면 리스트 화면으로 이동한다.                  
                  this.$router.push('/reference/list/1');
                }
            }
          );                     
    },
    updateData : async function(){

      if (await this.$root.$confirm.open('Confirm', '수정 하시겠습니까??', { color: 'primary' }) == false) return;  

      axios.post(`${CONST.HOST_ADDR}/reference/updateBoardContents`, this.BoardData).then(
            (ret)=>{
                this.$root.$commretmsg.CommonDTOMsg(ret.data);  //결과를 화면에 뿌린다.          
            }
          );                     

      },
  },
  
}
</script>

<style>

</style>